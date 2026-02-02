# 🚀 Easypanel Deployment Guide

## Pre-requisitos

**Necesitas:**
1. Cuenta Cloudinary (gratis) → https://cloudinary.com
2. Tu dominio configurado en Hostinger DNS

## Paso 1: DNS Configuration

**En Hostinger DNS Manager**, agregar 2 registros A:

```
Tipo: A
Host: @    (o vacío)
Valor: [IP DE TU VPS]
TTL: 3600

Tipo: A
Host: api
Valor: [IP DE TU VPS]
TTL: 3600
```

**Resultado:**
- `tu-dominio.com` → Tu VPS
- `api.tu-dominio.com` → Tu VPS

---

## Paso 2: Crear Proyecto en Easypanel

1. Ir a Easypanel dashboard
2. Click **"+ Create Project"**
3. Nombre: `motion-graphics` (o cualquiera)
4. Click **Create**

---

## Paso 3: Crear Service - API

1. Dentro del proyecto, click **"+ Add Service"**
2. Seleccionar **"App"**
3. Nombre: `api`

### Source:
- Type: **GitHub**
- Repository: `agentbotdev/remotioncodeapp`
- Branch: `main`

### Build:
- Type: **Dockerfile**
- Dockerfile: `Dockerfile.api`
- Context: `.`

### Deploy:
- Port: `3000`

### Domains:
- Click **"+ Add Domain"**
- Domain: `api.TU-DOMINIO.com`
- Enable HTTPS: ✅

### Environment Variables:
Click **"+ Add Variable"** para cada una:

```
PORT = 3000
NODE_ENV = production
CLOUDINARY_CLOUD_NAME = [tu cloud name]
CLOUDINARY_API_KEY = [tu api key]
CLOUDINARY_API_SECRET = [tu api secret]
```

4. Click **"Deploy"**
5. Esperar 5-7 minutos para build

---

## Paso 4: Crear Service - Frontend

1. Click **"+ Add Service"** (dentro del mismo proyecto)
2. Seleccionar **"App"**
3. Nombre: `frontend`

### Source:
- Type: **GitHub**
- Repository: `agentbotdev/remotioncodeapp`
- Branch: `main`

### Build:
- Type: **Dockerfile**
- Dockerfile: `Dockerfile.frontend`
- Context: `.`

### Deploy:
- Port: `3000`

### Domains:
- Click **"+ Add Domain"**
- Domain: `TU-DOMINIO.com` (sin api.)
- Enable HTTPS: ✅

### Environment Variables:
```
NEXT_PUBLIC_API_URL = https://api.TU-DOMINIO.com
```

4. Click **"Deploy"**
5. Esperar 3-4 minutos para build

---

## Paso 5: Verificar Deployment

### Test API:
```bash
curl https://api.TU-DOMINIO.com/health
```

Debe responder:
```json
{"status":"ok","uptime":123.45,...}
```

### Test Frontend:
Abrir en browser:
```
https://TU-DOMINIO.com
```

Debe mostrar la galería de presets.

### Test Completo:
```bash
curl -X POST https://api.TU-DOMINIO.com/generate \
  -H "Content-Type: application/json" \
  -d '{"preset":"focus","outputName":"test"}'
```

---

## Troubleshooting

### Error: Build failed (API)
- Verificar logs en Easypanel → Service → Logs
- Común: memoria insuficiente durante build
- Solución: Revisar que VPS tenga 4GB+ RAM

### Error: Cannot connect to API
- Verificar DNS propagation (puede tardar 15 min)
- Verificar que el service esté "Running"
- Verificar SSL certificate

### Error: Chrome not found
- Dockerfile.api debe usar la versión con apt-get install chromium
- Rebuild: Easypanel → Service → Redeploy

---

## Comandos Útiles

### Ver logs:
Easypanel → Service → Logs

### Rebuild:
Easypanel → Service → Redeploy

### Restart:
Easypanel → Service → Restart

### Shell access:
Easypanel → Service → Terminal

---

## Estructura Final

```
Easypanel
└── Project: motion-graphics
    ├── Service: api
    │   └── Domain: api.tu-dominio.com
    │   └── Port: 3000
    │   └── Build: Dockerfile.api
    │
    └── Service: frontend
        └── Domain: tu-dominio.com
        └── Port: 3000
        └── Build: Dockerfile.frontend
```

---

## Post-Deploy Checklist

- [ ] DNS configurado
- [ ] API service running
- [ ] Frontend service running
- [ ] Health check responde OK
- [ ] Video generation funciona
- [ ] Frontend muestra galería
