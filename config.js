// @flow Created by 陈其丰 on 2018/9/27.


module.exports = {
    PORT:3001,
    HOST     : process.env.SERVER_HOST,
    USER     : 'root',
    PASSWORD : process.env.DB_PASSWORD,
    DATABASE : process.env.DB_NAME,

    /*有道相关*/
    WORD_APP_KEY:process.env.WORD_APP_KEY,
    WORD_KEY:process.env.WORD_KEY,


    TOKEN:process.env.TOKEN,
    TOKEN_ID:process.env.TOKEN_ID,

};