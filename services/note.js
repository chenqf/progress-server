// @flow Created by 陈其丰 on 2018/9/27.

const db = require('../lib/mysql');
const tool = require('../lib/tool');
const Sql = require('../lib/sql');
const config = require('../config');




// 分页查询所有单词

exports.queryAll = async function(queryItem,ctx){
    let {
        startNum = 0,
        pageCount = 10,
        pre,
        startTime,
        endTime,
        order = 'DESC',
        content
    } = queryItem;
    let sql = new Sql('note');
    sql.limit(startNum,pageCount)
    content && sql.whereEqual({content})
    if(pre){
        sql.whereGtEqual({createTime:tool.toDateStartStrByPre(pre)})
        sql.whereLtEqual({createTime:tool.toDateEndStrByPre(pre)})
    }
    else{
        if(startTime){
            sql.whereGtEqual({createTime:tool.toDateStr(startTime)})
        }
        if(endTime){
            sql.whereLtEqual({createTime:tool.toDateStr(endTime)})
        }
    }
    if(order === 'DESC'){
        sql.orderByDESC('createTime');
    }else if(order === 'ASC'){
        sql.orderByASC('createTime');
    }
    return await db.query(sql);
}

exports.countAll = async function(queryItem,ctx){
    let {
        pre,
        startTime,
        endTime,
        content
    } = queryItem;
    let sql = new Sql('note');
    content && sql.whereEqual({content})
    if(pre){
        sql.whereGtEqual({createTime:tool.toDateStartStrByPre(pre)})
        sql.whereLtEqual({createTime:tool.toDateEndStrByPre(pre)})
    }else{
        startTime && sql.whereGtEqual({createTime:tool.toDateStr(startTime)})
        endTime && sql.whereLtEqual({createTime:tool.toDateStr(endTime)})
    }
    return await db.count(sql);
}

exports.delete = async function(id,ctx){
    let sql = new Sql('note');
    sql.whereEqual({id});
    return await db.delete(sql);
}

//插入数据库
exports.insert = async function (noteItem,ctx) {
    let sql = new Sql('note');
    sql.set(noteItem);
    return await db.insert(sql);
}

exports.update = async function(noteItem,ctx){
    let sql = new Sql('note');
    sql.set(noteItem).whereEqual({id:noteItem.id})
    return await db.update(sql);
}
