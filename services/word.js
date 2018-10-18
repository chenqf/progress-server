// @flow Created by 陈其丰 on 2018/9/27.

const db = require('../lib/mysql');
const axios = require('axios');
const md5 = require('md5');
const tool = require('../lib/tool');
const Sql = require('../lib/sql');

const APP_KEY = '51a433fdcbf4ab82';
const KEY = 'GO8nt8g99GFycXOgmJA0dC7oeP5zW8Og';
const FROM = 'EN';
const TO = 'zh-CHS';
const SALT = Math.random().toString(32).slice(2);

exports.baseSearch = async function (word,ctx) {
    let sign = md5(`${APP_KEY}${word}${SALT}${KEY}`);
    let url = `http://openapi.youdao.com/api?q=${encodeURI(word)}&from=${FROM}&to=${TO}&appKey=${APP_KEY}&salt=${SALT}&sign=${sign}`;
    let response = await axios.get(url);
    return response.data;
};
/**
 * 查询单词
 */
exports.search = async function (word,ctx) {
    let fkUserId = ctx.userId;
    let wordSql = new Sql('word').whereEqual({text:word});


    let results = await db.query(wordSql);    //单词表中的记录

    if(results.length){
        let wordItem = results[0];
        let fkWordId = wordItem.id; // 单词id
        let userWordSql = new Sql('user_word').whereEqual({fkUserId,fkWordId});
        let res = await db.query(userWordSql);// 用户单词表中的记录
        //不存在用户单词表中的记录
        if(!res.length){
            wordItem.new = true;
            userWordSql.set({fkUserId,fkWordId,createTime:Date.now()});
            let userWordId = await db.insert(userWordSql);
            wordItem.userWordId = userWordId;
            wordItem.createTime = Date.now();
        }
        //存在用户单词表中的记录
        else{
            wordItem.userWordId = res[0].id;
            wordItem.createTime = res[0].createTime;
        }
        return wordItem;
    }


    let sign = md5(`${APP_KEY}${word}${SALT}${KEY}`);
    let url = `http://openapi.youdao.com/api?q=${encodeURI(word)}&from=${FROM}&to=${TO}&appKey=${APP_KEY}&salt=${SALT}&sign=${sign}`;
    let response = await axios.get(url);
    try{
        let basic = response.data.basic;
        let webdict = response.data.webdict || {};
        let usPhonetic = basic['us-phonetic'] || basic['uk-phonetic'] || basic['phonetic'];
        let ukPhonetic = basic['uk-phonetic'] || basic['us-phonetic'] || basic['phonetic'];
        let phonetic = basic['phonetic'] || basic['us-phonetic'] || basic['uk-phonetic'] ;
        let explains = JSON.stringify(basic.explains);
        let dictUrl = webdict.url;
        let wfs = JSON.stringify(basic.wfs || []);
        let params = {fkUserId,text:word,usPhonetic,ukPhonetic,phonetic,randomReview:0,explains,dictUrl,wfs,createTime:Date.now()};
        let sql = new Sql('word').set(params);
        let id = await db.insert(sql);

        let userWordSql = new Sql('user_word').set({fkUserId,fkWordId:id,createTime:Date.now()});
        let userWordId = await db.insert(userWordSql);
        return Object.assign({id,'new':true,userWordId},params)
    }catch (err){
        throw new Error('查询的单词有误')
    }
};


exports.queryByPreDate = async function (pre = 0,ctx) {
    let fkUserId = ctx.userId;
    let start = tool.getTodayStart() - pre * 24 *60 * 60* 1000;
    let end = tool.getTodayEnd() - pre * 24 *60 * 60* 1000;
    let sql = `SELECT 
                    w.dict_url , 
                    w.explains ,
                    w.id ,
                    w.phonetic ,
                    w.text ,
                    w.uk_phonetic ,
                    w.us_phonetic ,
                    w.wfs , 
                    uw.create_time , 
                    uw.id as user_word_id ,
                    uw.level
                FROM 
                    user_word uw, word w 
                WHERE 
                    uw.fk_word_id = w.id 
                AND  
                    uw.fk_user_id = ${fkUserId} 
                AND 
                    uw.create_time >= ${start} 
                AND 
                    uw.create_time <= ${end} 
                ORDER BY 
                    uw.id ASC `;

    let items = await db.queryBySql(sql);
    return items;
};


exports.queryAllReview = async function (ctx) {
    let fkUserId = ctx.userId;
    let start = tool.getTodayStart();
    let end = tool.getTodayEnd();
    let sql = `SELECT 
                    w.dict_url , 
                    w.explains ,
                    w.id ,
                    w.phonetic ,
                    w.text ,
                    w.uk_phonetic ,
                    w.us_phonetic ,
                    w.wfs , 
                    uw.create_time , 
                    uw.id as user_word_id ,
                    uw.level
                FROM 
                    user_word uw, word w 
                WHERE 
                    uw.fk_word_id = w.id 
                AND  
                    uw.fk_user_id = ${fkUserId} 
                AND
                    (      uw.create_time >= ${start - 24 *60 * 60* 1000} 
                        AND 
                            uw.create_time <= ${end - 24 *60 * 60* 1000} 
                        OR
                            uw.create_time >= ${start - 2 * 24 *60 * 60* 1000} 
                        AND 
                            uw.create_time <= ${end - 2 * 24 *60 * 60* 1000} 
                        OR
                            uw.create_time >= ${start - 4 * 24 *60 * 60* 1000} 
                        AND 
                            uw.create_time <= ${end - 4 * 24 *60 * 60* 1000} 
                        OR
                            uw.create_time >= ${start - 7 * 24 *60 * 60* 1000} 
                        AND 
                            uw.create_time <= ${end - 7 * 24 *60 * 60* 1000} 
                        OR
                            uw.create_time >= ${start - 15 * 24 *60 * 60* 1000} 
                        AND 
                            uw.create_time <= ${end - 15 * 24 *60 * 60* 1000} 
                        OR
                            uw.create_time >= ${start - 30 * 24 *60 * 60* 1000} 
                        AND 
                            uw.create_time <= ${end - 30 * 24 *60 * 60* 1000} 
                    )
                ORDER BY 
                    uw.id DESC `;

    let items = await db.queryBySql(sql);
    return items;
};




exports.queryAll = async function (startNum,pageCount,ctx) {
    let fkUserId = ctx.userId;
    let sql = `SELECT 
                    w.dict_url , 
                    w.explains ,
                    w.id ,
                    w.phonetic ,
                    w.text ,
                    w.uk_phonetic ,
                    w.us_phonetic ,
                    w.wfs , 
                    uw.create_time , 
                    uw.id as user_word_id ,
                    uw.level
                FROM 
                    user_word uw, word w 
                WHERE 
                    uw.fk_word_id = w.id 
                AND  
                    uw.fk_user_id = ${fkUserId} 
                ORDER BY 
                    uw.create_time DESC 
                LIMIT
                    ${startNum},${pageCount}
                `;
    let items = await db.queryBySql(sql);
    return items;
};


exports.queryHard = async function (startNum,pageCount,ctx) {
    let fkUserId = ctx.userId;
    let sql = `SELECT 
                    w.dict_url , 
                    w.explains ,
                    w.id ,
                    w.phonetic ,
                    w.text ,
                    w.uk_phonetic ,
                    w.us_phonetic ,
                    w.wfs , 
                    uw.create_time , 
                    uw.id as user_word_id ,
                    uw.level
                FROM 
                    user_word uw, word w 
                WHERE 
                    uw.fk_word_id = w.id 
                AND  
                    uw.level = 1
                AND
                    uw.fk_user_id = ${fkUserId} 
                ORDER BY 
                    uw.create_time DESC 
                LIMIT
                    ${startNum},${pageCount}
                `;
    let items = await db.queryBySql(sql);
    return items;
};

exports.queryAllCount = async function (ctx) {
    let fkUserId = ctx.userId;
    let sql = `SELECT 
                    count(*) as count
                FROM 
                    user_word uw, word w 
                WHERE 
                    uw.fk_word_id = w.id 
                AND  
                    uw.fk_user_id = ${fkUserId} 
                `;
    let count = await db.countBySql(sql);
    return count;
};

exports.queryHardCount = async function (ctx) {
    let fkUserId = ctx.userId;
    let sql = `SELECT 
                    count(*) as count
                FROM 
                    user_word uw, word w 
                WHERE 
                    uw.fk_word_id = w.id 
                AND  
                    uw.level = 1
                AND  
                    uw.fk_user_id = ${fkUserId} 
                `;
    let count = await db.countBySql(sql);
    return count;
};




exports.queryByPreDateCount = async function (pre = 0,ctx) {
    let fkUserId = ctx.userId;
    let start = tool.getTodayStart() - pre * 24 *60 * 60* 1000;
    let end = tool.getTodayEnd() - pre * 24 *60 * 60* 1000;
    let sql = new Sql('word');
    sql.whereEqual({fkUserId})
        .whereGtEqual({createTime:start})
        .whereLtEqual({createTime:end});
    let totalCount = await db.count(sql);
    return totalCount;
};

exports.queryRandom = async function (count = 5,ctx) {
    let fkUserId = ctx.userId;
    let sql = `SELECT 
                    w.id ,
                    w.dict_url , 
                    w.explains ,
                    w.phonetic ,
                    w.text ,
                    w.uk_phonetic ,
                    w.us_phonetic ,
                    w.wfs , 
                    uw.create_time , 
                    uw.id as user_word_id ,
                    uw.level
                FROM 
                    user_word uw, word w 
                WHERE 
                    uw.fk_word_id = w.id 
                AND  
                    uw.fk_user_id = ${fkUserId} 
                ORDER BY 
                    RAND()
                LIMIT
                    ${count}
                `;
    let items = await db.queryBySql(sql);
    return items;
};