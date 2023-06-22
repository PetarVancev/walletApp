import express, { Express, Request, Response } from "express";

import walletController from "./controllers/walletController";
import sessionController from "./controllers/sessionController";
import transactionsController from "./controllers/transactionsController";

const app: Express = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const port = 8000;

app.post("/player/:playerId/createwallet", (req: Request, res: Response) => {
  walletController.createWallet(req, res);
});

app.post("/player/:playerId/createsession", (req: Request, res: Response) => {
  sessionController.createSession(req, res);
});

app.post("/player/:playerId/withdraw", (req: Request, res: Response) => {
  walletController.withdraw(req, res);
});

app.post("/player/:playerId/deposit", (req: Request, res: Response) => {
  walletController.deposit(req, res);
});

app.get("/player/:playerId/transactions", (req: Request, res: Response) => {
  const playerId: number = parseInt(req.params.playerId);
  transactionsController.getPlayerTransactions(playerId, res);
});

app.get("/session/:sessionId/transactions", (req: Request, res: Response) => {
  const sessionId: number = parseInt(req.params.sessionId);
  transactionsController.getSessionTransactions(sessionId, res);
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
