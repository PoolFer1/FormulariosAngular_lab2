
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
require('dotenv').config();

const app = express();


app.use(express.json());

app.use(cors({
  origin: 'http://localhost:4200', 
  credentials: true 
}));

// Declaramos pool aquí para que las rutas lo puedan usar (se inicializa en startServer)
let pool;

// FUNCIONES DE INICIALIZACIÓN DE LA BASE DE DATOS
// Intentamos crear la base de datos y la tabla si no existen. Esto evita
// el error "Unknown database 'formularios'" cuando el script SQL
// no se ha ejecutado previamente.
async function initDatabase() {
  // Crear una conexión temporal (sin especificar database)
  const tmpConn = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
  });

  // 1) Crear la base de datos si no existe
  await tmpConn.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\``);

  // 2) Usar la base y crear la tabla si no existe
  await tmpConn.query(`USE \`${process.env.DB_NAME}\``);

  const createTableSQL = `
    CREATE TABLE IF NOT EXISTS formularios (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      number VARCHAR(10) NOT NULL UNIQUE,
      date DATE NOT NULL,
      email VARCHAR(100) NOT NULL,
      category VARCHAR(50) NOT NULL,
      gender VARCHAR(20),
      text LONGTEXT NOT NULL,
      terms BOOLEAN NOT NULL DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB;
  `;

  await tmpConn.query(createTableSQL);

  await tmpConn.end();
}

// Creamos el pool y arrancamos el servidor dentro de una función async
async function startServer() {
  // Inicializar DB (crea DB y tabla si no existen)
  try {
    await initDatabase();
  } catch (err) {
    console.error('Error inicializando la base de datos:', err);
    process.exit(1);
  }

  // Crear pool de conexiones (ahora que la BD existe)
  // pool se declara en el scope superior para que las rutas lo puedan usar
  pool = mysql.createPool({
    host: process.env.DB_HOST,        // localhost
    port: process.env.DB_PORT,        // 3305 
    user: process.env.DB_USER,        // root
    password: process.env.DB_PASSWORD, // 4358Fernando
    database: process.env.DB_NAME,    // formularios
    waitForConnections: true,
    connectionLimit: 10, // Máximo 10 conexiones simultáneas
    queueLimit: 0
  });

  // Exponer el pool en app.locals por si se quiere acceder desde otro lugar
  app.locals.pool = pool;

  // RUTA DE PRUEBA
  app.get('/api/test', (req, res) => {
    res.json({ mensaje: 'Servidor funcionando correctamente' });
  });

  // Iniciar el servidor (solo después de que la BD y pool estén listos)
  const PORT = process.env.API_PORT || 7500;

  app.listen(PORT, () => {
    console.log(`\n  ========================================\nServidor iniciado correctamente\nEscuchando en: http://localhost:${PORT}\nConectado a MySQL en puerto: ${process.env.DB_PORT}\n  ========================================\n  `);
  });
}

app.post('/api/formulario', async (req, res) => {
  try {
    // Obtener los datos enviados por Angular
    const { name, number, date, email, category, gender, text, terms } = req.body;

    // Validar que no vengan datos vacíos
    if (!name || !number || !date || !email || !category || !text) {
      return res.status(400).json({ 
        error: 'Faltan datos requeridos' 
      });
    }


    const connection = await pool.getConnection();


    const query = `
      INSERT INTO formularios (name, number, date, email, category, gender, text, terms, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())
    `;

    const [result] = await connection.execute(query, [
      name,
      number,
      date,
      email,
      category,
      gender,
      text,
      terms ? 1 : 0 // Convertir boolean a 0 o 1
    ]);


    connection.release();

    // Responder a Angular con éxito
    res.status(201).json({
      mensaje: 'Formulario guardado exitosamente',
      id: result.insertId // ID del registro guardado
    });

  } catch (error) {
    console.error('Error al guardar formulario:', error);
    res.status(500).json({
      error: 'Error al guardar los datos',
      detalles: error.message
    });
  }
});


app.get('/api/formularios', async (req, res) => {
  try {
    const connection = await pool.getConnection();

    // Query para traer todos los registros
    const [formularios] = await connection.execute(
      'SELECT * FROM formularios ORDER BY created_at DESC'
    );

    connection.release();

    res.json({
      total: formularios.length,
      datos: formularios
    });

  } catch (error) {
    console.error('Error al obtener formularios:', error);
    res.status(500).json({
      error: 'Error al obtener los datos'
    });
  }
});


app.get('/api/formulario/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const connection = await pool.getConnection();

    // Query para traer un registro por ID
    const [formulario] = await connection.execute(
      'SELECT * FROM formularios WHERE id = ?',
      [id]
    );

    connection.release();

    if (formulario.length === 0) {
      return res.status(404).json({
        error: 'Formulario no encontrado'
      });
    }

    res.json(formulario[0]);

  } catch (error) {
    console.error('Error al obtener formulario:', error);
    res.status(500).json({
      error: 'Error al obtener el dato'
    });
  }
});

// Iniciar secuencia de arranque
startServer().catch(err => {
  console.error('Error al arrancar el servidor:', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Promesa rechazada no manejada:', reason);
});
