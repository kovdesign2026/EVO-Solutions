// ============================================================
// esp32/receiver/receiver.ino
// Firmware ESP32 — EVO Solutions (RECEPTOR DE SALA)
// Compatible: Arduino IDE 2.x + ESP32 Board Package 2.x
//
// CONEXIONES DE PINES:
// ─────────────────────────────────────────────────────────
//  BUZZER (Sirena Activa o Pasiva):
//    (+)   → GPIO 5
//    (-)   → GND
//
//  LED ROJO (Sirena policial):
//    Ánodo (+) → GPIO 2 (con resistencia 220Ω en serie)
//    Cátodo(-) → GND
//
//  LED AZUL (Sirena policial):
//    Ánodo (+) → GPIO 4 (con resistencia 220Ω en serie)
//    Cátodo(-) → GND
// ============================================================

#include <esp_now.h>
#include <WiFi.h>
#include <esp_idf_version.h>

#define PIN_BUZZER 5
#define PIN_LED_ROJO 2
#define PIN_LED_AZUL 4

// Estructura para recibir el mensaje ESP-NOW (Debe ser idéntica al emisor)
typedef struct struct_message {
  char cmd[32];
  int alarmMode;
} struct_message;

struct_message myData;

bool alarmActive = false;
unsigned long lastSirenUpdate = 0;
unsigned long lastLedBlink = 0;
int currentFreq = 800;
int sirenDir = 30;
bool ledToggle = false;

// Callback que se ejecuta al recibir un mensaje por ESP-NOW
#if ESP_IDF_VERSION >= ESP_IDF_VERSION_VAL(5, 0, 0)
void OnDataRecv(const esp_now_recv_info *info, const uint8_t *incomingData, int len) {
#else
void OnDataRecv(const uint8_t * mac, const uint8_t *incomingData, int len) {
#endif
  memcpy(&myData, incomingData, sizeof(myData));
  Serial.print("[ESP-NOW] Comando Recibido: ");
  Serial.println(myData.cmd);

  String cmdStr = String(myData.cmd);

  if (cmdStr == "SYSTEM_OFF" || cmdStr == "ALARM_DISARM") {
    alarmActive = false;
    noTone(PIN_BUZZER);
    digitalWrite(PIN_LED_ROJO, LOW);
    digitalWrite(PIN_LED_AZUL, LOW);
    Serial.println("✅ Alarma desactivada. Todo apagado.");
  } 
  else {
    // Si recibimos una alerta diferente a SILENCIOSA, encendemos la sirena completa
    if(cmdStr != "ALARM_SILENT") {
      alarmActive = true;
      Serial.println("🚨 ¡SIRENA ACTIVADA!");
    } else {
      // Si es silenciosa, encendemos la alarma pero apagamos el zumbador (solo destellos)
      alarmActive = true;
      noTone(PIN_BUZZER); 
      Serial.println("🔕 ¡ALARMA SILENCIOSA ACTIVADA (Solo luces)!");
    }
  }
}

void setup() {
  Serial.begin(115200);
  Serial.println("\n────────────────────────────────────────");
  Serial.println("   EVO Solutions — ESP32 RECEPTOR       ");
  Serial.println("────────────────────────────────────────");

  // Configurar pines
  pinMode(PIN_BUZZER, OUTPUT);
  pinMode(PIN_LED_ROJO, OUTPUT);
  pinMode(PIN_LED_AZUL, OUTPUT);

  // Asegurar que inician apagados
  digitalWrite(PIN_LED_ROJO, LOW);
  digitalWrite(PIN_LED_AZUL, LOW);
  noTone(PIN_BUZZER);

  // ESP-NOW requiere que el WiFi esté encendido en modo Estación
  WiFi.mode(WIFI_STA);
  Serial.print("Dirección MAC de este Receptor: ");
  Serial.println(WiFi.macAddress()); // Útil si en el futuro se quiere filtrar por MAC

  // Inicializar ESP-NOW
  if (esp_now_init() != ESP_OK) {
    Serial.println("❌ Error inicializando ESP-NOW");
    return;
  }
  Serial.println("✅ ESP-NOW Inicializado correctamente");

  // Registrar la función de callback
  esp_now_register_recv_cb(OnDataRecv);
  Serial.println("🎧 Escuchando alertas desde la Central (ESP32 Principal)...");
}

void loop() {
  // Lógica no bloqueante para hacer destellos rápidos y sirena
  if (alarmActive) {
    unsigned long m = millis();
    
    // Si no es alarma silenciosa, reproducir sonido de patrulla
    if (String(myData.cmd) != "ALARM_SILENT") {
      // Efecto tipo Wail Policial
      if (m - lastSirenUpdate > 20) {
        lastSirenUpdate = m;
        currentFreq += sirenDir;
        if (currentFreq >= 2000) sirenDir = -40; // Baja más rápido
        if (currentFreq <= 800) sirenDir = 40;   // Sube
        noTone(PIN_BUZZER);
        tone(PIN_BUZZER, currentFreq);
      }
    }

    // Efecto estroboscópico de luces Policiales (Rojo y Azul)
    if (m - lastLedBlink > 100) { // Parpadeo a 100ms
      lastLedBlink = m;
      ledToggle = !ledToggle;
      
      // Alternar rápido los LEDs
      if (ledToggle) {
        digitalWrite(PIN_LED_ROJO, HIGH);
        digitalWrite(PIN_LED_AZUL, LOW);
      } else {
        digitalWrite(PIN_LED_ROJO, LOW);
        digitalWrite(PIN_LED_AZUL, HIGH);
      }
    }
  }
}
