
const controller = require('../lib/controller').factory(__filename);
const db = require('../lib/mysql');
const md5 = require('md5');
const Sql = require('../lib/sql');
controller.requestMapping('/user');


controller.all('/register', async (ctx,params,next) => {
    if(!params.name || !params.password){
        throw new Error('用户名密码不可为空')
    }
    let createTime = Date.now();
    let token = md5(`${params.password}_${createTime}`);
    let sql = new Sql('user');
    sql.set({name:params.name,password:md5(params.password),token,createTime});
    let data = await db.insert(sql);
    ctx.body = data;
});

controller.all('/login', async (ctx,params,next) => {
    let sql = new Sql('user');
    sql.whereEqual({name:params.name,password:md5(params.password)});
    let items = await db.query(sql);
    if(!items.length){
        throw new Error('用户名或密码错误')
    }
    let item = items[0],
        token = item.token;
    ctx.cookies.set('token', token, {
        path:'/',       // 写cookie所在的路径
        maxAge: 365 * 24 * 60 * 60 * 1000,   // cookie有效时长
        expires:new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // cookie失效时间
        httpOnly:true,  // 是否只用于http请求中获取
    });
    ctx.body = item;
});






