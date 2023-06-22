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

export default { insertTransaction };
