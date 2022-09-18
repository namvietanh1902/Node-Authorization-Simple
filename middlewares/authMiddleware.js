const jwt =  require('jsonwebtoken');
const User = require("../models/users");


const requireAuth = (req, res, next)=>{
    const token = req.cookies.jwt;
    if (token) {
        jwt.verify(token,"Team Secret",(err,decoded)=>{
            if (err) {
                console.log(err.message);
                res.redirect("/login");
            }
            else{
                console.log(decoded);
                next();
            }
        });
    }
    else{
        res.redirect("/login");
        
    }
}
const checkUser =  (req, res, next)=>{
    const token = req.cookies.jwt;
    if (token) {
        jwt.verify(token,"Team Secret",async (err,decoded)=>{
            if (err) {
                console.log(err.message);
                res.locals.user =null;
                next();
            }
            else{
                console.log(decoded);
                const user = await User.findById(decoded.id);
                res.locals.user = user;

                next();
            }
        });
    }
    else{
        res.locals.user =null;

       next();
    }
}
module.exports = {requireAuth,checkUser}