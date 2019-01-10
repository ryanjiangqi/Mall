$(function () {
    $("img.lazy").lazyload({
        skip_invisible: false,
        effect: "fadeIn",
        container: $(".main")
    });
    homepage.initiPage();
    homepage.RefreshShoppingCar();
    var menuList = $(".footer_nav a");
    var currpathname = window.location.pathname.toLowerCase();
    menuList.each(function () {
        var subhref = $(this).attr("data-subhref").toLowerCase();
        if (subhref.toLowerCase() == "/pagesite/home")
        {
            $(this).addClass("active");
            return false;
        }
        //if (subhref.indexOf(currpathname) > -1) {
        //    $(this).addClass("active");
        //    return false;
        //}
    });
    //搜索
    $(".js-serach").on("click", function () {
        var txt = $.trim($(this).parent().find("input[type=text]").val());


        if (txt.length > 0) {
            var url = "/item/Index?WeiXinID=" + common.WeiXinID + "&shopweixinid=" + common.ShopWeiXinID + "&CategoryID=0&keyword=" + encodeURIComponent(txt);
            window.location.href = url;
        }
    });
    //扫码搜索
    $(".js-scanQRCode").click(function () {
        var txtobj = $(this).next().find("input[type=text]");
        wx.scanQRCode({
            needResult: 1,
            scanType: ["qrCode", "barCode"],//data.scanType, // 可以指定扫二维码还是一维码，默认二者都有
            // desc: 'scanQRCode desc',
            success: function (res) {
                var result = res.resultStr;
                if (result != "" && result != null) {
                    result = result.replace("EAN_13,", "");

                    txtobj.val(result);
                    var url = "/item/Index?WeiXinID=" + common.WeiXinID + "&shopweixinid=" + common.ShopWeiXinID + "&CategoryID=0&keyword=" + encodeURIComponent(result);
                    window.location.href = url;
                    //$("#txtsearch").val(result);
                    //pageOption.seachtype = 1;
                    //pageOption.search();
                }
            }
        });
    })
    $(".main").scroll(function () {
        backTop();
    });

    $("#backTop").click(function () {
        $('.main').animate({ scrollTop: 0 }, 1000);
        return false;
    });
    //新版商户卡劵
    $(".main").on("click", ".js-link", function () {
        var link = $(this).data("link");
        var IsValid = $(this).data("valid");
        if ($.trim(link) != "" && IsValid=="1") {
            self.location.href = link;
        }
    })

    function backTop() {
        if ($(".main").scrollTop() > 100) {
            $("#backTop").fadeIn(1500);
        } else {
            $("#backTop").fadeOut(1500);
        }
    }
    $(window).resize(function () {
        if (common.custompageColumnList != null) {
            $(common.custompageColumnList).each(function (i, obj) {
                //商品分类
                if (obj.ColumnType == 4) {
                    homepage.categoriesSize(obj.CustompageColumnId, obj.JsonData.spacing);

                }
            });
        }
    });
});

var homepage = {
    ispost: true,
    //初始化页面
    initiPage: function () {
        $('#pageCaption').show().siblings().hide();
        var pageData = common.custompageColumnList;
        if (pageData != null) {
            $(pageData).each(function (i, obj) {
                //轮播图
                if (obj.ColumnType == 3) {
                    homepage.ImageSlideSwiper(obj.CustompageColumnId, obj.JsonData.IsAutoPlay, obj.JsonData.AutoPlayTime);

                }
                //商品分类
               else if (obj.ColumnType == 4) {
                    homepage.categoriesSize(obj.CustompageColumnId, obj.JsonData.spacing);

               }
                //推荐商品
               else if (obj.ColumnType == 5) {
                   var idlist = [];
                   idlist = obj.JsonData.datalist.map(function (v) { return v.flowid; });
                   homepage.GetHotItemList(obj.CustompageColumnId, idlist, common.UserID, obj.JsonData.DisplayQty, obj.JsonData.IsShowName, obj.JsonData.IsShowPrice, obj.JsonData.DisplayMode)
                }
                else if (obj.ColumnType == 6) {
                    var idlist = [];
                    idlist = obj.JsonData.datalist.map(function (v) { return v.StoreID; });
                    homepage.GetShopStoreByRecommend(obj.CustompageColumnId, idlist, obj.JsonData.DisplayQty, obj.JsonData.IsShowName)
                }
                    //卡券列表初始化
                else if (obj.ColumnType == 8) {
                    var idlist = [];

                    idlist = obj.JsonData.datalist.map(function (v) { return v.voucherId; });
                    if (idlist.length > 0) {
                        var id = obj.CustompageColumnId;
                        $.ajax({
                            url: "/HomeAPI/GetCouponList",
                            type: "post",
                            dataType: "json",
                            contentType: "application/json; charset=utf8",
                            data: JSON.stringify(idlist),
                            success: function (result) {
                                if (result.length > 0) {
                                    var $leftobj = $("#" + obj.CustompageColumnId + " .content");
                                    $leftobj.append($("#addvoucherLeftTemplate").tmpl(result));
                                    $(result).each(function () {
                                        var $leftitem = $leftobj.find("div[data-id=" + this.ID + "]");
                                        $leftitem.find("a").attr("style", "background-color:" + this.CouponBackground);
                                        $leftitem.find(".link").attr("style", "color:" + this.CouponBackground);
                                    })
                                }
                            }
                          , error: function (ex) {

                          }
                        });
                    }

                }
                else if (obj.ColumnType == 10) {
                    var idlist = [];
                    idlist = obj.JsonData.datalist.map(function (v) { return v.TuanID; });
                    homepage.GetTuanItemList(obj.CustompageColumnId, idlist, obj.JsonData.DisplayQty)
                }
                else if (obj.ColumnType == 11) {
                    var idlist = [];
                    idlist = obj.JsonData.datalist.map(function (v) { return v.TuanID; });
                    homepage.GetPinItemList(obj.CustompageColumnId, idlist, obj.JsonData.DisplayQty)
                }
            });
        }
    },
    //计算分类的间距(第一个参数：左部栏目的ID值，)
    categoriesSize: function (leftid, spacing) {
        if (!spacing) {
            spacing = 10;
        }
        if (spacing == '') {
            //$('#appInner .module[data-id=category] .icon-categories').css('margin', 0);
            $("#" + leftid + " .icon-categories").css('margin', 0);
            return;
        };
        var width = $("#" + leftid + " a").outerWidth() - 2 * spacing;
        $("#" + leftid + " .icon-categories").css({ 'width': width, 'height': width, 'margin': '0 auto' })
    },
    //读取推荐商品
    GetHotItemList: function (id, idlist, userid, qty, IsShowName, IsShowPrice, DisplayMode) {
        if ($("#" + id).length > 0 && idlist.length>0) {
            var postdata = {};
            postdata.idlist = idlist;
            postdata.qty = qty;
            postdata.userid = userid;
            postdata.displaymode = DisplayMode;
            var url = "/HomeAPI/GetNewIndexHotItemList";
            $.ajax({
                url: url,
                type: "post",
                dataType: "json",
                contentType: "application/json; charset=utf8",
                data: JSON.stringify(postdata),
                success: function (data) {
                    if (data != null && data.length > 0) {
                        $("#" + id + " .content").append($("#ItemTemplate").tmpl(data));
                        $(".lazy").lazyload({
                            //effect: "fadeIn"
                            skip_invisible: false,
                            threshold: 200,
                            failurelimit: 10,
                            container: $(".main")
                        });
                        if (IsShowName == 0) {
                            $("#" + id + " .name").attr("style", "display: none;")
                        }
                        if (IsShowPrice == 0) {
                            $("#" + id + " .price-stocks").attr("style", "display: none;")
                        }
                    }
                    else {
                        $("#" + id).remove();
                    }
                },
                error: function () {

                }
            });
        }
        else {
            $("#" + id).remove();
        }
    },
    //读取推荐店铺
    GetShopStoreByRecommend: function (id, idlist, qty, IsShowName) {
        if ($("#" + id).length > 0 && idlist.length>0) {
            var url = "/HomeAPI/GetShopStoreByRecommend";
            var postdata = {};
            postdata.idlist = idlist;
            postdata.qty = qty;
            $.ajax({
                url: url,
                type: "post",
                dataType: "json",
                contentType: "application/json; charset=utf8",
                data: JSON.stringify(postdata),
                success: function (data) {
                    if (data != null && data.length > 0) {
                        $("#" + id + " .content").append($("#StoreTemplate").tmpl(data));
                        $(".js-storelazy").lazyload({
                            //effect: "fadeIn"
                            skip_invisible: false,
                            threshold: 200,
                            failurelimit: 10,
                            container: $(".main")
                        });
                        if (IsShowName == 0) {
                            $("#" + id + " .name").attr("style", "display: none;")
                        }

                    }
                    else {
                        $("#" + id).remove();
                    }
                },
                error: function () {

                }
            });
        }
        else {
            $("#" + id).remove();
        }
    },
    //团购商品
    GetTuanItemList: function (id, idlist, qty)
    {
        if ($("#" + id).length > 0 && idlist.length > 0) {
            var url = "/HomeAPI/GetTuanItemList";
            var postdata = {};
            postdata.idlist = idlist;
            postdata.qty = qty;
            $.ajax({
                url: url,
                type: "post",
                dataType: "json",
                contentType: "application/json; charset=utf8",
                data: JSON.stringify(postdata),
                success: function (data) {
                    if (data != null && data.length > 0) {
                        $("#" + id + " .content").append($("#grouponGoodlistleftTemplate").tmpl(data));

                        homepage.calculateProgressBar(id);

                    }
                    else {
                        $("#" + id).remove();
                    }
                },
                error: function () {

                }
            });
        }
        else {
            $("#" + id).remove();
        }
    },
    //计算团购商品的进度条
    calculateProgressBar: function (id) {
        var $currobj = $("#" + id + " .js-progress");
        $currobj.each(function (m) {
            var item = $(this);
            var TotalLimit = parseFloat(item.attr("data-TotalLimit"));
            var SurplusNum = parseFloat(item.attr("data-SurplusNum"));
            var bar = (SurplusNum / TotalLimit) * 100;
            var width = "width:" + bar + "%;";
            item.attr("style", width);
        });

    },
    //拼团商品
    GetPinItemList: function (id, idlist, qty)
    {
        if ($("#" + id).length > 0 && idlist.length > 0) {
            var url = "/HomeAPI/GetPinItemList";
            var postdata = {};
            postdata.idlist = idlist;
            postdata.qty = qty;
            $.ajax({
                url: url,
                type: "post",
                dataType: "json",
                contentType: "application/json; charset=utf8",
                data: JSON.stringify(postdata),
                success: function (data) {
                    if (data != null && data.length > 0) {
                        $("#" + id + " .content").append($("#groupsGoodlistleftTemplate").tmpl(data));
                    }
                    else {
                        $("#" + id).remove();
                    }
                },
                error: function () {

                }
            });
        }
        else {
            $("#" + id).remove();
        }
    },
    RefreshShoppingCar: function () {
        if ($(".footer_nav .icon_footer_cart").length > 0) {
            //获取购物车数量
            $.ajax({
                url: "/ShoppingCartAPI/GetShoppingCarCount?userid=" + common.UserID,
                type: "get",
                cahce: false,
                dataType: "json",
                contentType: "application/json; charset=utf8",
                success: function (data) {
                    var acount = parseInt(data);
                    if (acount > 0) {
                        $(".footer_nav .icon_footer_cart").html("<b>" + acount + "</b>");
                    }
                }
            })
        }
    },
    //轮播图
    ImageSlideSwiper: function (id, IsAutoPlay, AutoPlayTime)
    {
        var $id = "#swiper" + id;
        if (IsAutoPlay == 1) {
            var swiper = new Swiper($id, {
                pagination: '.swiper-pagination',
                paginationClickable: true,
                nextButton: '.swiper-button-next',
                prevButton: '.swiper-button-prev',
                autoHeight: true,
                autoplay: AutoPlayTime*1000
            });
        }
        else {
            var swiper = new Swiper($id, {
                pagination: '.swiper-pagination',
                paginationClickable: true,
                nextButton: '.swiper-button-next',
                prevButton: '.swiper-button-prev',
                autoHeight: true
            });
        }
    },
}