var menuItem = {
    id: "anhhong",
    title: "Translate with vdict",
    contexts: ["selection"]
};
chrome.runtime.onInstalled.addListener(function() {
    chrome.contextMenus.create(menuItem);
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

chrome.storage.sync.get('isEnable', function (data) {
    checkEnable(data.isEnable === 1 || !(data.isEnable));
});

chrome.storage.onChanged.addListener(function (change) {
    stopBlock();
    checkEnable(!(change.isEnable) || change.isEnable.newValue == 1);
});
function startBlock(){
    console.log('Starting Block');
    chrome.storage.sync.get('blockRequest', function(data) {
        data.blockRequest.length > 0 && chrome.webRequest.onBeforeRequest.addListener(
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
function stopBlock() {
    chrome.webRequest.onBeforeRequest.removeListener(blockedRequest);
}
function blockedRequest(detail){
    console.info( 'Blocked :  ' + detail.url)
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