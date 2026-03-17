// bot/flow.js

import {
  enviarCodigo,
  reiniciarBombas,
  reiniciarTanques,
  setDispensarios
} from "../services/rendilitrosApi.js"

// 🧠 Memoria en RAM
const userState = {}

// Estados
const STATES = {
  NONE: "NONE",
  ESPERANDO_ESTACION: "ESPERANDO_ESTACION",
  ESPERANDO_TELEFONO: "ESPERANDO_TELEFONO",
  ESPERANDO_CODIGO: "ESPERANDO_CODIGO",
  ESPERANDO_MODO: "ESPERANDO_MODO"
}

// 🔥 FUNCIÓN PRINCIPAL
export async function processMessage({ text, image }, user) {

  // Inicializar usuario
  if (!userState[user]) {
    userState[user] = {
      state: STATES.NONE,
      data: {}
    }
  }

  const current = userState[user]

  // 📸 IMAGEN
  if (image) {
    return "📸 Evidencia recibida.\n\nTu ticket fue enviado al equipo de soporte."
  }

  const msg = text?.toLowerCase()

  if (!msg) {
    return "⚠️ No entendí el mensaje."
  }

  // =========================
  // 💬 SALUDO
  // =========================
  if (msg.includes("hola")) {
    return `👋 Hola, soy tu bot Rendichicas

Puedes decir:
- Reiniciar bombas
- Reiniciar tanques
- Configurar dispensarios`
  }

  // =========================
  // 🚪 COMANDOS
  // =========================

  if (msg.includes("reiniciar bombas")) {
    current.state = STATES.ESPERANDO_ESTACION
    current.data = { action: "bombas" }

    return "🔧 Indícame el número de estación."
  }

  if (msg.includes("reiniciar tanques")) {
    current.state = STATES.ESPERANDO_ESTACION
    current.data = { action: "tanques" }

    return "⛽ Indícame el número de estación."
  }

  if (msg.includes("dispensarios")) {
    current.state = STATES.ESPERANDO_ESTACION
    current.data = { action: "dispensarios" }

    return "⚙️ Indícame el número de estación."
  }

  // =========================
  // 1️⃣ ESTACIÓN
  // =========================
  if (current.state === STATES.ESPERANDO_ESTACION) {

    const noEstacion = parseInt(msg)

    if (isNaN(noEstacion)) {
      return "❌ Ingresa un número de estación válido."
    }

    current.data.noEstacion = noEstacion
    current.state = STATES.ESPERANDO_TELEFONO

    return "📱 Ingresa tu número de teléfono."
  }

  // =========================
  // 2️⃣ TELÉFONO → ENVÍA CÓDIGO
  // =========================
  if (current.state === STATES.ESPERANDO_TELEFONO) {

    const telefono = msg
    current.data.telefono = telefono

    const result = await enviarCodigo(
      current.data.noEstacion,
      telefono
    )

    if (!result) {
      return "❌ Error enviando código. Intenta de nuevo."
    }

    current.state = STATES.ESPERANDO_CODIGO

    return "📲 Te enviamos un código. Escríbelo para continuar."
  }

  // =========================
  // 3️⃣ CÓDIGO
  // =========================
  if (current.state === STATES.ESPERANDO_CODIGO) {

    const { action, noEstacion, telefono } = current.data
    const codigo = parseInt(msg)

    if (isNaN(codigo)) {
      return "❌ Código inválido. Ingresa solo números."
    }

    // 🔧 BOMBAS
    if (action === "bombas") {

      const result = await reiniciarBombas(noEstacion, codigo)

      current.state = STATES.NONE

      return result
        ? "✅ Bombas reiniciadas correctamente."
        : "❌ Error al reiniciar bombas."
    }

    // ⛽ TANQUES
    if (action === "tanques") {

      const result = await reiniciarTanques(noEstacion, telefono)

      current.state = STATES.NONE

      return result
        ? "✅ Tanques reiniciados correctamente."
        : "❌ Error al reiniciar tanques."
    }

    // ⚙️ DISPENSARIOS
    if (action === "dispensarios") {
      current.state = STATES.ESPERANDO_MODO
      return "⚙️ Indica el modo (AUTO / MANUAL)."
    }
  }

  // =========================
  // 4️⃣ MODO DISPENSARIOS
  // =========================
  if (current.state === STATES.ESPERANDO_MODO) {

    const modo = msg.toUpperCase()

    if (modo !== "AUTO" && modo !== "MANUAL") {
      return "❌ Modo inválido. Usa AUTO o MANUAL."
    }

    const result = await setDispensarios(
      current.data.noEstacion,
      current.data.telefono,
      modo
    )

    current.state = STATES.NONE

    return result
      ? "✅ Dispensarios configurados correctamente."
      : "❌ Error al configurar dispensarios."
  }

  return "❓ No entendí tu mensaje."
}