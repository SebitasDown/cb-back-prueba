// chat.controller.js
import db from "../../db.js";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI("AIzaSyApvToRId4SSkxyMLZIjj-HktBHC0Umv0s");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export const askVideo = async (req, res) => {
  const { ask, videoID } = req.body;

  const [rows] = await db.execute(
    "SELECT summary FROM videos WHERE id_video = ?",
    [videoID]
  );

  const summary = rows[0].summary;

  const prompt = `
    Eres un experto en desarrollo de software. 
    Solo responde preguntas o genera contenido relacionado con programación, 
    tecnologías, buenas prácticas de desarrollo, herramientas de software y temas técnicos.
    Si el usuario pide algo fuera de este ámbito, redirígelo amablemente al tema de desarrollo.

    Información disponible (si aplica):
    ${summary}

    Pregunta:
    ${ask}
  `;

  const result = await model.generateContent(prompt);
  const responses = result.response.text();

  res.json({ responses });
};
