import db from "../../db.js";
import Groq from "groq-sdk";
import connectMongo from "../../mongodb.js";
import { createSession, getSessionsByUser, getSessionById, getRecentMessages, saveMessage, deleteOldMessages, buildContext } from "../../services/chatMemory.js";

function getGroq() {
  return new Groq({ apiKey: process.env.GROQ_API_KEY });
}

const SYSTEM_PROMPT = `
Responde solo preguntas relacionadas con programación, siempre en español, con calma y paciencia.
Puedes saludar si alguien te saluda.
`;

export const askVideo = async (req, res) => {
  const { ask, videoID, sessionId, userId } = req.body;

  if (!ask) {
    return res.status(400).json({ error: "ask es requerido" });
  }

  try {
    await connectMongo();

    let videoSummary = "";
    if (videoID) {
      const [rows] = await db.execute(
        "SELECT summary, title FROM videos WHERE id_video = ?",
        [videoID]
      );
      if (rows.length > 0) {
        videoSummary = `Información del video "${rows[0].title}":\n${rows[0].summary}`;
      }
    }

    const systemContent = `${SYSTEM_PROMPT}\n\n${videoSummary ? `${videoSummary}\n\n` : ""}Responde basándote en la información del video cuando sea relevante.`;

    let activeSessionId = sessionId;

    if (sessionId) {
      const session = await getSessionById(sessionId);
      if (!session) {
        return res.status(404).json({ error: "Sesión no encontrada" });
      }
    } else if (userId) {
      const session = await createSession(userId, ask.substring(0, 60));
      activeSessionId = session._id;
    }

    if (!activeSessionId) {
      return res.status(400).json({ error: "sessionId o userId son requeridos" });
    }

    const context = await buildContext(activeSessionId, userId, systemContent);

    context.push({ role: "user", content: ask });

    const completion = await getGroq().chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: context,
    });

    const responseContent = completion.choices[0]?.message?.content || "";

    await saveMessage(activeSessionId, userId, "user", ask);
    await saveMessage(activeSessionId, userId, "assistant", responseContent);

    await deleteOldMessages(activeSessionId, 50);

    return res.json({
      responses: responseContent,
      sessionId: activeSessionId,
    });
  } catch (error) {
    console.error("Error en el chat:", error);
    res.status(500).json({ responses: "Hubo un error al procesar tu pregunta. Intenta más tarde." });
  }
};

export const createSessionHandler = async (req, res) => {
  const { userId, title } = req.body;

  if (!userId) {
    return res.status(400).json({ error: "userId es requerido" });
  }

  try {
    await connectMongo();
    const session = await createSession(userId, title);
    return res.status(201).json(session);
  } catch (error) {
    console.error("Error creando sesión:", error);
    res.status(500).json({ error: "Error creando sesión" });
  }
};

export const getSessionsHandler = async (req, res) => {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ error: "userId es requerido" });
  }

  try {
    await connectMongo();
    const sessions = await getSessionsByUser(Number(userId));
    return res.json(sessions);
  } catch (error) {
    console.error("Error obteniendo sesiones:", error);
    res.status(500).json({ error: "Error obteniendo sesiones" });
  }
};

export const getSessionMessagesHandler = async (req, res) => {
  const { sessionId } = req.params;

  try {
    await connectMongo();
    const messages = await getRecentMessages(sessionId, 50);
    return res.json(messages);
  } catch (error) {
    console.error("Error obteniendo mensajes:", error);
    res.status(500).json({ error: "Error obteniendo mensajes" });
  }
};
