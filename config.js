// @flow Created by 陈其丰 on 2018/9/27.


module.exports = {
    PORT:3001,
    HOST     : '45.77.71.18',
    USER     : 'root',
    PASSWORD : process.env.DB_PASSWORD,
    DATABASE : 'word_memory',

    /*有道相关*/
    WORD_APP_KEY:process.env.WORD_APP_KEY,
    WORD_KEY:process.env.WORD_KEY,

    /*百度相关*/
    AUDIO_API_KEY:process.env.AUDIO_API_KEY,
    AUDIO_SECRET_KEY:process.env.AUDIO_SECRET_KEY,

    TOKEN:process.env.TOKEN,
    TOKEN_ID:process.env.TOKEN_ID,

};