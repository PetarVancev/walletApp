Player wallet app

1. Run npm install to install all the required node modules
2. Run npm run build to compile the typescript code
3. Run npm run start to start the node.js app
4. Example API is running on localhost:8000

Available routes:

POST routes

```
POST     /player/:playerId/createwallet        Creates a wallet for a player (maximum 1 per player)
POST     /player/:playerId/createsession       Creates a session for a player (A player can have multiple)
POST     /player/:playerId/withdraw            Withdraw(bet transaction) from a players wallet
Request body example {
  "amount": 1,
  "sessionId": 1
}

POST     /player/:playerId/deposit             Deposit(win transaction) to a players wallet
Request body example {
  "amount": 1,
  "sessionId": 1
}
```

GET routes

```
GET     /player/:playerId/transactions        Returns all transactions of a given player
GET     /session/:sessionId/transactions      Returns all transactions of a given session
```

Notes:
You can use postman to test the api by sending urlencoded body or raw JSON
The typescript is compiled into javascript in the ./dist folder
The database already has 4 players and only the player with id 1 already has a wallet, session and transactions
