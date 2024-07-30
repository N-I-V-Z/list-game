const userService = require("../Services/userService");

const register = async (req, res) => {
  try {
    const { userName, password, role } = req.body;
    const hashPassword = await userService.hashPassword(password);
    const response = await userService.register(userName, hashPassword, role);
    res.status(response.err === 0 ? 200 : 400).send(response);
  } catch (error) {
    console.log("Internal Server Error: ", error);
    res.status(500).send({ err: 1, mes: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { userName, password } = req.body;
    const response = await userService.login(userName, password);
    res.status(response.err === 0 ? 200 : 400).send(response);
  } catch (error) {
    console.log("Internal Server Error: ", error);
    res.status(500).send({ err: 1, mes: error.message });
  }
};

const refresh_token = async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) return res.sendStatus(401);
  
    const response = await userService.refresh_token(token);
    res.status(response.err === 0 ? 200 : 500).send(response.err === 0 ? response.accessToken : null);
  } catch (error) {
    console.log("Internal Server Error: ", error);
    res.status(500).send({ err: 1, mes: error.message });
  }
};

module.exports = {
  register,
  login,
  refresh_token,
};
