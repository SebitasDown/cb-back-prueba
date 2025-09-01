//This is the main entrance of the backend (express lift)

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import videosRoutes from "./modules/videos/videos.routes.js";
import categoriesRoutes from "./modules/categories/categories.routes.js";
import speakersRoutes from "./modules/speakers/speakers.routes.js";
import cloudinary from "./cloudinary.js";
import searchVideos from "./modules/search/search.routes.js";
import Comments from "./modules/comments/comment.routes.js"
import chatRoute from "./modules/chat/chat.routes.js";
import authRoutes from "./modules/auth/auth.routes.js";
dotenv.config();
cloudinary.config();

// Initialize Express
const app = express();

// Configuración de CORS - DEBE IR ANTES DE TODO
const corsOptions = {
    origin: [
        'https://cb-front.vercel.app',
        'https://cb-front-nuegaam1f-sebitasdowns-projects.vercel.app',
        'https://cb-front.vercel.app',
        'http://localhost:3000',
        'http://localhost:5173',
        'http://localhost:4173',
        'http://127.0.0.1:5173',
        'http://127.0.0.1:4173'
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-auth-token', 'Origin', 'Accept'],
    credentials: true,
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

app.use(express.json()); // To handle JSON in requests



app.get("/hello", (req, res) => {

    res.json({name: "David"});
})

// Routes
app.use("/videos", videosRoutes);
app.use("/categories", categoriesRoutes);
app.use("/speakers", speakersRoutes);
app.use("/search", searchVideos);
app.use("/comment", Comments)
app.use("/chat", chatRoute);
app.use("/auth", authRoutes);
// Start the server
app.listen(3000, () => {
    console.log("Server running on the port: http://localhost:3000");
});