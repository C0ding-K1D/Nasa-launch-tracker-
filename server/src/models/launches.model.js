const launchesDB = require("./launches.mongo");
const planets = require("./planets.mongo");
const axios = require("axios");

const launches = new Map();

const DEFAULT_FLIGHT_NUM = 100;

const launch = {
  flightNumber: 100,
  mission: "Kepler Exploration X",
  rocket: "Explorer IS1",
  launchDate: new Date("December 27, 2030"),
  target: "Kepler-442 b",
  customers: ["ZTM", "NASA"],
  upcoming: true,
  success: true,
};

saveLaunch(launch);

// launches.set(launch.flightNumber, launch);
//launch.get(100);
async function findLaunch(filter) {
  return await launchesDB.findOne(filter);
}

async function existsLaunchWithId(launchId) {
  return await findLaunch(launchId);
}

async function findLatestFlightNUmber() {
  const latestLaunch = await launchesDB.findOne().sort("-flightNumber");

  if (!latestLaunch) {
    return DEFAULT_FLIGHT_NUM;
  }

  return latestLaunch.flightNumber;
}

async function getAllLaunches() {
  return await launchesDB.find({}, { _id: 0, __v: 0 });
}

const SPACE_X_URL = "https://api.spacexdata.com/v4/launches/query";

async function populateLaunches() {
  console.log("loading data ...!");
  const response = await axios.post(SPACE_X_URL, {
    query: {},
    options: {
      pagination: false,
      populate: [
        {
          path: "payloads",
          select: {
            customers: 1,
          },
        },
        {
          path: "rocket",
          select: {
            name: 1,
          },
        },
      ],
    },
  });
  if (response.status !== 200) {
    console.log("Problem downloading data");
    throw new Error("Error downloading new data!");
  }

  const launchDocs = response.data.docs;

  for (const launchDoc of launchDocs) {
    const payloads = launchDoc["payloads"];
    const customers = payloads.flatMap((payload) => payload["customers"]);

    const launch = {
      flightNumber: launchDoc["flight_number"],
      mission: launchDoc["name"],
      rocket: launchDoc["rocket"]["name"],
      launchDate: launchDoc["date_local"],
      upcoming: launchDoc["upcoming"],
      success: launchDoc["success"],
      customers,
    };
    console.log(`${launch.flightNumber} ${launch.customers}`);

    await saveLaunch(launch);
  }
}

async function loadLaunchData() {
  const firstLaunch = await findLaunch({
    flightNumber: 1,
    rocket: "Falcon 1",
    mission: "FalconSat",
  });

  if (firstLaunch) {
    console.log("Launch data already loaded");
  } else {
    await populateLaunches();
  }
}

async function saveLaunch(launch) {
  try {
    await launchesDB.findOneAndUpdate(
      {
        flightNumber: launch.flightNumber,
      },
      launch,
      {
        upsert: true,
      }
    );
  } catch (error) {
    console.error(error);
  }
}

async function scheduleNewLaunch(launch) {
  const newFlightNumber = (await findLatestFlightNUmber()) + 1;

  const planet = await planets.findOne({
    keplerName: launch.target,
  });

  if (!planet) {
    throw new Error("Planet not found");
  }

  const newLaunch = Object.assign(launch, {
    success: true,
    upcoming: true,
    customers: ["RD1", "Wu-Tang"],
    flightNumber: newFlightNumber,
  });

  await saveLaunch(newLaunch);
}

//old method using maps
// const addNewLaunch = (launch) => {
//   flightNumber++;
//   launches.set(
//     flightNumber,
//     Object.assign(launch, {
//       success: true,
//       upcoming: true,
//       customers: ["hw24", "ztm"],
//       flightNumber,
//     })
//   );
// };

async function abortLaunchById(launchId) {
  const aborted = await launchesDB.findOneAndUpdate(
    {
      flightNumber: launchId,
    },
    {
      upcoming: false,
      success: false,
    }
  );

  return aborted.modifiedCount === 1;
}

module.exports = {
  launches,
  getAllLaunches,
  scheduleNewLaunch,
  existsLaunchWithId,
  abortLaunchById,
  loadLaunchData,
};
