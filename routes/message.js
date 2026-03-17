import express from "express"
import { processMessage } from "../bot/flow.js"

const router = express.Router()

// Endpoint para pruebas (Postman)
router.post("/", async (req, res) => {
  try {
    const { text = null, image = null, user = "usuario_test" } = req.body ?? {}

    const reply = await processMessage({ text, image }, user)

    return res.json({ reply })
  } catch (error) {
    console.error("Error en routes/message:", error)
    return res.status(500).json({ reply: "❌ Error procesando mensaje" })
  }
})

export default router