import { body } from 'express-validator';

export const signupValdiation = [
    body('name')
    .trim()
    .not()
    .isEmpty()
    .isLength({ min: 3 }),
    body('email')
    .trim()
    .not()
    .isEmpty()
    .isEmail()
    .withMessage("Please Enter Valid Email!"),
    body('password')
    .trim()
    .not()
    .isEmpty()
    .isLength({ min: 6 }),
    body('profilePic')
    .not()
    .isEmpty()
];

export const loginValidation = [
    body('email')
    .trim()
    .not()
    .isEmpty()
    .isEmail()
    .withMessage("Please Enter Valid Email!"),
    body('password')
    .trim()
    .not()
    .isEmpty()
    .isLength({ min: 6 }),
];