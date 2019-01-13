var handler = null;
var isLoading = false;
var currentPageer = null;
var Pageer=
{
    pageindex:1,
    APiUrl: "",
    ListID: "",
    handlerID: "",
    loadid: "",
    TemplateID: "",
    NoneID: "",
    scrollEld: $(document),
    isLastPage: false,
    islazyload: false,//是否图片懒加载
    targetObj: "",
    isSplit: false,//是否截取文字，商品列表名称与促销信息用的
    init: function (apiurl, ListID, handlerid, LoadID, templateid, NoneID, callback) {
        Pageer.APiUrl = apiurl;
        Pageer.ListID = ListID;
        Pageer.handlerID = handlerid;
        Pageer.loadid = LoadID;
        Pageer.TemplateID = templateid;
        Pageer.NoneID = NoneID;
        // Capture scroll event.
        Pageer.scrollEld.bind('scroll', onScroll);       
        // Load first data from the API.
        loadData(callback);
    }
};
var Pageer2 =
{
    pageindex: 1,
    APiUrl: "",
    ListID: "",
    handlerID: "",
    loadid: "",
    TemplateID: "",
    NoneID: "",
    scrollEld: $(document),
    isLastPage: false,
   
    init: function (apiurl, ListID, handlerid, LoadID, templateid, NoneID, callback) {
        Pageer2.APiUrl = apiurl;
        Pageer2.ListID = ListID;
        Pageer2.handlerID = handlerid;
        Pageer2.loadid = LoadID;
        Pageer2.TemplateID = templateid;
        Pageer2.NoneID = NoneID;
        // Capture scroll event.
        Pageer2.scrollEld.bind('scroll', onScroll);
        // Load first data from the API.
        loadData(callback);
    }
};
if (currentPageer==null) {
    currentPageer = Pageer;
}
// Prepare layout options.
//var options = {
//    autoResize: true, // This will auto-update the layout when the browser window is resized.
//    container: $(currentPageer.ListID), // Optional, used for some extra CSS styling
//    offset: 2, // Optional, the distance between grid items

//};


function onScroll(event) { 
    // Only check when we're not still waiting for data.
    if (!isLoading && !currentPageer.isLastPage) {
        console.log(currentPageer.pageindex);
        // Check if we're within 100 pixels of the bottom edge of the broser window.
        var closeToBottom = ($(window).scrollTop() + $(window).height() > $(document).height() - 100);
        if (closeToBottom) {
            loadData();
        }
    }
};


/**
 * Refreshes the layout.
 */
//function applyLayout() {
//    // Clear our previous layout handler.
//    if (handler) {
//        handler.wookmarkClear();
//    }
//    // Create a new layout handler.
//    handler = $(currentPageer.handlerID);
//    handler.wookmark(options);
//};

function loadData(callback) {
    isLoading = true;
    $(currentPageer.loadid).show();
    $(currentPageer.NoneID).hide();
    $.ajax({
        url: currentPageer.APiUrl,
        dataType: 'json',
        cache: false,
        data: { pageIndex: currentPageer.pageindex }, // Page parameter to make sure we load new data
        success: function (data) {
            
            $(currentPageer.loadid).hide();
            // Increment page index for future calls.
            if (currentPageer.pageindex == 1) {
                if (data == "" || data == null || data.list == "") {
                    currentPageer.isLastPage = true;
                    $(currentPageer.NoneID).show();
                    return;
                }
            }

            currentPageer.pageindex++;
            if (typeof (data.isLastPage) == "undefined") {
                $(currentPageer.TemplateID).tmpl(data).appendTo(currentPageer.ListID);
            }
            else {
                currentPageer.isLastPage = data.isLastPage;
                $(currentPageer.TemplateID).tmpl(data.list).appendTo(currentPageer.ListID);
            }
            if (currentPageer.isSplit) {
                strSplit();
            }
            //是否懒加载
            if (currentPageer.islazyload) {
                var timeout = 500;
                //if (currentPageer.pageindex > 10 && currentPageer.pageindex<15)
                //{
                //    timeout = 800;
                //}
                //else if (currentPageer.pageindex >= 15 && currentPageer.pageindex < 20) {
                //    timeout = 1500;
                //}
                //else if (currentPageer.pageindex >= 20 ) {
                //    timeout = 2000;
                //}
                 if (currentPageer.pageindex >= 20) {
                    timeout = 800;
                }
                setTimeout(function () {
                    $(currentPageer.targetObj).lazyload({
                        //effect: "fadeIn",
                        threshold: 200,
                        failurelimit: 10,
                        //skip_invisible : false
                        // 
                        //placeholder: "http://style.uuhooo.com/images/none.jpg.310-310.jpg"
                    })
                }, timeout);
            }
            // Apply layout.
           // applyLayout();

            if (callback) {//回调
                callback(data);
            }
            isLoading = false;
        },
        complete: function ()
        {
            
        }
    });
};

function strSplit() {
    var txtEle = $(".goods_name > a");
    txtEle.each(function () {
        var txtStr = $.trim($(this).text());
        var txtLen = txtStr.length * 14;
        var txtRowLen = $(this).width();

        var iconWidth = $(this).next("span").width();
        var txtTwoLen = $(this).width() * 2 - iconWidth - 14;
        var txtSubStrNum = Math.floor(txtTwoLen / 14);
        var txtSubStr = txtStr.substring(0, txtSubStrNum);
        $(this).text(txtStr);
        if (txtLen <= txtRowLen) {
            $(this).next("span").css("display", "block");
        } else if (txtLen < txtTwoLen) {
            $(this).next("span").css("display", "inline-block");
        } else {
            $(this).next("span").css("display", "inline-block");
            $(this).text(txtSubStr).append("...");
        }
    })
}
