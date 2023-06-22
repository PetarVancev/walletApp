import express, { Express, Request, Response } from "express";
import walletController from "./controllers/walletController";
import sessionController from "./controllers/sessionController";

const app: Express = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const port = 8000;

let count = 0;

app.post("/:playerId/createwallet", (req: Request, res: Response) => {
  walletController.createWallet(req, res);
});

app.post("/:playerId/createsession", (req: Request, res: Response) => {
  sessionController.createSession(req, res);
});

app.post("/:playerId/withdraw", (req: Request, res: Response) => {
  walletController.withdraw(req, res);
});

app.post("/:playerId/deposit", (req: Request, res: Response) => {
  walletController.deposit(req, res);
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
