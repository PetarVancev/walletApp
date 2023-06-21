import express, { Express, Request, Response } from "express";
import createWallet from "./controllers/walletController";
import createSession from "./controllers/sessionController";

const app: Express = express();
const port = 8000;

app.post("/:playerId/createwallet", (req: Request, res: Response) => {
  const playerid: number = parseInt(req.params.playerId);
  createWallet(playerid);
});

app.post("/:playerId/createsession", (req: Request, res: Response) => {
  const playerid: number = parseInt(req.params.playerId);
  createSession(playerid);
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
