const express = require('express');
const router = express.Router();
const {body} = require('express-validator')
const { authToken, adminOnly } = require('../middleware/authMiddleware');
const {
  register,
  login
} = require('../controllers/authController')


router.post(
  '/register',
  [
    body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  ], register
);

router.post('/login',
  [
    body('email').isEmail().withMessage('Must be a valid email address'),
    body('password').notEmpty().withMessage('Please provide a valid password')
  ], login
  
);

//add user from dashboard
router.post(
  '/add',
  authToken,
  [
    body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  ],
  register
);

module.exports = router;
