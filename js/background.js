chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.todo === "showPageAction") {
        chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
            chrome.pageAction.show(tabs[0].id);
        });
    }
});

var menuItem = {
    id: "anhhong",
    title: "Translate with vdict",
    contexts: ["selection"]
}
chrome.contextMenus.create(menuItem);
chrome.contextMenus.onClicked.addListener(function(data) {
    if (data.menuItemId === "anhhong" && data.selectionText) {
        var link = 'https://vdict.com/';
        var dt = encodeURI(data.selectionText);
        link += dt + ',1,0,0.html';
        var createData = {
            url: link,
            type: "popup",
            top: 5,
            left: 5,
            width: 800,
            height: 500,
        }
        chrome.windows.create(createData, function() {});
    }
});
