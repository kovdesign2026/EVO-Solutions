// ============================================================
// src/services/logger.js
// Gestión del registro de actividad
// ============================================================

const MAX_ENTRIES = 50;

// Estado en memoria (reset al reiniciar app)
let logEntries = [];

/**
 * Tipos de actividad con sus iconos y colores
 */
export const LogTypes = {
  PRESS:   { icon: 'hand-point-up', color: '#4A5FD4', label: 'Pulsador' },
  TOGGLE:  { icon: 'toggle-on',     color: '#00C853', label: 'Interruptor' },
  SLIDER:  { icon: 'sliders-h',     color: '#FFB300', label: 'Volumen' },
  CONNECT: { icon: 'wifi',          color: '#00E676', label: 'Conexión' },
  ERROR:   { icon: 'exclamation-triangle', color: '#FF4444', label: 'Error' },
};

/**
 * Agrega una entrada al registro
 * @param {string} type - Clave de LogTypes
 * @param {string} title - Título de la acción
 * @param {string} detail - Descripción detallada
 */
export const addLog = (type, title, detail = '') => {
  const entry = {
    id:        Date.now().toString(),
    type,
    title,
    detail,
    timestamp: new Date(),
  };

  logEntries = [entry, ...logEntries].slice(0, MAX_ENTRIES);
  return entry;
};

/**
 * Obtiene todas las entradas del log
 */
export const getLogs = () => [...logEntries];

/**
 * Limpia el registro
 */
export const clearLogs = () => {
  logEntries = [];
};

/**
 * Formatea un timestamp a string legible
 * @param {Date} date
 */
export const formatTime = (date) => {
  return date.toLocaleTimeString('es-CO', {
    hour:   '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
};
