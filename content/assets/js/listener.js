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

        ]
    },
["blocking"]);