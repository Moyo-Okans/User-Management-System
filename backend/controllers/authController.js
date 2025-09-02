const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs')
const User = require('../models/userModel');

const register = async(req, res) => {
    try {
      // Checking for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { name, email, password } = req.body;

      // Checking if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
      }
      

      // Create new user (password will hash in pre-save hook)
      const user = new User({ name, email, password});
      await user.save();

      // Generate JWT
      const token = jwt.sign(
        { userId: user._id }, 
        process.env.JWT_SECRET, 
        { expiresIn: '24h'});

      res.status(201).json({
        message: "User created successfully",
        token,
        user: { _id: user._id, name: user.name, email: user.email },
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  
}

const login = async (req, res) => {
    try{
      //check for errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      
      const { email, password } = req.body;

      const user = await User.findOne({ email });
      if (!user) {
        console.log(" No user found with email:", email);
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      
      //Compare password with hashed password
      
      console.log(" Entered password:", password);
      console.log(" Stored hash:", user.password);

      const isMatch = await bcrypt.compare(password, user.password);
      console.log(" Password match?", isMatch);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      //Generate JWT
      const token = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );
      //send a successful response
      res.status(200).json({
         message: "Login successful",
         token,
         user: {_id: user._id, name: user.name, email: user.email}
        })

      
    } catch(error) {
        console.error(error)
        res.status(500).json({ message: 'server error'})
      }
}
module.exports = {
    register,
    login
}

