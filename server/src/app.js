const express = require("express");
const cors = require("cors");
const path = require("path");
const morgan = require("morgan");

const api = require("./api");
//cors is a security feature that allows us to restrict access to our server
const app = express();
app.use(
  cors({
    origin: "",
  })
);
// morgan is a logger that logs all the requests that come to our server used right after any security features and before what we want logged
app.use(morgan(""));
// using cors instead of this
// app.use((req, res, next) => {
//   res.set("Access-Control-Allow-Origin", "http://localhost:3000");
//   next();
// });
app.use(express.json());
app.use(express.static(path.join(__dirname, "..", "public")));

app.use("/v1", api);

app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "index.html"));
});
module.exports = app;
