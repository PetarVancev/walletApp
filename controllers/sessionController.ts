import { Request, Response } from "express";

import database from "../db/db";
import sessionInterface from "../interfaces/sessionInterface";

const db = database.db;

async function createSession(req: Request, res: Response) {
  let message;
  const playerId: number = parseInt(req.params.playerId);
  const query = "INSERT INTO sessions (player_id) VALUES ($1) RETURNING *";
  db.one(query, [playerId])
    .then((session: sessionInterface) => {
      message = "Session succesfully created";
      console.log(message, session);
      res.status(200).send(session);
    })
    .catch((error: Error) => {
      message = "Error occurred while creating session";
      console.error(message, error);
      res.status(500).send(message);
    });
}

async function getSession(
  sessionId: number,
  res: Response
): Promise<sessionInterface> {
  let message;
  const query = "SELECT * FROM sessions WHERE id = $1";
  return db
    .one(query, sessionId)
    .then((session) => session)
    .catch((error: Error) => {
      message = "Error occurred while getting session";
      console.error(message, error.message);
      res.status(500).send(message);
    });
}

export default { createSession, getSession };
