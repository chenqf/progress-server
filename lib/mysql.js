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

module.exports = {
    insert:(sql)=>{
        let table = sql.table;
        return new Promise((resolve,reject)=>{
            pool.getConnection(function(err, connection) {
                if (err) reject(err); // not connected!
                // Use the connection
                let query = connection.query(`INSERT INTO ${table} SET ?`, sql.toInsert(), function (error, results, fields) {
                    connection.release();
                    if (error) reject(error);
                    resolve(results.insertId);
                });
                console.log(query.sql);
            });
        });
    },
    update:(sql)=>{
        let table = sql.table,
            statement = `UPDATE ${table} SET ${sql.toUpdate()} ${sql.toWhere()} `;
        console.log(statement);
        return new Promise((resolve,reject)=>{
            pool.getConnection(function(err, connection) {
                connection.release();
                if (err) reject(err); // not connected!
                // Use the connection
                connection.query(statement, function (error, results, fields) {
                    if (error) reject(error);
                    console.log(results);
                    resolve(results.changedRows);
                });
            });
        });
    },
    delete:(sql)=>{
        let table = sql.table,
            statement = `DELETE FROM ${table} ${sql.toWhere()}`;
        console.log(statement);
        return new Promise((resolve,reject)=>{
            pool.getConnection(function(err, connection) {
                if (err) reject(err); // not connected!
                // Use the connection
                connection.query(statement, function (error, results, fields) {
                    connection.release();
                    if (error) reject(error);
                    resolve(results.affectedRows);
                })
            });
        });
    },

    query:(sql)=>{
        let table = sql.table,
            statement = `SELECT * from ${table} ${sql.toWhere()} ${sql.toOrder()} ${sql.toLimit()}`;
        console.log(statement);
        return new Promise((resolve,reject)=>{
            pool.getConnection(function(err, connection) {
                if (err) reject(err); // not connected!
                // Use the connection
                connection.query(statement, function (error, results, fields) {
                    // When done with the connection, release it.
                    connection.release();
                    // Handle error after the release.
                    if (error) reject(error);
                    // Don't use the connection here, it has been returned to the pool.
                    resolve(_dealQueryData(results))
                });
            });
        });
    },
    queryBySql:(sql)=>{
        console.log(sql);
        return new Promise((resolve,reject)=>{
            pool.getConnection(function(err, connection) {
                if (err) reject(err); // not connected!
                // Use the connection
                connection.query(sql, function (error, results, fields) {
                    // When done with the connection, release it.
                    connection.release();
                    // Handle error after the release.
                    if (error) reject(error);
                    // Don't use the connection here, it has been returned to the pool.
                    resolve(_dealQueryData(results))
                });
            });
        });
    },
    countBySql:(sql)=>{
        console.log(sql);
        return new Promise((resolve,reject)=>{
            pool.getConnection(function(err, connection) {
                connection.release();
                if (err) reject(err); // not connected!
                // Use the connection
                connection.query(sql, function (error, results, fields) {
                    if (error) reject(error);
                    resolve(results[0].count);
                });
            });
        });
    },
    count:(sql)=>{
        let table = sql.table,
            statement = `SELECT COUNT(*) AS count FROM ${table} ${sql.toWhere()} ${sql.toLimit()}`;
        console.log(statement);
        return new Promise((resolve,reject)=>{
            pool.getConnection(function(err, connection) {
                connection.release();
                if (err) reject(err); // not connected!
                // Use the connection
                connection.query(statement, function (error, results, fields) {
                    if (error) reject(error);
                    resolve(results[0].count);
                });
            });
        });
    }
};