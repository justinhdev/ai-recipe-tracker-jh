import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes";
import openaiRoutes from "./routes/openai.routes";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => res.send("API is running"));
app.use("/api/auth", authRoutes);

app.use("/api/ai", openaiRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
