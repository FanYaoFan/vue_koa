const Koa = require ('koa')
const app = new Koa()
const Router = require('koa-router')
const bodyParser = require('koa-bodyparser')
const {connect , initSchemas} = require('./database/init.js')
const mongoose = require('mongoose')
const cors = require('koa2-cors')
app.use(cors())

let user = require('./appAPI/User.js')  //给一个路由模块地址
// eg : let home = require('./appAPI/Home.js') appAPI目录下
// router.use ('/home' ,user.routes())
;(async() => {
    await connect()
    initSchemas()
    const User = mongoose.model('User')
    let oneUser = new User ( {
        username : 'yao',
        password : '123456',
    });
    oneUser.save().then( (req,res) => {
        console.log('插入成功')
    })
    .catch( () => {
        console.log('插入失败')
    })
    let users = await User.findOne( {} ).exec()
    console.log (users)
})()


// 装载所有子路由
let router = new Router();
router.use('/user',user.routes()) //路由装载 /user 给了其一个父级路由
// 加载路由中间件
app.use(bodyParser())
app.use(router.routes())
app.use(router.allowedMethods())
app.use( async (ctx) => {
    ctx.body = `<h1>hello koa</h1>`
})
app.listen (3000, () => {
    console.log('server is running')
})