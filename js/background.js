const fbRingtone = ['*://*.facebook.com/rsrc.php/yh/r/taJw7SpZVz2.mp3', '*://*.facebook.com/rsrc.php/yO/r/kTasEyE42gs.ogg'];
const defaultOptions = {
    'seenChat': 1,
    'typingChat': 1,
    'typingPost': 0,
    'stopTimeline': 0,
    'stopGroup': 0,
    'ringtone': 'https://cdn.rawgit.com/Hongarc/music/master/Attention.mp3',
};

function getOuo(link) {
    fetch(link, {
        method: 'post',
    }).then((response) => {
        if (response.url) {
            let dataUOU = {
                url: response.url,
            };
            chrome.windows.create(dataUOU);
        }
    });
}
!function createMenuIteam() {
    let menuItem = {
        id: 'getOUO',
        title: 'Get link',
        contexts: ['selection', 'link'],
        targetUrlPatterns: ['*://*.ouo.io/*', '*://*.ouo.press/*'],
    };
    chrome.contextMenus.create(menuItem);
    chrome.contextMenus.onClicked.addListener(data => {
        if (data.menuItemId === 'getOUO' && (data.selectionText || data.linkUrl)) {
            let link = data.selectionText || data.linkUrl;
            link = link.split(/\/.{6}$/)[0] + '/rgo' + link.match(/\/.{6}$/);
            console.log(link);
            /\/rgo\/.{6}$/.test(link) && getOuo(link);
        }
    });
}();
!function initIsEnable() {
    chrome.storage.sync.get({
        'isEnable': 1,
    }, data => {
        if (data.isEnable === 1) {
            startBlock();
        }
    });
}();
!function initFB() {
    chrome.storage.sync.get(defaultOptions, data => {
        chrome.storage.sync.set({
            'seenChat': data.seenChat,
            'stopTimeline': data.stopTimeline,
            'typingChat': data.typingChat,
            'typingPost': data.typingPost,
            'stopGroup': data.stopGroup,
            'ringtone': data.ringtone,
        }, () => {
            console.log('Init settings Facebook successfull !!!');
        });
        checkFacebook();
        checkringtone(data.ringtone);
    });
}();
let ringtone = {
    block: () => {
    },
    remove: () => {
    },
};
function checkringtone(valueURL) {

    console.log('ringtone : ' + valueURL);
    ringtone.remove();
    if (valueURL) {
        ringtone.block = () => ({redirectUrl: valueURL});
        ringtone.remove = () =>{
            chrome.webRequest.onBeforeRequest.removeListener(ringtone.block);
        };

        chrome.webRequest.onBeforeRequest.addListener(ringtone.block, {
            urls: fbRingtone,
        }, ['blocking', 'requestBody']);
    }
}
chrome.storage.onChanged.addListener(change =>{
    chrome.storage.sync.get({
        'isEnable': 1,
    }, data =>{
        if (change.isEnable) {
            if (data.isEnable === 1) {
                startBlock();
            } else {
                console.log('Stoping Block');
                stopBlock();
            }
        } else if (data.isEnable === 1 && change.blockRequest) {
            startBlock();
        }
    });
    if (change.seenChat || change.typingChat || change.typingPost || change.stopTimeline || change.stopGroup) {
        checkFacebook();
    }
    if (change.ringtone) {
        checkringtone(change.ringtone.newValue);
    }
});

function stopBlock() {
    chrome.webRequest.onBeforeRequest.removeListener(blockedRequest);
}

function stopBlockFB() {
    console.info('stopFb');
    chrome.webRequest.onBeforeRequest.removeListener(blockedFb);
}

function blockedRequest(detail) {
    console.info(' |Blocked :  ' + detail.url);
    return {
        cancel: true,
    };
}

function startBlock() {
    stopBlock();
    console.log('Starting Block');
    chrome.storage.sync.get('blockRequest', data =>{
        data.blockRequest && data.blockRequest.length > 0 &&
        chrome.webRequest.onBeforeRequest.addListener(blockedRequest, {
            urls: data.blockRequest,
        }, ['blocking']);
        for (let p in data.blockRequest) {
            console.warn(`  |----Block patterns : ${data.blockRequest[p]}`);
        }
    });
}

function checkFacebook() {
    stopBlockFB();
    console.log('Starting checkFacebook');
    let blockRequestFb = [];
    let keyFb = [
        'seenChat',
        'typingChat',
        'typingPost',
        'stopTimeline',
        'stopGroup',
    ];
    let valueFb = [
        '*://*/ajax/mercury/change_read_status.php*',
        '*://*.facebook.com/ajax/messaging/typ.php?dpr*',
        '*://*.facebook.com/ufi/typing/*',
        '*://*.facebook.com/ajax/pagelet/generic.php/LitestandTailLoadPagelet*',
        '*://*.facebook.com/ajax/pagelet/generic.php/GroupEntstreamPagelet*',
    ];
    chrome.storage.sync.get(keyFb, data =>{
        for (let index in keyFb) {
            (data[keyFb[index]] === 1) && blockRequestFb.push(valueFb[index]);
        }
        console.log(blockRequestFb);
        blockRequestFb.length && chrome.webRequest.onBeforeRequest.addListener(blockedFb, {
            urls: blockRequestFb,
        }, ['blocking']);
    });
}

function blockedFb(detail) {
    console.info(' |Blockedfb :  ' + detail.url);
    return {
        cancel: true,
    };
}
!function blockLinkneverDie() {
    let listLinkNewverdie = [
        '*://*.google-analytics.com/analytics.js',
        '*://*.popclck.net/*',
        '*://*.scorecardresearch.com/*',
        '*://adsire.com/*',
    ];
    chrome.webRequest.onBeforeRequest.addListener(logLinkneverdie, {
        urls: listLinkNewverdie,
    }, ['blocking']);
}();

function logLinkneverdie(detail) {
    console.info(' |BlockedDie :  ' + detail.url);
    return {
        cancel: true,
    };
}
