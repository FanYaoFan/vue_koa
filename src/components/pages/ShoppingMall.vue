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