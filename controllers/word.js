
const controller = require('../lib/controller').factory(__filename);
const db = require('../lib/mysql');
const Sql = require('../lib/sql');
const wordService = require('../services/word');

controller.requestMapping('/word');


controller.post('/base/search',async(ctx,params,next) =>{
    if(!params.q){
        throw new Error('请输入要查询的单词')
    }
    let data = await wordService.baseSearch(params.q,ctx)
    ctx.body = data;
});

controller.post('/search',async(ctx,params,next) =>{
    if(!params.q){
        throw new Error('请输入要查询的单词')
    }
    let data = await wordService.search(params.q,ctx);
    ctx.body = data;
});

controller.post('/queryByPreDate', async (ctx,params,next) => {
    let pre = Number(params.pre) || 0;
    let items =  await wordService.queryByPreDate(pre,ctx);
    ctx.body = { items,totalCount:items.length };
});

/**
 * 查询用户下的所有单词
 */
controller.post('/queryAll', async (ctx,{startNum = 0,pageCount = 10},next) => {
    let items =  await wordService.queryAll(startNum,pageCount,ctx);
    let count =  await wordService.queryAllCount(ctx);
    ctx.body = { items,count};
});


controller.post('/queryAllReview', async (ctx,{startNum = 0,pageCount = 10},next) => {
    let items =  await wordService.queryAllReview(ctx);
    ctx.body = { items,count:items.length};
});

/**
 * 更新 user_word 的创建时间
 */
controller.post('/updateCreateTime', async (ctx,{id,createTime},next) => {
    if(!id || !createTime){
        throw new Error('缺少参数！')
    }
    let sql = new Sql('user_word');
    sql.set({createTime}).whereEqual({id});
    let data = await db.update(sql);
    ctx.body = data;
});



controller.post('/delete', async (ctx,params,next) => {
    let fkUserId = ctx.userId;
    if(!params.wordId){
        throw new Error('缺少wordId')
    }
    let sql = new Sql('user_word');
    sql.whereEqual({fkUserId,fkWordId:params.wordId});
    let data = await db.delete(sql);
    ctx.body = data;
});




/**
 * 随机选取count条数据
 */
controller.post('/queryRandom', async (ctx,params,next) => {
    let count = params.count || 5;
    let items =  await wordService.queryRandom(count,ctx);
    ctx.body = { items };
});







