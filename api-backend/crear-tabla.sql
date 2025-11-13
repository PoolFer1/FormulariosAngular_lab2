-- ========================================
-- SCRIPT SQL - Crear tabla para formularios
-- ========================================

-- 1. CREAR BASE DE DATOS (si no existe)
CREATE DATABASE IF NOT EXISTS formulario;

-- 2. USAR LA BASE DE DATOS
USE formulario;

-- 3. CREAR TABLA formularios
-- Esta tabla almacenará todos los formularios enviados desde Angular
CREATE TABLE IF NOT EXISTS formularios (
  -- Columna de ID (clave primaria, se incrementa automáticamente)
  id INT AUTO_INCREMENT PRIMARY KEY,
  
  -- Datos del formulario
  name VARCHAR(100) NOT NULL,                    -- Nombre (máx 100 caracteres)
  number VARCHAR(10) NOT NULL UNIQUE,           -- Cédula (máx 10, único)
  date DATE NOT NULL,                           -- Fecha de nacimiento
  email VARCHAR(100) NOT NULL,                  -- Email
  category VARCHAR(50) NOT NULL,                -- País (Ecuador, Colombia, etc)
  gender VARCHAR(20),                           -- Género (Hombre, Mujer, Otro)
  text LONGTEXT NOT NULL,                       -- Biografía (mucho texto)
  terms BOOLEAN NOT NULL DEFAULT FALSE,         -- Aceptó términos (sí/no)
  
  -- Metadata
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Cuándo se guardó
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP -- Última actualización
);

-- 4. (OPCIONAL) Si necesitas eliminar la tabla después:
-- DROP TABLE formularios;

-- 5. (OPCIONAL) Ver la estructura de la tabla:
-- DESCRIBE formularios;
