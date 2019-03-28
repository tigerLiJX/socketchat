'use strict'

const Koa = require('koa');
const views = require('koa-views');
const statics = require('koa-static');
const bodyparse = require('koa-bodyparser');
const session = require('koa-session-minimal');
const mysqlSession = require('koa-mysql-session');
const config = require('./config/config');
const path = require('path');
const app = new Koa();

//session 存储配置
const store = new mysqlSession({
    database: config.database.DATABASE,
    user: config.database.USERNAME,
    password: config.database.PASSWORD,
    host: config.database.HOST,
    // port: config.database.PORT, //widnows 下去掉这一行
})

//使用session中间件
app.use(session({
    key: 'SESSION_ID',
    store,
}))

//静态资源加载中间件
app.use(statics(path.join(__dirname, './static')))
app.use(statics(path.join(__dirname, './plugins')))

//服务端模板渲染引擎中间件
app.use(views(path.join(__dirname, './views'),{
    extension: 'ejs'
}))

//表单解析中间件
app.use(bodyparse())

//路由文件
app.use(require('./routes/register.js').routes())

//启动端口
app.listen(config.port);

console.log('listening on port http://127.0.0.1:' + config.port)