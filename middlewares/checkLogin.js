'use strict'

module.exports = {
    //已登录跳转聊天页
    checkLogin: (ctx) => {
        if(ctx.session && ctx.session.id) {
            ctx.redirect('/chat')
        }
    },
    //未登录前往登录
    checkNotLogin: (ctx) => {
        if(!ctx.session || !ctx.session.id) {
            ctx.redirect('/login')
        }
    }
}