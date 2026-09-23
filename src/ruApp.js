import {express} from "express";
import {dotenv} from "dotenv";

dotenv.config();
const app = express()
const PORT = 3000;

app.use(express.json());
const connection = async () => {
    try {
        await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      database: process.env.DB_NAME,
    })
    } catch (error) {
        console.log(error)
    }
};


connection()
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));