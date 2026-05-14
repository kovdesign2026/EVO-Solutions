import { ESP32_IP } from '../config';

/**
 * Servicio centralizado para comunicación con el hardware ESP32
 */

// --- HARDWARE (ESP32) ---
export const checkHardwareConnection = async () => {
  try {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), 2000); // 2 seg timeout
    const response = await fetch(`http://${ESP32_IP}/status`, { signal: controller.signal });
    clearTimeout(id);
    if (response.ok) {
      const data = await response.json();
      return { connected: true, alarmMode: data.alarmMode || 0 };
    }
    return { connected: false, alarmMode: 0 };
  } catch (e) {
    return { connected: false, alarmMode: 0 };
  }
};

export const sendCommand = async (command) => {
  try {
    const response = await fetch(`http://${ESP32_IP}/comando?data=${command}`);
    if (response.ok) {
      return { success: true };
    }
    return { success: false, error: 'Respuesta inválida del hardware' };
  } catch (e) {
    return { success: false, error: 'No se pudo conectar con el ESP32' };
  }
};
