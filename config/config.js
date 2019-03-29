'use strict'

const config = {
    //启动端口
    port: 3003,
    //数据库配置
    database: {
        DATABASE: 'socketchat', //数据库名称
        USERNAME: 'root', //数据库用户
        PASSWORD: 'root', //数据库密码 //widnows 下没有设置密码就为空
        HOST: '127.0.0.1', //数据库地址
        PORT: '8889' //widnows 下去掉这一行
    }
}

//if windows
// const config = {
//     port: 3002,
//     //数据库配置
//     database: {
//         DATABASE: 'socketchat', //数据库名称
//         USERNAME: 'root', //数据库用户
//         PASSWORD: '', //数据库密码
//         HOST: '127.0.0.1', //数据库地址
//     }
// }

module.exports = config