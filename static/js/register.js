$(function(){
    function tip(text){
        $('.message').text(text).fadeIn();
        setTimeout(() => {
            $('.message').fadeOut();
        },1000)
    }
    //表单验证
    $('#form').bootstrapValidator({
        message: 'This value is not valid',
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh',
        },
        fields: {
            username: {
                validators: {
                    notEmpty: {
                        message: '内容不能为空'
                    },
                    stringLength: {
                        min: 2,
                        max: 8,
                        message: '长度在2到8之间'
                    },
                }
            },
            password: {
                validators: {
                    notEmpty: {
                        message: '内容不能为空'
                    },
                    stringLength: {
                        min: 6,
                        max: 12,
                        message: '密码长度为6到12位'
                    },
                    regexp: {
                        regexp: /^[a-zA-Z][a-zA-Z0-9_]*$/,
                        message: '密码由数字字母或者下划线组成且必须以字母开头'
                    }
                }
            },
            confirmpassword: {
                validators: {
                    notEmpty: {
                        message: '内容不能为空'
                    },
                    identical: {
                        field: 'password',
                        message: '两次密码不一致'
                    },
                }
            },
        }
    })
        .on('success.form.bv', function(e) {
            e.preventDefault();
            var $form = $(e.target);
            var bv = $form.data('bootstrapValidator');
            $.ajax({
                url: "/register",
                type: 'POST',
                data: {
                    username: $('#username').val().trim(),
                    password: $('#password').val().trim(),
                    avatar: $('.avatar').attr('src'),
                },
                success: function(res){
                    console.log(res)
                    // if(res.state == 1){
                    //     tip(`${res.message}`);
                    //     $('#check-name').removeClass('has-success').addClass('has-error');
                    //     $('#check-name i').removeClass('glyphicon-ok').addClass('glyphicon-remove');
                    //
                    // }else if(res.state == 2){
                    //     tip(`${res.message}`);
                    //     setTimeout(() => {
                    //         // location.href = '/signin'
                    //     },1000)
                    // }
                },
                error: function(err){
                    console.log(err)
                    // tip(`${err}`)
                }
            })
        });

    //选择图像
    $('#hidden').on('change',function(){
        let file = this.files[0];
        let reader = new FileReader();
        if(file.size >= 1024 * 1024 / 2){
            console.log('请上传小于512kb的图片!');
            return;
        }
        reader.onload = function(e){
            $('.avatar').attr('src',e.target.result);
        }
        reader.readAsDataURL(file);
    })
})