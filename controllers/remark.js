
const controller = require('../lib/controller').factory(__filename);
const db = require('../lib/mysql');
const Sql = require('../lib/sql');
const tool = require('../lib/tool');

controller.requestMapping('/remark');


controller.post('/insert', async (ctx,params,next) => {
    let content = params.content;
    if(!content){
        throw new Error('缺少内容！')
    }
    let fkUserId = ctx.userId;
    if(!fkUserId){
        throw new Error('权限异常！')
    }
    let sql = new Sql('remark');
    sql.set({fkUserId,content,createTime:Date.now()});
    let data = await db.insert(sql);
    ctx.body = data;
});

controller.post('/delete', async (ctx,params,next) => {
    let id = params.id;
    if(!id){
        throw new Error('缺少id！')
    }
    let fkUserId = ctx.userId;
    if(!fkUserId){
        throw new Error('权限异常！')
    }
    let sql = new Sql('remark');
    sql.whereEqual({id,fkUserId});
    let data = await db.delete(sql);
    ctx.body = data;
});

controller.post('/update', async (ctx,params,next) => {
    let content = params.content;
    let id = params.id;
    if(!content){
        throw new Error('缺少内容！')
    }
    if(!id){
        throw new Error('缺少id！')
    }
    let fkUserId = ctx.userId;
    if(!fkUserId){
        throw new Error('权限异常！')
    }
    let sql = new Sql('remark');
    sql.set({content}).whereEqual({id,fkUserId});
    let data = await db.update(sql);
    ctx.body = data;
});


controller.post('/query', async (ctx,params,next) => {
    let fkUserId = ctx.userId;
    if(!fkUserId){
        throw new Error('权限异常！')
    }
    let sql = new Sql('remark');
    let pre = Number(params.pre) || 0;
    let start = tool.getTodayStart() - pre * 24 *60 * 60* 1000;
    let end = tool.getTodayEnd() - pre * 24 *60 * 60* 1000;
    sql.whereEqual({fkUserId}).whereGtEqual({createTime:start}).whereLtEqual({createTime:end});
    let items = await db.query(sql);
    ctx.body = {
        items
    };
});







