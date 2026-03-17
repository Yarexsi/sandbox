import express from "express"
import { processMessage } from "../bot/flow.js"
import messageRouter from "../routes/message.js"
import { sendWhatsAppText } from "../services/whatsappApi.js"

const app = express()

app.use(express.json())

app.use("/message", messageRouter)

// 🔹 Verificar servidor
app.get("/", (req, res) => {
  res.send("Bot Rendichicas funcionando 🚀")
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

    // Enviar respuesta a WhatsApp
    await sendWhatsAppText(user, reply)

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
  const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN

  const mode = req.query["hub.mode"]
  const token = req.query["hub.verify_token"]
  const challenge = req.query["hub.challenge"]

  if (!VERIFY_TOKEN) {
    console.error("WHATSAPP_VERIFY_TOKEN no está configurado")
    return res.sendStatus(500)
  }

  if (mode && token === VERIFY_TOKEN) {
    return res.status(200).send(challenge)
  }

  return res.sendStatus(403)
})

export default app