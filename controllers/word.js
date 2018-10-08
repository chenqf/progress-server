
const controller = require('../lib/controller').factory(__filename);
const db = require('../lib/mysql');
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
    // let totalCount =  await wordService.queryByPreDateCount(pre,ctx);
    ctx.body = { items,totalCount:items.length };
});

controller.post('/queryAll', async (ctx,params,next) => {
    let items =  await wordService.queryAll(ctx);
    ctx.body = { items,totalCount:items.length };
});


controller.post('/queryReview', async (ctx,params,next) => {
    let items = await Promise.all([
        wordService.queryByPreDate(1,ctx),
        wordService.queryByPreDate(2,ctx),
        wordService.queryByPreDate(4,ctx),
        wordService.queryByPreDate(7,ctx),
        wordService.queryByPreDate(15,ctx),
        wordService.queryByPreDate(30,ctx),
    ]);
    console.log(items);
    ctx.body = {items}
});


controller.post('/queryReviewNum', async (ctx,params,next) => {
    let items = await Promise.all([
        wordService.queryByPreDate(1,ctx),
        wordService.queryByPreDate(2,ctx),
        wordService.queryByPreDate(4,ctx),
        wordService.queryByPreDate(7,ctx),
        wordService.queryByPreDate(15,ctx),
        wordService.queryByPreDate(30,ctx),
    ]);

    ctx.body = items.map((list)=>list.length);
});





controller.post('/queryRandom', async (ctx,params,next) => {
    let items =  await wordService.queryRandom(ctx);
    ctx.body = { items };
});







