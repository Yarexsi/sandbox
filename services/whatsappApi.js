import axios from "axios"

const TOKEN = process.env.WHATSAPP_TOKEN
const PHONE_ID = process.env.WHATSAPP_PHONE_ID

// Mantenerlo simple: usar una versión fija, como recomienda Meta por periodo.
// Si necesitan cambiarla, se puede convertir a env más adelante.
const GRAPH_VERSION = "v19.0"

export async function sendWhatsAppText(to, text) {
  const body = typeof text === "string" ? text : String(text ?? "")

  if (!TOKEN || !PHONE_ID) {
    console.warn(
      "WhatsApp no configurado: falta WHATSAPP_TOKEN o WHATSAPP_PHONE_ID; se omite envío"
    )
    return { skipped: true }
  }

  if (!to || !body) {
    return { skipped: true }
  }

  const url = `https://graph.facebook.com/${GRAPH_VERSION}/${PHONE_ID}/messages`

  const res = await axios.post(
    url,
    {
      messaging_product: "whatsapp",
      to,
      type: "text",
      text: { body }
    },
    {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        "Content-Type": "application/json"
      }
    }
  )

  return res.data
}
