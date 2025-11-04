import mongoose from 'mongoose';

const MONGO_URL = process.env.MONGO_URL

const eventSchema = new Schema({
    userId: String,
    username: String,
    type: String,
    timestamp: { type: Date, default: Date.now}
});

const Event = mongoose.models.Event || mongoose.model("Event", eventSchema);
export default async function connectToDatabase() {
    if (!mongoose.connection.readyState){
        await  mongoose.connect(MONGO_URL);
    }

    if (req.method === "GET"){

        try {
            const events = await Event.find();

            // Agrupar por dia
            const grouped = {};

            for (const object of events) {
                const day = eventSchema.timestamp.toISOString().split("T")[0];
                if (!grouped[day]) grouped[day] = { entradas: 0, saidas:0 };
                if ( object.type === "GUILD_MEMBER_ADD" ) grouped[day].entradas++;
                if ( object.type === "GUILD_MEMBER_REMOVE" ) grouped[day].saidas++;
            }

            // Converter para array
            const data = Object.entries(grouped).map(([day, counts]) => ({
                day,
                ...counts
            }))

            res.status(200).json({ events });
        } catch (error) {
            res.status(500).json({ error: "Erro ao buscar eventos" });
        }

    } else {
        res.status(405).json({ error: "Metodo nao permitido" });
    }
}