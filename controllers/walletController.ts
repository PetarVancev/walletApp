import database from "../db/db";
import walletInterface from "../interfaces/walletInterface";
import sessionController from "./sessionController";
import sessionInterface from "../interfaces/sessionInterface";
import transactionsController from "./transactionsController";

const db = database.db;

async function createWallet(playerId: number) {
  const query =
    "INSERT INTO wallets (player_id, balance) VALUES ($1, $2) ON CONFLICT (player_id) DO NOTHING RETURNING *";
  db.oneOrNone(query, [playerId, 0])
    .then((insertedRow: walletInterface) => {
      if (insertedRow) {
        console.log(
          "Row inserted successfully into wallets table:",
          insertedRow
        );
      } else {
        console.log("A wallet for the player already exists");
      }
    })
    .catch((error: Error) => {
      console.error("Error occurred while inserting row:", error.message);
    });
}

async function getWallet(playerId: number): Promise<walletInterface> {
  const query = "SELECT * FROM wallets WHERE player_id = $1";
  return db
    .one(query, playerId)
    .then((wallet) => wallet)
    .catch((error: Error) => {
      console.error("Error occurred while getting wallet", error.message);
    });
}

async function withdraw(playerId: number, amount: number, sessionId: number) {
  const wallet: walletInterface = await getWallet(playerId);
  const session: sessionInterface = await sessionController.getSession(
    sessionId
  );
  if (amount <= 0) {
    console.log("The amount must be positive");
  } else {
    if (session) {
      if (session.player_id == playerId) {
        if (amount > wallet.balance) {
          console.error(
            "You dont have that much balance, You have " + wallet.balance
          );
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
              console.log(wallet);
            })
            .catch((error: Error) => {
              console.error("Error occurred while withdrawing", error.message);
            });
        }
      } else {
        console.log("You are not on a valid session for the player");
      }
    }
  }
}

async function deposit(playerId: number, amount: number, sessionId: number) {
  const wallet: walletInterface = await getWallet(playerId);
  const session: sessionInterface = await sessionController.getSession(
    sessionId
  );
  if (amount <= 0) {
    console.log("The amount must be positive");
  } else {
    if (session) {
      if (session.player_id == playerId) {
        wallet.balance += amount;
        console.log(wallet.balance);
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
            console.log(wallet);
          })
          .catch((error: Error) => {
            console.error("Error occurred while withdrawing", error.message);
          });
      } else {
        console.log("You are not on a valid session for the player");
      }
    }
  }
}

export default { createWallet, withdraw, deposit };
