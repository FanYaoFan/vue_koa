const mongoose = require('mongoose')

const categorySchme = new mongoose.Schema({
    ID:{unique:true,type:String},
    MALL_CATEGORY_NAME:{type:String},
    IMAGE:{type:String},
    TYPE:{type:Number},
    SORT:{type:Number}, //排序
    COMMENTS:{type:String} 
})
mongoose.model('Category', categorySchme )