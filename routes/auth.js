const { json } = require('express')
const express = require('express')
const router = express.Router()
const User = require('../model/User')
const { registerValidation, loginValidation } = require('../validation')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

//--- Register a new user ---

router.post('/register', async(req, res) => {
    
    //--- Lets validate before we make a new user ---

    const {error} = registerValidation(req.body)
    if (error) {
     res.json(error.details[0].message)
    } else {
        //--- Checking if the user already exists in the DB ---
        const emailExists = await User.findOne({ email: req.body.email })    
        if(emailExists) return res.status(400).json('Email alreadt exists')

        //--- Hash password ---

        const salt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(req.body.password, salt)

        //--- Creating a new user ---
        const user = new User({
            name: req.body.name,
            email: req.body.email,
            password: hashPassword
    
        })
        try {
            const savedUser = await user.save()
            res.json({user_is: savedUser._id})
        } catch (err) {
            res.status(500).json(err)
        }
    }

})

//--- User login ---


router.post('/login', async (req, res) => {
    //--- Validate email and password for login
    const {error} = loginValidation(req.body)
    if (error) {
        res.json(error.details[0].message)
    } else {
        //--- Checking if the user email exists in the DB ---
        const user = await User.findOne({ email: req.body.email })
        if (!user) return res.status(400).json('Email does not found!')

        //--- check password ---

        const validPass = await bcrypt.compare(req.body.password, user.password)
        if (!validPass) return res.status(400).json('Invalid Password!')

        //--- Create and assign token

        const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET)
        res.header('auth-token', token).json(token)

    }


})


module.exports = router