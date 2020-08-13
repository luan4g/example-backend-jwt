import knex from "knex";
import path from "path";

const connection = knex({
  client: "sqlite3",
  connection: path.resolve(__dirname, "db.sqlite"),
  useNullAsDefault: true,
});

export default connection;
