'use strict'

const router = require('koa-router');
const socketchat = require('../lib/mysql');
const check = require('../middlewares/checkLogin');
const route = new router();

route.get('/send',async (ctx, next) => {
    check.checkNotLogin(ctx);
    await socketchat.findAllUser()
        .then(async result => {
            let user = result.filter(val => val.username == ctx.session.username);
            ctx.body = {
                code: 1,
                user: {
                    avatar: user[0].avatar,
                    id: user[0].id,
                },
            }
        })
})

module.exports = route;