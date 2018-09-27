
const controller = require('../lib/controller').factory(__filename);
const db = require('../lib/mysql');
const md5 = require('md5');
const userService = require('../services/user');
controller.requestMapping('/user');


controller.all('/register', async (ctx,params,next) => {
    let createTime = Date.now();
    let token = md5(`${params.password}_${createTime}`);
    let data = await db.insert('user',{
        name:params.name,
        password:md5(params.password),
        token,
        createTime
    });
    ctx.body = data;
});

controller.all('/login', async (ctx,params,next) => {
    let items = await db.query('user',{
        name:params.name,
        password:md5(params.password)
    });
    if(!items.length){
        throw new Error('用户名或密码错误')
    }
    let item = items[0],
        token = item.token;
    console.log(userService.checkToken(ctx));
    ctx.cookies.set('token', token, {
        path:'/',       // 写cookie所在的路径
        maxAge: 365 * 24 * 60 * 60 * 1000,   // cookie有效时长
        expires:new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // cookie失效时间
        httpOnly:true,  // 是否只用于http请求中获取
    });
    ctx.body = item;
});


// controller.all('/delete', async (ctx,params,next) => {
//     let data = await db.delete('user',{
//         name:'cqf1',
//         password:'pwd1',
//     });
//     ctx.body = data;
// });

// controller.all('/update', async (ctx,params,next) => {
//     let data = await db.update('user',{
//         name:'chenqifeng'
//     },{
//         id:7
//     });
//     ctx.body = data;
// });


// controller.all('/query', async (ctx,params,next) => {
//     let data = await db.query('user',{
//         id:1
//     });
//     ctx.body = data;
// });







