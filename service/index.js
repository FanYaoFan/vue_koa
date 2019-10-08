const Koa = require ('koa')
const Router = require ('koa-router')
const app = new Koa()
const bodyParser = require ('koa-bodyparser')
const {connect , initSchemas} = require('./database/init.js')
const cors = require('koa2-cors')
app.use(bodyParser()) //使用post接收数据
app.use(cors())

let user = require ('./appAPI/User.js')
let goods = require( './appAPI/goods.js')
// let SubId = require('./appAPI/abc')

;(async () => {
   await connect()
    initSchemas()
})();
let router = new Router()
router.use('/user',user.routes())
// router.use ( '/user' , router.routes())  // 写错  
router.use('/goods',goods.routes()) // 商品路由
// router.use('/SubId',SubId.routes()) // 小类路由


app.use(router.routes())
app.use(router.allowedMethods())
app.use( async (ctx) => {
    ctx.body = `<h1>hello koa</h1>` 
    // console.log(ctx.body.body)  // undefined
})
app.listen (3000, () => {
    console.log('server is running')
})