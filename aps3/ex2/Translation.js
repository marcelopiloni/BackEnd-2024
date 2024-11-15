// Translation.js
import pool from './database.js';

class Translation {
    static async create(textoOriginal, textoTraduzido, idioma) {
        let conn;
        try {
            conn = await pool.getConnection();
            const result = await conn.query(
                'INSERT INTO traducoes (texto_original, texto_traduzido, idioma) VALUES (?, ?, ?)',
                [textoOriginal, textoTraduzido, idioma]
            );
            return result.insertId;
        } finally {
            if (conn) conn.release();
        }
    }

    static async findById(id) {
        let conn;
        try {
            conn = await pool.getConnection();
            const rows = await conn.query('SELECT * FROM traducoes WHERE id = ?', [id]);
            return rows[0];
        } finally {
            if (conn) conn.release();
        }
    }

    static async findAll() {
        let conn;
        try {
            conn = await pool.getConnection();
            return await conn.query('SELECT * FROM traducoes');
        } finally {
            if (conn) conn.release();
        }
    }
}

export default Translation;