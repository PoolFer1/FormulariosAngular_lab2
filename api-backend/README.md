# Backend API - Formulario Angular + MySQL

## 📋 Estructura de archivos
```
api-backend/
├── package.json          ← Dependencias del proyecto
├── .env                  ← Configuración (usuario, contraseña, puertos)
├── server.js             ← Servidor Express (el corazón del backend)
├── crear-tabla.sql       ← Script para crear la tabla en MySQL
└── README.md             ← Este archivo
```

---

## ⚙️ PASO 1: Configurar la base de datos MySQL

### 1.1 Abre MySQL Workbench o línea de comandos MySQL
```bash
mysql -u root -p4358Fernando -P 3305
```

### 1.2 Copia el contenido de `crear-tabla.sql` y ejecútalo
O ejecuta directamente:
```bash
mysql -u root -p4358Fernando -P 3305 < crear-tabla.sql
```

Esto creará:
- Base de datos: `formularios`
- Tabla: `formularios` con todas las columnas necesarias

---

## 📦 PASO 2: Instalar dependencias de Node.js

Abre una terminal en la carpeta `api-backend` y ejecuta:

```bash
npm install
```

Esto instalará:
- `express` - Framework web
- `mysql2` - Driver para conectar a MySQL
- `cors` - Permite que Angular acceda al API
- `dotenv` - Lee variables del archivo .env

---

## 🚀 PASO 3: Iniciar el servidor

En la terminal, dentro de la carpeta `api-backend`, ejecuta:

```bash
npm start
```

O simplemente:

```bash
node server.js
```

### ✅ Si funciona correctamente verás:
```
========================================
✅ Servidor iniciado correctamente
✅ Escuchando en: http://localhost:7500
✅ Conectado a MySQL en puerto: 3305
========================================
```

---

## 🔗 PASO 4: Conectar Angular con el Backend

Ahora tu Angular debe hacer peticiones HTTP a `http://localhost:7500`

### Endpoints disponibles:

#### ✅ **POST /api/formulario** (GUARDAR DATOS)
```javascript
// Angular envía esto:
{
  name: "Fernando",
  number: "1234567890",
  date: "1990-05-15",
  email: "fernando@example.com",
  category: "Ecuador",
  gender: "Hombre",
  text: "Mi biografía aquí...",
  terms: true
}
```

#### ✅ **GET /api/formularios** (VER TODOS LOS FORMULARIOS)
Retorna lista de todos los formularios guardados

#### ✅ **GET /api/formulario/:id** (VER UN FORMULARIO)
Retorna un formulario específico por ID

---

## 🧪 Probar que funciona

Abre tu navegador y ve a:
```
http://localhost:7500/api/test
```

Deberías ver:
```json
{ "mensaje": "Servidor funcionando correctamente" }
```

---

## 📝 Notas importantes

1. **El servidor debe estar corriendo** mientras usas Angular
2. **Angular debe hacer peticiones HTTP** al endpoint POST
3. **Los datos se guardan automáticamente** en MySQL
4. **El puerto 7500** es donde escucha el backend
5. **El puerto 3305** es donde está tu MySQL

---

## ❓ Solución de problemas

### Error: "Cannot find module 'express'"
```bash
npm install
```

### Error: "ECONNREFUSED - Connection refused"
- Verifica que MySQL esté corriendo en el puerto 3305
- Verifica credenciales en `.env`

### Error: "Table 'formularios.formularios' doesn't exist"
- Ejecuta el script `crear-tabla.sql`

---

## 📚 Cómo funciona el código

1. **server.js** escucha en puerto 7500
2. Angular envía datos con **POST** a `/api/formulario`
3. Express recibe los datos
4. Se validan los datos
5. Se guardan en la tabla `formularios` de MySQL
6. Se retorna respuesta de éxito a Angular

---

¡Listo! Tu backend está completamente funcional. 🎉
