
const controller = require('../lib/controller').factory(__filename);
const db = require('../lib/mysql');
const Sql = require('../lib/sql');

controller.requestMapping('/demo');


controller.all('/insert', async (ctx,params,next) => {
    let sql = new Sql('user');
    sql.set({name:'cqf2',password:'pwd2',token:'token2',createTime:Date.now()});
    let data = await db.insert(sql);
    ctx.body = data;
});

controller.all('/delete', async (ctx,params,next) => {
    let sql = new Sql('user');
    sql.whereEqual({name:'cqf2',password:'pwd2'});
    let data = await db.delete(sql);
    ctx.body = data;
});

controller.all('/update', async (ctx,params,next) => {
    let sql = new Sql('user');
    sql.set({name:'chenqifeng'}).whereEqual({id:7});
    let data = await db.update(sql);
    ctx.body = data;
});


controller.all('/query', async (ctx,params,next) => {
    let sql = new Sql('user');
    let data = await db.query(sql);
    ctx.body = data;
});







