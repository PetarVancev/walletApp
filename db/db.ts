import pgPromise, { IDatabase, IMain } from "pg-promise";

const pgp: IMain = pgPromise();

const conn: string =
  "postgresql://postgres:bv59hHUSxZ3gdwPpD4YH@containers-us-west-45.railway.app:7165/railway";
const db: IDatabase<any> = pgp(conn);

export default { pgp, db };
