// chat.controller.js
import db from "../../db.js";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

export const askVideo = async (req, res) => {
  const { ask, videoID } = req.body;

  try {
    const [rows] = await db.execute(
      "SELECT summary FROM videos WHERE id_video = ?",
      [videoID]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Video no encontrado" });
    }

    const summary = rows[0].summary;

    const prompt = `
   responde solo preguntas relacionadas con programacion pero siempre responde en español con calma y pasiente

    Puedes saludar si alguien te saluda

    Información disponible (si aplica):
    ${summary}

    Pregunta:
    ${ask}
  `;

    const result = await model.generateContent(prompt);
    const responses = result.response.text();

    res.json({ responses });
  } catch (error) {
    console.error("Error en Gemini API:", error);

    // Manejo de error de cuota superada (429)
    if (error.status === 429 || error.message?.includes("429") || error.message?.includes("Quota exceeded")) {
      return res.status(429).json({
        responses: "Lo siento, parcero, la IA está un poco saturada de camello en este momento. Por favor, intenta de nuevo en un minuto. 🙏"
      });
    }

    res.status(500).json({ responses: "Hubo un error al procesar tu pregunta. Intenta más tarde." });
  }
};
