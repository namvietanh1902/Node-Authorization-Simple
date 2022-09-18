const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = mongoose.Schema({
    email:{
        type: String, 
        required: [true, "Bạn chưa nhập email"],
        unique: [true,"Email này đã tồn tại"],
        lowercase: true,
        validate: [((val)=>{
            var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            return re.test(val);
        }),"Email bạn nhập vào chưa hợp lệ"]
    },
    password:{
        type: String, 
        required:[ true,"Bạn chưa nhập mật khẩu"], 
        minlength: [6,"Mật khẩu phải dài hơn 6 kí tự"]
    },
});
userSchema.pre('save', async function(next){
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password,salt);
    console.log(this);
    next();
})
userSchema.statics.login = async function(email, password){
    const user = await this.findOne({ email: email});
    if (user) {
        const auth = await bcrypt.compare(password, user.password);
        if (auth) {
            return user;
        }
        else throw Error("Mật khẩu không hợp lệ");
    }
    else throw Error("Email không hợp lệ");
}
const User = mongoose.model('users',userSchema);

module.exports = User;