const UserModel = require("../Models/UserModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
// require('dotenv').config();

const hashPassword = async (password) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  return hashedPassword;
};

const register = async (userName, password, role) => {
  try {
    await UserModel.create({
      username: userName,
      password: password,
      role: role || 2, // Sử dụng giá trị role nếu được cung cấp, nếu không mặc định là 2
    });
    return { err: 0 };
  } catch (error) {
    return { err: 1, mes: error.message }; // Trả về lỗi nếu có
  }
};

const generaAccessToken = (data) => {
  const access_token = jwt.sign(data, process.env.SECRET_KEY, {
    expiresIn: "1m",
  });
  return access_token;
};

const generaRefreshToken = (data) => {
  const refresh_token = jwt.sign(data, process.env.SECRET_KEY, {
    expiresIn: "7d",
  });
  return refresh_token;
};

const refresh_token = async (token) => {
  try {
    const user = jwt.verify(token, process.env.SECRET_KEY);
    const newAccessToken = generaAccessToken({
      userName: user.userName,
      role: user.role,
    });
    return { err: 0, accessToken: newAccessToken };
  } catch (err) {
    return { err: 1, mes: 'Invalid token' };
  }
};


const login = async (userName, password) => {
  try {
    const response = await UserModel.findOne({ username: userName });
    const isMath = await bcrypt.compare(password, response.password);
    if (isMath) {
      const access_token = generaAccessToken({
        userName: response.username,
        role: response.role,
      });
      const refresh_token = generaRefreshToken({
        userName: response.username,
        role: response.role,
      });

      return {
        err: 0,
        data: {
          data: response,
          access_token,
          refresh_token,
        },
        mes: "Login success",
      };
    } else {
      return { err: 1, data: null, mes: "Wrong User Name or Password" };
    }
  } catch (error) {
    return { err: 1, mes: error.message }; // Trả về lỗi nếu có
  }
};

module.exports = {
  register,
  hashPassword,
  login,
  refresh_token,
};
