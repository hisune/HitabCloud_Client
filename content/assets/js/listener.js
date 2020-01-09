var cookieGlobal;

// 监听前端页面的消息
chrome.extension.onMessage.addListener(
    function(request, sender, sendResponse){
        switch(request.call){
            case 'setCookie':
                cookieGlobal = request.value;
                break;
            case 'setWeather':
                $()
        }
        sendResponse({called: request.call});
    }
);

// req模块的cookie添加
chrome.webRequest.onBeforeSendHeaders.addListener(function(details) {
    if(typeof cookieGlobal == 'string') details.requestHeaders.push({name: "Cookie", value: cookieGlobal});
    return {requestHeaders: details.requestHeaders};
}, {urls: ["<all_urls>"]}, ["blocking", "requestHeaders", "extraHeaders"]);

// 过滤weather的某些请求
chrome.webRequest.onBeforeRequest.addListener(function(details) {
        return {cancel: true};
    },
    {
        urls: [
            "https://i.tq121.com.cn/j/wap2019/bdshare/static/api/js/trans/logger.js*",
            "https://i.tq121.com.cn/j/wap2019/bdshare/static/api/js/share/share_api.js*",
            "https://i.tq121.com.cn/j/wap2019/bdshare/static/api/js/view/share_view.js*",
            "https://i.tq121.com.cn/j/wap2019/bdshare/static/api/js/base/tangram.js*",
            "https://i.tq121.com.cn/j/wap2019/bdshare/static/api/js/share/api_base.js*",
            "https://i.tq121.com.cn/j/wap2019/bdshare/static/api/js/view/view_base.js*",
            "https://analyse.weather.com.cn/*",
            "https://hm.baidu.com/hm.js*",
            "http://mc.weather.com.cn/common/source/res/qlmu.js*",
            "http://www.smucdn.com/smu0/o.js*",
            // "http://e.weather.com.cn/p/custom/*",
        ]
    },
["blocking"]);