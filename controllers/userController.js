const User = require("../models/User.js");
const bcrypt = require("bcrypt");

module.exports.register = async (req, res) => {
  try {
    console.log(req.body);
    const { name, email, password } = req.body;
    //validation
    if (!name) return res.status(400).send("Hey! Name field is required");
    if (!email) return res.status(400).send("Hey! Email field is required");
    if (!password || password.length < 8)
      return res.status(400).send("Hey! Password must be atleast 8 characters");

    //the email must be unique
    let userExist = await User.findOne({ email }).exec();
    if (userExist)
      return res
        .status(400)
        .send(
          "It seems you are already an existing user. Please check your email or login."
        );

    const user = new User({
      name,
      email,
      password,
    });
    //hashing the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(user.password, salt);
    user.password = hashedPassword;
    //saving user to database
    const newUser = await user.save();
    console.log("USER CREATED", newUser);
    return res.status(200).json("Registration successful!");
  } catch (error) {
    console.log("CREATE USER FAILED", error);
    return res.status(400).send("Error in registering. Please, try again");
  }
};

module.exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const findUser = await User.findOne({ email });
    // console.log("USER ===>", findUser);
    if (findUser) {
      const match = await bcrypt.compare(password, findUser.password);
      if (match) {
        const { password, createdAt, updatedAt, ...user } = findUser._doc;
        // console.log(userInfo);
        res.status(200).json(user);
      } else {
        res
          .status(400)
          .json("Incorrect password! Check your password and try again.");
      }
    } else {
      res
        .status(400)
        .json("User doesn't exists with this email. Please register.");
    }
  } catch (error) {
    console.log("ERROR IN USER LOGIN ===>", error);
    res.status(400).json("Error in user login. Please try login again.");
  }
};

module.exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ _id: { $ne: req.params.id } }).select([
      "email",
      "name",
      "_id",
    ]);
    return res.json(users);
  } catch (error) {
    console.log(error);
  }
};

module.exports.logout = async (req, res) => {
  try {
    if (!req.params.id) return res.json({ msg: "User id is required " });
    onlineUsers.delete(req.params.id);
    return res.status(200).send();
  } catch (ex) {
    console.log(ex);
  }
};
