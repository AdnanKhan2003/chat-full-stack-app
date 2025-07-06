import express from 'express';

import { postSignup, postLogin, logout, checkAuth, getUsers } from '../controllers/auth.controller.js';
import { loginValidation, signupValdiation } from '../validations/auth.validations.js';
import { protectRoute } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/users', protectRoute, getUsers);
router.get('/check', protectRoute, checkAuth);
router.post('/signup', signupValdiation, postSignup);
router.post('/login', loginValidation, postLogin);
router.post('/logout', protectRoute, logout);


export default router;