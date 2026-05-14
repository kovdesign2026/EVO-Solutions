// ============================================================
// esp32/firmware.ino
// Firmware ESP32 — EVO Solutions Panel de Control (PRINCIPAL)
// Compatible: Arduino IDE 2.x + ESP32 Board Package 2.x
//
// CONEXIONES DE PINES:
// ─────────────────────────────────────────────────────────
//  SERVO MOTOR (Puerta, Posicional 180°):
//    VCC   → 5V  (alimentación externa recomendada, aunque no pida mucha potencia)
//    GND   → GND
//    SEÑAL → GPIO 13 (NUNCA USAR GPIO 34, 35, 36 o 39 PARA SALIDA, SON SOLO ENTRADA)
//
//  LED (Luz exterior):
//    Ánodo (+) → GPIO 2 (con resistencia 220Ω en serie)
//    Cátodo(-) → GND
//
//  BUZZER ACTIVO (Alarma):
//    (+)   → GPIO 4
//    (-)   → GND
//    Nota: Si el buzzer es pasivo, usa tone() en lugar de digitalWrite
//
//  LED indicador WiFi (opcional):
//    (+)   → GPIO 5 (con resistencia 220Ω)
//    (-)   → GND
// ============================================================

#include <ESP32Servo.h> // Instalar: "ESP32Servo" by Kevin Harrington
#include <WebServer.h>
#include <WiFi.h>
#include <esp_now.h> // LIBRERÍA ESP-NOW
#include <esp_idf_version.h>

// ── Configuración WiFi ───────────────────────────────────
const char *WIFI_SSID = "FAMILIAGV";
const char *WIFI_PASSWORD = "Samara0807";

// IP estática (debe coincidir con la app)
IPAddress staticIP(192, 168, 1, 50);
IPAddress gateway(192, 168, 1, 1);
IPAddress subnet(255, 255, 255, 0);
IPAddress dns(8, 8, 8, 8);

// ── Pines ────────────────────────────────────────────────
#define PIN_SERVO                                                              \
  13 // Servo motor (¡Cambiado a 13! GPIO 18 a veces da problemas y 34 es solo
     // entrada)
#define PIN_LED 2    // LED (luz exterior) - también LED_BUILTIN en muchos ESP32
#define PIN_BUZZER 4 // Buzzer activo (alarma)
#define PIN_WIFI_LED 5 // LED indicador de WiFi (opcional)

// ── Servidor HTTP ────────────────────────────────────────
WebServer server(80);

// ── Objetos ──────────────────────────────────────────────
Servo doorServo;

// ── Estado global ────────────────────────────────────────
bool ledState = false;
bool buzzerState = false;
int buzzerVolume = 0; // 0-100 (PWM)
bool doorOpen = false;

// ── Variables para efectos de sirena ─────────────────────
unsigned long lastSirenUpdate = 0;
int currentFreq = 800;
int sirenDir = 30; // Velocidad de cambio de la sirena
int alarmMode = 0; // 0=Off, 1=Panic, 2=Robbery, 3=Fire, 4=Medical, 5=Evacuation, 6=Silent

// ── ESP-NOW Configuración ────────────────────────────────
// Usamos dirección Broadcast para que cualquier ESP32 esclavo pueda escuchar
uint8_t broadcastAddress[] = {0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF};

typedef struct struct_message {
  char cmd[32];
  int alarmMode;
} struct_message;

struct_message myData;
esp_now_peer_info_t peerInfo;

#if ESP_IDF_VERSION >= ESP_IDF_VERSION_VAL(5, 0, 0)
void OnDataSent(const wifi_tx_info_t *tx_info, esp_now_send_status_t status) {
#else
void OnDataSent(const uint8_t *mac_addr, esp_now_send_status_t status) {
#endif
  Serial.print("[ESP-NOW] Estado de envío: ");
  Serial.println(status == ESP_NOW_SEND_SUCCESS ? "Éxito" : "Fallo");
}

void sendESPNOW(String command, int mode) {
  command.toCharArray(myData.cmd, 32);
  myData.alarmMode = mode;
  esp_err_t result = esp_now_send(broadcastAddress, (uint8_t *) &myData, sizeof(myData));
  if (result == ESP_OK) {
    Serial.println("[ESP-NOW] Comando " + command + " enviado correctamente");
  } else {
    Serial.println("[ESP-NOW] Error enviando comando");
  }
}

// ── Configuración CORS (permite llamadas desde la app) ────
void setCORSHeaders() {
  server.sendHeader("Access-Control-Allow-Origin", "*");
  server.sendHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  server.sendHeader("Access-Control-Allow-Headers", "Content-Type");
}

// ── Endpoint: /status ─────────────────────────────────────
// La app lo usa para verificar si el ESP32 está en línea y obtener estado de alarma
void handleStatus() {
  setCORSHeaders();

  String json = "{";
  json += "\"status\":\"ok\",";
  json += "\"device\":\"ESP32 EVO Solutions\",";
  json += "\"led\":" + String(ledState ? "true" : "false") + ",";
  json += "\"buzzer\":" + String(buzzerState ? "true" : "false") + ",";
  json += "\"volume\":" + String(buzzerVolume) + ",";
  json += "\"door\":" + String(doorOpen ? "true" : "false") + ",";
  json += "\"alarmMode\":" + String(alarmMode);
  json += "}";

  server.send(200, "application/json", json);
}

// ── Endpoint: /comando?data=XXX ───────────────────────────
// Recibe comandos desde la app React Native
void handleComando() {
  setCORSHeaders();

  if (!server.hasArg("data")) {
    server.send(400, "text/plain", "ERROR: Falta parametro 'data'");
    return;
  }

  String cmd = server.arg("data");
  cmd.trim();
  Serial.println("[CMD] Recibido: " + cmd);

  // ── Lógica Central Comunitaria ──────────────────────────
  // SOS → Solo envía al receptor de abajo por ESP-NOW (sirena policial)
  // Otras alarmas → Solo activan hardware local del cuarto
  // SYSTEM_OFF → Apaga TODO (local + ESP-NOW)

  // 1. ALERTA DE PÁNICO (SOS) → SOLO ESP-NOW al receptor de abajo
  if (cmd == "ALARM_PANIC") {
    alarmMode = 1;
    Serial.println("🚨 [SOS] Enviando sirena al receptor de abajo por ESP-NOW");
    sendESPNOW(cmd, alarmMode);  // Solo envía al receptor
    server.send(200, "text/plain", "OK:ALARM_PANIC");
  }

  // 2. ALERTA DE ROBO → Solo local (cuarto)
  else if (cmd == "ALARM_ROBBERY") {
    buzzerState = true;
    alarmMode = 2;
    doorServo.write(0);         // Cierra la puerta por seguridad
    Serial.println("🚨 [ALARMA LOCAL] ROBO ACTIVADO");
    server.send(200, "text/plain", "OK:ALARM_ROBBERY");
  }

  // 3. ALERTA DE INCENDIO → Solo local (cuarto)
  else if (cmd == "ALARM_FIRE") {
    buzzerState = true;
    alarmMode = 3;
    doorServo.write(90);        // Abre la puerta para evacuación
    Serial.println("🔥 [ALARMA LOCAL] INCENDIO ACTIVADO");
    server.send(200, "text/plain", "OK:ALARM_FIRE");
  }

  // 4. EMERGENCIA MÉDICA → Solo local (cuarto)
  else if (cmd == "ALARM_MEDICAL") {
    buzzerState = true;
    alarmMode = 4;
    doorServo.write(90);        // Abre la puerta para acceso médico
    Serial.println("⚕️ [ALARMA LOCAL] EMERGENCIA MÉDICA ACTIVADA");
    server.send(200, "text/plain", "OK:ALARM_MEDICAL");
  }

  // 5. EVACUACIÓN → Solo local (cuarto)
  else if (cmd == "ALARM_EVACUATION") {
    buzzerState = true;
    alarmMode = 5;
    doorServo.write(90);        // Abre la puerta
    Serial.println("🏃 [ALARMA LOCAL] EVACUACIÓN ACTIVADA");
    server.send(200, "text/plain", "OK:ALARM_EVACUATION");
  }

  // 6. ALERTA SILENCIOSA → Solo local (cuarto)
  else if (cmd == "ALARM_SILENT") {
    alarmMode = 6;
    ledState = true;
    digitalWrite(PIN_LED, HIGH); // Solo prende LED, sin buzzer
    doorServo.write(0);
    Serial.println("🔕 [ALARMA LOCAL] SILENCIOSA ACTIVADA");
    server.send(200, "text/plain", "OK:ALARM_SILENT");
  }

  // 7. APAGAR SISTEMA / DESARMAR → Apaga local Y envía ESP-NOW para apagar el receptor
  else if (cmd == "SYSTEM_OFF" || cmd == "ALARM_DISARM") {
    buzzerState = false;
    alarmMode = 0;
    ledState = false;
    digitalWrite(PIN_LED, LOW); // Apaga el LED
    noTone(PIN_BUZZER);         // Apaga la sirena
    doorServo.write(0);         // Cierra y asegura la puerta
    Serial.println("✅ [SISTEMA] APAGADO LOCAL + ESP-NOW");
    sendESPNOW("SYSTEM_OFF", 0);  // Apaga el receptor de abajo también
    delay(50);                     // Pequeña pausa para asegurar que se envíe
    sendESPNOW("SYSTEM_OFF", 0);  // Envía 2 veces por seguridad
    server.send(200, "text/plain", "OK:SYSTEM_OFF");
  }

  // ── Comando desconocido ───────────────────────────────
  else {
    Serial.println("[WARN] Comando no reconocido: " + cmd);
    server.send(400, "text/plain", "ERROR:UNKNOWN_CMD:" + cmd);
  }
}

// ── Endpoint: OPTIONS (pre-flight CORS) ──────────────────
void handleOptions() {
  setCORSHeaders();
  server.send(204, "text/plain", "");
}

// ── Conectar a WiFi ───────────────────────────────────────
void connectWiFi() {
  Serial.print("[WiFi] Conectando a: ");
  Serial.println(WIFI_SSID);

  WiFi.mode(WIFI_STA); // Necesario explícitamente para ESP-NOW
  WiFi.config(staticIP, gateway, subnet, dns);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

  int attempts = 0;
  while (WiFi.status() != WL_CONNECTED && attempts < 30) {
    delay(500);
    Serial.print(".");
    attempts++;
  }

  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("\n[WiFi] ✅ Conectado!");
    Serial.print("[WiFi] IP: ");
    Serial.println(WiFi.localIP());
    digitalWrite(PIN_WIFI_LED, HIGH); // Indicador ON
  } else {
    Serial.println("\n[WiFi] ❌ Error de conexión. Reiniciando...");
    delay(3000);
    ESP.restart();
  }
}

// ── Setup ─────────────────────────────────────────────────
void setup() {
  Serial.begin(115200);
  Serial.println("\n");
  Serial.println("════════════════════════════════════════");
  Serial.println("   EVO Solutions — ESP32 Firmware      ");
  Serial.println("════════════════════════════════════════");

  // ── Configurar pines ──────────────────────────────────
  pinMode(PIN_LED, OUTPUT);
  pinMode(PIN_BUZZER, OUTPUT);
  pinMode(PIN_WIFI_LED, OUTPUT);

  digitalWrite(PIN_LED, LOW);
  digitalWrite(PIN_BUZZER, LOW);
  digitalWrite(PIN_WIFI_LED, LOW);

  // ── Configurar Servo ──────────────────────────────────
  ESP32PWM::allocateTimer(0);
  ESP32PWM::allocateTimer(1);
  ESP32PWM::allocateTimer(2);
  ESP32PWM::allocateTimer(3);
  doorServo.setPeriodHertz(50);           // Servo estándar de 50Hz
  doorServo.attach(PIN_SERVO, 500, 2400); // min/max microsegundos
  doorServo.write(0); // Posición inicial: 0° = Puerta cerrada
  Serial.println("[SERVO] Inicializado en posición 0° (cerrada)");

  // ── Conectar WiFi ─────────────────────────────────────
  connectWiFi();

  // ── Iniciar ESP-NOW ───────────────────────────────────
  if (esp_now_init() == ESP_OK) {
    Serial.println("[ESP-NOW] ✅ Inicializado correctamente");
    esp_now_register_send_cb(OnDataSent);
    memcpy(peerInfo.peer_addr, broadcastAddress, 6);
    peerInfo.channel = 0;  
    peerInfo.encrypt = false;
    if (esp_now_add_peer(&peerInfo) != ESP_OK){
      Serial.println("[ESP-NOW] ❌ Error agregando peer de broadcast");
    }
  } else {
    Serial.println("[ESP-NOW] ❌ Error al inicializar ESP-NOW");
  }

  // ── Registrar endpoints ───────────────────────────────
  server.on("/status", HTTP_GET, handleStatus);
  server.on("/comando", HTTP_GET, handleComando);
  server.on("/", HTTP_OPTIONS, handleOptions);
  server.on("/comando", HTTP_OPTIONS, handleOptions);

  // Ruta raíz (info básica)
  server.on("/", HTTP_GET, []() {
    setCORSHeaders();
    server.send(200, "text/html",
                "<h1>EVO Solutions</h1>"
                "<p>ESP32 Panel de Control</p>"
                "<p>Endpoints: <code>/status</code>, "
                "<code>/comando?data=CMD</code></p>");
  });

  server.begin();
  Serial.println("[HTTP] ✅ Servidor iniciado en puerto 80");
  Serial.println("[HTTP] Esperando comandos de la app...");
  Serial.println("────────────────────────────────────────");
}

// ── Loop ──────────────────────────────────────────────────
void loop() {
  // Procesar peticiones HTTP
  server.handleClient();

  // Efecto de Sirena Dinámica
  if (buzzerState) {
    unsigned long m = millis();
    if (alarmMode == 1) { // Panic: Wail
      if (m - lastSirenUpdate > 20) {
        lastSirenUpdate = m;
        currentFreq += sirenDir;
        if (currentFreq >= 2000) sirenDir = -30;
        if (currentFreq <= 800) sirenDir = 30;
        noTone(PIN_BUZZER);
        tone(PIN_BUZZER, currentFreq);
      }
    } else if (alarmMode == 2) { // Robbery: Hi-Low
      if (m - lastSirenUpdate > 400) {
        lastSirenUpdate = m;
        currentFreq = (currentFreq == 1500) ? 800 : 1500;
        noTone(PIN_BUZZER);
        tone(PIN_BUZZER, currentFreq);
      }
    } else if (alarmMode == 3) { // Fire: Slow Beep
      if (m - lastSirenUpdate > 500) {
        lastSirenUpdate = m;
        currentFreq = (currentFreq == 1000) ? 0 : 1000;
        noTone(PIN_BUZZER);
        if (currentFreq > 0) tone(PIN_BUZZER, currentFreq);
      }
    } else if (alarmMode == 4) { // Medical: Fast Beep
      if (m - lastSirenUpdate > 150) {
        lastSirenUpdate = m;
        currentFreq = (currentFreq == 1200) ? 0 : 1200;
        noTone(PIN_BUZZER);
        if (currentFreq > 0) tone(PIN_BUZZER, currentFreq);
      }
    } else if (alarmMode == 5) { // Evacuation: Sweep down
      if (m - lastSirenUpdate > 10) {
        lastSirenUpdate = m;
        currentFreq -= 10;
        if (currentFreq <= 500) currentFreq = 2000;
        noTone(PIN_BUZZER);
        tone(PIN_BUZZER, currentFreq);
      }
    } else if (alarmMode == 6) { // Silent
      noTone(PIN_BUZZER);
    }
  }

  // Reconectar WiFi si se pierde la conexión
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("[WiFi] ⚠ Conexión perdida, reconectando...");
    digitalWrite(PIN_WIFI_LED, LOW);
    connectWiFi();
  }

  delay(1); // Ceder tiempo al scheduler del ESP32
}
