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
