'use strict'

const router = require('koa-router');
const socketchat = require('../lib/mysql');
const check = require('../middlewares/checkLogin');
const route = new router();

route.get('/chat',async (ctx, next) => {
    check.checkNotLogin(ctx);
    await socketchat.findAllUser()
        .then(async result => {
            let users = result.filter(val => val.username != ctx.session.username)
            await ctx.render('chat', {
                session: ctx.session,
                title: '聊天',
                users,
            })
        })
})

module.exports = route;