db.getSiblingDB("admin").auth(
  process.env["MONGO_INITDB_ROOT_USERNAME"],
  process.env["MONGO_INITDB_ROOT_PASSWORD"],
);

db.createUser({
  user: process.env["M_USERNAME"],
  pwd: process.env["M_PASSWORD"],
  roles: [
    {
      role: "readWrite",
      db: process.env["M_DATABASE"],
    },
  ],
});
