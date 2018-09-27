// @flow Created by 陈其丰 on 2018/9/27.


function AuthError (msg) {
    this.message = msg;
    this.code = 888;
}
AuthError.prototype = new Error();


module.exports = AuthError;