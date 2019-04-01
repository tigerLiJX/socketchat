const router = require('koa-router');
const socketchat = require('../lib/mysql');
const fs = require('fs');
const md5 = require('md5');
const moment = require('moment');
const client = require('../util/client');
const check = require('../middlewares/checkLogin');
const route = new router();
//注册
route.get('/register', async (ctx,next) => {
    check.checkLogin(ctx);
    await ctx.render('register',{
        session: ctx.session,
        title: '注册'
    })
})

route.post('/register', async (ctx,next) => {
    const params = ctx.request.body;
    // console.log(params)
    //用户名查重
    await socketchat.findUser(params.username)
        .then(async result => {
            if(result.length != 0) {
                ctx.body = {
                    code: 0,
                    msg: '用户名已存在'
                }
            }else {
                //用户名可用,继续执行
                await next()
            }
        })

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
            .then(async function(data) {
                if(data.conclusionType == 1) {
                    //将base64图片转为buffer对象
                    let dataBuffer = new Buffer(base64Img, 'base64');
                    avatar = new Date().getTime()+'.png';
                    let uploads = './static/uploads/' + avatar;
                    fs.writeFile(uploads, dataBuffer, async (err, data) => {
                        if(err) {
                            throw err;
                        }else {
                            // console.log('头像保存成功')
                        }
                    })
                    let user = [
                        params.username,
                        md5(params.password),
                        avatar,
                        moment().format('YYYY-MM-DD HH:mm:ss')
                    ];

                    await socketchat.insertUser(user)
                        .then(() => {
                            ctx.body = {
                                code: 1,
                                msg: '注册成功',
                            }
                        })

                }else {
                    ctx.body = {
                        msg: data.conclusion,
                        data
                    }
                }
            }, function(e) {
                console.log(e)
            });
    }else {
        let user = [
            params.username,
            md5(params.password),
            avatar,
            moment().format('YYYY-MM-DD HH:mm:ss')
        ];
        await socketchat.insertUser(user)
        .then(() => {
            ctx.body = {
                code: 1,
                msg: '注册成功',
            }
        })
    }
})

module.exports = route;