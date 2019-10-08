<template>
    <div>
        <swiper :options="swiperOption">
            <swiper-slide class="swiper-default" v-for="(item,index) in slide" :key="index">
                Slide {{item}}
            </swiper-slide>
            <div class="swiper-pagination" slot="pagination"></div>  
        </swiper>
    
    </div>
</template>

<script>
    import 'swiper/dist/css/swiper.css'
    import {swiper,swiperSlide} from 'vue-awesome-swiper'
    export default {
        data() {
            return {
                slide:[1,2,3,4,5],
                swiperOption:{
                    direction:'vertical',
                    pagination:{
                        id:'.swiper-pagination'
                    }
                }
            }
        }, 
        components: {
            swiper,swiperSlide
        },
    }
</script>

<style  scoped>
    .swiper-default{
      height: 14rem;
      text-align: center;
      padding-top: 3rem;
      border-bottom: 1px solid #ccc;
    }
</style>