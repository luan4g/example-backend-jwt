import path from "path";

module.exports = {
  client: "sqlite",
  connection: {
    filename: path.resolve(__dirname, "src", "database", "db.sqlite"),
  },
  migrations: {
    directory: path.resolve(__dirname, "src", "database", "migrations"),
  },
  userNullAsDefault: true,
};
