import "dotenv/config";
import express from "express";
import { router } from "./routes.js";

const app = express();
const PORT = 3000;

app.use(router);

app.use((err, res) => {
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({ erro: "JSON inválido" });
  }
  console.error(err);
  res.status(500).json({ erro: "Erro interno" });
});

app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));


//feito basicamente td na IA, tenho que fazer EU mesmo!

/*
import dotenv from "dotenv";
import express from "express";
import mysql from 'mysql2/promise';

dotenv.config();
const app = express()
const PORT = 3000;

app.use(express.json());

const connection = async () => {
    try {
      return await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
    })
    } catch (error) {
        console.log(error)
    }
};
connection()



async function verifyApiKey(apiKey, res) {
    try{
        if (apiKey !== process.env.API_KEY) {
        return res.status(401).json({ error: 'Chave de API inválida' });
    }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
}

const apikeyMiddleware = async (req, res, next) => {
    const apiKey = req.headers['X-API-KEY'] || req.headers['x-api-key'];
    await verifyApiKey(apiKey, res);
    next();
}
const RE_DATA = /^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})$/;

function paraDatetimeMySQL(texto) {
  const m = RE_DATA.exec(texto);
  if (!m) return null;

  const [ano, mes, dia, h, min, s] = m.slice(1, 7).map(Number);
  const d = new Date(Date.UTC(ano, mes - 1, dia, h, min, s));
  const existe =
    d.getUTCFullYear() === ano &&
    d.getUTCMonth() === mes - 1 &&
    d.getUTCDate() === dia &&
    d.getUTCHours() === h &&
    d.getUTCMinutes() === min &&
    d.getUTCSeconds() === s;

  return existe ? `${m[1]}-${m[2]}-${m[3]} ${m[4]}:${m[5]}:${m[6]}` : null;
}
const paraISO = (dt) => (dt ? dt.toLocaleDateString().replace(" ", "T") : null);


app.post('/saldo', apikeyMiddleware, async (req, res) => {
    
    try {
    const { data, matricula } = req.body ?? {};

    if (!data || !matricula) {
        return res.status(400).json({ error: 'Dados incompletos' });
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(data)) {
        return res.status(400).json({ error: 'Formato de data inválido. Use AAAA-MM-DD' });
    }
    if (!/^\d{11}$/.test(matricula)) {
        return res.status(400).json({ error: 'Formato de matrícula inválido. Use 11 dígitos' });
    }
    const desde = typeof data === "string" ? paraDatetimeMySQL(data) : null;

        const conn = await connection();
        const [rows] = await conn.query('SELECT a.matricula, a.nome, a.foto, a.foto_atualizada_em, s.saldo, s.atualizado_em AS saldo_atualizado_em, q.codigo AS qrcode, q.gerado_em     AS qrcode_gerado_em FROM alunos a LEFT JOIN saldos  s ON s.matricula = a.matricula LEFT JOIN qrcodes q ON q.id = ( SELECT id FROM qrcodes WHERE matricula = a.matricula ORDER BY gerado_em DESC, id DESC LIMIT 1) WHERE a.matricula = ?',
        [matricula]);
        
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Aluno não encontrado' });
        }
        
        const aluno = rows[0];
        const fotoMudou = aluno.foto_atualizada_em > desde;
        const qrMudou = aluno.qrcode_gerado_em != null && aluno.qrcode_gerado_em > desde;

        res.json( { matricula: aluno.matricula,
        nome: aluno.nome,
        saldo: aluno.saldo === null ? null : Number(aluno.saldo),
        DHAtualizacaoSaldo: paraISO(aluno.saldo_atualizado_em),
        strQrCode: qrMudou ? aluno.qrcode : null,
        foto: fotoMudou ? aluno.foto : null,
        });
            
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
})

app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));





banco:

SELECT * FROM saldos INNER JOIN alunos ON saldos.matricula = alunos.matricula  INNER JOIN qrcodes ON qrcodes.matricula = alunos.matricula WHERE alunos.matricula = 20251200001 ORDER BY qrcodes.id ASC 
LIMIT 1;
CREATE USER 'ru_teste'@'localhost' IDENTIFIED BY 'ru_testePassword';

GRANT SELECT, INSERT, UPDATE, DELETE ON ru_teste.* TO 'ru_teste'@'localhost';
*/