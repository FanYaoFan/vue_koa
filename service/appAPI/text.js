const Router = require('koa-router')
let router = new Router()

router.get('/test' , async (ctx) => {
    ctx.body  = [
        {
            name:'xiaozhang',
            age:20,
            sex:'男',
            hobby:'ball'
        },
        {
            name:'xiaohong',
            age:23,
            sex:'女',
            hobby:'shopping'
        },
        {
            name:'xiaoli',
            age:24,
            sex:'男',
            hobby:'music'
        },
        {
            name:'xiaohuang',
            age:28,
            sex:'男',
            hobby:'game'
        },
        {
            name:'xiaohua',
            age:24,
            sex:'女',
            hobby:'swimming'
        },
    ]
    
  

     
})
