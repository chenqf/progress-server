// @flow Created by 陈其丰 on 2018/9/27.

const db = require('../lib/mysql');
const tool = require('../lib/tool');


exports.queryAllReview = async function (ctx) {
    let fkUserId = ctx.userId;
    let start = tool.getTodayStart();
    let end = tool.getTodayEnd();
    let sql = `SELECT 
                   *
                FROM 
                    remark
                WHERE 
                    fk_user_id = ${fkUserId} 
                AND
                    (      create_time >= ${start - 24 *60 * 60* 1000} 
                        AND 
                            create_time <= ${end - 24 *60 * 60* 1000} 
                        OR
                            create_time >= ${start - 2 * 24 *60 * 60* 1000} 
                        AND 
                            create_time <= ${end - 2 * 24 *60 * 60* 1000} 
                        OR
                            create_time >= ${start - 4 * 24 *60 * 60* 1000} 
                        AND 
                            create_time <= ${end - 4 * 24 *60 * 60* 1000} 
                        OR
                            create_time >= ${start - 7 * 24 *60 * 60* 1000} 
                        AND 
                            create_time <= ${end - 7 * 24 *60 * 60* 1000} 
                        OR
                            create_time >= ${start - 15 * 24 *60 * 60* 1000} 
                        AND 
                            create_time <= ${end - 15 * 24 *60 * 60* 1000} 
                        OR
                            create_time >= ${start - 30 * 24 *60 * 60* 1000} 
                        AND 
                            create_time <= ${end - 30 * 24 *60 * 60* 1000} 
                    )
                ORDER BY 
                    id ASC `;

    let items = await db.queryBySql(sql);
    return items;
};
