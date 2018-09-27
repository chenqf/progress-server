// @flow Created by 陈其丰 on 2018/9/27.


exports.checkToken = async function (ctx) {
    let token = ctx.cookies.get('token');
    if(!token){
        throw new Error('暂无权限，请重新登录')
    }
};