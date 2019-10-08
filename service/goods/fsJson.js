const fs = require ('fs')
fs.readFile('./goods.json' , 'utf8' , function(err,data){
    let newDate = JSON.parse(data)  // json => js 
    let pushData = []
    newDate.RECORDS.map( function(value,index){
        if(value.IMAGE1 != null){
            pushData.push(value)
        }
    })
    // 以上是提纯 
    
    fs.writeFile('./newGood.json' , JSON.stringify(pushData), function(err){
        if(err) console.log('写文件操作失败');
        else console.log('写文件操作成功');
    })
})