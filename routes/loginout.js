'use strict'

const router = require('koa-router');
const route = new router();

route.get('/loginout',async (ctx, next) => {
    ctx.session = null;
    ctx.body = {
        code: 1,
        msg: '退出成功'
    }
})

module.exports = route;