// const Router = require ('koa-router')
// const mongoose = require('mongoose')

// let router = new Router()
// router.get( '/' ,  async = (ctx) => {  //代表默认下的首页
//     ctx.body = '用户操作界面'
// })
// router.post('/register' , async (ctx) => {
//     // 1.取得model
//     const  User = mongoose.model('User' );
//     // 2. 把从前端接收的POST数据封装成一个新的user对象
//     console.log(User)
//     let newUser = new User(ctx.request.body)
//     //  ctx.body = ctx.request.body
//     // 3.用mongoose的save方法直接存储，然后判断是否成功，返回相应的结果
//     await newUser.save().then( () => {
//         //成功返回code 200,并返回成功消息
//         ctx.body={
//             status : 200,
//             success : true,
//             message:'注册成功'
//         }
//     })
//     .catch({
//         //失败并返回500 并返回错误信息
//         status : 500,
//         message : 'error',
//     })
// })


// module.exports=router;