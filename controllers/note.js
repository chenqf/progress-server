
const controller = require('../lib/controller').factory(__filename);
const noteService = require('../services/note');
const tool = require('../lib/tool.js')

controller.requestMapping('/note');



// 像数据库中查询结果，查到结果，返回
controller.all('/create',async(ctx,params,next) =>{
    //插入库中
    let noteItem = {
        content:params.content,
        createTime:tool.getCurrentTime()
    }
    noteItem.id = await noteService.insert(noteItem,ctx);
    //根据api插入库中
    ctx.body = noteItem;
});

// 分页查询所有单词
controller.all('/queryAll',async(ctx,params,next) =>{
    let {
        startNum = 0,
        pageCount = 10,
        startTime,
        endTime,
        pre
    } = params;
    let queryItem = {
        startNum,
        pageCount,
        pre,
        startTime:startTime ? tool.toDateStr(startTime): undefined,
        endTime:endTime ? tool.toDateStr(endTime): undefined
    }
    //获取数据
    let data = await noteService.queryAll(queryItem,ctx)
    //获取总条数
    let count = await noteService.countAll(queryItem,ctx)

    ctx.body = {
        data,
        count
    }
});

//删除
controller.all('/delete',async(ctx,params,next) =>{
    let {
        id
    } = params;
    if(!id){
        throw new Error('参数有误')
    }
    //获取数据
    let data = await noteService.delete(id,ctx)
    
    if(!data){
        throw new Error('数据不存在')
    }
    
    ctx.body = data;
});

//修改内容
controller.all('/update',async(ctx,params,next) =>{
    let {
        id,
        content,
        createTime
    } = params;
    if(!id){
        throw new Error('参数有误')
    }
    //获取数据
    let data = await noteService.update({
        id,
        content
        // ,
        // createTime:tool.toDateStr(createTime)
    },ctx)
    
    // if(!data){
    //     throw new Error('数据不存在')
    // }
    ctx.body = data;
});










