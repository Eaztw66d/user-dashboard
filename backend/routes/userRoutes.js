import express from 'express';
import protect from '../middleware/authMiddleware.js';
import {
  authUser,
  registerUser,
  updateUserProfile,
  getUserProfile,
  getAllUsers,
  deleteUser,
  getUserById
} from '../controllers/userController.js'

const router = express.Router();


router.route('/').post(registerUser).get(protect, getAllUsers);

router.post('/login', authUser);

router.route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

  router.route('/:id')
  .delete(protect, deleteUser)
  .get(protect, getUserById);


export default router;