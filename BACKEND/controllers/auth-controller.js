const User = require('../models/user-model')
const bcrypt = require('bcryptjs')
const home = async(req,res)=>{
    try {
        res.status(200).send("welcome to the home page")
    } catch (error) {
        console.log(error);
    }
}
const register = async(req,res)=>{
    try {
        const {username,email,phone,password} = req.body

        const userExist = await User.findOne({email})

        if(userExist) {
           return res.status(400).json({message:"Email already exist ..."})
        }

        const userCreated = await User.create({username,email,phone,password })
        return res.status(201).json({
            msg: "registration successful" ,
            token: await userCreated.generateToken() ,
            userId:userCreated._id.toString()
        })
    }
    catch (error) {
        next(error)
    }
}

const login = async (req,res)=>{
    try {
        const {email,password} = req.body

        const userExist = await User.findOne({email})

        if(!userExist){
            return res.status(400).json({message:"Invalid credentials"})
        }
        // const user = await bcrypt.compare(password,userExist.password)
        const user = await userExist.comparePassword(password)
        if(user){
            res.status(200).json({
                msg: "login successful" ,
                token: await userExist.generateToken() ,
                userId: userExist._id.toString()
        })
        }
        else{
            res.status(401).json({message:"Invalid login password"})
        }
    } catch (error) {
        res.status(500).json("Internal server error")
    }
}
    
const user = async(req,res)=>{
    try {
        const userData = req.user
        // console.log("user data from controller side",userData)
        res.status(200).json({userData})
    } catch (error) {
        console.log(`error from the user route ${error}`)
    }
}
module.exports = {home,register,login,user}