const User = require('../models/users');
const jwt = require('jsonwebtoken');
const maxAge = 3*24*60*60;
const createToken = (id) => {
    return jwt.sign({id},"Team Secret",{
        expiresIn: maxAge
    })
}

const handleError = (err) => {
    let errors = {email:'',password:''}
    if (err.code === 11000){
        errors.email ="Email đó đã tồn tại";
        return errors;
    }
    if (err.message.includes('users validation failed')){
        Object.values(err.errors).forEach(({properties})=>{
            errors[properties.path] =properties.message;
        });
    }
    if (err.message ==="Email không hợp lệ"){
        errors.email="Email chưa được đăng ký"
    }
    if(err.message==="Mật khẩu không hợp lệ"){
        errors.password = "Mật khẩu không hợp lệ";
    }
    return errors;
}
const signup_get = (req,res,next) =>{
    res.render('signup');
}
const login_get = (req,res,next)=>{
    res.render('login');
}
const signup_post = async (req,res)=>{
    const {email,password} = req.body;

    try{
        const user = await User.create({email,password});
        const token = createToken(user._id);
        res.cookie('jwt',token,{httpOnly:true,maxAge:maxAge*1000});
        res.status(201).json({user: user._id});
    }
    catch(err){
        const errors = handleError(err);
        res.status(500).json({errors: errors});
        
    }
}
const login_post = async (req,res,next) => {
    const {email,password} = req.body;
    try{
        const user = await User.login(email,password);
        const token = createToken(user._id);
        res.cookie('jwt',token,{httpOnly:true,maxAge:maxAge*1000});
        res.status(201).json({user: user._id});
    }
    catch(err){
        const errors = handleError(err);
        res.status(500).json({errors: errors});
    }
}
const logout_get = (req, res) => {
    res.cookie('jwt','',{
        maxAge:1
    })
    res.redirect('/');
}
module.exports = {
    signup_get: signup_get,
    login_post: login_post,
    signup_post: signup_post,
    login_get: login_get,
    logout_get: logout_get,
}