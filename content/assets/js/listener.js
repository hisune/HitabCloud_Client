// 监听前端页面的消息
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse){
        console.log(request.call);
        switch(request.call){
            case 'setCookie':
                console.log(request.value);
                if(request.value){
                    updateCookieRule(request.value).then(() => {
                        sendResponse({called: request.call});
                    }).catch(error => {
                        console.error('Failed to update rules:', error);
                    });  // 更新cookie规则
                }else{
                    sendResponse({called: request.call});
                }
                break;
            case 'cleanCookie':
                chrome.declarativeNetRequest.updateDynamicRules({
                    removeRuleIds: [1]
                });
        }
        return true; // 保持消息通道开放
    }
);

// req模块的cookie添加
// 更新cookie规则
function updateCookieRule(cookieValue) {
    return new Promise((resolve, reject) => {
        chrome.declarativeNetRequest.updateDynamicRules({
            removeRuleIds: [1]
        }, () => {
            chrome.declarativeNetRequest.updateDynamicRules({
                addRules: [
                    {
                        id: 1,
                        priority: 1,
                        action: {
                            type: "modifyHeaders",
                            requestHeaders: [
                                { header: "Cookie", operation: "set", value: cookieValue || '' }
                            ]
                        },
                        condition: {
                            urlFilter: "*",
                            resourceTypes: ["main_frame", "xmlhttprequest"]
                        }
                    }
                ]
            }, () => {
                if (chrome.runtime.lastError) {
                    reject(chrome.runtime.lastError);
                } else {
                    resolve();
                }
            });
        });
    });
}

// 初始化，确保在安装时清除规则
chrome.runtime.onInstalled.addListener(() => {
    chrome.declarativeNetRequest.updateDynamicRules({
        removeRuleIds: [1]
    });
});
// chrome.webRequest.onBeforeSendHeaders.addListener(function(details) {
//     if(typeof cookieGlobal == 'string') details.requestHeaders.push({name: "Cookie", value: cookieGlobal});
//     return {requestHeaders: details.requestHeaders};
// }, {urls: ["<all_urls>"]}, ["blocking", "requestHeaders", "extraHeaders"]);

// 过滤weather的某些请求
// chrome.webRequest.onBeforeRequest.addListener(function(details) {
//         return {cancel: true};
//     },
//     {
//         urls: [
//
//         ]
//     },
// ["blocking"]);