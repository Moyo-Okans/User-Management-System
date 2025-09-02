const express = require('express')
const mongoose = require('mongoose')
const {
  getAllUsers,
  getUser,
  updateUser,
  deleteUser
} = require('../controllers/userController')

const User = require('../models/userModel')
const {authToken, adminOnly} = require('../middleware/authMiddleware')
const router = express.Router()

//get all users
router.get('/', authToken, adminOnly, getAllUsers)

//get user by id
router.get('/:id', authToken, adminOnly, getUser)

//update user
router.put('/:id', authToken, adminOnly, updateUser)

//delete user
router.delete('/:id', authToken, adminOnly, deleteUser)

module.exports = router