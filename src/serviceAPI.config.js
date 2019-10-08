const BASEURL = "https://www.easy-mock.com/mock/5cab1e59c0af8d1b182a4120/smart/"
const LOCALURL = "http://localhost:3000/"
const URL = {
    // getShoppingMallInfo : BASEURL + 'index', //商城引用
    getGoodsInfo : BASEURL+'getGoodsInfo',

    getShoppingMallInfo : LOCALURL + 'goods/base',
    
    registerUser : LOCALURL+'user/register',  // 用户注册接口
    LoginUser : LOCALURL+'user/login',   //用户登录接口
    getDetailGoodsInfo : LOCALURL + 'goods/getDetailGoodsInfo' ,//获取商品详情接口
    getCategoryList : LOCALURL + 'goods/getCategoryList' , //得到大类信息
    getCategorySublist : LOCALURL + 'goods/getCategorySublist', //得到小类信息
    getGoodsSubID : LOCALURL + 'goods/getGoodsSubID',  //得到商品右侧的list数据
    base : LOCALURL + 'SubId/base'
}
module.exports = URL
