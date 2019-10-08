<template>
    <div>
        
        <div class="floor">
            <div class="floor-title">{{floortitle}}</div>
          <div class="floor-anormaly">
              <div class="floor-one">
                  <img :src="floorData0.image" alt="" width="100%">
              </div>
             <div>
                  <div class="floor-two">
                  <img :src="floorData1.image" alt="" width="100%">
              </div>
              <!-- 这里还要套一个div --> 
               <div>
                  <img :src="floorData2.image" alt="" width="100%">
              </div>
             </div>
          </div>
          <div class="floor-rule">
               <div v-for="(item,index) in floorData.slice(3)" :key="index">
                   <img :src="item.image" width="100%"/>
               </div>
          </div>
     </div>
      
   

    </div>
</template>

<script>
    export default {
        // 需要传递的数
        props: ['floorData','floortitle'],
        data(){
            return {
                 floorData0:{},
                 floorData1:{},
                 floorData2:{}
            }
        },
         created(){
            //这里写得不到数据，应为数据是延迟返回的
            
        },
        watch :{
            // 数据的双向绑定 这里为什么用箭头函数就不行
            floorData:function(val){
                this.floorData0 = this.floorData[0]
                this.floorData1 = this.floorData[1]
                this.floorData2 = this.floorData[2]
            }
            //  floorData:  index => {
            //     this.floorData0 = this.floorData[0]
            //     this.floorData1 = this.floorData[1]
            //     this.floorData2 = this.floorData[2]
            // }
        }
    }
</script>

<style  scoped>
    .floortitle{
         text-align: center;
         font-size :14px;
         height: 1.8rem;
         line-height: 1.8rem;
         background-color: #fff;
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
   
</style>