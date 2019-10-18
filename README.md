# Vue Koa 全栈项目
***
## 目录 
## [1 总体目录结构](#1-总体目录结构)
## [2 后台](#2-后台)  
### [2.1 init连接数据库](#21--initjs-连接数据库)
### [2.2 glob](#22-glob)
### [2.3 Schema](#23-schema)
### [2.4 koa路由模块化](#24-koa路由模块化-1)
### [2.5 接口](#25--接口)
### [2.6 服务器开启](#26-服务器开启-1)
## [3 前台](#3-前台-1)
### [3.1 ShoppingMall](#31--shoppingmallvue)
### [3.2 Goods](#32-goods-1)
### [3.3 Carts](#33--carts-购物车结算)
### [3.4 categoryList](#34-categorylist-1)
### [3.5 Register](#35--register-注册界面)
### [3.6 Login](#36--login-登录界面)  
***  
___
## [预览图](https://github.com/FanYaoFan/vue_koa/blob/master/img/app.gif)
***
## 1 总体目录结构
<img src="https://github.com/FanYaoFan/vue_koa/blob/master/img/backend/catalogue.png"></img>
## 2 后台 
目录结构   
<img src="https://github.com/FanYaoFan/vue_koa/blob/master/img/backend/be.png"></img>
### 2.1  init.js 连接数据库  
#### 2.1.1  mongoose  
使用mongoose来连接数据库.(如果忘记数据库地址可以直接使用mongo来查看数据库地址)
`mongoose.connect ('mongodb://localhost/app,{autoIndex : false}, {userNewUrlParser : true }`  
### 2.2  glob
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
 ***
### 2.5  接口
#### 2.5.1 首页接口
点击图片,进入商品详情页 以id形式向后台(post发送请求),后台请求对应路由,在数据库中查找并返回数据  
 <img src="https://github.com/FanYaoFan/vue_koa/blob/master/img/BackGoods/getDetailGoods.png"></img>  
 代码:  
  <img src="https://github.com/FanYaoFan/vue_koa/blob/master/img/BackGoods/getGoodscode.png"></img>  
#### 2.5.2 列表左侧数据接口  
如图:   
<img src="https://github.com/FanYaoFan/vue_koa/blob/master/img/BackGoods/getCategoryList.png"></img>  
代码:  
<img src="https://github.com/FanYaoFan/vue_koa/blob/master/img/BackGoods/getCategoryListCode.png"></img> 
#### 2.5.3  列表右侧导航接口  
如图: 
<img src="https://github.com/FanYaoFan/vue_koa/blob/master/img/BackGoods/getCategorySublistTab.png"></img> 
代码:  

<img src="https://github.com/FanYaoFan/vue_koa/blob/master/img/BackGoods/categorySubListCode.png"></img>   


#### 2.5.4  主体商品数据接口
如图:  
<img src="https://github.com/FanYaoFan/vue_koa/blob/master/img/BackGoods/getmainSubId.png"></img> 
代码:
<img src="https://github.com/FanYaoFan/vue_koa/blob/master/img/BackGoods/getmainSubIdcode.png"></img>   
#### 2.5.5  serviceAPI.js
实际开发中,一般把各个接口配置放在一个js文件中. 如图  
<img src="https://github.com/FanYaoFan/vue_koa/blob/master/img/BackGoods/serviceAPI.png"></img>  
#### 2.6 服务器开启
建立index.js 文件中, 引入所有模块,node index.js 开启服务器 
<img src="https://github.com/FanYaoFan/vue_koa/blob/master/img/backend/serviceJs.png"></img>
## [回到顶部](#vue-koa-全栈项目)
##  3 前台
前台目录结构  
 <img src="https://github.com/FanYaoFan/vue_koa/blob/master/img/backend/fe.png" height="300"></img>   
前台页面采用vant搭建基本页面 采用flex布局 axios请求后台数据    
### 3.1  ShoppingMall.vue
在create生命周期中,通过get请求url.getShoppingMallInfo接口,把拿到的数据渲染在页面上.也可以在methods中定义一个axios方法,然后再create生命周期中,以this.fn()调用这个方法.  
```JavaScript  
created() {
    axios({
      url: url.getShoppingMallInfo,
      method: "get"
    })
      .then(response => {
        if (response.status === 200) {
          this.category = response.data.data.category;
          console.log(response.data.data);
          this.advertesPicture =
            response.data.data.advertesPicture.PICTURE_ADDRESS;
          this.recommend = response.data.data.recommend;
          this.floor1 = response.data.data.floor1;
          console.log(this.floor1);
          this.floorName = response.data.data.floorName;
          this.hotGoods = response.data.data.hotGoods;
          console.log(this.hotGoods);
        }
      })
      .catch(error => {
        console.log(error);
      });
  }
```
如图: 
<img src="https://github.com/FanYaoFan/vue_koa/blob/master/img/fe/ShoppingMallfirstPart.png"></img>  
***
<img src="https://github.com/FanYaoFan/vue_koa/blob/master/img/fe/ShoppingMallsecondPart.png"></img>    
#### 3.1.1 floorComponent 
前台获取数据, 
```JavaScript
data(){return {floor1: [],floorName: []}}  
<floorComponet :floorData="this.floor1" :floortitle="this.floorName.floor1"></floorComponet>  
```  
在floor组件中,通过watch监听数据的改变,从而实现数据的双向绑定 注: 这里为什么要用watch? 已经实际开发中,哪些是需要用到watch的?  
```JavaScript  
export default {
        // 需要传递的数
        props: ['floorDate'],
        data(){
            return {
                floorDate0:[],
                floorDate1:[],
                floorDate2:[]
            }
        },
         created(){
            //这里写得不到数据，应为数据是延迟返回的
            
        },
        watch :{
            // 数据的双向绑定
            floorData: val => {
                this.floorDate0 = this.floorDate[0]
                this.floorDate1 = this.floorDate[1]
                this.floorDate2 = this.floorDate[2]
            }
        }
}
```  
### 3.2 Goods 
通过post向后台请求(url.getDetailGoodsInfo)并携带id参数.后台通过id查找返回数据
如图:  
<img src="https://github.com/FanYaoFan/vue_koa/blob/master/img/fe/Goods.png"></img>
#### 3.2.1 购物车添加逻辑  
 用到localstorage相关方法  
思路:  
1. 先判断localStorage(本地存储)里有没有商品,有就执行累加,没有接添加 
2. 加入成功后跳转到购物车页面(已经有仍旧跳转,这里不太完美)  
逻辑操作: 
```JavaScript   
let cartInfo = localStorage.cartInfo ? JSON.parse(localStorage.cartInfo) : [] //设置一个变量来存储值
let isHaveGoods = cartInfo.find( cart => cart.goodsId == this.goodsId)  // find方法来查看cartInfo是否有这个值(通过id来查找)
// 没有,就添加新的商品  
if(!isHavaGoods){
//设置一个新商品
let newGoodsInfo = {goodsId : this.goodsInfo.ID,
Name : this.goodsInfo.NAME,
price : this.goodsInfo.PRESENT_PRICE,
image : this.goodsInfo.IMAGE1,
count : 1
}
cartInfo.push(newGoodsInfo)
localStorage.cartInfo = JSON.stringify(cartInfo)  //s => json 格式
}
 this.$router.push({name:'Cart'(路由名字)})  //进行跳转 也可以用path来跳转  this.$router.push( '/cart'(路由地址))
```   
## [回到顶部](#vue-koa-全栈项目)  
### 3.3  Carts 购物车接算 
如图: 
<img src="https://github.com/FanYaoFan/vue_koa/blob/master/img/fe/cart.png"></img>  
### 3.4 CategoryList 
如图:   
<img src="https://github.com/FanYaoFan/vue_koa/blob/master/img/fe/CategoryList.png"></img>  
```JavaScript
html:
 <div id="list-div">
            <van-pull-refresh v-model="isRefresh" @refresh="onRefresh">
              <van-list v-model="loading" :finished="finished" @load="onLoad">
                <div
                  class="list-item"
                  v-for="(item , index) in goodList"
                  :key="index"
                  @click="goGoodsInfo(item.ID)"
                >
                  <!-- 右侧主体 -->
                  <div class="list-item-img">
                    <img :src="item.IMAGE1" width="100%" />
                  </div>
                  <div class="list-item-text">
                    <div>{{item.NAME}}</div>
                    <div class>￥{{item.ORI_PRICE | moneyFilter}}</div>
                  </div>
                </div>
              </van-list>
            </van-pull-refresh>
          </div>
//data中的数据:   
data() {
    return {
      category: [],
      categoryIndex: 0,
      categorySub: [], // 右侧列表数据
      active: 0,
      loading: false, // 上拉加载
      finished: false, //上拉加载是否有数据

      isRefresh: false, //下拉刷新状态
      page: 1, //商品列表的页数
      goodList: [], // 商品列表信息
      categorySubId: "" //商品子类id
    };
  },
  methods: {
   clickCategory(index, categoryId) {
      this.categoryIndex = index;
      // 当点击的时候调用getCategorySubId(categoryId)这个方法
      //  点击大类的初始化操作
      this.page = 1;
      this.finished = false;
      this.goodList = [];
      this.getCategorySubId(categoryId);
    },
    // 根据左侧导航传过来的id 读取右侧列表
    getCategorySubId(categoryId) {
      axios({
        url: url.getCategorySublist,
        method: "post",
        data: { categoryId: categoryId }
      })
        .then(response => {
          //  console.log(response + 1)
          if (response.status === 200 && response.data.message) {
            this.categorySub = response.data.message;
            this.active = 0; // 切换的时候
          } else {
            Toast("服务器错误，数据取得失败");
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 上拉加载方法
    onLoad() {
      setTimeout(() => {
        // 当这个值有的时候 就等于 this.categorySubID , 没有的时候就等于子类的第一组数据
        this.categorySubId = this.categorySubId
          ? this.categorySubId
          : this.categorySub[0].ID;
        this.getGoodList();
      }, 1000);
    },
    // 下拉刷新方法
    onRefresh() {
      setTimeout(() => {
        this.isRefresh = false;
        this.goodList = []; //清空
        this.page = 1;
        this.onLoad(); //重新刷新
        this.finished = false; //保证下拉还能刷新
      }, 1000);
    },

    getGoodList() {
      axios({
        url: url.getGoodsSubID,
        // url : url.getCategorySublist,
        method: "post",
        data: {
          categorySubId: this.categorySubId,
          page: this.page
          //传的参数
        }
      })
        .then(response => {
          console.log(response + "hello why");
          if (response.status === 200 && response.data.message) {
            this.page++;
            console.log(response.data.message);
            this.goodList = this.goodList.concat(response.data.message);
          } else {
            this.finished = true;
          }
          this.loading = false;
        })
        .catch(err => {
          console.log(err);
        });
    },

    // 点击子类的方法
    onClickCategorySub(index, title) {
      this.categorySubId = this.categorySubId[index].ID;
      //   初始化操作
      this.goodList = [];
      this.finished = false;
      this.page = 1;
      this.onLoad();
    },
  }
```  
## [回到顶部](#vue-koa-全栈项目)  
### 3.5  register(注册界面)
使用的是van-field 组件  注册按钮设置loading状态   
<img src="https://github.com/FanYaoFan/vue_koa/blob/master/img/fe/registerVue.png"></img> 
思路: 请求后台的注册路由,注册成功,返回code:200,(将注册信息插入到数据库中)并跳转路由到主界面,失败,弹出注册失败信息  
表单验证方法:    
eg 用户名不能小于5为,成立,看密码,密码不能少于6为,比对两次输入的密码是否一致.  
```JavaScript 
 data () {
            return {
              username : '',
              password : '',  
              openLoading : false, // 是否开启用户注册的loading状态
              usernameErrorMsg : '',   //当用户名出现错误的时候
              passwordErrorMsg : '',   //当密码出现错误的时候
            }
        },
//注册方法: 
 axiosRegisterUser () {
                this.openLoading = true
                axios ( {
                    url : url.registerUser,
                    method : 'post',
                    data : {
                         username : this.username, 
                         password : this.password,
                        
                    }
                })
                .then( (response) => {
                    console.log(response)
                   if(response.status === 200){
                        // Toast.success('注册成功')
                        this.$router.push('/') // 注册成功跳转到首页,后期可以更改
                        Toast.success('注册成功')
                   }
                   else{
                       Toast.fail('注册失败')
                        this.openLoading=false
                   }
                })
                .catch( error => {
                    console.log(error)
                })
            },
            表单验证方法:  
             checkForm(){
            let isOk= true
            if(this.username.length<5){
                this.usernameErrorMsg="用户名不能小于5位"
                isOk= false 
            }else{
                this.usernameErrorMsg=''
            }
            if(this.password.length<6){
                this.passwordErrorMsg="密码不能少于6位"
                isOk= false
            }else{
                this.passwordErrorMsg=''
            }
            return isOk
                },
    }
        }
```
### 3.6  Login (登录界面)  
在created生命周期中, 判断其是否登录(在localStorage中是否有其值)
在localStorage中设置userInfo ={userName : this.username}  思考: 为什么要把登录放在一个Promise实例中??
```JavaScript
  data() {
            return {
                username: '',
                password: '',
                openLoading: false,    //是否开启用户的Loading
                usernameErrorMsg:'',   //当用户名出现错误的时候
                passwordErrorMsg:'',   //当密码出现错误的时候
            }
        },
        created(){
            if(localStorage.userInfo){
                    Toast.success('您已经登录')
                    this.$router.push('/')
            }
        },
        methods: {
            goBack() {
                this.$router.go(-1)   
            },

            //*****注册用户的实行方法*****
            LoginAction(){
               
                this.checkForm() && this.axiosLoginUser()
            },

            //*******axios注册用户方法*******
            axiosLoginUser(){
                    //先把按钮进行loading状态，防止重复提交
                    this.openLoading = true

                axios({
                    url: url.registerUser,
                    method: 'post',
                    data:{
                        userName:this.username,
                        password:this.password 
                    }
                })
                .then(response => {
                    // localstorage 
        new Promise((resolve,reject)=>{
        localStorage.userInfo={userName:this.username}
                 setTimeout(()=>{
                    resolve()
                            },500)
                    }).then(()=>{
                            Toast.success('登录成功')
                            this.$router.push('/')
                    }).catch(err=>{
                            Toast.fail('登录状态保存失败')
                            console.log(err)
                    })
                   if (response.status == 200){
                       Toast.success('登录成功')
                       this.$router.push('/')
                   }else{
                       Toast.fail('登录失败')
                       this.openLoading = false
                   }
                        
                })
                .catch((error) => {   
                   Toast.fail('登录失败')
                   this.openLoading = false
                })
                        
            },

```
## [回到顶部](#vue-koa-全栈项目)

 
