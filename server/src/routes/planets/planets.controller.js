const { getAllPlanets } = require("../../models/planets.model");
const planets = require("../../models/planets.mongo");

async function httpGetAllPlanets(req, res) {
  const allPlanets = await planets.find({});
  return res.status(200).json(allPlanets);
}

module.exports = {
  httpGetAllPlanets,
};
