// @flow Created by 陈其丰 on 2018/9/27.

const Koa = require('koa');
const path = require('path');
const Router = require('koa-router');
const filesTree = require('files-tree');
const bodyParser = require('koa-bodyparser');
const koaStatic = require('koa-static');
const app = new Koa();
const staticPath = './static';
const config = require('./config');
const controller = require('./lib/controller');
const userService = require('./services/user');

require('./lib/pool')

app.use(bodyParser());//解析post请求中的参数


app.use(async function ( ctx, next) {
    let query = Object.assign({},ctx.query,ctx.request.body);
    ctx.params = query;
    await next();
});

app.use( async function ( ctx, next)  {
    ctx.set('Access-Control-Allow-Credentials', 'true');
    ctx.set('Access-Control-Allow-Origin', '*');
    ctx.set('Access-Control-Allow-Headers', 'X-Requested-With');
    ctx.set('Access-Control-Allow-Methods','PUT,POST,GET,DELETE,OPTIONS');
    ctx.set('X-Powered-By',' 3.2.1');
    await next();
});

app.use( async function ( ctx, next ) {
    //先去执行路由
    try{
        await next();
        ctx.body = {
            code: 0,
            success:true,
            data: ctx.body || [],
            timestamp:Date.now()
        };
    }catch(error){
        ctx.status = 200;
        ctx.body = {
            success:false,
            code: error.code ? error.code : -1,
            message: typeof error === 'string' ? error : error.message,
            timestamp:Date.now()
        };
        setTimeout(()=>{
            throw error;
        },50);
    }
});
/*先校验是否登录了*/
app.use(async function ( ctx, next) {
    if(ctx.path !== '/user/register' && ctx.path !== '/user/login' && ctx.path !== '/user/check'){
        let data = await userService.checkToken(ctx);
        ctx.userId = data.id;
    }
    await next();
});

app.use(koaStatic(path.join( __dirname,  staticPath)));


/*------------加载路由--------------*/
let pageList = filesTree.allFile(path.resolve(__dirname, './controllers'));
pageList.forEach(function (item) {
    let path = item.path;
    require(path);
});
let router = new Router();
let controllerList = controller.controllerList();
controllerList.forEach(function (controller) {
    router.use(controller.requestMappingValue, controller.router.routes(), controller.router.allowedMethods());
});
// 加载路由中间件
app.use(router.routes()).use(router.allowedMethods());
/*------------加载路由--------------*/



app.listen(config.PORT, function () {
    console.log(`Service startup successful：${config.PORT}`);
});
