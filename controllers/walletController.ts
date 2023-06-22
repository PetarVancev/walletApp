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
    .then((wallet: walletInterface) => {
      if (wallet) {
        message = "Wallet succesfuly created";
        console.log(message);
        res.status(200).send(wallet);
      } else {
        message = "The player already has a wallet";
        console.error(message);
        res.status(500).send(message);
      }
    })
    .catch((error: Error) => {
      console.error("Error occurred while creating wallet", error.message);
      res.status(500).send(error.message);
    });
}

async function getWallet(
  playerId: number,
  res: Response
): Promise<walletInterface> {
  let message;
  const query = "SELECT * FROM wallets WHERE player_id = $1";
  return db
    .one(query, playerId)
    .then((wallet) => wallet)
    .catch((error) => {
      message = "Error occurred while getting wallet";
      console.error(message, error.message);
      res.status(500).send(message);
    });
}

async function withdraw(req: Request, res: Response) {
  let message;
  const playerId: number = parseInt(req.params.playerId);
  const { amount, sessionId }: { amount: number; sessionId: number } = req.body;
  const wallet: walletInterface = await getWallet(playerId, res);
  if (wallet) {
    const session: sessionInterface = await sessionController.getSession(
      sessionId,
      res
    );
    if (session) {
      if (amount <= 0) {
        message = "The amount must be positive";
        console.log(message);
        res.status(500).send(message);
      } else {
        if (session.player_id == playerId) {
          if (amount > wallet.balance) {
            message = "You dont have that much balance, You have ";
            console.error(message + wallet.balance);
            res.status(500).send(message + wallet.balance);
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
                  -amount
                );
                res.status(200).send(wallet);
              })
              .catch((error: Error) => {
                console.error(
                  "Error occurred while withdrawing",
                  error.message
                );
                res.status(500).send(error.message);
              });
          }
        } else {
          message = "You are not on a valid session for the player";
          res.status(400).send(message);
          console.error(message);
        }
      }
    }
  }
}

async function deposit(req: Request, res: Response) {
  let message;
  const playerId: number = parseInt(req.params.playerId);
  const amount: number = parseFloat(req.body.amount);
  const sessionId = req.body.sessionId;
  const wallet: walletInterface = await getWallet(playerId, res);
  if (wallet) {
    const session: sessionInterface = await sessionController.getSession(
      sessionId,
      res
    );
    if (session) {
      if (amount <= 0) {
        message = "The amount must be positive";
        console.log(message);
        res.status(500).send(message);
      } else {
        if (session.player_id == playerId) {
          wallet.balance += amount;
          const query =
            "UPDATE wallets SET balance = $1 WHERE player_id = $2 RETURNING *";
          return db
            .one(query, [wallet.balance, playerId])
            .then((wallet) => {
              transactionsController.insertTransaction(
                playerId,
                sessionId,
                amount
              );
              res.status(200).send(wallet);
            })
            .catch((error: Error) => {
              console.error("Error occurred while depositing", error.message);
              res.status(500).send(error.message);
            });
        } else {
          message = "You are not on a valid session for the player";
          res.status(400).send(message);
          console.error(message);
        }
      }
    }
  }
}

export default { createWallet, withdraw, deposit };
