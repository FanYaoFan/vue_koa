const mongoose = require ('mongoose')
const glob = require ('glob')
mongoose.connect("mongodb://localhost/app"  , { autoIndex: false })
mongoose.set('useNewUrlParser', true)
// mongoose.set('useCreateIndex', true)
var db = mongoose.connection
const {resolve} = require ('path')
let maxConnectTimes = 0 
exports.initSchemas = () =>{
  glob.sync(resolve(__dirname,'./schema/','**/*.js')).forEach(require)
}
// exports.connect = () =>{
//     // 必须确保先连接数据库后，再作其他事情，
//     // 所以我们需要在所有代码的外层增加一个Promise
//     return new Promise( (resolve, reject) => {
//        //连接数据库
//     // mongoose.connect(db)
      
//       // 增加数据库连接监听事件
//     mongoose.connection.on('disconnected', () => {
//       console.log ('数据库断开')
//       if ( maxConnectTimes <= 3) {
//             maxConnectTimes ++ 
//             mongoose.connect(db)
//       }else{
//           reject()
//           throw new Error('数据库重连次数超过最大值')
//       }
//   })

//   mongoose.connection.on('error', () => {
//       console.log ('数据库错误')
//       mongoose.connect(db)
//   })
//  //连接打开时 
//  mongoose.connection.once('open', () => {
//   console.log('MongoDB Connected successfully!')
//   resolve()
// })
//     })
// }

exports.connect = () => {
   return new Promise( (resolve , reject) => {
     //连接数据库
     db.on ( 'disconnected' , () => {
       console.log ('数据库断开')
       if (maxConnectTimes <= 3 ) {
        maxConnectTimes ++
        mongoose.connect("mongodb://localhost/app" , { useNewUrlParser: true })
       } else {
        reject()
        throw new Error('数据库重连次数超过最大值')
       }
     })
     db.on('error', () => {
            console.log ('数据库错误')
            mongoose.connect("mongodb://localhost/app" , { useNewUrlParser: true }, (err) => {
              if(err){
                console.log(err)
              }
            })
        })
     db.once ( 'open' , () => {
        console.log('MongoDB Connected successfully!')
        resolve()
      } )
   })
}