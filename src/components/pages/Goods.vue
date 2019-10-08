<template>
    <div>
    <!-- nav-bar -->
            <div class="navbar-div">
                <van-nav-bar
                    title="商品详情"
                    left-text="返回"
                    left-arrow
                    @click-left="onClickLeft"
                />
            </div>
            <!-- 商品头图部分 -->
            <div class="topimage-div">
                <img :src="goodsInfo.IMAGE1" width="100%"/>   
            </div>
            <div class="goods-name">{{goodsInfo.NAME}}</div>
            <div class="goods-price">价格：${{goodsInfo.PRESENT_PRICE |  moneyFilter}}</div>
            <!-- main body -->
            <div>
            <!--  切换布局 -->
                <van-tabs swipeable sticky>
                    <van-tab title="商品详情">
                        <div class="detail" v-html="goodsInfo.DETAIL"></div>
                    </van-tab>
                    <van-tab title="评价">
                        好!!!!!
                    </van-tab>
                </van-tabs>
           </div>
   
    <!-- 底栏-->
    <div class="goods-bottom">
        <div><van-button size="large" type="primary" @click="addGoodsToCart">加入购物车</van-button></div>
        <div><van-button size="large" type="danger">直接购买</van-button></div>
   </div>         
   
    




    </div>
</template>

<script>
    import axios from 'axios'
    import url  from '@/serviceAPI.config.js'
    import {Toast} from 'vant'
    import {toMoney} from '@/Filter/moneyFilter.js'
    export default {
        data(){
            return {
                goodsId : "",
                goodsInfo:{},   //商品详细数据
            }
        },
        filters : { 
            moneyFilter(money){
                return toMoney(money)
            }
         },//过滤
        created(){
            this.goodsId = this.$route.query.goodsId ? this.$route.query.goodsId : this.$route.params.goodsId
            // 显示undefined的 why
            console.log(this.goodsId)
           
            this.getInfo()
        },
        methods: {
            getInfo () {
                axios({
                    url : url.getDetailGoodsInfo,
                    method : 'post',
                    data :  {
                        goodsId : this.goodsId
                        }

                }).then( (response) =>{
                 console.log(response)
                    if(response.status === 200 && response.data.message){
                         this.goodsInfo = response.data.message
                    }else{
                        Toast('找不到id,换张图片')
                    }
            
                }).catch( err => {
                    console.log(err)
                })
            },
            onClickLeft(){
                 this.$router.go(-1)  
          },
          addGoodsToCart(){
            //   取出本地购物车的商品
            let cartInfo = localStorage.cartInfo ? JSON.parse(localStorage.cartInfo) : []
            let isHaveGoods = cartInfo.find( cart => cart.goodsId == this.goodsId)
            if(!isHaveGoods){
                let newGoodsInfo = {
                    goodsId : this.goodsInfo.ID,
                    Name : this.goodsInfo.NAME,
                    price : this.goodsInfo.PRESENT_PRICE,
                    image : this.goodsInfo.IMAGE1,
                    count : 1
                }
                cartInfo.push(newGoodsInfo)
                localStorage.cartInfo = JSON.stringify(cartInfo)
                Toast.success('添加成功')
            }else{
                Toast.success('已有此商品')
            }

              this.$router.push({name:'Cart'})  //进行跳转

          },


        },
    
    }
</script>

<style  scoped>
  .goods-name .goods-price{
       background-color: #fff;
  }
  /* 清除图片间隙 */
  .detail {
      font-size : 0;
  }

/* 底栏样式 */
  .goods-bottom{
    position: fixed;   /*绝对定位*/
    bottom:0px;
    left:0px;
    background-color: #FFF;
    width:100%;
    display: flex;
    flex-direction: row;
    flex-flow: nowrap;
}
.goods-bottom > div{
    flex:1;
    padding:5px;
}
</style>