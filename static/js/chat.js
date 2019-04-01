$(function () {
    function tip(text){
        $('.message').text(text).fadeIn();
        setTimeout(() => {
            $('.message').fadeOut();
        },1000)
    }
    //左侧联系人选择
    $('.nav-li').each(function(i, val){
        $(val).on('click',function(){
            $(val).addClass('selected').siblings().removeClass('selected')
        })
    })
    //退出
    $('#loginout').click(function () {
        $.ajax({
            url: 'loginout',
            type: 'get',
            success: function (res) {
                tip(`${res.msg}`)
                if(res.code == 1) {
                    setTimeout(() => {
                        location.href = '/login'
                    },1000)
                }
            },
            error: function () {
                console.log(error)
            }
        })
    })
})