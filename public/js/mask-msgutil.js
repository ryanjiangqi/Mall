/*
    description：消息扩展
    date：2014-06-26 18:32
    author:liss
*/
(function ($) {

    /* 注册普通遮罩层 */
    var shade = '<div id="bg" class="bg" style="display:none; background:rgba(0,0,0,0.6);">&nbsp;</div>';

    $.initMask = function () {
        if ($("#bg").length == 0) {
            $("html").append(shade);
        }
        $('#bg').css({ "width": $(document).width(), "height": $(document).height(), "left": 0, "top": 0, 'z-index': 1000 })
        return $("#bg");
    };
    $.openMask = function () {
        if ($("#bg").length == 0) {
            $("html").append(shade);
        }
        $('#bg').css({ "width": $(document).width(), "height": $(document).height(), "left": 0, "top": 0, 'z-index': 1000 }).show();
    };

    /* 关闭普通遮罩层 */
    $.closeMask = function () {
        if ($("#bg").length > 0) {
            $("#bg").hide();
        }
    };

    /* 注册普通消息 */
    var msgDiv = '<div id="alertGeneralMsg" style="display:none;position:fixed;top:50%; left:50%; margin-top:-30px; margin-left:-100px; width:200px; padding:20px 10px; line-height:32px; background:#FFF; border-radius:4px; box-shadow:1px 1px 8px #999; font-size:16px; font-weight:700; color:#333; text-align:center;z-index:9999"></div>';

    $.initgeneralTips = function () {
        if ($("#alertGeneralMsg").length > 0) {
            $("#alertGeneralMsg").remove();
        }
        $("html").append(msgDiv);
        return $("#alertGeneralMsg");
    };

    $.generalShortTips = function (message, delaytimes) {
        if ($("#alertGeneralMsg").length == 0) {
            $("html").append(msgDiv);
        }
        $("#alertGeneralMsg").html(message).show(300).delay(delaytimes).fadeOut("slow");
    };

    $.generalLongTips = function (message) {
        if ($("#alertGeneralMsg").length == 0) {
            $("html").append(msgDiv);
        }
        $("#alertGeneralMsg").html(message).show(300);
    };
    $.closegeneralTips = function () {
        if ($("#alertGeneralMsg").length > 0) {
            $("#alertGeneralMsg").hide();
        }
    };


    /* 注册自定义模版普通消息 */
    $.multiShortTips = function (html, msgDivId, message, delaytimes) {
        if ($("#" + msgDivId).length == 0) {
            $("html").append(html);
        }
        $("#" + msgDivId).html(message).show(300).delay(delaytimes).fadeOut("slow");
    };

    $.multiLongTips = function (html, msgDivId, message) {
        if ($("#" + msgDivId).length == 0) {
            $("html").append(html);
        }
        $("#" + msgDivId).html(message).show()
    };

    $.closeMultiTips = function (msgDivId) {
        if ($("#" + msgDivId).length > 0) {
            $("#" + msgDivId).hide();
        }
    };

})(jQuery);
