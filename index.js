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

// 🔥 Lista de orígenes permitidos
const allowedOrigins = [
  "http://localhost:5173",
  "https://cb-front.vercel.app",
  "https://cb-front-1d2hf8bcb-sebitasdowns-projects.vercel.app",
  "https://cb-front-7c14.vercel.app",
  "https://cb-back-prueba-gf2kjttpd-sebitasdowns-projects.vercel.app"
];

// ✅ Configuración de CORS simplificada
app.use(cors({
  origin: allowedOrigins,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "x-auth-token"],
  credentials: true
}));

// ✅ Aumentar límite para recibir archivos grandes
app.use(express.json({ limit: "200mb" }));
app.use(express.urlencoded({ limit: "200mb", extended: true }));

// ✅ Ruta de prueba
app.get("/hello", (req, res) => {
  res.json({ name: "David" });
});

// ✅ Rutas principales
app.use("/videos", videosRoutes);
app.use("/categories", categoriesRoutes);
app.use("/speakers", speakersRoutes);
app.use("/search", searchVideos);
app.use("/comment", Comments);
app.use("/chat", chatRoute);
app.use("/auth", authRoutes);

// ✅ Puerto dinámico para Vercel o 3000 local
const PORT = process.env.PORT || 3000;

// Para desarrollo local
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server running on: http://localhost:${PORT}`);
  });
}

// Para Vercel - exportar la app
export default app;
