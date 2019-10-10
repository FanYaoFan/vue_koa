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

##  3 前台
 <img src="https://github.com/FanYaoFan/vue_koa/blob/master/img/backend/fe.png" height="300"></img>
前台页面采用vant搭建基本页面 采用flex布局 axios请求后台数据  
### 3.1  ShoppingMall.vue
```JavaScript
<template>
    <div>
        <!-- top区域 -->
        <div class="search-bar">
            <van-row>
                <van-col span="3">
                    <img :src=" locationIcon" alt="" class="licaton-icon">
                </van-col>
                <van-col span="16">
                    <input type="text" class="search-input">
                </van-col>
                <van-col span="5">
                    <van-button size="mini">搜索</van-button>
                </van-col>
            </van-row>
        </div>
       <!-- 轮播图区域 -->
       <div class="swipe">    
           <van-swipe :autoplay="3000" indicator-color="white">
                <van-swipe-item v-for = "(banner,index) in bannerPicArray" :key="index">
                    <img v-lazy="banner.imageUrl" width="100%">
                </van-swipe-item>
           </van-swipe>
       </div>
       <!-- type=bar -->
       <div class="type-bar">
           <div v-for="(cate,index) in category" :key="index">
               <img v-lazy="cate.image" width="100%">
               <span>{{cate.mallCategoryName}}</span>
           </div>
       </div>
       <div>    
               <img v-lazy="advertesPicture" alt="" width="100%">
       </div>
        <!-- 推荐区域 -->
        <div class="recommend">
            <div class="recommend-title">
                商品推荐
            </div>
            <div class="recommend-body">
                <swiper :options="swiperOption">
                    <swiper-slide v-for="(item,index) in recommend" :key="index">
                        <div class="recommend-item">
                            <img v-lazy="item.image" alt="" width="80%">
                            <div>{{item.goodsName}}</div>
                            <div>${{item.price | moneyFilter}}(${{item.mallPrice |  moneyFilter}})</div>
                        </div>
                    </swiper-slide>
                </swiper>
            </div>
        </div>
     <!-- 展示区域 -->
    
      <floorComponet  :floorData="this.floor1" :floortitle="this.floorName.floor1"></floorComponet>

     <!-- 热卖区域 -->
        <!--Hot Area-->
    <!--Hot Area-->
<div class="hot-area">
    <div class="hot-goods">
        <van-list>
            <van-row gutter="20">
                <van-col span="12" v-for="( item, index) in hotGoods" :key="index">
                    <goodsinfo :goodsId ="item.goodsId" :goodsImage  = "item.image"  :goodsName = "item.name" :goodsPrice = "item.price"></goodsinfo>
                    <!-- goodsinfo 要传递 id值 -->
                </van-col>
            </van-row>
        </van-list>
    </div>
</div>
     
    </div>
</template>

<script>
    import axios from 'axios'
    import 'swiper/dist/css/swiper.css'
    import {swiper,swiperSlide} from 'vue-awesome-swiper' //局部引入组件
    // 引入自定义组件
    import floorComponet from '../component/floorComponent'
    //导入过滤器
    import {toMoney} from '@/Filter/moneyFilter.js'
    // 导入热卖组件
    import goodsinfo from '../component/goodsinfocomponent'
    import url from '@/serviceAPI.config.js'
    export default {
        data(){
            return {
               
                locationIcon : require('../../assets/images/location.png'),
                bannerPicArray: [
                    {imageUrl:require('../../assets/images/a.jpg')},
                    {imageUrl:require('../../assets/images/b.jpg')},
                    {imageUrl:require('../../assets/images/c.jpg')}
                ],
                category:[],
                advertesPicture:'',
                recommend:[],
                swiperOption:{
                    slidesPerView:3  //图片一列展示几项
                },
                floor1:[],
                floorName:[],
                hotGoods:[] ,//热卖商品
            }
        },
        components: {swiper,swiperSlide, floorComponet, goodsinfo }, //局部组件 商品推荐
        filters: {
             moneyFilter(money){
             return toMoney(money)
             }  
         },
        created(){
            axios({
                // url:'https://www.easy-mock.com/mock/5cab1e59c0af8d1b182a4120/smart/index',
                url: url.getShoppingMallInfo,
                method:'get',
            }).then( response => {
                if(response.status === 200){
                     this.category = response.data.data.category
                     console.log( response.data.data)
                     this.advertesPicture =  response.data.data.advertesPicture.PICTURE_ADDRESS
                     this.recommend = response.data.data.recommend
                     this.floor1  =  response.data.data.floor1
                     console.log(this.floor1)
                     this.floorName = response.data.data.floorName
                     this.hotGoods = response.data.data.hotGoods  
                     console.log(this.hotGoods)

                }
            })
            .catch( error => {
                console.log(error)
            })
          
        }
    }
</script>

<style scoped>
  .search-bar{
      height: 2.2rem;
      background-color: #e5017d;
      line-height: 2.2rem;
      overflow: hidden;
  }
  .licaton-icon {
       width: 100%;
       height: 2.3rem;
       padding-top:.2rem;
       padding-left:.2rem;
   }
  .search-input{
      width: 100%;
      background-color: #e5017d;
      color: #fff;   
      height: 1.2rem;
      border-top:0px;
      border-left:0px;
      border-right:0px;
      border-bottom:1px solid #fff;
      margin-left: .125rem;
      margin-right: .125rem;
  }

  /* 轮播图样式 */
  .swipe{
    height: 12rem;
    clear: both;
    width: 100%;
    max-height: 15rem;
    overflow:hidden;
  }

/* type-bar样式 */
 .type-bar{
     background-color: #fff;
     /* height: 5rem; */
     margin:0 .3rem .3rem .3rem;
     display: flex;
     border-radius: .3rem;
     font-size:13px;
     flex-direction:row;
     flex-wrap:nowrap;
 }
 .type-bar div{
    padding: .3rem;
    font-size: 12px;
    flex : 1;
 }
 /* 推荐区域样式 */
 .recommend{
     background-color: #fff; 
     margin-top: .3rem;
     text-align: left;
 }
  .recommend-title{
      border-bottom:1px solid #eee;
      color:#e5017d;
      font-size: 14px;
      padding:.3rem;
  }
  .recommend-item {
      background-color:#fff; 
      width: 99%;
      border-right:1px solid #eee;
      font-size: 12px;
      text-align: center;
  }

  /* 展示区域样式 */
  .floor-anormaly{
      display: flex;
      flex-direction: row;
      background-color: #fff;
      border-bottom: 1px solid #ccc;
  }
  /* 盒模型改变 */
   .floor-anormaly div {
        width:10rem;
       box-sizing: border-box;
       -webkit-box-sizing: border-box;
   }
   .floor-one{
      border-right:1px solid #ddd;
      
  }
  .floor-two{
      border-bottom:1px solid #ddd;
  }

  /* 规则排列区域 */
  .floor-rule {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      background-color: #fff;
  }
    .floor-rule div{
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      width:10rem;
      border-bottom:1px solid #ddd;
  }
  .floor-rule div:nth-child(odd){
      border-right: 1px solid #ddd;
  }
    /* 热卖区域 样式 */
  .hot-area{
      text-align: center;
      font-size:14px;
      height: 1.8rem;
      line-height:1.8rem;
  }
  .hot-goods{
      height: 130rem;
      overflow: hidden;
      background-color: #fff;
      /* 给个高度就可以拉到底部?? */

  }
   
</style>
```

 
