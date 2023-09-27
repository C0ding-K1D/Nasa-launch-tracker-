const {
  getAllLaunches,
  scheduleNewLaunch,
  existsLaunchWithId,
  abortLaunchById,
} = require("../../models/launches.model");
const Launches = require("../../models/launches.mongo");

const httpGetAllLaunches = async (req, res) => {
  try {
    const launches = await Launches.find({}, { _id: 0, __v: 0 });
    return res.status(200).json(launches);
  } catch (error) {
    console.error(error);
  }
};

const getOneLaunch = async (req, res) => {
  const id = Number(req.params.id);
  const launch = await Launches.findOne({ flightNumber: id });
  if (!launch) {
    return res.status(404).json({
      error: "Launch not found",
    });
  }
  return res.status(200).json(launch);
};

const httpAddNewLaunch = async (req, res) => {
  const launch = req.body;
  if (
    !launch.mission ||
    !launch.rocket ||
    !launch.launchDate ||
    !launch.target
  ) {
    return res.status(400).json({
      error: "Missing required launch property",
    });
  }

  launch.launchDate = new Date(launch.launchDate);
  if (isNaN(launch.launchDate)) {
    return res.status(400).json({
      error: "Invalid launch date",
    });
  }
  await scheduleNewLaunch(launch);
  return res.status(201).json();
};

const httpAbortLaunch = async (req, res) => {
  const launchId = Number(req.params.id);
  const launch = await existsLaunchWithId(launchId);
  if (!launch) {
    return res.status(404).json({
      error: "Launch not found",
    });
  }
  const aborted = abortLaunchById(launchId);

  if (!aborted) {
    return res.status(400).json({
      error: "Launch not aborted",
    });
  }
  return res.status(200).json({
    ok: true,
  });
};

module.exports = {
  httpGetAllLaunches,
  getOneLaunch,
  httpAddNewLaunch,
  httpAbortLaunch,
};
