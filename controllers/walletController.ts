import { Request, Response } from "express";

import database from "../db/db";
import walletInterface from "../interfaces/walletInterface";
import sessionController from "./sessionController";
import sessionInterface from "../interfaces/sessionInterface";
import transactionsController from "./transactionsController";

const db = database.db;

async function createWallet(req: Request, res: Response) {
  let message;
  const playerId: number = parseInt(req.params.playerId);
  const query =
    "INSERT INTO wallets (player_id, balance) VALUES ($1, $2) ON CONFLICT (player_id) DO NOTHING RETURNING *";
  db.oneOrNone(query, [playerId, 0])
    .then((insertedRow: walletInterface) => {
      if (insertedRow) {
        console.log("Row inserted successfully into wallets table");
        res.status(200).send(insertedRow);
      } else {
        message = "A wallet for the player already exists";
        console.error(message);
        res.status(409).send(message);
      }
    })
    .catch((error: Error) => {
      console.error("Error occurred while inserting row:", error.message);
      res.status(500).send(error.message);
    });
}

async function getWallet(playerId: number): Promise<walletInterface> {
  const query = "SELECT * FROM wallets WHERE player_id = $1";
  return db
    .oneOrNone(query, playerId)
    .then((wallet) => {
      if (wallet) {
        return wallet;
      } else {
      }
    })
    .catch((error: Error) => {
      console.error("Error occurred while getting wallet", error.message);
    });
}

async function withdraw(req: Request, res: Response) {
  let message;
  const playerId: number = parseInt(req.params.playerId);
  const { amount, sessionId }: { amount: number; sessionId: number } = req.body;
  const session: sessionInterface = await sessionController.getSession(
    sessionId,
    res
  );
  if (amount <= 0) {
    message = "The amount must be positive";
    console.log(message);
    res.status(500).send(message);
  } else {
    if (session) {
      if (session.player_id == playerId) {
        const wallet: walletInterface = await getWallet(playerId);
        if (amount > wallet.balance) {
          message = "You dont have that much balance, You have ";
          console.error(message + wallet.balance);
        } else {
          wallet.balance -= amount;
          const query =
            "UPDATE wallets SET balance = $1 WHERE player_id = $2 RETURNING *";
          return db
            .one(query, [wallet.balance, playerId])
            .then((wallet) => {
              transactionsController.insertTransaction(
                playerId,
                sessionId,
                -amount,
                wallet.balance
              );
              res.status(200).send(wallet);
            })
            .catch((error: Error) => {
              console.error("Error occurred while withdrawing", error.message);
              res.status(500).send(error.message);
            });
        }
      } else {
        message =
          "You are not on a valid session for the player or the player doesnt exist";
        res.status(400).send(message);
        console.error(message);
      }
    }
  }
}

async function deposit(req: Request, res: Response) {
  let message;
  const playerId: number = parseInt(req.params.playerId);
  const amount: number = parseFloat(req.body.amount);
  const sessionId: number = parseInt(req.body.sessionId);
  const session: sessionInterface = await sessionController.getSession(
    sessionId,
    res
  );
  if (amount <= 0) {
    message = "The amount must be positive";
    console.log(message);
    res.status(500).send(message);
  } else {
    if (session) {
      if (session.player_id == playerId) {
        const wallet: walletInterface = await getWallet(playerId);
        wallet.balance += amount;
        const query =
          "UPDATE wallets SET balance = $1 WHERE player_id = $2 RETURNING *";
        return db
          .one(query, [wallet.balance, playerId])
          .then((wallet) => {
            transactionsController.insertTransaction(
              playerId,
              sessionId,
              amount,
              wallet.balance
            );
            res.status(200).send(wallet);
          })
          .catch((error: Error) => {
            console.error("Error occurred while depositing", error.message);
            res.status(500).send(error.message);
          });
      } else {
        message =
          "You are not on a valid session for the player or the player doesnt exist";
        res.status(500).send(message);
        console.error(message);
      }
    }
  }
}

export default { createWallet, withdraw, deposit };
