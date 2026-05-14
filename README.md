# 🛡️ EVO Solutions — Panel de Control ESP32

Panel de control móvil para sistemas de seguridad residencial y empresarial.  
Desarrollado en **React Native (Expo)** · Comunicación HTTP local con **ESP32**.

---

## 📁 Estructura del Proyecto

```
EVO-Solutions/
├── App.js                          ← Punto de entrada principal
├── app.json                        ← Configuración Expo
├── package.json                    ← Dependencias
├── babel.config.js
│
├── src/
│   ├── theme/
│   │   └── colors.js               ← Paleta de colores corporativa
│   │
│   ├── services/
│   │   ├── api.js                  ← Comunicación HTTP con ESP32
│   │   └── logger.js               ← Registro de actividad
│   │
│   ├── components/
│   │   ├── Header.js               ← Cabecera + estado conexión
│   │   ├── MonostableButton.js     ← Botón PRESS_ON / PRESS_OFF
│   │   ├── BistableSwitch.js       ← Switch TOGGLE_ON / TOGGLE_OFF
│   │   ├── SliderControl.js        ← Potenciómetro VALUE:XX
│   │   ├── DeviceCard.js           ← Tarjeta de dispositivo
│   │   ├── ActivityLog.js          ← Registro de actividad
│   │   ├── BottomNav.js            ← Navegación inferior
│   │   └── Toast.js                ← Notificaciones
│   │
│   └── screens/
│       ├── HomeScreen.js           ← Panel principal
│       ├── DevicesScreen.js        ← Lista de dispositivos
│       ├── ScenesScreen.js         ← Escenas automáticas
│       └── SettingsScreen.js       ← Configuración / IP
│
└── esp32/
    └── firmware.ino                ← Código Arduino para ESP32
```

---

## ⚡ Instalación de la App (React Native / Expo)

### Requisitos previos
- [Node.js](https://nodejs.org/) v18 o superior
- [Expo Go](https://expo.dev/client) instalado en el celular

### Pasos

```bash
# 1. Descomprimir el proyecto
unzip EVO-Solutions.zip
cd EVO-Solutions

# 2. Instalar dependencias
npm install

# 3. Iniciar servidor de desarrollo
npm start
# o: npx expo start

# 4. Escanear el QR con Expo Go (Android) o cámara (iOS)
```

> ⚠️ El celular y el ESP32 deben estar en la **misma red WiFi**.

---

## 🔌 Conexiones del ESP32

### Diagrama de pines

```
ESP32 DevKit v1
┌─────────────────────────────────────────────────────────┐
│                                                         │
│  GPIO 18 ──────────────────► SERVO MOTOR (Puerta)       │
│  GPIO  2 ──[220Ω]──────────► LED (Luz exterior)         │
│  GPIO  4 ──────────────────► BUZZER ACTIVO (Alarma)     │
│  GPIO  5 ──[220Ω]──────────► LED WiFi (Indicador)       │
│                                                         │
│  3.3V  ──────────────────── Lógica ESP32                │
│  5V    ──────────────────── Servo VCC (ext. recom.)     │
│  GND   ──────────────────── GND común                   │
└─────────────────────────────────────────────────────────┘
```

---

### 🔴 Servo Motor (Puerta Principal)

| Pin Servo | Conexión ESP32     | Color cable típico |
|-----------|--------------------|--------------------|
| VCC (+)   | 5V (fuente ext.)   | Rojo               |
| GND (-)   | GND                | Negro/Marrón       |
| SEÑAL     | **GPIO 18**        | Naranja/Amarillo   |

> 💡 **IMPORTANTE:** Alimenta el servo con fuente externa de 5V/2A.  
> Conectar VCC del servo directamente al ESP32 puede causar resets por sobrecorriente.

---

### 💡 LED (Luz Exterior)

```
GPIO 2 ──[R 220Ω]── Ánodo(+) ── LED ── Cátodo(-) ── GND
```

| Componente | Valor    | Notas                          |
|------------|----------|--------------------------------|
| Resistencia| 220Ω     | Para corriente ~15mA            |
| LED        | Cualquier| Rojo, verde, azul o blanco     |

> El GPIO 2 es también el LED integrado en la mayoría de placas ESP32 DevKit.

---

### 🔔 Buzzer Activo (Alarma)

```
GPIO 4 ──(+)── BUZZER ──(-)── GND
```

| Pin Buzzer | Conexión   | Notas                              |
|------------|------------|------------------------------------|
| (+) VCC    | **GPIO 4** | Control directo con PWM            |
| (-) GND    | GND        | Tierra común                       |

> Usa un **buzzer activo** (genera sonido con DC).  
> Si tienes **buzzer pasivo**, reemplaza `ledcWrite()` con `tone()` en el firmware.

---

### 💡 LED Indicador WiFi (Opcional)

```
GPIO 5 ──[R 220Ω]── LED ── GND
```

Se enciende cuando el ESP32 establece conexión WiFi exitosa.

---

## 🔧 Configuración del Firmware ESP32

### 1. Instalar Arduino IDE

Descarga desde: https://www.arduino.cc/en/software

### 2. Agregar soporte ESP32

```
Arduino IDE → Archivo → Preferencias → URLs adicionales:
https://raw.githubusercontent.com/espressif/arduino-esp32/gh-pages/package_esp32_index.json
```

Luego: `Herramientas → Gestor de placas → Buscar "esp32"` → Instalar **v2.x**

### 3. Instalar librerías necesarias

```
Herramientas → Gestor de librerías:
  ✅ ESP32Servo   (by Kevin Harrington)
  ✅ WebServer    (incluida en el paquete ESP32)
```

### 4. Configurar credenciales WiFi

En `esp32/firmware.ino`, líneas 16-17:

```cpp
const char* WIFI_SSID     = "TU_RED_WIFI";     // ← Tu nombre de red
const char* WIFI_PASSWORD = "TU_CONTRASEÑA";    // ← Tu contraseña
```

### 5. Configurar IP estática

En `esp32/firmware.ino`, líneas 20-23:

```cpp
IPAddress staticIP(192, 168, 1, 50);   // ← IP que usará el ESP32
IPAddress gateway(192, 168, 1, 1);     // ← Tu router/gateway
IPAddress subnet(255, 255, 255, 0);    // ← Máscara de subred
```

> 🔑 Esta IP debe coincidir con la configurada en la app (Ajustes → IP ESP32).

### 6. Cargar el firmware

```
Herramientas → Placa → ESP32 Dev Module
Herramientas → Puerto → COMxx (Windows) o /dev/ttyUSBx (Linux/Mac)
→ Cargar (Ctrl+U)
```

### 7. Verificar con Monitor Serie

```
Herramientas → Monitor Serie → 115200 baudios
```

Deberías ver:
```
════════════════════════════════════════
   EVO Solutions — ESP32 Firmware
════════════════════════════════════════
[WiFi] Conectando a: TU_RED_WIFI
........
[WiFi] ✅ Conectado!
[WiFi] IP: 192.168.1.50
[HTTP] ✅ Servidor iniciado en puerto 80
[HTTP] Esperando comandos de la app...
────────────────────────────────────────
```

---

## 📡 API HTTP — Endpoints

| Endpoint                        | Acción                        | Respuesta       |
|----------------------------------|-------------------------------|-----------------|
| `GET /status`                   | Verificar conexión            | JSON con estado |
| `GET /comando?data=PRESS_ON`    | Abrir puerta (servo 90°)      | `OK:PRESS_ON`   |
| `GET /comando?data=PRESS_OFF`   | Cerrar puerta (servo 0°)      | `OK:PRESS_OFF`  |
| `GET /comando?data=TOGGLE_ON`   | Encender LED                  | `OK:TOGGLE_ON`  |
| `GET /comando?data=TOGGLE_OFF`  | Apagar LED                    | `OK:TOGGLE_OFF` |
| `GET /comando?data=VALUE:75`    | Buzzer al 75% de volumen      | `OK:VALUE:75`   |

### Probar desde navegador o curl

```bash
# Verificar conexión
curl http://192.168.1.50/status

# Abrir puerta
curl "http://192.168.1.50/comando?data=PRESS_ON"

# Encender LED
curl "http://192.168.1.50/comando?data=TOGGLE_ON"

# Buzzer al 80%
curl "http://192.168.1.50/comando?data=VALUE:80"
```

---

## 📱 Uso de la App

### Pantalla: Inicio
| Control            | Función                                   |
|--------------------|-------------------------------------------|
| **PULSADOR**       | Mantener presionado para abrir la puerta  |
| **INTERRUPTOR**    | Toggle para encender/apagar la luz        |
| **VOLUMEN BUZZER** | Deslizar para controlar la alarma         |

### Pantalla: Dispositivos
- Vista detallada de cada dispositivo
- Control individual con botón ON/OFF
- Información de pins y comandos activos

### Pantalla: Escenas
- **Modo Alarma:** Activa buzzer al 100% + luz
- **Bienvenida:** Abre puerta + enciende luz
- **Modo Nocturno:** Apaga todo
- **Ronda de Vigilancia:** Activa monitoreo

### Pantalla: Ajustes
- Cambiar IP del ESP32
- Probar conexión en tiempo real
- Ver endpoints disponibles
- Limpiar registro de actividad

---

## 🛠️ Solución de Problemas

### ❌ App no conecta al ESP32

1. Verifica que el celular esté en la **misma red WiFi** que el ESP32
2. Confirma la IP en `Ajustes → IP ESP32`
3. Prueba `ping 192.168.1.50` desde una PC en la red
4. Revisa el Monitor Serie del Arduino IDE para ver errores WiFi
5. Algunos routers bloquean comunicación entre dispositivos — habilita "Client Isolation" OFF

### ❌ Android bloquea HTTP (no HTTPS)

El archivo `app.json` ya incluye `"usesCleartextTraffic": true`.  
Si compilas con EAS Build, verifica que el AndroidManifest tenga `android:usesCleartextTraffic="true"`.

### ❌ Servo no se mueve

- Verifica alimentación externa de 5V para el servo
- Comprueba que el pin de señal esté en GPIO 18
- En Monitor Serie debe aparecer `→ Servo: ABRIENDO (90°)`

### ❌ LED no enciende

- Verifica polaridad (ánodo al GPIO, cátodo a GND)
- La resistencia de 220Ω es obligatoria
- GPIO 2 en algunos ESP32 está invertido (LOW = encendido) — ajusta en el firmware

### ❌ "Module not found" al instalar

```bash
# Limpiar caché y reinstalar
rm -rf node_modules
npm cache clean --force
npm install
```

---

## 🔒 Seguridad

> Esta aplicación está diseñada para **redes locales privadas**.  
> No expongas el puerto 80 del ESP32 a internet sin implementar autenticación.

Para producción considerar:
- Token de autenticación en los headers HTTP
- HTTPS con certificado autofirmado
- Filtrado de IPs por MAC address en el router

---

## 📦 Build para producción

```bash
# Instalar EAS CLI
npm install -g eas-cli

# Configurar proyecto
eas build:configure

# Build Android APK
eas build --platform android --profile preview

# Build iOS (requiere cuenta Apple Developer)
eas build --platform ios
```

---

## 🏢 Empresa

**EVO Solutions**  
Panel de Control IoT v1.0.0  
Desarrollado para control de sistemas de seguridad residencial y empresarial.

---

*Powered by ESP32 + React Native + Expo*
