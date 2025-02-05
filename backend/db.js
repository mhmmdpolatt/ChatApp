const { Pool } = require("pg");

// PostgreSQL bağlantısı
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASS,
    port: process.env.DB_PORT,
  });

// Mesajlar tablosunu oluşturma fonksiyonu
const createMessagesTable = async () => {
  try {
    const query = `
      CREATE TABLE IF NOT EXISTS messages (
        id SERIAL PRIMARY KEY,
        user_name TEXT NOT NULL,
        message TEXT NOT NULL,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    await pool.query(query);
    console.log(" Messages tablosu başarıyla oluşturuldu!");
  } catch (error) {
    console.error("Tablo oluşturulurken hata oluştu:", error);
  }
};


module.exports = { pool, createMessagesTable };
