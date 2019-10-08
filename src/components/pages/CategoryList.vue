<template>
  <div>
    <div class="navbar-div">
      <van-nav-bar title="类别列表" />
    </div>

    <!-- 左右布局 -->
    
    <div>
      <van-row>
        <van-col span="6">
          <div id="leftNav">
              <ul>
                  <!-- // 这里要传id值 -->
                  <li v-for="(item,index) in category" :key="index" @click= "clickCategory(index,item.ID)" :class="{categoryActive:categoryIndex==index}">
                      {{item.MALL_CATEGORY_NAME}}
                      </li>
              </ul>
          </div>
        </van-col>

        <van-col span="18">
            <div class="tabCategorySub">
                <van-tabs v-model="active">
                    <van-tab v-for="(item,index) in categorySub" :key="index" :title="item.MALL_SUB_NAME">
                    </van-tab>
               </van-tabs>
            </div>
            
                <!-- 上拉加载 --> 
                <!-- <div id="list-div">
                    <van-list v-model="loading" :finished="finished" @load="onLoad">
                        <div class="list-item" v-for="(item,index) in list" :key="index">
                            {{item}}
                        </div>
                    </van-list>
                </div> -->

                <!-- 下拉刷新 包裹 上拉加载 ?? -->
            <div id="list-div">
              <van-pull-refresh v-model="isRefresh" @refresh="onRefresh">
                  <van-list
                    v-model="loading"
                    :finished="finished"
                    @load="onLoad"
                        >
                  <div class="list-item" v-for="(item , index) in goodList" :key="index"  @click="goGoodsInfo(item.ID)">
                     <!-- 右侧主体 -->
                     <div class="list-item-img">
                         <img :src="item.IMAGE1" width="100%">
                     </div>
                     <div class="list-item-text">
                         <div>{{item.NAME}}</div>
                          <div class="">￥{{item.ORI_PRICE | moneyFilter}}</div>
                     </div>
                </div>
               </van-list>
             </van-pull-refresh>
           </div>

        </van-col>
      </van-row>
    </div>

  </div>
</template>

<script>
import axios from "axios";
import url from "@/serviceAPI.config.js";
import {Toast} from 'vant'
import {toMoney} from '@/Filter/moneyFilter.js'  // 引入过滤器
export default {
    data (){
        return {
            category : [],
            categoryIndex : 0,
            categorySub : [], // 右侧列表数据
            active : 0,
            loading: false,  // 上拉加载
            finished : false ,  //上拉加载是否有数据
           
            isRefresh:  false, //下拉刷新状态
            page : 1,   //商品列表的页数
            goodList : [] , // 商品列表信息
            categorySubId : '', //商品子类id
        }
    },
    filters : {
        moneyFilter(money){
            return toMoney(money)  //挂载 
        }
    },
    created(){
        this.getCategoryList()
       
    },
    mounted(){
        let winHeight = document.documentElement.clientHeight
        document.getElementById("leftNav").style.height = winHeight - 46-50 + 'px'
        document.getElementById("list-div").style.height = winHeight - 90-50  + 'px'
    },
  methods: {
    //   获取左侧导航数据
    getCategoryList() {
      axios({
        url: url.getCategoryList,
        method: "get"
      })
        .then( response => {
            // console.log(response)
            if(response.status === 200 &&  response.data.message){
                this.category = response.data.message  //得到数据后就可以去渲染
                // 当我们获取左侧数据的时候,我们直接调用右侧列表数据的(数组)的第一项
                this. getCategorySubId(this.category[0].ID)
            }else{
                Toast('data 获取 失败')
            }
        })
        .catch( err => {
            console.log(err)
        });
    },
    clickCategory(index,categoryId){
        this.categoryIndex = index
         // 当点击的时候调用getCategorySubId(categoryId)这个方法
        //  点击大类的初始化操作
         this.page = 1
         this.finished =  false 
         this.goodList = []
        this.getCategorySubId(categoryId)
    },
    // 根据左侧导航传过来的id 读取右侧列表
    getCategorySubId(categoryId){
        axios({
            url: url.getCategorySublist,
            method: 'post',
            data: {categoryId : categoryId}
        }).then(
            (response) => {
                //  console.log(response + 1)
                if(response.status === 200 && response.data.message){
                    this.categorySub = response.data.message
                      this.active = 0 // 切换的时候 
                      
                    
                }else{
            Toast('服务器错误，数据取得失败')
        }  
            }) 
        .catch(
            (err) => {
                console.log(err)
            } )
       
    },
    // 上拉加载方法
    onLoad(){
        setTimeout ( () => {
            // 当这个值有的时候 就等于 this.categorySubID , 没有的时候就等于子类的第一组数据
           this.categorySubId = this.categorySubId ? this.categorySubId : this.categorySub[0].ID
           this.getGoodList()

        }, 1000)
    },
    // 下拉刷新方法  
    onRefresh(){
        setTimeout( () => {
            this.isRefresh = false 
            this.goodList = [] //清空
            this.page = 1
            this.onLoad()  //重新刷新
            this.finished = false  //保证下拉还能刷新
        }, 1000)
   },

    getGoodList(){
            axios({
                url : url. getGoodsSubID,
                // url : url.getCategorySublist,
                method: 'post',
                data : { 
                    categorySubId : this.categorySubId,
                    page : this.page
                    //传的参数
                 }
            }).then(
                response => {
                    console.log(response + "hello why")
                    if(response.status === 200 &&  response.data.message){
                        this.page ++ 
                        console.log(response.data.message)
                        this.goodList = this.goodList.concat(response.data.message)
                        
                    }else{
                        this.finished = true
                    }
                     this.loading= false
                }
            ).catch(
                err => {
                    console.log(err)
                }
            )
    },

    // 点击子类的方法 
      onClickCategorySub(index,title){
        this.categorySubId = this.categorySubId[index].ID
        //   初始化操作
        this.goodList = []
        this.finished = false
        this.page = 1
        this.onLoad()
      },
      //   跳转到商品详细页
    goGoodsInfo(id){
        this.$router.push( {name : 'Goods', params : {goodsId : id}})  // 根据id跳转到详细页
    }

  },


};
</script>

<style  scoped>
#leftNav {
  background-color: aliceblue;
}
#leftNav ul li {
    line-height: 2rem;
    border-bottom: 1px solid  #E4E7ED;
    padding: 3px;
    text-align: center;
    font-size: 0.5rem;
}
/* active 效果 */
.categoryActive{
    background-color: #fff;
}

/* 上拉加载数据 */
.list-item{
    text-align: center;
    line-height: 80px;
    border-bottom:1px solid #f0f0f0;
    background-color: #fff;
}
 #list-div{
        overflow: scroll;
    }
    .list-item{
        display: flex;
        flex-direction: row;
        font-size:0.8rem;
        border-bottom: 1px solid #f0f0f0;
        background-color: #fff;
        padding:5px;
    }
    #list-div{
        overflow: scroll;
    }
    .list-item-img{
        flex:8;
    }
    .list-item-text{
        flex:16;
        margin-top:10px;
        margin-left:10px;
    }
</style>