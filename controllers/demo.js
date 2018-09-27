
const controller = require('../lib/controller').factory(__filename);

controller.requestMapping('/demo');

controller.all('/index', async (ctx,params,next) => {
    console.log(params);
    ctx.body = {a:1};
});

