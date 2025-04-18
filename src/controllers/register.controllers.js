import asynchandler from "../utils/asynchandler.js";

const register = asynchandler(async (req, res) => {
  res.status(200).json({
    messege: "fahad shahzad the king of the pirates",
  });
});

export default register;
