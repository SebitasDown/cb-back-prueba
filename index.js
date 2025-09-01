import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import videosRoutes from "./modules/videos/videos.routes.js";
import categoriesRoutes from "./modules/categories/categories.routes.js";
import speakersRoutes from "./modules/speakers/speakers.routes.js";
import cloudinary from "./cloudinary.js";
import searchVideos from "./modules/search/search.routes.js";
import Comments from "./modules/comments/comment.routes.js";
import chatRoute from "./modules/chat/chat.routes.js";
import authRoutes from "./modules/auth/auth.routes.js";

dotenv.config();
cloudinary.config();

const app = express();

// 🔥 Lista de orígenes permitidos (Frontend en Vercel y localhost)
const allowedOrigins = [
  "http://localhost:5173", // Desarrollo local
  "https://cb-front.vercel.app", // Frontend principal en Vercel
  "https://cb-front-1d2hf8bcb-sebitasdowns-projects.vercel.app", // Frontend en Vercel
  "https://cb-front-7c14.vercel.app", // Frontend alternativo en Vercel
  "https://cb-back-prueba-gf2kjttpd-sebitasdowns-projects.vercel.app" // Backend en Vercel
];

// ✅ Configuración de CORS
app.use(cors({
  origin: function (origin, callback) {
    // Permitir solicitudes sin 'origin' (ej: Postman)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("No permitido por CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "x-auth-token"],
  credentials: true
}));

// ✅ Middleware para manejar preflight (OPTIONS)
app.options("*", cors());

// Middleware para parsear JSON
app.use(express.json());

// Rutas de prueba
app.get("/hello", (req, res) => {
  res.json({ name: "David" });
});

// Rutas principales
app.use("/videos", videosRoutes);
app.use("/categories", categoriesRoutes);
app.use("/speakers", speakersRoutes);
app.use("/search", searchVideos);
app.use("/comment", Comments);
app.use("/chat", chatRoute);
app.use("/auth", authRoutes);

// Iniciar servidor
app.listen(3000, () => {
  console.log("Server running on: http://localhost:3000");
});
