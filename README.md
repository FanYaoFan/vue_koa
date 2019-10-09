# Vue Koa 全栈项目  
## 1 总体目录结构
<img src="https://github.com/FanYaoFan/vue_koa/blob/master/img/backend/catalogue.png"></img>
## 2 后台 
目录结构   
<img src="https://github.com/FanYaoFan/vue_koa/blob/master/img/backend/be.png"></img>
### 2.1  init.js 连接数据库  
#### 2.1.1  mongoose  
使用mongoose来连接数据库.(如果忘记数据库地址可以直接使用mongo来查看数据库地址)
`mongoose.connect ('mongodb://localhost/app,{autoIndex : false}, {userNewUrlParser : true }`  
#### 2.2.2  glob
```javascript
npm install glob --save
const glob = require('glob')  
const {resolve} = require('path')
```  
使用  
**glob**：node的glob模块允许你使用 * 等符号，来写一个glob规则，像在shell里一样，获取匹配对应规则文件。  
**resolve**: 将一系列路径或路径段解析为绝对路径.  
```JavaScript
exports.initSchemas(自定义名称) = () => { glob.sync(resolve(__dirname, './schmea/', '**/*.js')).forEach(require)}
```   
<img src="https://github.com/FanYaoFan/vue_koa/blob/master/img/backend/init.png"></img>
### 2.3 Schema  
数据库中的Schema是为数据库对象的集合的一种映射,每个schema会映射到mongodb中的一个collection,它不具备操作数据库的能力
#### 2.3.1 定义数据库模型(约束) 
```JavaScript
var UserSchema = mongoose.Schema({}) 
(注意 首字母大写,要和数据库里的表(集合)名称对应  
```
#### 2.3.2 Schmea 数据类型
``` JavaScript   
var schema = new Schema({       
  name:    String,  // 字符串类型  
  binary:  Buffer,   NodeJS buffer 类型
  living:  Boolean,  
  updated: { type: Date, default: Date.now },  
  age:     { type: Number, min: 18, max: 65 },  
  mixed:   Schema.Types.Mixed,   // 混合类型
  _someId: Schema.Types.ObjectId,    
  decimal: Schema.Types.Decimal128,
  array:      [],  
  ofString:   [String],  
  ofNumber:   [Number],  
  ofDates:    [Date],  
  ofBuffer:   [Buffer],  
  ofBoolean:  [Boolean],  
  ofMixed:    [Schema.Types.Mixed],  
  ofObjectId: [Schema.Types.ObjectId],  // 主键,一种特殊而且非常重要的类型 
  ofArrays:   [[]],  
  ofArrayOfNumbers: [[Number]],  
  nested: {
    stuff: { type: String, lowercase: true, trim: true }  
  }
})
```  
定义好约束之后,暴露出去  
`mongoose.model('集合名字` , 集合Schema, 集合名字(防止复数s)`
app项目中的Schema代码  
#### 2.3.2  User.js
如图  
<img src="https://github.com/FanYaoFan/vue_koa/blob/master/img/backend/userSchema.png"></img>
密码加盐 `npm instal --save bcrypt --registry=https://registry.npm.taobao.org` 
bcrypt是一种跨平台的文件加密工具。bcrypt 使用的是布鲁斯·施内尔在1993年发布的 Blowfish 加密算法。由它加密的文件可在所有支持的操作系统和处理器上进行转移。它的口令必须是8至56个字符，并将在内部被转化为448位的密钥   
每次存储时都要进行. 用在Schema的user.js中.
#### 2.3.3  Goods.js 
约束商品列表,要和数据库(mongodb)里面的字段一致. 如图  
<img src="https://github.com/FanYaoFan/vue_koa/blob/master/img/backend/goodsSchema.png"></img>
#### 2.3.4 Category.js
<img src="https://github.com/FanYaoFan/vue_koa/blob/master/img/backend/CategorySchema.png"></img>
#### 2.3.5 Categorysub.js
<img src="https://github.com/FanYaoFan/vue_koa/blob/master/img/backend/CategorysubSchema.png"></img>
### 2.4 koa路由模块化  
#### 2.4.1 登录注册路由  
思路:前台通过后台写好的登录路由,再封装成接口请求,注册登录到数据库中,逻辑操作(比对有没有相同的(可以用正则等)账号或用户名)   
```JavaScript
引入 :  
const mongoose = require('mongoose')  
const Router = require('koa-router)  
let router = new Router  
登录,注册 请求方式都是 post  
router.post('/register', async(ctx) => { 逻辑操作})
router.post('/login' , async(ctx) => {逻辑操作})
```  
__逻辑操作__ :  
1. 取得model(Schema暴露的model)    
 `const User = mongoose.model('User')`  
2. 把从前端接收的post数据(ctx.request.body)封装成一个new对象//为什么要用new的方式呢?  
     `let newUsr = new  User(ctx.request.body)`  
3. 用mongoose的save方法存储,要返回时候成功(用异步的方式,.then())    
```JavaScript  
await newUser.save().then( ()=> { ctx.body = { code:200,
            message:'注册成功'}).catch( ()=>{ ctx.body={
            code:500,
            message:error
        }})
 ```    
 注册路由code图: 
 <img src="https://github.com/FanYaoFan/vue_koa/blob/master/img/backend/Login.png"></img>  
登录页面同理  但增加了密码&账户比对的方式方法
如图     
 <img src="https://github.com/FanYaoFan/vue_koa/blob/master/img/backend/Login.png"></img>
#### 2.4.2 商品插入数据库
新建一个service/appApi/goods.js,关于商品的操作就都在这个api文件中 
导入所有数据,(一般是json格式的文件)  
思路: 
1. 利用node自带的fs模块(readFile), 把读取的文件数据(data)json格式的文件 => 字符串格式(__JSON.parse方法__)
2. 引入模型`const Goods = mongoose.model('Goods')`   
3. 用map方法循环每条数据(json格式一般是一个大对象包含,再一个数组格式包含各条数据),保存到数据库中.   
`data.数组名称.map(( value,index )=> {let newGoods = new Goods(value) newGoods.save().then().catch()})`  
#### 2.4.3 左侧商品列表插入数据库 
同样也是使用node自带的fs模块(readFile)方法  
```JavaScript  
fs.readFile( 'json文件路径', 'utf8', (err,data) => {
//逻辑操作})  
```    
逻辑操作  
1. data = JSON.parse(data) 
2. 引入Category的约束Schema
3. 循环遍历每条数据save到数据库中 如图  
 <img src="https://github.com/FanYaoFan/vue_koa/blob/master/img/backend/insertcategorydb.png"></img>  
 *** 
#### 2.4.4 右侧子类的商品数据插入到数据库
如图: 
 <img src="https://github.com/FanYaoFan/vue_koa/blob/master/img/backend/categorySubdb.png"></img>
##  前台
 <img src="https://github.com/FanYaoFan/vue_koa/blob/master/img/backend/fe.png" height="300"></img>
