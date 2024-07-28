const UserModel = require("../Models/UserModel");
const bcrypt = require("bcrypt");

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

const login = async (userName, password) => {
  try {
    const response = await UserModel.findOne({ username: userName });
    const isMath = await bcrypt.compare(password, response.password);
    if (isMath){
        return {err: 0, data: response, mes: "Login success"};
    }else{
        return {err: 1, data: null, mes: "Wrong User Name or Password"}
    }
  } catch (error) {
    return { err: 1, mes: error.message }; // Trả về lỗi nếu có
  }
};

module.exports = {
  register,
  hashPassword,
  login,
};
