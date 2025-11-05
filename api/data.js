// api/data.js
import mongoose, { Schema } from "mongoose";

const MONGO_URL = process.env.MONGO_URL;

// ---- 1. Define o schema ----
const eventSchema = new Schema({
  userId: String,
  username: String,
  type: String,
  timestamp: { type: Date, default: Date.now },
});

// ---- 2. Cria (ou reutiliza) o model ----
const Event = mongoose.models.Event || mongoose.model("Event", eventSchema);

// ---- 3. Função de conexão (mantém 1 conexão aberta) ----
let isConnected = false;
async function connectToDatabase() {
  if (isConnected) return;
  await mongoose.connect(MONGO_URL);
  isConnected = true;
  console.log("MongoDB conectado");
}

// ---- 4. Exporta rota serverless (/api/data) ----
export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();

  if (req.method === "GET") {
    try {
      await connectToDatabase();
      const events = await Event.find();

      // Agrupa por dia
      const grouped = {};
      for (const object of events) {
        const day = object.timestamp.toISOString().split("T")[0];
        if (!grouped[day]) grouped[day] = { entradas: 0, saidas: 0 };

        if (object.type === "GUILD_MEMBER_ADD") grouped[day].entradas++;
        if (object.type === "GUILD_MEMBER_REMOVE") grouped[day].saidas++;
      }

      // Converte em array pra facilitar uso no front
      const data = Object.entries(grouped).map(([day, counts]) => ({
        day,
        ...counts,
      }));

      res.status(200).json({ data });
    } catch (error) {
      console.error("Erro ao buscar eventos:", error);
      res.status(500).json({ error: "Erro ao buscar eventos" });
    }
  } else {
    res.status(405).json({ error: "Método não permitido" });
  }
}
