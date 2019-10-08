<template>
    <div>
     <div class="goods-info" @click=" goGoodsPage">
        <div class="goods-image">
            <img v-lazy="goodsImage" width="90%" />
        </div>
        <div class="goods-name">{{goodsName}}</div>
        <div class="goods-price">${{goodsPrice | moneyFilter }}</div>
     </div>
    </div>
</template>

<script>
    import {toMoney} from '@/Filter/moneyFilter.js'

    export default {
        props:['goodsImage','goodsName','goodsPrice', 'goodsId'],
        filters:{
            moneyFilter(money){
                return toMoney(money)
            }  
        },
        methods: {
            goGoodsPage() {
                this.$router.push({name: 'Goods', query: { goodsId : this.goodsId}})
                //当点击 商品列表 跳转 到 商品详情页面 
                // 通过goodsId 传值  那么在哪接收呢??? 
                // 跳转的页面 就是Goods (商品详情页面来接收 id (第一次, this.goodsId 显示undefined))
            }
        },
    }
</script>

<style scoped>
    .goods-name{
        padding: 0 8px;
       overflow: hidden;
       text-overflow: ellipsis;
       white-space:nowrap; 
    }
</style>