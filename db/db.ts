import pgPromise, { IDatabase, IMain } from "pg-promise";

const pgp: IMain = pgPromise();

const conn: string = "postgres://test:pass@localhost:5432/walletapp";
const db: IDatabase<any> = pgp(conn);

export default { pgp, db };
