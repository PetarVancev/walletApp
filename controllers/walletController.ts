import database from "../db/db";
import walletInterface from "../interfaces/walletInterface";

const db = database.db;
const pgp = database.pgp;

async function createWallet(playerId: number) {
  let response;
  const insertQuery =
    "INSERT INTO wallets (player_id, balance) VALUES ($1, $2) ON CONFLICT (player_id) DO NOTHING RETURNING *";
  db.oneOrNone(insertQuery, [playerId, 0])
    .then((insertedRow: walletInterface) => {
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

export default createWallet;
