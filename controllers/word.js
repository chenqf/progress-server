
const controller = require('../lib/controller').factory(__filename);
const wordService = require('../services/word');
const tool = require('../lib/tool.js')

controller.requestMapping('/word');


// 查词，直接返回有道结果
controller.all('/baseSearch',async(ctx,params,next) =>{
    let data = await wordService.queryByApi(params.q,ctx);
    ctx.body = data;
});

// 像数据库中查询结果，查到结果，返回
controller.all('/search',async(ctx,params,next) =>{
    //库中存在，直接返回
    let data = await wordService.queryByDb(params.q,ctx);
    if(data.length){
        ctx.body = data[0];
        return ;
    }

    //库中不存在，查询api
    let result = await wordService.queryByApi(params.q,ctx);
    if(!result.query){
        throw new Error('查询API失败')
    }
    //插入库中
    let {
        'us-phonetic':usPhonetic,
        'uk-phonetic':ukPhonetic,
        phonetic,
        explains,
    } = result.basic;

    //插入库中
    let wordItem = {
        name:params.q,
        usPhonetic,
        phonetic,
        ukPhonetic,
        explains:explains.join('；'),
        level:1,
        createTime:tool.getCurrentTime()
    }
    wordItem.id = await wordService.insert(wordItem,ctx);
    //根据api插入库中
    ctx.body = wordItem;
});

// 分页查询所有单词
controller.all('/queryAll',async(ctx,params,next) =>{
    let {
        startNum = 0,
        pageCount = 10,
        level,
        startTime,
        endTime,
        pre,
        content
    } = params;
    let queryItem = {
        startNum,
        pageCount,
        level,
        pre,
        startTime:startTime ? tool.toDateStr(startTime): undefined,
        endTime:endTime ? tool.toDateStr(endTime): undefined,
        content
    }
    //获取数据
    let data = await wordService.queryAll(queryItem,ctx)
    //获取总条数
    let count = await wordService.countAll(queryItem,ctx)

    ctx.body = {
        data,
        count
    }
});

//删除
controller.all('/delete',async(ctx,params,next) =>{
    let {
        id
    } = params;
    if(!id){
        throw new Error('参数有误')
    }
    //获取数据
    let data = await wordService.delete(id,ctx)
    
    if(!data){
        throw new Error('数据不存在')
    }
    
    ctx.body = data;
});

//修改内容
controller.all('/update',async(ctx,params,next) =>{
    let {
        id,
        name,
        usPhonetic,
        phonetic,
        ukPhonetic,
        explains,
        createTime
    } = params;
    if(!id){
        throw new Error('参数有误')
    }
    //获取数据
    let data = await wordService.update({
        id,
        name,
        usPhonetic,
        phonetic,
        ukPhonetic,
        explains,
        createTime:tool.toDateStr(createTime)
    },ctx)
    
    if(!data){
        throw new Error('数据不存在')
    }
    ctx.body = data;
});

//修改等级
controller.all('/updateLevel',async(ctx,params,next) =>{
    let {
        id,
        level
    } = params;
    if(!id || !level){
        throw new Error('参数有误')
    }
    //获取数据
    let data = await wordService.update({id,level},ctx)
    
    if(!data){
        throw new Error('数据不存在')
    }
    
    ctx.body = data;
});

// 随机查询单词
controller.all('/random',async(ctx,params,next) =>{
    let {
        pageCount,
        level
    } = params;

    if(!pageCount){
        throw new Error('参数有误')
    }
    
    //获取数据
    let data = await wordService.random({pageCount,level},ctx)
    
    if(!data){
        throw new Error('数据不存在')
    }
    
    ctx.body = data;
});







