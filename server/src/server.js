const http = require("http");
const mongoose = require("mongoose");
require("dotenv").config();

const port = process.env.PORT || 8000;
const dbConnection = process.env.DB_URL;
const app = require("./app");

const { loadPlanetsData } = require("./models/planets.model");
const { loadLaunchData } = require("./models/launches.model");

const server = http.createServer(app);

async function startServer() {
  mongoose
    .connect(dbConnection)
    .then(() => {
      console.log("MongoDB Connected...");
      server.listen(port, () => {
        console.log(`Server is up on port ${port}`);
      });
    })
    .catch((err) => console.log(err));
  await loadPlanetsData();
  await loadLaunchData();
}

startServer();
//using express instead of http
// const express = require("express");

// const app = express();

// app.listen(port, () => {
//   console.log(`Server is up on port ${port}`);
// });
