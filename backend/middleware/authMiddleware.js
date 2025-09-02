const jwt = require('jsonwebtoken')
const User = require('../models/userModel')

const authToken = (req, res, next) => {
    const authHeader = req.headers.authorization
    const token = authHeader && authHeader.startsWith('Bearer')
        ? authHeader.slice(7)
        : null;
    if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        console.error(error)
        res.status(401).json({ message:  'Token is invalid'})
    }
}

//admin code
const adminOnly = async(req, res, next) => {
    try{
        const user = await User.findById(req.user.userId)

        if(!user || user.role !== "admin") {
            return res.status(403).json({message: "Access denied, admin only" })
        }
        next()
    } catch (error) 
    {
        res.status(500).json({ message: 'Server error' });
    }
}

module.exports = {authToken, adminOnly}