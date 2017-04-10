chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.todo === "showPageAction") {
        chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
            chrome.pageAction.show(tabs[0].id);
        });
    }
});

var menuItem = {
    id: "anhhong",
    title: "Speak",
    contexts: ["selection"]
}
chrome.contextMenus.create(menuItem);
chrome.contextMenus.onClicked.addListener(function(data) {
    if (data.menuItemId === "anhhong" && data.selectionText) {
        var link = 'https://code.responsivevoice.org/getvoice.php?tl=vi&rate=0.5&vol=1&t=';
        link += encodeURI(data.selectionText);
        var createData = {
            url: link,
            type: "popup",
            top: 5,
            left: 5,
            width: 500,
            height: 500,
        }
        chrome.windows.create(createData, function() {});
    }
});
