import express, { Express, Request, Response } from "express";
import walletController from "./controllers/walletController";
import sessionController from "./controllers/sessionController";

const app: Express = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const port = 8000;

app.post("/:playerId/createwallet", (req: Request, res: Response) => {
  const playerid: number = parseInt(req.params.playerId);
  walletController.createWallet(playerid);
});

app.post("/:playerId/createsession", (req: Request, res: Response) => {
  const playerid: number = parseInt(req.params.playerId);
  sessionController.createSession(playerid);
});

app.post("/:playerId/withdraw", (req: Request, res: Response) => {
  const playerid: number = parseInt(req.params.playerId);
  walletController.withdraw(playerid, req.body.amount, req.body.sessionId);
});

app.post("/:playerId/deposit", (req: Request, res: Response) => {
  const playerid: number = parseInt(req.params.playerId);
  const amount: number = parseFloat(req.body.amount);
  walletController.deposit(playerid, amount, req.body.sessionId);
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
