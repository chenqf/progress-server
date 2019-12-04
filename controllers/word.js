
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
        explains
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
        explains
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

    if(pageCount){
        throw new Error('参数有误')
    }
    
    //获取数据
    let data = await wordService.random({pageCount,level},ctx)
    
    if(!data){
        throw new Error('数据不存在')
    }
    
    ctx.body = data;
});




















// controller.all('/getAudioToken',async(ctx,params,next) =>{
//     let data = await wordService.getAudioToken(ctx);
//     ctx.body = data;
// });

// controller.all('/base/search',async(ctx,params,next) =>{
//     if(!params.q){
//         throw new Error('请输入要查询的单词')
//     }
//     let data = await wordService.baseSearch(params.q,ctx)
//     ctx.body = data;
// });

// controller.post('/search',async(ctx,params,next) =>{
//     if(!params.q){
//         throw new Error('请输入要查询的单词')
//     }
//     let data = await wordService.search(params.q,ctx);
//     ctx.body = data;
// });

// controller.post('/queryByPreDate', async (ctx,params,next) => {
//     let pre = Number(params.pre) || 0;
//     let items =  await wordService.queryByPreDate(pre,ctx);
//     ctx.body = { items,totalCount:items.length };
// });

// /**
//  * 查询用户下的所有单词
//  */
// controller.post('/queryAll', async (ctx,{startNum = 0,pageCount = 10},next) => {
//     let items =  await wordService.queryAll(startNum,pageCount,ctx);
//     let count =  await wordService.queryAllCount(ctx);
//     ctx.body = { items,count};
// });

// controller.post('/queryHard', async (ctx,{startNum = 0,pageCount = 10},next) => {
//     let items =  await wordService.queryHard(startNum,pageCount,ctx);
//     let count =  await wordService.queryHardCount(ctx);
//     ctx.body = { items,count};
// });




// controller.post('/queryAllCount', async (ctx,params,next) => {
//     let count =  await wordService.queryAllCount(ctx);
//     ctx.body = { count};
// });

// controller.post('/queryHardCount', async (ctx,params,next) => {
//     let count =  await wordService.queryHardCount(ctx);
//     ctx.body = { count};
// });


// controller.post('/queryAllReview', async (ctx,{startNum = 0,pageCount = 10},next) => {
//     let items =  await wordService.queryAllReview(ctx);
//     ctx.body = { items,count:items.length};
// });


// /**
//  * 更新 user_word 的创建时间
//  */
// controller.post('/updateCreateTime', async (ctx,{id,createTime},next) => {
//     if(!id || !createTime){
//         throw new Error('缺少参数！')
//     }
//     let sql = new Sql('user_word');
//     sql.set({createTime}).whereEqual({id});
//     let data = await db.update(sql);
//     ctx.body = data;
// });

// /**
//  * 更新 user_word 的单词级别
//  */
// controller.post('/updateLevel', async (ctx,{id,level},next) => {
//     if(!id || !level){
//         throw new Error('缺少参数！')
//     }
//     let sql = new Sql('user_word');
//     sql.set({level:Number(level)}).whereEqual({id});
//     let data = await db.update(sql);
//     ctx.body = data;
// });



// controller.post('/delete', async (ctx,params,next) => {
//     let fkUserId = ctx.userId;
//     if(!params.wordId){
//         throw new Error('缺少wordId')
//     }
//     let sql = new Sql('user_word');
//     sql.whereEqual({fkUserId,fkWordId:params.wordId});
//     let data = await db.delete(sql);
//     ctx.body = data;
// });




// /**
//  * 随机选取count条数据
//  */
// controller.post('/queryRandom', async (ctx,params,next) => {
//     let count = params.count || 5;
//     let items =  await wordService.queryRandom(count,ctx);
//     ctx.body = { items };
// });







