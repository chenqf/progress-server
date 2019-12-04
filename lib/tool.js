// @flow Created by 陈其丰 on 2018/9/28.
const moment = require('moment')


exports.truncate = function(q){
    var len = q.length;
    if(len<=20) return q;
    return q.substring(0, 10) + len + q.substring(len-10, len);
}

exports.getCurrentTime = function(currentDate = new Date()){
    return moment(currentDate).format('YYYY-MM-DD HH:mm:ss')
}

exports.toDateStr = function(str){
    return moment(new Date(str)).format('YYYY-MM-DD HH:mm:ss')
}

exports.toDateStartStrByPre = function(num = 1){
    return moment().subtract(num, 'days').format('YYYY-MM-DD 00:00:00')
}
exports.toDateEndStrByPre = function(num = 1){
    return moment().subtract(num, 'days').format('YYYY-MM-DD 23:59:59')
}
