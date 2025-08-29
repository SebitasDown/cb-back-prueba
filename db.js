// backend/db.js
import mysql from 'mysql2/promise';

const db = mysql.createPool({
  host: '34.123.42.113',      // IP pública de tu DB
  database: 'superdev',       // Nombre de la base de datos
  user: 'root',               // Usuario
  password: 'Superdev123456?',// Contraseña
  port: 3306,                 // Puerto por defecto MySQL
});

export default db;

