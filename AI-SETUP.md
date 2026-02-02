# 🎬 Motion Graphics Studio - AI Generation Setup

## ✨ Nuevo Feature: Generación con IA

Ahora podés generar videos escribiendo lo que querés en lenguaje natural.

---

## 🔑 Configuración de Gemini API

### 1. Conseguí tu API Key de Google AI Studio:

1. Andá a: https://makersuite.google.com/app/apikey
2. Hacé click en **"Create API Key"**
3. Copiá la key (empieza con `AIza...`)

### 2. Agregá la key al proyecto:

Creá un archivo `.env` en la carpeta `remotioncodeapp/`:

```env
# Gemini AI
GEMINI_API_KEY=AIzaSy...tuKeyAqui

# Cloudinary (ya lo tenés configurado)
CLOUDINARY_CLOUD_NAME=dnw6yxww8
CLOUDINARY_API_KEY=895895771773235
CLOUDINARY_API_SECRET=Mb8dtEflA6y6QxXTsRJOjA67XPU

# Server
PORT=3000
NODE_ENV=production
```

### 3. Instalá las dependencias:

```bash
cd remotioncodeapp
npm install
```

### 4. Reiniciá la API:

```bash
npm run api
```

---

## 🚀 Cómo Funciona

### **Con AI:**
El usuario escribe: 
> "Un video motivacional con la frase FOCUS en tipografía bold, fondo negro con neón azul"

La IA (Gemini) analiza el prompt y genera:
```json
{
  "composition": "NeonText",
  "text": "FOCUS",
  "primaryColor": "#00d4ff",
  "backgroundColor": "#000000",
  "style": "energetic",
  "duration": 10
}
```

Remotion renderiza el video con esos parámetros.

---

## 📝 Ejemplos de Prompts

### Motivacional:
```
Un video motivacional con la frase FOCUS en tipografía bold, 
fondo negro con neón azul
```

### Tech/Futurista:
```
Video promocional para lanzamiento de producto tech, 
estilo futurista con partículas, colores cyan y morado
```

### Gaming:
```
Intro para canal de YouTube estilo gaming, 
colores RGB, efectos glitch, texto "GAME ON"
```

### Minimalista:
```
Video minimalista con gradiente suave, 
texto "SIMPLICITY" en blanco, fondo degradado azul a violeta
```

---

## 🎨 Sistema de Fallback

Si la API de Gemini falla o no está configurada, el sistema usa un **analizador basado en keywords**:

- Detecta colores mencionados (azul, rojo, verde, etc.)
- Identifica el tipo de composición por palabras clave
- Extrae el texto principal (palabras en mayúsculas o entre comillas)

**Ejemplo:**
Prompt: `Video con NEON azul y partículas`
→ Detecta: composición=NeonText, color=azul, efecto=partículas

---

## 🔧 Troubleshooting

### "Error al cargar presets"
- Verificá que la API esté corriendo en el puerto 3000
- Revisá que no haya errores en la consola de la API

### "AI generation failed"
- Verificá que el `GEMINI_API_KEY` esté en el archivo `.env`
- Probá la key en: https://makersuite.google.com/app/apikey
- El sistema va a usar el fallback automáticamente si falla

### El video no se reproduce
- Abrí la consola del navegador (F12)
- Revisá si hay errores de CORS
- Probá descargar el video directamente

---

## 📚 Composiciones Disponibles

1. **KineticTitle** - Texto animado dinámico (motivacional)
2. **NeonText** - Texto con efecto neón brillante
3. **GradientText** - Texto con gradientes suaves
4. **GlassCard** - Efecto glassmorphism
5. **ParticleNetwork** - Partículas tech/futuristas
6. **DataViz** - Visualización de datos animada
7. **IsometricCard** - Diseño 3D isométrico
8. **BentoGrid** - Grid de elementos
9. **ParallaxLayers** - Efecto parallax en capas

La IA elige automáticamente la mejor composición según tu prompt.

---

## 🎯 Próximos Pasos

- [ ] Entrenar modelo custom para mejores resultados
- [ ] Agregar más composiciones
- [ ] Sistema de voz a texto
- [ ] Generación de imágenes con DALL-E para fondos
- [ ] Editor visual en tiempo real

---

¡Disfrutá creando videos con IA! 🚀
