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
                }
            },
            password: {
                validators: {
                    notEmpty: {
                        message: '内容不能为空'
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
                url: "/login",
                type: 'POST',
                data: {
                    username: $('#username').val().trim(),
                    password: $('#password').val().trim(),
                },
                success: function(res){
                    console.log(res)
                    if(res.code == 1){
                        tip(`${res.msg}`);
                        setTimeout(() => {
                            location.href = '/chat'
                        },1000)
                    }else if(res.code == 0){
                        tip(`${res.msg}`);
                        $('#check-name').removeClass('has-success').addClass('has-error');
                        $('#check-name i').removeClass('glyphicon-ok').addClass('glyphicon-remove');

                    }else if(res.code == 2){
                        tip(`${res.msg}`);
                        $('#check-password').removeClass('has-success').addClass('has-error');
                        $('#check-password i').removeClass('glyphicon-ok').addClass('glyphicon-remove');
                    }
                },
                error: function(err){
                    tip(`${err}`)
                }
            })
        });

    //选择图像
    $('#avatar').on('change',function(){
        let file = this.files[0];
        let reader = new FileReader();
        if(file.size >= 1024 * 1024 / 2){
            console.log('请上传小于512kb的图片!');
            return;
        }
        reader.onload = function(e){
            $('.preview').attr('src',e.target.result);
        }
        reader.readAsDataURL(file);
    })
})