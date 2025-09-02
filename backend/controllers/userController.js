const User = require('../models/userModel')
const mongoose = require('mongoose')

//create a user



//get all users
const getAllUsers = async (req, res) => {
    try {
        const users =  await User.find().select('-password');
        res.json(users)
      } catch (error){
        console.error(error)
        res.status(500).json({ message: "sERVER ERROR"})
      } 
}

//get user by id
const getUser = async (req, res) => {
    try {
    
          const id = req.params.id
          if(!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({error: 'Invalid userId format'})
          }
    
          const user = await User.findById(id).select('-password')
    
          if(!user) {
              return res.status(404).json({error: 'No such user'})
             
          }
           res.json(user)
        } catch (error) {
            console.error(error)
            res.status(500).json({ message:"server error" })
        }
}

//update user
const updateUser = async (req, res) => {
  try {
    const id = req.params.id;
    const body = req.body;

    // Check if ID is valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid userId format" });
    }

    // Find user by ID and update
    const user = await User.findByIdAndUpdate(id, body, {
      new: true, // return updated doc
      runValidators: true, // validate against schema
    }).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // ✅ return updated user instead of "Deleted Successfully"
    res.status(200).json({ message: "User updated successfully", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


//delete user
const deleteUser = async(req, res) => {
  try {
    const id = req.params.id
    //checking if ID is a valid mongodb ID
    if(!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({error: 'Invalid userId format'})
    }

    //variable to find user by id and delete
    const user = await User.findByIdAndDelete(id)
    //if statement to check if user can be found or not
    if(!user) {
      return res.status(404).json({message: "User not found"})
      
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch(error) {
    console.error(error)
    res.status(500).json({ message: "Server error"})
  }
}

module.exports = {
    getAllUsers,
    getUser,
    updateUser,
    deleteUser
}