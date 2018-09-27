// @flow Created by 陈其丰 on 2018/9/27.

const mysql = require('mysql');
const config = require('../config');
const pool  = mysql.createPool({
    connectionLimit : 10,
    host     : config.HOST,
    user     : config.USER,
    password : config.PASSWORD,
    database : config.DATABASE
});

module.exports = pool;