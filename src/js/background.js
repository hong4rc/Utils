"use strict";
const fbRingtone = [
    '*://*/rsrc.php/yh/r/taJw7SpZVz2.mp3',
    '*://*/rsrc.php/yO/r/kTasEyE42gs.ogg'
];
const defaultOptions = {
    'seenChat': 1,
    'typingChat': 1,
    'typingPost': 0,
    'stopTimeline': 0,
    'stopGroup': 0,
    'ringtone': 'https://cdn.rawgit.com/Hongarc/music/master/Attention.mp3'
};
const GRAPH_API = 'https://graph.facebook.com/v2.10/';
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
    let getOuoItem = {
        id: 'getOUO',
        title: 'Get link',
        contexts: ['link'],
        targetUrlPatterns: [
            '*://*.ouo.io/*',
            '*://*.ouo.press/*'
        ]
    };
    let blockFb = {
        id: 'blockFb',
        title: 'Block this Page',
        contexts: ['link'],
        targetUrlPatterns: ['*://*.facebook.com/*/*'],
    };
    chrome.contextMenus.create(getOuoItem);
    chrome.contextMenus.create(blockFb);
    chrome.contextMenus.onClicked.addListener((info, tab) => {
        let link = info.linkUrl;
        if (link) {
            switch (info.menuItemId) {
                case 'getOUO':
                    log(info.selectionText);
                    link = link.split(/\/.{6}$/)[0] + '/rgo' + link.match(/\/.{6}$/);
                    log(link);
                    /\/rgo\/.{6}$/.test(link) && getOuo(link);
                    break;
                case 'blockFb':
                    let url = new URL(info.linkUrl);
                    let id = url.pathname;
                    let index = id.lastIndexOf("/groups/");
                    if (index >= 0) {
                        return;
                    }
                    index = id.lastIndexOf("-");
                    id = id.substr(1);
                    if (index > 0) {
                        id = id.substr(index);
                    }
                    blockPage(id, tab);
                    break;
                default:

            }
        }
    });
}();
!function initIsEnable() {
    chrome.storage.sync.get({
        'isEnable': 1
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
            log('Init settings Facebook successfull !!!');
        });
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

    log('ringtone : ' + valueURL);
    ringtone.remove();
    if (valueURL) {
        ringtone.block = () => ({redirectUrl: valueURL});
        ringtone.remove = () => {
            chrome.webRequest.onBeforeRequest.removeListener(ringtone.block);
        };

        chrome.webRequest.onBeforeRequest.addListener(ringtone.block, {
            urls: fbRingtone,
        }, [
            'blocking',
            'requestBody'
        ]);
    }
}
chrome.storage.onChanged.addListener(change => {
    if (change.isEnable) {
        if (change.isEnable.newValue === 1) {
            startBlock();
        } else {
            log('Stoping Block');
            stopBlock();
        }
    } else if (change.blockRequest) {
        startBlock();
    }
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
    log('Starting Block');
    chrome.storage.sync.get(['blockRequest', 'isEnable'], data => {
        data.isEnable && data.blockRequest && data.blockRequest.length > 0
        && chrome.webRequest.onBeforeRequest.addListener(blockedRequest, {
            urls: data.blockRequest,
        }, ['blocking']);
        for (let p in data.blockRequest) {
            console.info(`  |----Block patterns : ${data.blockRequest[p]}`);
        }
    });
}

function checkFacebook() {
    stopBlockFB();
    log('Starting checkFacebook');
    let blockRequestFb = [];
    let keyFb = [
        'seenChat',
        'typingChat',
        'typingPost',
        'stopTimeline',
        'stopGroup'
    ];
    let valueFb = [
        '*://*/ajax/mercury/change_read_status.php*',
        '*://*.facebook.com/ajax/messaging/typ.php?dpr*',
        '*://*.facebook.com/ufi/typing/*',
        '*://*.facebook.com/ajax/pagelet/generic.php/LitestandTailLoadPagelet*',
        '*://*.facebook.com/ajax/pagelet/generic.php/GroupEntstreamPagelet*',
    ];
    chrome.storage.sync.get(keyFb, data => {
        for (let index in keyFb) {
            (data[keyFb[index]] === 1) && blockRequestFb.push(valueFb[index]);
        }
        log(blockRequestFb);
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
    chrome.webRequest.onBeforeRequest.addListener(logLinkNeverDie, {
        urls: listLinkNewverdie,
    }, ['blocking']);
}();

function logLinkNeverDie(detail) {
    console.info(' |BlockedDie :  ' + detail.url);
    return {
        cancel: true,
    };
}
function setToken(access_token) {
    fetch(GRAPH_API + 'me?access_token=' + access_token)
        .then(res => res.json())
        .then(json => {
            if (json.id) {
                chrome.storage.sync.set({'access_token': access_token}, () => {
                    log('Set Token success with token : ' + access_token);
                });
            }
        });
}

let icon = chrome.extension.getURL("knife.png");

function blockPage(name, tab) {
    chrome.storage.sync.get(['access_token'], data => {
        let access_token = data.access_token;
        fetch(GRAPH_API + '' + name + '?fields=id,name&access_token=' + access_token)
            .then(res => res.json())
            .then(json => {
                log(json);
                if (json.id) {
                    log(tab.id);
                    chrome.tabs.sendMessage(tab.id, {
                        cmd: "block",
                        id: json.id,
                        name: json.name
                    });
                } else if (json.error){
                    chrome.notifications.create({
                        type: "basic",
                        iconUrl: icon,
                        title: "error",
                        message: json.error.message
                    });
                }
            });
    });
}

chrome.runtime.onMessage.addListener((msg) => {
    if (msg && msg.noti === "block") {
        chrome.notifications.create({
            type: "basic",
            iconUrl: icon,
            appIconMaskUrl: icon,
            title: "Blocked",
            message: msg.name + "\n" + msg.id
        });
    }
});

function log(...args) {
    console.log(...args)
}