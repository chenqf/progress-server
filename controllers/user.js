



const controller = require('../lib/controller').factory(__filename);
const db = require('../lib/mysql');

controller.requestMapping('/user');

controller.all('/register', async (ctx,params,next) => {
    let data = await db.exec('SELECT * from user;');
    ctx.body = data;
});

