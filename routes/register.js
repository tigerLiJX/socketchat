const router = require('koa-router');

const route = new router();

//注册页
route.get('/register', async (ctx,next) => {
    await ctx.render('register',{
        session: ctx.session,
    })
})

route.post('/register', async (ctx,next) => {
    let params = ctx.request.body;
    console.log(params)

})

module.exports = route;