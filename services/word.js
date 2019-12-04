// @flow Created by 陈其丰 on 2018/9/27.

const db = require('../lib/mysql');
const axios = require('axios');
const tool = require('../lib/tool');
const Sql = require('../lib/sql');
const config = require('../config');
const crypto = require('crypto');
const querystring = require("querystring");

const APP_KEY = config.WORD_APP_KEY;
const KEY = config.WORD_KEY;
const FROM = 'EN';
const TO = 'zh-CHS';


// 查词，直接返回有道结果
exports.queryByApi = async function (word,ctx) {
    let salt = (new Date).getTime();
    let curTime = Math.round(new Date().getTime()/1000);
    let str1 = APP_KEY + tool.truncate(word) + salt + curTime + KEY;
    let sha256 = crypto.createHash('sha256');//定义加密方式:md5不可逆,此处的md5可以换成任意hash加密的方法名称；
    sha256.update(str1);
    let sign = sha256.digest('hex');  //加密后的值d
    let url = `http://openapi.youdao.com/api`;
    let res = querystring.stringify({
        q:encodeURI(word),
        appKey: APP_KEY,
        salt: salt,
        from: FROM,
        to: TO,
        sign: sign,
        signType: "v3",
        curtime: curTime,
    })
    let response = await axios.get(url + '?' + res);
    return response.data;
}



// 像数据库中查询结果，查到结果，返回
exports.queryByDb = async function (word,ctx) {
    let wordSql = new Sql('word').whereEqual({name:word});
    return await db.query(wordSql);
}

// 查词，返回有道结果，插入数据库
exports.insert = async function (wordItem,ctx) {
    let sql = new Sql('word');
    sql.set(wordItem);
    return await db.insert(sql);
}

// 分页查询所有单词

exports.queryAll = async function(queryItem,ctx){
    let {
        startNum,
        pageCount,
        level,
        pre,
        startTime,
        endTime,
        content
    } = queryItem;
    let sql = new Sql('word');
    sql.limit(startNum,pageCount)
        .whereEqual({level,name:content})
    if(pre){
        sql.whereGtEqual({createTime:tool.toDateStartStrByPre(pre)})
        sql.whereLtEqual({createTime:tool.toDateEndStrByPre(pre)})
    }
    else if(startTime){
        sql.whereGtEqual({createTime:tool.toDateStr(startTime)})
    }else if(endTime){
        sql.whereLtEqual({createTime:tool.toDateStr(endTime)})
    }
    return await db.query(sql);
}

exports.countAll = async function({startNum = 0,pageCount = 10},ctx){
    let {
        startNum,
        pageCount,
        level,
        pre,
        startTime,
        endTime,
        content
    } = queryItem;
    let sql = new Sql('word');
    sql.limit(startNum,pageCount)
        .whereEqual({level,name:content})
    if(pre){
        sql.whereGtEqual({createTime:tool.toDateStartStrByPre(pre)})
        sql.whereLtEqual({createTime:tool.toDateEndStrByPre(pre)})
    }
    else if(startTime){
        sql.whereGtEqual({createTime:tool.toDateStr(startTime)})
    }else if(endTime){
        sql.whereLtEqual({createTime:tool.toDateStr(endTime)})
    }
    return await db.count(sql);
}

exports.delete = async function(id,ctx){
    let sql = new Sql('word');
    sql.whereEqual({id});
    return await db.delete(sql);
}

exports.update = async function(wordItem,ctx){
    let sql = new Sql('word');
    sql.set(wordItem).whereEqual({id:wordItem.id})
    return await db.update(sql);
}

// 随机查询单词
exports.random = async function({level,pageCount},ctx){
    let sql = new Sql('word');
    if(level){
        sql.whereEqual(level)
    }
    sql.random(pageCount);
    return await db.query(sql);
}


























// exports.getAudioToken = async function () {
//     let url = `http://openapi.baidu.com/oauth/2.0/token?grant_type=client_credentials&client_id=${AUDIO_API_KEY}&client_secret=${AUDIO_SECRET_KEY}`
//     let response = await axios.get(url);
//     return response.data;
// };

// // 应用ID 51a433fdcbf4ab82
// // 应用秘钥 GO8nt8g99GFycXOgmJA0dC7oeP5zW8Og
// exports.baseSearch = async function (word,ctx) {
//     //英音地址：https://dict.youdao.com/dictvoice?audio=apple&type=1
//     //美音地址：https://dict.youdao.com/dictvoice?audio=apple&type=2
//     //API文档：https://ai.youdao.com/DOCSIRMA/html/%E8%87%AA%E7%84%B6%E8%AF%AD%E8%A8%80%E7%BF%BB%E8%AF%91/API%E6%96%87%E6%A1%A3/%E6%96%87%E6%9C%AC%E7%BF%BB%E8%AF%91%E6%9C%8D%E5%8A%A1/%E6%96%87%E6%9C%AC%E7%BF%BB%E8%AF%91%E6%9C%8D%E5%8A%A1-API%E6%96%87%E6%A1%A3.html
//     //应用Id
    
// };
// /**
//  * 查询单词
//  */
// exports.search = async function (word,ctx) {
//     let fkUserId = ctx.userId;
//     let wordSql = new Sql('word').whereEqual({text:word});

//     let results = await db.query(wordSql);    //单词表中的记录

//     if(results.length){
//         let wordItem = results[0];
//         let fkWordId = wordItem.id; // 单词id
//         let userWordSql = new Sql('user_word').whereEqual({fkUserId,fkWordId});
//         let res = await db.query(userWordSql);// 用户单词表中的记录
//         //不存在用户单词表中的记录
//         if(!res.length){
//             wordItem.new = true;
//             userWordSql.set({fkUserId,fkWordId,createTime:Date.now()});
//             let userWordId = await db.insert(userWordSql);
//             wordItem.userWordId = userWordId;
//             wordItem.level = 0;
//             wordItem.createTime = Date.now();
//         }
//         //存在用户单词表中的记录
//         else{
//             wordItem.userWordId = res[0].id;
//             wordItem.level = res[0].level;
//             wordItem.createTime = res[0].createTime;
//         }
//         return wordItem;
//     }


//     let sign = md5(`${APP_KEY}${word}${SALT}${KEY}`);
//     let url = `http://openapi.youdao.com/api?q=${encodeURI(word)}&from=${FROM}&to=${TO}&appKey=${APP_KEY}&salt=${SALT}&sign=${sign}`;
//     let response = await axios.get(url);
//     try{
//         let basic = response.data.basic;
//         let webdict = response.data.webdict || {};
//         let usPhonetic = basic['us-phonetic'] || basic['uk-phonetic'] || basic['phonetic'];
//         let ukPhonetic = basic['uk-phonetic'] || basic['us-phonetic'] || basic['phonetic'];
//         let phonetic = basic['phonetic'] || basic['us-phonetic'] || basic['uk-phonetic'] ;
//         let explains = JSON.stringify(basic.explains);
//         let dictUrl = webdict.url;
//         let wfs = JSON.stringify(basic.wfs || []);
//         let params = {fkUserId,text:word,usPhonetic,ukPhonetic,phonetic,randomReview:0,explains,dictUrl,wfs,createTime:Date.now()};
//         let sql = new Sql('word').set(params);
//         let id = await db.insert(sql);

//         let userWordSql = new Sql('user_word').set({fkUserId,fkWordId:id,createTime:Date.now()});
//         let userWordId = await db.insert(userWordSql);
//         return Object.assign({id,'new':true,userWordId,level:0},params)
//     }catch (err){
//         throw new Error('查询的单词有误')
//     }
// };





// exports.queryByPreDate = async function (pre = 0,ctx) {
//     let fkUserId = ctx.userId;
//     let start = tool.getTodayStart() - pre * 24 *60 * 60* 1000;
//     let end = tool.getTodayEnd() - pre * 24 *60 * 60* 1000;
//     let sql = `SELECT 
//                     w.dict_url , 
//                     w.explains ,
//                     w.id ,
//                     w.phonetic ,
//                     w.text ,
//                     w.uk_phonetic ,
//                     w.us_phonetic ,
//                     w.wfs , 
//                     uw.create_time , 
//                     uw.id as user_word_id ,
//                     uw.level
//                 FROM 
//                     user_word uw, word w 
//                 WHERE 
//                     uw.fk_word_id = w.id 
//                 AND  
//                     uw.fk_user_id = ${fkUserId} 
//                 AND 
//                     uw.create_time >= ${start} 
//                 AND 
//                     uw.create_time <= ${end} 
//                 ORDER BY 
//                     uw.id ASC `;

//     let items = await db.queryBySql(sql);
//     return items;
// };


// exports.queryAllReview = async function (ctx) {
//     let fkUserId = ctx.userId;
//     let start = tool.getTodayStart();
//     let end = tool.getTodayEnd();
//     let sql = `SELECT 
//                     w.dict_url , 
//                     w.explains ,
//                     w.id ,
//                     w.phonetic ,
//                     w.text ,
//                     w.uk_phonetic ,
//                     w.us_phonetic ,
//                     w.wfs , 
//                     uw.create_time , 
//                     uw.id as user_word_id ,
//                     uw.level
//                 FROM 
//                     user_word uw, word w 
//                 WHERE 
//                     uw.fk_word_id = w.id 
//                 AND  
//                     uw.fk_user_id = ${fkUserId} 
//                 AND
//                     (      uw.create_time >= ${start - 24 *60 * 60* 1000} 
//                         AND 
//                             uw.create_time <= ${end - 24 *60 * 60* 1000} 
//                         OR
//                             uw.create_time >= ${start - 2 * 24 *60 * 60* 1000} 
//                         AND 
//                             uw.create_time <= ${end - 2 * 24 *60 * 60* 1000} 
//                         OR
//                             uw.create_time >= ${start - 4 * 24 *60 * 60* 1000} 
//                         AND 
//                             uw.create_time <= ${end - 4 * 24 *60 * 60* 1000} 
//                         OR
//                             uw.create_time >= ${start - 7 * 24 *60 * 60* 1000} 
//                         AND 
//                             uw.create_time <= ${end - 7 * 24 *60 * 60* 1000} 
//                         OR
//                             uw.create_time >= ${start - 15 * 24 *60 * 60* 1000} 
//                         AND 
//                             uw.create_time <= ${end - 15 * 24 *60 * 60* 1000} 
//                         OR
//                             uw.create_time >= ${start - 30 * 24 *60 * 60* 1000} 
//                         AND 
//                             uw.create_time <= ${end - 30 * 24 *60 * 60* 1000} 
//                     )
//                 ORDER BY 
//                     uw.id DESC `;

//     let items = await db.queryBySql(sql);
//     return items;
// };




// exports.queryAll = async function (startNum,pageCount,ctx) {
//     let fkUserId = ctx.userId;
//     let sql = `SELECT 
//                     w.dict_url , 
//                     w.explains ,
//                     w.id ,
//                     w.phonetic ,
//                     w.text ,
//                     w.uk_phonetic ,
//                     w.us_phonetic ,
//                     w.wfs , 
//                     uw.create_time , 
//                     uw.id as user_word_id ,
//                     uw.level
//                 FROM 
//                     user_word uw, word w 
//                 WHERE 
//                     uw.fk_word_id = w.id 
//                 AND  
//                     uw.fk_user_id = ${fkUserId} 
//                 ORDER BY 
//                     uw.create_time DESC 
//                 LIMIT
//                     ${startNum},${pageCount}
//                 `;
//     let items = await db.queryBySql(sql);
//     return items;
// };


// exports.queryHard = async function (startNum,pageCount,ctx) {
//     let fkUserId = ctx.userId;
//     let sql = `SELECT 
//                     w.dict_url , 
//                     w.explains ,
//                     w.id ,
//                     w.phonetic ,
//                     w.text ,
//                     w.uk_phonetic ,
//                     w.us_phonetic ,
//                     w.wfs , 
//                     uw.create_time , 
//                     uw.id as user_word_id ,
//                     uw.level
//                 FROM 
//                     user_word uw, word w 
//                 WHERE 
//                     uw.fk_word_id = w.id 
//                 AND  
//                     uw.level = 1
//                 AND
//                     uw.fk_user_id = ${fkUserId} 
//                 ORDER BY 
//                     uw.create_time DESC 
//                 LIMIT
//                     ${startNum},${pageCount}
//                 `;
//     let items = await db.queryBySql(sql);
//     return items;
// };

// exports.queryAllCount = async function (ctx) {
//     let fkUserId = ctx.userId;
//     let sql = `SELECT 
//                     count(*) as count
//                 FROM 
//                     user_word uw, word w 
//                 WHERE 
//                     uw.fk_word_id = w.id 
//                 AND  
//                     uw.fk_user_id = ${fkUserId} 
//                 `;
//     let count = await db.countBySql(sql);
//     return count;
// };

// exports.queryHardCount = async function (ctx) {
//     let fkUserId = ctx.userId;
//     let sql = `SELECT 
//                     count(*) as count
//                 FROM 
//                     user_word uw, word w 
//                 WHERE 
//                     uw.fk_word_id = w.id 
//                 AND  
//                     uw.level = 1
//                 AND  
//                     uw.fk_user_id = ${fkUserId} 
//                 `;
//     let count = await db.countBySql(sql);
//     return count;
// };




// exports.queryByPreDateCount = async function (pre = 0,ctx) {
//     let fkUserId = ctx.userId;
//     let start = tool.getTodayStart() - pre * 24 *60 * 60* 1000;
//     let end = tool.getTodayEnd() - pre * 24 *60 * 60* 1000;
//     let sql = new Sql('word');
//     sql.whereEqual({fkUserId})
//         .whereGtEqual({createTime:start})
//         .whereLtEqual({createTime:end});
//     let totalCount = await db.count(sql);
//     return totalCount;
// };

// exports.queryRandom = async function (count = 5,ctx) {
//     let fkUserId = ctx.userId;
//     let sql = `SELECT 
//                     w.id ,
//                     w.dict_url , 
//                     w.explains ,
//                     w.phonetic ,
//                     w.text ,
//                     w.uk_phonetic ,
//                     w.us_phonetic ,
//                     w.wfs , 
//                     uw.create_time , 
//                     uw.id as user_word_id ,
//                     uw.level
//                 FROM 
//                     user_word uw, word w 
//                 WHERE 
//                     uw.fk_word_id = w.id 
//                 AND  
//                     uw.fk_user_id = ${fkUserId} 
//                 ORDER BY 
//                     RAND()
//                 LIMIT
//                     ${count}
//                 `;
//     let items = await db.queryBySql(sql);
//     return items;
// };