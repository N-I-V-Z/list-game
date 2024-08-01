const userRoute = require("./userRoute");
const gameRoute = require("./gameRoute");
const scoreRoute = require("./scoreRoute");

const initRouters = (app) => {
  
  app.use("/api/users", userRoute);

  app.use("/api/games", gameRoute);

  app.use("/api/scores", scoreRoute);

  app.get("/", (req, res) => {
    res.send("Server on");
  });

  return app;
};

module.exports = initRouters;
