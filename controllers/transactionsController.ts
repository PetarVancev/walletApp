import { Response } from "express";

import database from "../db/db";
import transactionsInterface from "../interfaces/transactionsInterface";

const db = database.db;

async function insertTransaction(
  playerId: number,
  sessionId: number,
  amount: number
) {
  const query =
    "INSERT INTO transactions (player_id, session_id, amount) VALUES ($1, $2, $3) RETURNING *";
  db.one(query, [playerId, sessionId, amount])
    .then((insertedRow: transactionsInterface) => {
      console.log("Transaction made succesfully", insertedRow);
    })
    .catch((error: Error) => {
      console.error("Error occurred while making transaction:", error.message);
    });
}

async function getPlayerTransactions(playerId: number, res: Response) {
  let message;
  const query =
    "SELECT player_id, session_id, amount FROM transactions WHERE player_id = $1";
  db.many(query, playerId)
    .then((transactions) => res.status(200).send(transactions))
    .catch((error) => {
      message = "Error occurred while getting transactions";
      console.error(message, error.message);
      res.status(500).send(message);
    });
}

async function getSessionTransactions(sessionId: number, res: Response) {
  let message;
  const query =
    "SELECT player_id, session_id, amount FROM transactions WHERE session_id = $1";
  db.many(query, sessionId)
    .then((transactions) => res.status(200).send(transactions))
    .catch((error) => {
      message = "Error occurred while getting transactions";
      console.error(message, error.message);
      res.status(500).send(message);
    });
}

export default {
  insertTransaction,
  getPlayerTransactions,
  getSessionTransactions,
};
