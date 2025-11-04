const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Event = require('./models/Event');
require('dotenv').config()

const PORT = 3030;
const app = express();
app.use(cors());
app.use(express.json())
app.use(express.static('public'));

//Conecta ao MongoDB
mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

// Rotas para pegar dados
app.get('/api/data', async (req, res) => {
  const events = await Event.find().lean();

  // Agrupar por dia
  const grouped = {};

  for (const object of events) {
    const day = object.timestamp.toISOString().split("T")[0];
    
    if (!grouped[day]) grouped[day] = { entradas: 0, saidas: 0 };

    if (object.eventType === "GUILD_MEMBER_ADD") grouped[day].entradas++;
    if (object.eventType === "GUILD_MEMBER_REMOVE") grouped[day].saidas++;
  }

  const labels = Object.keys(grouped);
  const joins = labels.map(day => grouped[day].entradas);
  const leaves = labels.map(day => grouped[day].saidas);

  res.json({ labels, joins, leaves });
});


app.listen(PORT, () => console.log('Servidor rodando em http://localhost:3000'));