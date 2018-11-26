// @flow Created by 陈其丰 on 2018/9/27.

const db = require('../lib/mysql');
const AuthError = require('../lib/auth_error');
const Sql = require('../lib/sql');
const config = require('../config');

exports.checkToken = async function (ctx) {
    let token = ctx.cookies.get('token');
    if(!token){
        throw new AuthError('暂无权限，请重新登录')
    }
    if(config.TOKEN === token){
        return {id:Number(config.TOKEN_ID)};
    }else{
        throw new AuthError('暂无权限，请重新登录')
    }
    // let sql = new Sql('user');
    // sql.whereEqual({token});
    // let items = await db.query(sql);
    // if(!items.length){
    //     throw new AuthError('暂无权限，请重新登录')
    // }
    // return items[0];
};