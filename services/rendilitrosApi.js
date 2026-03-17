import axios from "axios"

const API_URL = "https://addesapi.rendilitros.com/api/Bot"

// 🔒 MODO SEGURO
const SAFE_MODE = true

// ==========================
// 🔹 MOCK HELPER
// ==========================
function mockResponse(action) {
  console.log(`🧪 [SANDBOX] Ejecutando: ${action}`)

  return {
    success: true,
    message: `[SANDBOX] ${action} ejecutado correctamente`
  }
}

// ==========================
// 🔹 ENVIAR CÓDIGO
// ==========================
export async function enviarCodigo(noEstacion, telefono) {

  if (SAFE_MODE) {
    return mockResponse(`Código enviado a ${telefono} en estación ${noEstacion}`)
  }

  try {
    const res = await axios.post(`${API_URL}/EnviarCodigo`, {
      Data: {
        noEstacion,
        Telefono: telefono
      }
    })

    return res.data

  } catch (error) {
    console.error("Error enviando código:", error.message)
    return null
  }
}

// ==========================
// 🔹 REINICIAR BOMBAS
// ==========================
export async function reiniciarBombas(noEstacion, codigo) {

  if (SAFE_MODE) {
    return mockResponse(`Bombas reiniciadas en estación ${noEstacion}`)
  }

  try {
    const res = await axios.post(`${API_URL}/ReiniciarMonitorBombas`, {
      Data: {
        noEstacion,
        Codigo: codigo
      }
    })

    return res.data

  } catch (error) {
    console.error("Error reiniciando bombas:", error.message)
    return null
  }
}

// ==========================
// 🔹 REINICIAR TANQUES
// ==========================
export async function reiniciarTanques(noEstacion, telefono) {

  if (SAFE_MODE) {
    return mockResponse(`Tanques reiniciados en estación ${noEstacion}`)
  }

  try {
    const res = await axios.post(`${API_URL}/ReiniciarMonitorTanques`, {
      Data: {
        noEstacion,
        Telefono: telefono
      }
    })

    return res.data

  } catch (error) {
    console.error("Error reiniciando tanques:", error.message)
    return null
  }
}

// ==========================
// 🔹 DISPENSARIOS
// ==========================
export async function setDispensarios(noEstacion, telefono, modo) {

  if (SAFE_MODE) {
    return mockResponse(`Dispensarios en modo ${modo} en estación ${noEstacion}`)
  }

  try {
    const res = await axios.post(`${API_URL}/SetDispensarios`, {
      Data: {
        NoEstacion: noEstacion,
        Telefono: telefono,
        Modo: modo
      }
    })

    return res.data

  } catch (error) {
    console.error("Error en dispensarios:", error.message)
    return null
  }
}