const { parse } = require("csv-parse");
const fs = require("fs");
const path = require("path");

const planets = require("./planets.mongo");

const parseStream = parse({
  comment: "#",
  columns: true,
  delimiter: ",",
});

const isHabitable = (planet) => {
  return (
    planet["koi_disposition"] === "CONFIRMED" &&
    planet["koi_insol"] > 0.36 &&
    planet["koi_insol"] < 1.11 &&
    planet["koi_prad"] < 1.6
  );
};

function loadPlanetsData() {
  const promise = new Promise((resolve, reject) => {
    fs.createReadStream(
      path.join(__dirname, "..", "..", "data", "kepler_data.csv")
    )
      .pipe(parseStream)
      .on("data", async (data) => {
        if (isHabitable(data)) {
          saveAPlanet(data);
        }
      })
      .on("error", (err) => {
        console.log(err);
        reject(err);
      })
      .on("end", async () => {
        const planetsFound = await getAllPlanets();
        console.log(`${planetsFound.length} habitable planets found!`);
        console.log("CSV file successfully processed");
        resolve();
      });
  });
}
const getAllPlanets = async () => {
  return await planets.find({});
};

const saveAPlanet = async (data) => {
  try {
    return await planets.updateOne(
      {
        keplerName: data.kepler_name,
      },
      {
        keplerName: data.kepler_name,
      },
      {
        upsert: true,
      }
    );
  } catch (error) {
    console.error(error);
  }
};

module.exports = {
  loadPlanetsData,
  getAllPlanets,
};
