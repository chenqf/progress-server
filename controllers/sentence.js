
const controller = require('../lib/controller').factory(__filename);
const db = require('../lib/mysql');
const Sql = require('../lib/sql');
const tool = require('../lib/tool');

controller.requestMapping('/sentence');


controller.post('/insert', async (ctx,params,next) => {
    let content = params.content;
    let explain = params.explain;
    if(!content || !explain){
        throw new Error('缺少内容！')
    }
    let sql = new Sql('sentence');
    sql.set({content,explain,createTime:Date.now()});
    let data = await db.insert(sql);
    ctx.body = data;
});

controller.post('/queryByPreDate', async (ctx,params,next) => {
    let sql = new Sql('sentence');
    let pre = Number(params.pre) || 0;
    let start = tool.getTodayStart() - pre * 24 *60 * 60* 1000;
    let end = tool.getTodayEnd() - pre * 24 *60 * 60* 1000;
    sql.whereGtEqual({createTime:start}).whereLtEqual({createTime:end});
    let items = await db.query(sql);
    ctx.body = {
        items
    };
});


