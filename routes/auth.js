const {
  login,
  register,
  getAllUsers,
  logout,
} = require("../controllers/userController");

const authRouter = require("express").Router();

authRouter.post("/login", login);
authRouter.post("/register", register);
authRouter.get("/allusers/:id", getAllUsers);
authRouter.get("/logout/:id", logout);

module.exports = authRouter;
