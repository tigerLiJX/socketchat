'use strict'

const router = require('koa-router');
const md5 = require('md5');
const socketchat = require('../lib/mysql');
const check = require('../middlewares/checkLogin');
const route = new router();

route.get('/login', async (ctx, next) => {
    check.checkLogin(ctx);
    await ctx.render('login',{
        session: ctx.session,
        title: '登录'
    })
})

route.post('/login', async (ctx, next) => {
    const username = ctx.request.body.username;
    const password = md5(ctx.request.body.password);
    await socketchat.findUser(username)
        .then(result => {
            result = result[0];
            if(!result) {
                ctx.body = {
                    code: 0,
                    msg: '用户不存在'
                }
            }else if(result.password != password) {
                ctx.body = {
                    code: 2,
                    msg: '密码错误'
                }
            }else if(result.username == username && result.password == password) {
                ctx.body = {
                    code: 1,
                    msg: '登录成功'
                }
                ctx.session = result;
            }
        })
})

module.exports = route;