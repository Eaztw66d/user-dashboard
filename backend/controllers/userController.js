import asyncHandler from 'express-async-handler';
import generateToken from '../utils/generateToken.js';
import User from '../models/userModel.js';



//* AUTH USER & GET TOKEN
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
    const user = await User.findOne({ email });


  if (user && (await user.matchPassword(password))) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id)
    })
  } else if (!user) {
    res.status(404);
    throw new Error('User with that email does not exist. Please register.');
  } else if (!await user.matchPassword(password)) {
    res.status(401);
    throw new Error('Invalid password, please try again!');
  } else {
    res.status(401);
    throw new Error('Invalid user credentials, please try again!')
  }


  
});

//* REGISTER NEW USER
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    res.status(400);
    throw new Error('User already exists, please sign in.');
  }

  const newUser = await User.create({
    name, 
    email,
    password
  });

  if (newUser) {
    res.status(201).json({
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      token: generateToken(newUser._id)
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data.')
  }
});

//* GET USER PROFILE
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email
    });
  } else {
    res.status(404);
    throw new Error('User not found.');
  }
});

//* UPDATE USER PROFILE
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  
  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    if (req.body.password) {
      user.password = req.body.password
    }

    const updatedUser = await user.save();

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(updatedUser._id)
    })
  } else {
    res.status(404);
    throw new Error('User not found.');
  }
})

//* GET ALL USERS
const getAllUsers = asyncHandler(async (req, res) => {
 const users = await User.find({});
 res.json(users);
})

//* DELETE USER
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    await user.remove();
    res.json({ Message: 'User removed'});
  } else {
    res.status(404);
    throw new Error('User not found.');
  }
})

//* GET USER BY ID
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');

  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error('User not found.');
  }
})

export {
  authUser,
  registerUser,
  updateUserProfile,
  getUserProfile,
  getAllUsers,
  deleteUser,
  getUserById
}