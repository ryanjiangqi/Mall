//微信转发需要引用的js
wx.config({
    debug: dataForWeixin.debug, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
    appId: dataForWeixin.appId, // 必填，公众号的唯一标识
    timestamp: dataForWeixin.timestamp, // 必填，生成签名的时间戳
    nonceStr: dataForWeixin.nonceStr, // 必填，生成签名的随机串
    signature: dataForWeixin.signature,// 必填，签名，见附录1
    jsApiList: dataForWeixin.jsApiList // 必填，需要使用的JS接口列表，所有JS接口列表见附录2 
});
wx.ready(function () {
    // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
    wx.error(function (res) {
        // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。          
    });
    wx.showOptionMenu();//显示右上角菜单
    //分享到朋友圈
    wx.onMenuShareTimeline({
        title: dataForWeixin.title, // 分享标题
        link: dataForWeixin.shareUrl, // 分享链接
        imgUrl: dataForWeixin.img, // 分享图标
        success: function () {
            // 用户确认分享后执行的回调函数
        },
        cancel: function () {
            // 用户取消分享后执行的回调函数
        }
    });
    //分享给朋友
    wx.onMenuShareAppMessage({
        title: dataForWeixin.title, // 分享标题
        link: dataForWeixin.shareUrl, // 分享链接
        imgUrl: dataForWeixin.img, // 分享图标
        desc: dataForWeixin.desc, // 分享描述
        type: '', // 分享类型,music、video或link，不填默认为link
        dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
        success: function () {
            // 用户确认分享后执行的回调函数
        },
        cancel: function () {
            // 用户取消分享后执行的回调函数
        }
    });
    //分享到QQ
    wx.onMenuShareQQ({
        title: dataForWeixin.title, // 分享标题
        link: dataForWeixin.shareUrl, // 分享链接
        imgUrl: dataForWeixin.img, // 分享图标
        desc: dataForWeixin.desc, // 分享描述
        success: function () {
            // 用户确认分享后执行的回调函数
        },
        cancel: function () {
            // 用户取消分享后执行的回调函数
        }
    });
    //分享到腾讯微博
    wx.onMenuShareWeibo({
        title: dataForWeixin.title, // 分享标题
        link: dataForWeixin.shareUrl, // 分享链接
        imgUrl: dataForWeixin.img, // 分享图标
        desc: dataForWeixin.desc, // 分享描述
        success: function () {
            // 用户确认分享后执行的回调函数
        },
        cancel: function () {
            // 用户取消分享后执行的回调函数
        }
    });

    if (typeof (dataForWeixin.getlocation) == "undefined" || dataForWeixin.getlocation) {
        //获取用户当前位置
        wx.getLocation({
            success: function (res) {
                var latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
                var longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。
                var speed = res.speed; // 速度，以米/每秒计
                var accuracy = res.accuracy; // 位置精度        
                var url = dataForWeixin.url + "&lon=" + longitude + "&lat=" + latitude;
                $.ajax({
                    url: url,
                    type: "post",
                    dataType: "json",
                    contenttype: "application/json; charset=utf8",
                    success: function (data) {
                        if (dataForWeixin.locationSuc) {
                            dataForWeixin.locationSuc();
                        }
                    },
                    error: function () {

                    }
                });
            },
            fail: function () {
                if (dataForWeixin.locationFail) {
                    dataForWeixin.locationFail();
                }
            },
            complete: function () {
                if (dataForWeixin.locationComplete) {
                    dataForWeixin.locationComplete();
                }
            },
            cancel: function () {
                if (dataForWeixin.locationCancel) {
                    dataForWeixin.locationCancel();
                }
            },
        });
    }

});