var swiper = new Swiper('#goodsSwiper', {
    pagination: '#goodsSwiper .swiper-pagination',
    lazyLoading: true,
    lazyLoadingInPrevNext: true,
    lazyLoadingOnTransitionStart: true,
    paginationClickable: true,
    autoHeight: true
});

var goodsRelatedSwiper = new Swiper('#goodsRelated', {
    pagination: '#goodsRelated .swiper-pagination',
    lazyLoading: true,
    slidesPerView: 3,
    slidesPerGroup: 3,
    paginationClickable: true
});
$(function () {
    if (commonData.errorCode == "1") {
        opeFuc.followDialog();
    }
    //初始化Sku属性
    if ($(".skucontent").length > 0) {
        itemsku.skuData = JSON.parse(commonData.skuData)
        itemsku.initSKU();
        $(".goods-standard span.skuitem").each(function () {
            var self = $(this);
            var attr_id = self.attr('data-id');
            if (!itemsku.SKUResult[attr_id]) {
                self.addClass("out-of-stock").attr('disabled', 'disabled');
            }
        })
    }
    //初始化Sku选择事件
    $(".goods-standard span.skuitem").click(function () {
        var self = $(this);
        if (self.hasClass("out-of-stock")) {
            return;
        }
        //选中自己，兄弟节点取消选中
        self.toggleClass("active").siblings().removeClass("active");

        //已经选择的节点
        var selectedObjs = $(".goods-standard span.active");

        if (selectedObjs.length) {
            //获得组合key价格
            var selectedIds = [];
            selectedObjs.each(function () {
                selectedIds.push($(this).attr("data-id"));
            });
            selectedIds.sort(function (value1, value2) {
                return parseInt(value1) - parseInt(value2);
            });
            var len = selectedIds.length;

            //用已选中的节点验证待测试节点 underTestObjs
            $(".skuitem").not(selectedObjs).not(self).each(function () {
                var siblingsSelectedObj = $(this).siblings(".active");
                var testAttrIds = [];//从选中节点中去掉选中的兄弟节点
                if (siblingsSelectedObj.length) {
                    var siblingsSelectedObjId = siblingsSelectedObj.attr("data-id");
                    for (var i = 0; i < len; i++) {
                        (selectedIds[i] != siblingsSelectedObjId) && testAttrIds.push(selectedIds[i]);
                    }
                } else {
                    testAttrIds = selectedIds.concat();
                }
                testAttrIds = testAttrIds.concat($(this).attr("data-id"));
                testAttrIds.sort(function (value1, value2) {
                    return parseInt(value1) - parseInt(value2);
                });
                if (!itemsku.SKUResult[testAttrIds.join('_')]) {
                    $(this).attr("disabled", "disabled").addClass("out-of-stock").removeClass('active');
                } else {
                    $(this).removeClass("out-of-stock").removeClass('active').removeAttr('disabled');
                }
            });

            //设置价格，库存，销量等
            if ($(".skucontent").length == len) {
                var skuinfo = itemsku.SKUResult[selectedIds.join('_')];
                var stock = skuinfo.Stock
                var FlowID = skuinfo.FlowID.join("");
                //取套餐商品信息
                opeFuc.getPackage(FlowID);

                opeFuc.quantiy = parseInt(skuinfo.Stock);
                opeFuc.skuid = skuinfo.SkuID.join("");

                var Price = parseFloat(skuinfo.Price.join(""));
                var MemberPrice = parseFloat(skuinfo.MemberPrice.join(""));
                var PromotePrice = parseFloat(skuinfo.PromotePrice.join(""));
                var minOrderQty = parseInt(skuinfo.MinOrderQty.join(""));
                //$("#textnum").val(minOrderQty);
                if ($("#textnum").val() < minOrderQty) {
                    $textnum.val(minOrderQty);
                }
                if (commonData.showstock == '1') {
                    $("#stockcount").html("销量:" + parseInt(skuinfo.Sales) + " 库存:" + skuinfo.Stock);
                } else {
                    $("#stockcount").html("销量:" + parseInt(skuinfo.Sales));
                }

                if (PromotePrice < MemberPrice) {
                    if (Price > PromotePrice) {
                        $("#price").html("<span>促销价</span><b>￥" + PromotePrice + "</b> <del>￥" + Price + "</del>");
                    }
                    else {
                        $("#price").html("<span></span><b>￥" + Price + "</b>");
                    }
                }
                else {
                    if (Price > MemberPrice) {
                        $("#price").html("<span>会员价</span><b>￥" + MemberPrice + "</b> <del>￥" + Price + "</del>");
                    }
                    else {
                        $("#price").html("<span></span><b>￥" + Price + "</b>");
                    }
                }

            }
        }
        else {
            //设置默认价格
            //$('#price').text('--');
            //设置属性状态
            $('.skuitem').each(function () {
                itemsku.SKUResult[$(this).attr('data-id')] ? $(this).removeAttr('disabled') : $(this).attr('disabled', 'disabled').removeClass('active');
                //self.addClass("out-of-stock").attr('disabled', 'disabled');
            })
        }
    });
    //选项切换
    $('.tabs-nav').on('click', '.tab-link', function () {
        var tabNav = $(this).attr('href');
        $(this).addClass('active').siblings().removeClass('active');
        $(tabNav).addClass('active').siblings().removeClass('active');
    });
    //套餐的子商品超过三条就隐藏用省略号代替
    if ($(".goods-packages-item .goods-img").length > 3) {
        $(".goods-packages-item .goods-img:nth-child(3)").addClass("more");
    };
    //加载评论信息
    opeFuc.getItemComment();
    //加载更多评论
    $("#more").click(function () {
        opeFuc.getItemComment();
    })
    //显示置顶功能
    $(".main").scroll(function () {
        if ($(".main").scrollTop() > 100) {
            $("#backTop").fadeIn(1500);
        } else {
            $("#backTop").fadeOut(1500);
        }
    });
    //置顶功能
    $("#backTop").click(function () {
        $('body,html,.main').animate({ scrollTop: 0 }, 1000);
        return false;
    });
});

var opeFuc = {
    ispost: true,
    iscall: true,
    storeid: commonData.StoreID,
    itemid: commonData.itemid,
    skuid: commonData.skuid,
    quantiy: commonData.quantiy,//库存
    minOrderQty: commonData.minOrderQty,//起订量
    addcartype: 1,//@((int)Yh.APPEnum.ShoppingCarEnum.CarType.购物车)
    pageindex: 1,//当前页数
    isLastPage: false,//是否最后一页
    currquantity: 0,
    getItemComment: function () {
        if (opeFuc.ispost && !opeFuc.isLastPage) {
            opeFuc.ispost = false;
            var url = "/ItemCommentsAPI/GetItemComment?StoreID=" + opeFuc.storeid + "&ItemID=" + opeFuc.itemid;
            url += "&shopweixinid=" + commonData.shopWeiXinID + "&pageindex=" + opeFuc.pageindex;
            $.ajax({
                url: url,
                type: "post",
                success: function (res) {
                    if (res != null && res.list.length > 0) {
                        $("#NoneData").hide();
                        $("#TemplateJson").tmpl(res.list).appendTo("#commentlist");
                        opeFuc.isLastPage = res.isLastPage;
                        if (res.isLastPage) {
                            $("#more").hide();
                        }
                        opeFuc.pageindex = opeFuc.pageindex + 1;
                    }
                    else {
                        $("#more").hide();
                        $("#NoneData").show();
                    }
                    opeFuc.ispost = true;
                },
                error: function () {
                    opeFuc.ispost = true;
                }
            })
        }
    },
    redicCart: function (flows) {
        var ct = 2;
        var url = "";
        if (flows == 'all') {
            ct = opeFuc.addcartype;
            url = "/ShoppingCar/Index?weixinid=" + commonData.WeiXinID + "&shopweixinid=" + commonData.shopWeiXinID + "&cartype=" + ct;

        } else {//立即购买直接跳到订单确认页
            url = "/ShoppingCar/OrderConfirm?shopweixinid=" + commonData.shopWeiXinID + "&cartype=" + ct;
        }
        document.location.href = url;
    },
    buyItem: function (flag) {
        if (opeFuc.ispost) {
            if ($(".skucontent").length > 0) {
                if (opeFuc.SkuIsAllcheck() < 1) {
                    $.generalShortTips("请选择规格！", 1000);
                    return;
                }
            }
            var num = parseFloat($.trim($("#textnum").val()));
            if (opeFuc.quantiy < num) {
                $.generalShortTips("库存不够！", 1000);
                return;
            }
            if (num < opeFuc.minOrderQty) {
                $.generalShortTips("购买商品数量不能低于起订量" + opeFuc.minOrderQty, 1000);
                return;
            }
            //根据业态已经SheetNo判断促销中需要弹出选择配送门店功能
            if (commonData.IsShowShop == '1' && commonData.sheetno != "") {
                var url = "/Shop/ActivityShopList?weixinid=" + commonData.WeiXinID + "&shopweixinid=" + commonData.shopWeiXinID + "&sheetno=" + commonData.sheetno + "&Skuid=" + opeFuc.skuid + "&ItemId=" + opeFuc.itemid + "&Quantity=" + num;
                window.location.href = url;
                return;
            }
            opeFuc.ispost = false;
            var urlEx = "&cartype=" + opeFuc.addcartype
            if (flag == 1) {
                urlEx = "&clear=true&cartype=2"; //直接付款 = 2
            }
            else {
                urlEx = "&Clear=false&IsGrowing=true";
            }
            var addcarurl = "/ShoppingCartAPI/AddCartInfo?UserID=" + commonData.UserID + "&StoreID=" + commonData.StoreID + "&skuid=" + opeFuc.skuid + "&ItemId=" + opeFuc.itemid + "&Quantity=" + num + urlEx;
            $.ajax({
                url: addcarurl,
                type: "post",
                success: function (res) {
                    opeFuc.ispost = true;
                    if (flag == 1) {
                        opeFuc.redicCart("");
                    }
                    else {
                        $.generalShortTips("加入购物车成功", 1000);
                    }
                },
                error: function () {
                    opeFuc.ispost = true;
                }
            })
        }
    },
    setLike: function (currobj) {
        if (opeFuc.ispost) {
            opeFuc.ispost = false;
            var url = "/ShopAPI/AddMyItem?UserID=" + commonData.UserID + "&StoreID=" + commonData.StoreID + "&ItemId=" + opeFuc.itemid + "&ShopId=" + commonData.ShopID;
            $.ajax({
                url: url,
                type: "post",
                success: function (str) {
                    opeFuc.ispost = true;
                    if ($(currobj).html() == "已收藏") {
                        $(currobj).html("收藏商品");
                    }
                    else {
                        $(currobj).html("已收藏");
                    }
                },
                error: function () {
                    opeFuc.ispost = true;
                }
            });
        }
    },
    //判断SKU属性是否全选了
    SkuIsAllcheck: function () {
        //已经选择的节点
        var selectedObjs = $(".goods-standard span.active")
        if ($(".skucontent").length == selectedObjs.length) {
            return 1;
        }
        return 0;
    },
    setdel: function () {
        var sumcount = $("#textnum").val();
        var newcount = parseInt(sumcount) - 1;
        var limitcount = parseInt($("#limitBuyCount").val());
        if (newcount < opeFuc.minOrderQty) {
            $.generalShortTips("购买数量不能低于起订量" + opeFuc.minOrderQty + "件", 1000);
            return;
        }
        if (limitcount > 0 && newcount > limitcount) {
            $.generalShortTips("抱歉，每个用户限制购买" + limitcount + "件", 1000);
            return;
        }

        if (newcount > 0) {
            $("#textnum").val(newcount);
            $("#textnum").attr("data-value", newcount);
        }
        else {
            $("#textnum").val("1");
        }
    },
    setadd: function () {
        var inttextnum = parseInt($("#textnum").val());
        var pcount = inttextnum + 1;
        var Stock = opeFuc.quantiy;
        if (pcount > Stock) {
            $.generalShortTips("库存不够", 1000);
            return;
        }
        var limitcount = parseInt($("#limitBuyCount").val());
        if (limitcount > 0 && pcount > limitcount) {
            $.generalShortTips("抱歉，每个用户限制购买" + limitcount + "件", 1000);
            $("#textnum").val(limitcount);
            return;
        }
        $("#textnum").val(pcount);
        $("#textnum").attr("data-value", pcount);
    },
    addcar: function (itemid, storeid, skuid, e) {
        if (opeFuc.ispost) {
            opeFuc.ispost = false;

            var inttextnum = parseInt($("#textnum").val());

            opeFuc.currquantity = opeFuc.currquantity + inttextnum;
            if (inttextnum > opeFuc.quantiy || opeFuc.quantiy < 1 || opeFuc.currquantity > opeFuc.quantiy) {
                $.generalShortTips("库存不够", 1000);
                opeFuc.ispost = true;
                return;
            }
            var limitcount = parseInt($("#limitBuyCount").val());
            if (limitcount > 0 && inttextnum > limitcount) {
                $.generalShortTips("抱歉，每个用户限制购买" + limitcount + "件", 1000);
                $("#textnum").val(limitcount);
                opeFuc.ispost = true;
                return;
            }
            var url = "/ShoppingCartAPI/AddCartInfo?UserID=" + commonData.UserID + "&StoreID=" + storeid + "&ItemId=" + itemid + "&Quantity=" + inttextnum + "&cartype=" + opeFuc.addcartype + "&skuid=" + skuid + "&IsGrowing=true";
            $.ajax({
                url: url,
                type: "post",
                contentType: "application/Json; charset=utf8",
                success: function (res) {
                    if (!res.Success) {
                        $.generalShortTips("加入购物车成功", 1000);
                    }
                    opeFuc.ispost = true;
                },
                error: function (ex) {
                    opeFuc.ispost = true;
                }
            })
        }
    },
    changeamount: function () {
        var sumcount = $("#textnum").val();
        var rg = /^[1-9]*[1-9][0-9]*$/;
        if (!rg.test(sumcount) || parseInt(sumcount) <= 0) {
            $("#textnum").val($("#textnum").attr("data-value"));
            return;
        }
        if (parseInt(sumcount) > opeFuc.quantiy) {
            $("#textnum").val($("#textnum").attr("data-value"));
            $.generalShortTips("库存不够", 1000);
            return;
        }


        if (sumcount < opeFuc.minOrderQty) {
            $.generalShortTips("购买数量不能低于起订量" + opeFuc.minOrderQty + "件", 1000);
            $("#textnum").val($("#textnum").attr("data-value"));
            return;
        }
        var limitcount = parseInt($("#limitBuyCount").val());
        if (limitcount > 0 && sumcount > limitcount) {
            $.generalShortTips("抱歉，每个用户限制购买" + limitcount + "件", 1000);
            $("#textnum").val($("#textnum").attr("data-value"));
            return;
        }
        $("#textnum").val(sumcount);
    },

    //取套餐商品信息
    getPackage: function (skuItemFlowId) {
        if ($("#packages").length > 0) {
            var flowId = $("#packages").attr("data-flowId");
            $.ajax({
                url: "/ItemAPI/GetPackageItem?flowID=" + flowId + "&skuItemFlowId=" + skuItemFlowId,
                type: "post",
                success: function (data) {
                    $("#packages").empty();
                    if (data != null) {
                        $("#packagesTemplate").tmpl(data).appendTo("#packages");
                    }
                },
                error: function () {
                }
            });
        }
    },
    //弹出公众号二维码
    followDialog: function () {
        var $dialog = $('#followDialog');//通知弹窗更换ID为alert
        $dialog.show();
        $("#btncanl").click(function () {
            $dialog.hide();
        });
    },
}