const router = require('koa-router');
const socketchat = require('../lib/mysql');
const fs = require('fs');
const md5 = require('md5');
const moment = require('moment');
const client = require('../util/client');
const route = new router();

route.get('/register', async (ctx,next) => {
    await ctx.render('register',{
        session: ctx.session,
    })
})

//注册页
route.get('/register', async (ctx,next) => {
    await ctx.render('register',{
        session: ctx.session,
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