const express = require("express");
const launchesRouter = express.Router();

const {
  httpGetAllLaunches,
  getOneLaunch,
  httpAddNewLaunch,
  httpAbortLaunch,
} = require("./launches.controller");

launchesRouter.get("/", httpGetAllLaunches);
launchesRouter.get("/:id", getOneLaunch);
launchesRouter.post("/", httpAddNewLaunch);
launchesRouter.delete("/:id", httpAbortLaunch);

module.exports = launchesRouter;
