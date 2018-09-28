// @flow Created by 陈其丰 on 2018/9/28.


exports.getTodayStart = function () {
    let date = new Date();
    let zone = date.getTimezoneOffset()/60;
    date = new Date(date.setMinutes(0));
    date = new Date(date.setSeconds(0));
    date = new Date(date.setMilliseconds(0));
    date = new Date(date.setHours(-8 - zone));
    return date.getTime();
};

exports.getTodayEnd = function () {
    let date = new Date();
    let zone = date.getTimezoneOffset()/60;
    date = new Date(date.setMinutes(0));
    date = new Date(date.setSeconds(0));
    date = new Date(date.setMilliseconds(0));
    date = new Date(date.setHours(-8 - zone + 24));
    return date.getTime();
};