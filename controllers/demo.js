
const controller = require('../lib/controller').factory(__filename);

controller.requestMapping('/demo');

controller.get('/index', async (ctx,params,next) => {
    console.log('--------------index');
    ctx.body = {a:1};
});

