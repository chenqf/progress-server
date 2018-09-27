// @flow Created by 陈其丰 on 2018/9/27.

const pool = require('./pool');

function _dealQueryData(data) {
    let result;
    if(Array.isArray(data)){
        result = [];
        for(let i = 0,len = data.length; i<len; i++){
            result[i] = _dealQueryData(data[i]);
        }
    }else{
        result = {};
        for(let key in data){
            let value = data[key];
            key = key.replace(/_[a-z]/g,(s)=>s[1].toUpperCase());
            result[key] = value;
        }
    }
    return result;
}

let _dealInsertData = function (data) {
    let result = {};
    for(let key in data){
        result[key.replace(/[A-Z]/g,(s)=>'_' + s.toLowerCase())] = data[key];
    }
    return result;
};

let _dealWhereData = function (data) {
    let list = [];
    for(let key in data){
        list.push(`${key.replace(/[A-Z]/g,(s)=>'_' + s.toLowerCase())}="${data[key]}"`);
    }
    let str = list.join(" AND ");
    return str ? ' WHERE ' + str : ''
};


let _dealUpdateParas = function (data) {
    let list = [];
    for(let key in data){
        list.push(`${key.replace(/[A-Z]/g,(s)=>'_' + s.toLowerCase())}="${data[key]}"`);
    }
    return list.join(',');
};


module.exports = {
    insert:(table,data = {})=>{
        return new Promise((resolve,reject)=>{
            pool.getConnection(function(err, connection) {
                if (err) reject(err); // not connected!
                // Use the connection
                connection.query(`INSERT INTO ${table} SET ?`, _dealInsertData(data), function (error, results, fields) {
                    if (error) reject(error);
                    resolve(results.insertId);
                });
            });
        });
    },
    delete:(table,data = {})=>{
        return new Promise((resolve,reject)=>{
            pool.getConnection(function(err, connection) {
                if (err) reject(err); // not connected!
                // Use the connection
                connection.query(`DELETE FROM ${table} ${_dealWhereData(data)}`, function (error, results, fields) {
                    if (error) reject(error);
                    resolve(results.affectedRows);
                })
            });
        });
    },
    update:(table,params = {},query = {})=>{
        return new Promise((resolve,reject)=>{
            pool.getConnection(function(err, connection) {
                if (err) reject(err); // not connected!
                // Use the connection
                connection.query(`UPDATE ${table} SET ${_dealUpdateParas(params)} ${_dealWhereData(query)} `, function (error, results, fields) {
                    if (error) reject(error);
                    resolve(results.changedRows);
                });
            });
        });
    },
    query:(table,data = {})=>{
        return new Promise((resolve,reject)=>{
            pool.getConnection(function(err, connection) {
                if (err) reject(err); // not connected!
                // Use the connection
                connection.query(`SELECT * from ${table} ${_dealWhereData(data)}`, function (error, results, fields) {
                    // When done with the connection, release it.
                    connection.release();
                    // Handle error after the release.
                    if (error) reject(err);
                    // Don't use the connection here, it has been returned to the pool.
                    resolve(_dealQueryData(results))
                });
            });
        });
    }
};