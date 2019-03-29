##### 说明:
最近做的++RN++项目中有即时聊天需求，在了解到++socket++可以实现这一功能，突发想法做一个简单的基于++socket.io++插件的例子，进而对++socket++有深一步的认识

##### 技术点:
node+koa+mysql+socket.io+baidu-aip-sdk

##### 环境（Mac）
本地集成环境（MAMP）

##### 目标:
- 多人聊天
- 一对一好友聊天
- 一对多聊天（客服）
- 分组聊天（视实际情况）

##### 简单实现
- 文字
- 文字链接
- 图片
- 图文链接
- 表情（视实际情况）
- 语音（视实际情况）

---

##### 目录结构与说明
```
socketchat
  config  数据库配置
  lib  数据库连接与使用
  middlewares  中间件
  plugins  第三方插件
  routes  路由
  static  静态资源
  views  前台模板引擎文件
  index.js  入口文件
  package.json
```

##### 安装第三方包
```
koa
koa-views
koa-static
koa-bodyparser
koa-session-minimal
koa-mysql-session
md5
mysql
ejs
socket.io
koa-bodyparser
```

##### config目录下新建config.js进行数据库配置(注意Windows与Mac的区别)
Windows下密码没有设置就为空，不需要设置 PORT
```
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
```

##### 在数据库socketchat下新建表user并且在lib文件下新建mysql.js连接数据库
```
'use strict'

const mysql = require('mysql');
const config = require('../config/config');

//创建数据池
const pool = mysql.createPool({
    database: config.database.DATABASE,
    user: config.database.USERNAME,
    password: config.database.PASSWORD,
    host: config.database.HOST,
    port: config.database.PORT,
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
                    connection.release()
                })
            }
        })
    })
}

const socketchat = {};

module.exports = socketchat
```

##### 配置index.js入口文件
```
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
    port: config.database.PORT,
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
```

##### 在routes文件夹下新建register.js文件
```
const router = require('koa-router');
const route = new router();

route.get('/register', async (ctx, next) => {
    await ctx.render('register')
})

route.post('/register', async (ctx,next) => {
    const params = ctx.request.body;

    //对base64头像进行处理
    let avatar = params.avatar;
    let base64Img = '';
    if(avatar.includes(';base64,')) {
        base64Img = avatar.replace(/^data:image\/\w+;base64,/,'');
        /**
         * 图像审核
         * conclusionType => 1.合规,2.疑似，3.不合规
         */
        await client.imageCensorUserDefined(base64Img, 'base64')
            .then(function(data) {
                ctx.body = {data}
                if(data.conclusionType == 1) {
                    //将base64图片转为buffer对象
                    let dataBuffer = new Buffer(base64Img, 'base64');
                    avatar = new Date().getTime()+'.png';
                    let uploads = './static/uploads/' + avatar;
                    fs.writeFile(uploads, dataBuffer, (err, data) => {
                        if(err) {
                            throw err;
                        }else {
                            console.log('头像保存成功')
                        }
                    })
                    //注册
                    const user = [
                        params.username,
                        md5(params.password),
                        avatar,
                        moment().format('YYYY-MM-DD HH:mm:ss')
                    ]
                    // socketchat.insertUser(user)
                    //    .then(result => {
                    //        ctx.body = {
                    //            code: 1,
                    //            msg: '注册成功',
                    //        }
                    //    })
                    //    .catch(err => {
                    //        ctx.body = {
                    //            code: 0,
                    //            msg: '注册失败',
                    //        }
                    //    })
                }
            }, function(e) {
                console.log(e)
            });
    }
})

module.exports = route;
```

##### 在views文件夹下新建register.ejs文件
```
<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>注册</title>
    <link rel="icon" href="http://www.wclimb.site/images/avatar.png">
</head>
<body>
    请注册
</body>
</html>
```
运行 index.js 文件即可