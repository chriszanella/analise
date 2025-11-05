// api/data.js
const mongoose = require("mongoose");
const { Schema } = mongoose;

const MONGO_URL = process.env.MONGO_URL;

const eventSchema = new Schema({
  userId: String,
  username: String,
  type: String,
  timestamp: { type: Date, default: Date.now },
});

const Event = mongoose.models.Event || mongoose.model("Event", eventSchema);

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectToDatabase() {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGO_URL).then((mongoose) => mongoose);
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();

  if (req.method === "GET") {
    try {
      await connectToDatabase();
      const events = await Event.find().lean();

      const grouped = {};
      for (const object of events) {
        const day = object.timestamp.toISOString().split("T")[0];
        if (!grouped[day]) grouped[day] = { entradas: 0, saidas: 0 };
        if (object.type === "GUILD_MEMBER_ADD") grouped[day].entradas++;
        if (object.type === "GUILD_MEMBER_REMOVE") grouped[day].saidas++;
      }

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
};
