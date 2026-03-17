import express from "express"
import { processMessage } from "../bot/flow.js"

const app = express()

app.use(express.json())

// 🔹 Verificar servidor
app.get("/", (req, res) => {
  res.send("Bot Rendichicas funcionando 🚀")
})

/*
🔹 Endpoint para pruebas (Postman)
*/
app.post("/message", async (req, res) => {
  try {
    const { text, image } = req.body

    const user = "usuario_test"

    const reply = await processMessage({ text, image }, user)

    return res.json({ reply })

  } catch (error) {
    console.error("Error en /message:", error)

    return res.status(500).json({
      reply: "❌ Error procesando mensaje"
    })
  }
})

/*
🔹 Webhook WhatsApp (Meta)
*/
app.post("/webhook", async (req, res) => {
  try {
    const body = req.body

    const message = body?.entry?.[0]?.changes?.[0]?.value?.messages?.[0]

    if (!message) {
      return res.sendStatus(200)
    }

    const user = message.from

    // Detectar texto o imagen
    const text = message.text?.body || null
    const image = message.image?.id || null

    const reply = await processMessage({ text, image }, user)

    console.log("Usuario:", user)
    console.log("Mensaje:", text || image)
    console.log("Respuesta:", reply)

    // ⚠️ Aquí después enviaremos respuesta a WhatsApp (aún no implementado)

    return res.sendStatus(200)

  } catch (err) {
    console.error("Error en /webhook:", err)
    return res.sendStatus(500)
  }
})

/*
🔹 Verificación de webhook (Meta)
*/
app.get("/webhook", (req, res) => {
  const VERIFY_TOKEN = "rendichicas_token"

  const mode = req.query["hub.mode"]
  const token = req.query["hub.verify_token"]
  const challenge = req.query["hub.challenge"]

  if (mode && token === VERIFY_TOKEN) {
    return res.status(200).send(challenge)
  }

  return res.sendStatus(403)
})

export default app