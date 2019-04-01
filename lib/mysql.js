'use strict'

const mysql = require('mysql');
const config = require('../config/config');

//创建数据池
const pool = mysql.createPool({
    database: config.database.DATABASE,
    user: config.database.USERNAME,
    password: config.database.PASSWORD,
    host: config.database.HOST,
    port: config.database.PORT, //widnows 下去掉这一行
})

/**
 * @param sql 数据库执行条件
 * @param value 参数
 * @returns {Promise<any>}
 * 数据池中进行会话操作
 */
let query = function(sql, value) {
    return new Promise((resolve, reject) => {
        pool.getConnection(function(err, connect) {
            if(err) {
                reject(err)
            }else {
                //执行sql脚本对数据库进行读写
                connect.query(sql, value, (err, rows) => {
                    if(err) {
                        reject(err)
                    }else {
                        resolve(rows)
                    }
                    //结束会话,不加这句代码会出现连接不稳定的问题
                    connect.release()
                })
            }
        })
    })
}

const socketchat = {};

//注册用户
socketchat.insertUser = (params) => {
    const _sql = `insert into user set username=?,password=?,avatar=?,moment=?;`;
    return query(_sql, params)
}

//用户名查重
socketchat.findUser = (name) => {
    const _sql = `select * from user where username="${name}";`;
    return query(_sql)
}

//获取所有用户
socketchat.findAllUser = () => {
    const _sql = `select * from user;`;
    return query(_sql)
}

module.exports = socketchat