import database from "../db/db";
import sessionInterface from "../interfaces/sessionInterface";

const db = database.db;
const pgp = database.pgp;

async function createSession(playerId: number) {
  let response;
  const insertQuery =
    "INSERT INTO sessions (player_id) VALUES ($1) RETURNING *";
  db.oneOrNone(insertQuery, [playerId])
    .then((insertedRow: sessionInterface) => {
      if (insertedRow) {
        console.log(
          "Row inserted successfully into wallets table:",
          insertedRow
        );
      } else {
        response = "Wallet for player already exists.";
      }
    })
    .catch((error: Error) => {
      console.error("Error occurred while inserting row:", error);
    });
  return response;
}

export default createSession;
