import express, { Router } from "express";
import { verificarChave } from "./middleweares/verificarChaveApi.js";
import { buscarSaldo } from "./controllers/SaldoAlunosController.js";

export const router = Router();

router.post("/saldo", verificarChave, express.json(), buscarSaldo);