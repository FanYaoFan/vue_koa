const mongoose = require ( 'mongoose')
const Schema = mongoose.Schema
var ObjectId = Schema.Types.ObjectId //声明object类型
const bcrypt = require('bcrypt')
const SALT_WORK_FACTOR = 10
// 创建我们的用户Schema
const userSchema = new Schema( {
    UserId : { type : ObjectId},
    UserName : {unique : true , type : String},
    password : String,
    createAt : { type : Date , default : Date.now()},
    lastLogin :{ type : Date, default : Date.now()}
})
// 加盐处理  目前不行 实施了仍旧报错
//每次存储数据时都要执行  // 为什么这里用箭头函数就不行
userSchema.pre('save',  function(next){
   
    console.log(this)
    bcrypt.genSalt( SALT_WORK_FACTOR,(err,salt)=>{
        if(err) return next(err)
        bcrypt.hash(this.password, salt, (err,hash)=>{
            if(err) return next(err)
            this.password = hash
            next()
        }) 

    })
})

userSchema.methods = {
    //密码比对的方法
    comparePassword:(_password,password)=>{
        return new Promise((resolve,reject)=>{
            bcrypt.compare(_password,password,(err,isMatch)=>{
                if(!err) resolve(isMatch)
                else reject(err)
            })
        })
    }
}

// 发布类型
module.exports = mongoose.model( 'User', userSchema )

