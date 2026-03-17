const express = require("express");
const router = express.Router();

// Ruta principal del bot
router.post("/", async (req, res) => {
  try {
    const { text, image } = req.body;

    console.log("Mensaje recibido:", text || image);

    // 🧠 RESPUESTAS BÁSICAS
    if (text) {
      if (text.toLowerCase().includes("hola")) {
        return res.json({
          reply: "👋 Hola, soy tu bot de soporte. ¿En qué te ayudo?"
        });
      }

      if (text.toLowerCase().includes("evidencia")) {
        return res.json({
          reply: "📸 Por favor envía la imagen como evidencia."
        });
      }

      if (text.toLowerCase().includes("reiniciar bombas")) {
        return res.json({
          reply: "🔧 Indícame el número de estación."
        });
      }

      return res.json({
        reply: "❓ No entendí tu mensaje."
      });
    }

    // 📸 SI RECIBE IMAGEN
    if (image) {
      return res.json({
        reply: "📸 Evidencia recibida.\n\nTu ticket fue enviado al equipo de soporte.\nUn agente revisará tu caso."
      });
    }

    return res.json({
      reply: "⚠️ Mensaje vacío."
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      reply: "❌ Error en el servidor."
    });
  }
});

module.exports = router;