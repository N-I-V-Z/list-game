const userRoute = require("./userRoute");

const initRouters = (app) => {

  app.get("/api/some-endpoint", (req, res) => {
    res.send("thanh cong")
  })
  
  app.use("/api/users", userRoute);

  app.get("/", (req, res) => {
    res.send("Server on");
  });

  return app;
};

module.exports = initRouters;
