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
    });
}

async function getSession(
  sessionId: number,
  res: Response
): Promise<sessionInterface> {
  const query = "SELECT * FROM sessions WHERE id = $1";
  return db
    .one(query, sessionId)
    .then((session) => {
      if (session) {
        return session;
      } else {
        console.log("No session with id " + sessionId + " found");
        throw new Error("No session with id " + sessionId + " found");
      }
    })
    .catch((error: Error) => {
      console.error("Error occurred while getting session", error.message);
      res.status(500).send("Couldnt find session with the specified id");
    });
}

export default { createSession, getSession };
