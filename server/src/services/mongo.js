const mongoose = require("mongoose");
require("dotenv").config();

const dbConnection = process.env.DB_URL;

async function dbInit() {
  await mongoose
    .connect(dbConnection)
    .then(() => {
      console.log("MongoDb connected ...");
    })
    .catch((err) => {
      console.error(err);
    });
}

async function mongoDisconnect() {
  await mongoose.disconnect();
}
module.exports = { dbInit, mongoDisconnect };
