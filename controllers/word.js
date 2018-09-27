
const controller = require('../lib/controller').factory(__filename);
const db = require('../lib/mysql');
controller.requestMapping('/word');


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


controller.all('/query', async (ctx,params,next) => {
    let data = await db.query('word');
    ctx.body = data;
});







