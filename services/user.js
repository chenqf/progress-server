// @flow Created by 陈其丰 on 2018/9/27.

const db = require('../lib/mysql');
const AuthError = require('../lib/auth_error');

exports.checkToken = async function (ctx) {
    let token = ctx.cookies.get('token');
    if(!token){
        throw new AuthError('暂无权限，请重新登录')
    }
    let items = await db.query('user',{token});
    if(!items.length){
        throw new AuthError('暂无权限，请重新登录')
    }
};