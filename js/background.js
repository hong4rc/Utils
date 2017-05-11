var menuItem = {
    id: "anhhong",
    title: "Translate with vdict",
    contexts: ["selection"]
};
chrome.contextMenus.create(menuItem);
function initFB() {
    chrome.storage.sync.set({'seenChat': 1, 'stopTimeline': 1, 'typingChat': 1, 'typingPost': 0}, function () {
        console.log('Init settings Facebook successfull !!!');
    });
}
chrome.runtime.onInstalled.addListener(function() {
    initFB();
});
chrome.contextMenus.onClicked.addListener(function(data) {
    if(data.menuItemId === "anhhong" && data.selectionText) {
        var link = 'https://vdict.com/';
        var dt = encodeURI(data.selectionText);
        link += dt + ',1,0,0.html';
        var createData = {
            url: link,
            type: "popup",
            top: 100,
            left: 100,
            width: 900,
            height: 500
        };
        chrome.windows.create(createData, function() {});
    }
});
chrome.storage.onChanged.addListener(function (change) {
    if(change.blockRequest){
        stopBlock();
        checkEnable(!(change.isEnable) || change.isEnable.newValue === 1);
    }
    if (change.seenChat || change.typingChat || change.typingPost || change.stopTimeline){
        stopBlockFB();
        checkFacebook();
    }
});
function stopBlock() {
    chrome.webRequest.onBeforeRequest.removeListener(stopBlockFB);
}
function stopBlockFB() {
    console.info('stopFb');
    chrome.webRequest.onBeforeRequest.removeListener(blockedFb);
}
function blockedRequest(detail){
    console.info( 'Blocked :  ' + detail.url);
    return {cancel: true};
}
function checkEnable(check) {

    if (check){
        startBlock();
    } else {
        console.log('Stoping Block');
        stopBlock();
    }
}
function startBlock(){
    console.log('Starting Block');
    chrome.storage.sync.get('blockRequest', function(data) {
        data.blockRequest && data.blockRequest.length > 0 && chrome.webRequest.onBeforeRequest.addListener(
            blockedRequest,
            {
                urls: data.blockRequest
            },
            ["blocking"]
        );
        for(p in data.blockRequest){
            console.warn('  |----Block patterns : ' + data.blockRequest[p]);
        }
        console.log('\n   -------- Anh Hồng --------\n');
    });
}
function checkFacebook() {
    var blockRequestFb = [];
    var keyFb =
        ['seenChat',
        'typingChat',
        'typingPost',
        'stopTimeline'];
    var valueFb = ['*://*/ajax/mercury/change_read_status.php*',
        '*://*.facebook.com/ajax/messaging/typ.php?dpr*',
        '*://*.facebook.com/ufi/typing/*',
        '*://*.facebook.com/ajax/pagelet/generic.php/LitestandTailLoadPagelet*'
    ];
    chrome.storage.sync.get(keyFb, function(data) {
        for(index in keyFb){
            (data[keyFb[index]] == 1) && blockRequestFb.push(valueFb[index]);
        }
        console.log(blockRequestFb);
        blockRequestFb.length && chrome.webRequest.onBeforeRequest.addListener(
            blockedFb,
            {
                urls: blockRequestFb
            },
            ["blocking"]
        );
    });
}
function blockedFb(detail){
    console.info( 'Blockedfb :  ' + detail.url);
    return {cancel: true};
}