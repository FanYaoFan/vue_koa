<template>
  <div>
    <div class="navbar-div">
      <van-nav-bar title="购物车"></van-nav-bar>
      <!--清空购物车-->
      <div class="card-title">
        <van-button size="small" type="danger" @click="clearCart" plain>清空购物车</van-button>
      </div>
    </div>

    <!-- 显示购物车的商品 -->
    <div class="cart-list">
      <div class="f-row" v-for="(item,index) in cartInfo" :key="index">
        <div class="f-img">
          <img :src="item.image" width="100%" />
        </div>
        <div class="f-text">
          <div class="f-goods-name"></div>
          <div class="f-control">
            <van-stepper v-model="item.count"></van-stepper>
          </div>
        </div>
        <div class="f-price">
          <div>￥{{item.price |moneyFilter}}</div>
          <div>x{{item.count}}</div>
          <div class="allPrice">￥{{item.price*item.count | moneyFilter}}</div>
        </div>
      </div>
    </div>
    <!-- 显示总价格 -->

     <div class="totalMoney">
         商品总结 : $ {{ totalMoney | moneyFilter}}
     </div>

  </div>
</template>

<script>
import { toMoney } from "@/Filter/moneyFilter.js";
export default {
  data() {
    return {
      cartInfo: [],
      isEmpty: false
    };
  },
  computed : {
      totalMoney(){
          let allMoney = 0
          this.cartInfo.forEach(  (item,inndex) => {
              allMoney += item.price * item.count
          });
           localStorage.cartInfo=JSON.stringify(this.cartInfo)
            // 保存的是json格式
            return allMoney

      }
  },
  filters: {
    moneyFilter(money) {
      return toMoney(money);
    }
  },
  created() {
    this.getCartInfo();
  },
  methods: {
    // 得到购物车信息
    getCartInfo() {
      if (localStorage.cartInfo) {
        this.cartInfo = JSON.parse(localStorage.cartInfo);
      }
      this.isEmpty = this.cartInfo.length > 0 ? true : false;
    },
    clearCart() {
      localStorage.removeItem("cartInfo");
      this.cartInfo = [];
    }
  }
};
</script>

<style  scoped>
.card-title {
  height: 2rem;
  line-height: 2rem;
  background-color: #fff;
  border-bottom: 1px solid #e4e7ed;
  padding: 5px;
  text-align: right;
}
.cart-list {
  background-color: #fff;
}
.f-row {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  padding: 0.5rem;
  font-size: 0.85rem;
  border-bottom: 1px solid #e4e7ed;
}
.f-img {
  flex: 6;
}
.f-text {
  flex: 14;
  padding-left: 10px;
}
.f-control {
  padding-top: 10px;
}
.f-price {
  flex: 4;
  text-align: right;
}
.allPrice {
    color : red;
}

/* 商品总价格计算样式 */
.totalMoney{
    text-align: right;
    background-color: #fff;
     border-bottom:1px solid #E4E7ED;
     padding: 5px;
}
</style>
