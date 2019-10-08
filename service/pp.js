const koa = require('koa')
const app = new koa()
const {connect , initSchemas} = require('./database/init.js')
const mongoose = require('mongoose')
//立即执行函数
;(async () =>{
    await connect()
    initSchemas()
    const User = mongoose.model('User')
    let oneUser = new User({userName:'jspang13',password:'123456'})
  
    oneUser.save().then(()=>{
        console.log('插入成功')
        
    })
let  users = await  User.findOne({}).exec();
console.log('------------------')
console.log(users)
console.log('------------------')  
})()

app.use( async(ctx) => {
    ctx.body = '<h1>hello koa</h1>'
})
app.listen ( 3000, () => { 
    console.log('hello world')
})