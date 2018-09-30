
const controller = require('../lib/controller').factory(__filename);
const db = require('../lib/mysql');
const wordService = require('../services/word');

controller.requestMapping('/word');


controller.all('/base/search',async(ctx,params,next) =>{
    if(!params.q){
        throw new Error('请输入要查询的单词')
    }
    let data = await wordService.baseSearch(params.q,ctx)
    ctx.body = data;
});

controller.all('/search',async(ctx,params,next) =>{
    if(!params.q){
        throw new Error('请输入要查询的单词')
    }
    let data = await wordService.search(params.q,ctx);
    ctx.body = data;
});

controller.all('/queryByPreDate', async (ctx,params,next) => {
    let pre = Number(params.pre) || 0;
    let items =  await wordService.queryByPreDate(pre,params.startNum,params.pageCount,params.order,ctx);
    // let totalCount =  await wordService.queryByPreDateCount(pre,ctx);
    ctx.body = { items,totalCount:items.length };
});

controller.all('/queryRandom', async (ctx,params,next) => {
    let items =  await wordService.queryRandom(ctx);
    ctx.body = { items };
});







