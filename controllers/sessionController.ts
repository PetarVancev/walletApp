import database from "../db/db";
import sessionInterface from "../interfaces/sessionInterface";

const db = database.db;
const pgp = database.pgp;

async function createSession(playerId: number) {
  let response;
  const query = "INSERT INTO sessions (player_id) VALUES ($1) RETURNING *";
  db.oneOrNone(query, [playerId])
    .then((insertedRow: sessionInterface) => {
      if (insertedRow) {
        console.log("Session succesfully created", insertedRow);
      }
    })
    .catch((error: Error) => {
      console.error("Error occurred while creating session", error);
    });
  return response;
}

async function getSession(sessionId: number): Promise<sessionInterface> {
  const query = "SELECT * FROM sessions WHERE id = $1";
  return db
    .one(query, sessionId)
    .then((session) => {
      if (session) {
        return session;
      } else {
        console.log("No session with id " + sessionId + " found");
      }
    })
    .catch((error: Error) => {
      console.error("Error occurred while getting session", error.message);
    });
}

export default { createSession, getSession };
