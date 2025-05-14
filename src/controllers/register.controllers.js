import asynchandler from "../utils/asynchandler.js";
import { ApiError } from "../utils/apierrors.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { fileuploader } from "../utils/cloudinary.js";
const register = asynchandler(async (req, res) => {
  const { fullname, username, email, password } = req.body;
  console.log("email:", email);
  if (
    [fullname, username, email, password].some(
      (fields) => fields?.trim() === ""
    )
  ) {
    throw new ApiError(400, "All the fields are required ");
  }
  const userexisted = User.findOne({
    $or: [{ username }, { email }],
  });
  if (userexisted) {
    throw new ApiError(409, "The user  with email or username already exists");
  }
  const avatarlocalpath = req.files?.avatar[0]?.path;
  const coverimagelocalpath = req.files?.coverimage[0]?.path;
  if (!avatarlocalpath) {
    throw new ApiError(400, "Avatar is required ");
  }

  const avatar = await fileuploader(avatarlocalpath);
  const coverimage = await fileuploader(coverimagelocalpath);

  if (!avatar) {
    throw new ApiError(400, "Avatar file is required ");
  }

  const User = await User.create({
    fullname,
    password,
    email,
    username: toLowerCase(),
    avatar: avatar.url,
    coverimage: coverimage?.url,
  });

  const CreatedUser = await User.findById(userexisted._id).select(
    "-password -refreshTocken"
  );
  if (!CreatedUser) {
    throw new ApiError(500, "something went wrong while registring the user ");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, CreatedUser, "user registerd successfully "));
});

export default register;
