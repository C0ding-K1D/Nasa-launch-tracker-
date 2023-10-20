const http = require("http");
const { dbInit } = require("./services/mongo");
require("dotenv").config();

const port = process.env.PORT || 8000;

const app = require("./app");

const server = http.createServer(app);

const { loadPlanetsData } = require("./models/planets.model");
const { loadLaunchData } = require("./models/launches.model");

async function startServer() {
  await dbInit();
  await loadPlanetsData();
  await loadLaunchData();

  server.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
}

startServer();
//using express instead of http
// const express = require("express");

// const app = express();

// app.listen(port, () => {
//   console.log(`Server is up on port ${port}`);
// });
