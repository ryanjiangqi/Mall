$(function () {
    init();//初始化选中的分类
    //一级类别点击事件
    $(".category-menu a").click(function () {
        var firstCategoryId = $(this).attr("data-id");
        $(this).addClass("active").siblings().removeClass("active");
        $(".category-list").hide();
        $("#one" + firstCategoryId).show();
        pageOption.updateCateGoryId(firstCategoryId);
        save(firstCategoryId);
    });
    $("#btnsearch").click(function () {
        var keyword = $.trim($("#txtkeyword").val());
        var url = "/Item/Index?WeiXinID="+commonData.WeiXinID+"&shopweixinid="+commonData.ShopWeiXinID+"&r="+(new Date()).getTime()+"&keyword=" + escape(keyword);
        window.location.href = url;
    });
});
function init() {

    if (window.sessionStorage) {
        var saveKey = GetKey();
        var categoryId = sessionStorage.getItem(saveKey);
        if (typeof (categoryId) != "undefined" && categoryId != null) {

            if (categoryId > 0) {
                var selectObj = $(".category-menu").find("a[data-id=" + categoryId + "]");
                if (selectObj.length > 0) {
                    $("#one" + categoryId).show();
                    $(".category-menu a").removeClass("active");
                    selectObj.addClass("active");
                }
                else {
                    $(".category-list").eq(0).show();
                }
            }
            else {
                $(".category-list").eq(0).show();
            }

        }
        else {
            pageOption.initselectobj();
        }
    }
    else {
        pageOption.initselectobj();
    }
}
//取URL当做保存的key
function GetKey() {
    var saveKey = window.location.href;
    // saveKey = saveKey.substring(saveKey.lastIndexOf("/") + 1);
    saveKey = $.trim(saveKey.replace("#", ""));
    return saveKey;
}
function save(categoryId) {
    if (window.sessionStorage) {
        var saveKey = GetKey();
        sessionStorage.setItem(saveKey, categoryId);
    }
}
var pageOption = {
    ispost: true,
    //添加或替换URL上的参数
    updateUrlWithParam: function (url, key, value) {
        var retUrl = url;

        if (retUrl.indexOf("?") == -1) {
            retUrl += "?" + key + "=" + value;
        }
        else {
            if (retUrl.indexOf("&" + key + "=") == -1) {
                if (retUrl.indexOf("?" + key + "=") == -1)
                    retUrl += "&" + key + "=" + value;
                else
                    //retUrl = retUrl.replace(eval('/(' + key + '=)([^&]*)/gi'), "?" + key + "=" + value);
                    retUrl = retUrl.replace(eval('/(' + key + '=)([^&]*)/gi'), key + "=" + value);
            }
            else {
                retUrl = retUrl.replace(eval('/(' + key + '=)([^&]*)/gi'), key + "=" + value);
            }
        }
        return retUrl;
    },
    //替换categoryId参数值
    updateCateGoryId: function (value) {
        var url = window.location.href;
        var newUrl = pageOption.updateUrlWithParam(url, "categoryId", value)
        var dd = document.title;
        history.replaceState(null, document.title, newUrl) + location.hash;
    },
    initselectobj: function () {
        var selectObj = $(".category-menu a.active");
        if (selectObj.length > 0) {
            var firstCategoryId = selectObj.attr("data-id");
            $("#one" + firstCategoryId).show();
        }
        else {
            $(".category-list").eq(0).show();
        }
    }
}