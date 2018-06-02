'use strict';

const FIRST = 0;
const FORWARD_SLASH_LENGTH = 1;
const fbRingtone = [
    '*://*/rsrc.php/yh/r/taJw7SpZVz2.mp3',
    '*://*/rsrc.php/yO/r/kTasEyE42gs.ogg'
];
const GRAPH_API = 'https://graph.facebook.com/v2.10/';

function getOuo(link) {
    fetch(link, {method: 'post'}).then(response => {
        if (response.url) {
            const dataUOU = {
                url: response.url,
            };
            chrome.windows.create(dataUOU);
        }
    });
}

function createMenuItem() {
    const getOuoItem = {
        id: 'getOUO',
        title: 'Get link',
        contexts: ['link'],
        targetUrlPatterns: [
            '*://*.ouo.io/*',
            '*://*.ouo.press/*'
        ]
    };
    const blockFb = {
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
            let id;
            let index;
            switch (info.menuItemId) {
                case 'getOUO':
                    log(info.selectionText);
                    link = `${link.split(/\/.{6}$/).shift()}/rgo${link.match(/\/.{6}$/)}`;
                    log(link);
                    if (/\/rgo\/.{6}$/.test(link)) {
                        getOuo(link);
                    }
                    break;
                case 'blockFb':
                    id = new URL(info.linkUrl).pathname;
                    index = id.lastIndexOf('/groups/');
                    if (index >= FIRST) {
                        return;
                    }
                    index = id.lastIndexOf('-');
                    id = id.substr(FORWARD_SLASH_LENGTH);
                    if (index >= FIRST) {
                        id = id.substr(index);
                    }
                    blockPage(id, tab);
                    break;
                default:

            }
        }
    });
}

function initIsEnable() {
    chrome.storage.sync.get({
        enable: true
    }, data => {
        if (data.enable === true) {
            startBlock();
        }
    });
}

createMenuItem();
initIsEnable();
let removeRingtone = () => {
    log('This is identity function !!!');
};

function setRingTone(valueURL) {

    log(`ringtone : ${valueURL}`);
    removeRingtone();
    if (valueURL) {
        const blockFunc = () => ({redirectUrl: valueURL});
        removeRingtone = () => {
            chrome.webRequest.onBeforeRequest.removeListener(blockFunc);
        };

        chrome.webRequest.onBeforeRequest.addListener(
            blockFunc,
            {urls: fbRingtone},
            ['blocking', 'requestBody']);
    }
}

chrome.storage.onChanged.addListener(change => {
    if (change.enable) {
        if (change.enable.newValue === true) {
            startBlock();
        } else {
            log('Stopping Block');
            stopBlock();
        }
    }
    if (change.listBlock) {
        startBlock();
    }
    if (change.fbBlock) {
        checkFacebook();
    }
    if (change.ringtone) {
        setRingTone(change.ringtone.newValue);
    }
});

function stopBlock() {
    chrome.webRequest.onBeforeRequest.removeListener(blockedRequest);
}

function stopBlockFB() {
    log('stopFb');
    chrome.webRequest.onBeforeRequest.removeListener(blockedFb);
}

function blockedRequest(detail) {
    log(` |Blocked :  ${detail.url}`);
    return {
        cancel: true,
    };
}

function startBlock() {
    stopBlock();
    log('Starting Block');
    chrome.storage.sync.get(['listBlock', 'enable'], data => {
        if (data.enable && data.listBlock && data.listBlock.length > FIRST) {
            chrome.webRequest.onBeforeRequest.addListener(blockedRequest, {
                urls: data.listBlock,
            }, ['blocking']);
        }
        for (const p in data.listBlock) {
            if (data.listBlock.hasOwnProperty(p)) {
                log(`  |----Block patterns : ${data.listBlock[p]}`);
            }
        }
    });
}

function checkFacebook() {
    stopBlockFB();
    log('Starting checkFacebook');
    const blockRequestFb = [];
    const blockFb = {
        'block-seen-chat': '*://*/ajax/mercury/change_read_status.php*',
        'block-typing-chat': '*://*/ajax/messaging/typ.php*',
        'block-typing-post': '*://*/ufi/typing/*',
        'block-timeline': '*://*/ajax/pagelet/generic.php/LitestandTailLoadPagelet*',
    };
    chrome.storage.sync.get('fbBlock', data => {
        for (const index in data.fbBlock) {
            if (data.fbBlock.hasOwnProperty(index) && data.fbBlock[index] === true) {
                blockRequestFb.push(blockFb[index]);
            }
        }
        log(blockRequestFb);
        if (blockRequestFb.length) {
            chrome.webRequest.onBeforeRequest.addListener(blockedFb, {
                urls: blockRequestFb,
            }, ['blocking']);
        }
    });
}

function blockedFb(detail) {
    log(` |Blockedfb :  ${detail.url}`);
    return {
        cancel: true,
    };
}

function setToken(access_token) {
    fetch(`${GRAPH_API}me?access_token=${access_token}`)
        .then(res => res.json())
        .then(json => {
            if (json.id) {
                chrome.storage.sync.set({access_token: access_token}, () => {
                    log(`Set Token success with token : ${access_token}`);
                });
            }
        });
}

const icon = chrome.extension.getURL('knife.png');

function blockPage(name, tab) {
    chrome.storage.sync.get(['access_token'], data => {
        const access_token = data.access_token;
        fetch(`${String(GRAPH_API) + name}?fields=id,name&access_token=${access_token}`)
            .then(res => res.json())
            .then(json => {
                log(json);
                if (json.id) {
                    log(tab.id);
                    chrome.tabs.sendMessage(tab.id, {
                        cmd: 'block',
                        id: json.id,
                        name: json.name
                    });
                } else if (json.error) {
                    chrome.notifications.create({
                        type: 'basic',
                        iconUrl: icon,
                        title: 'error',
                        message: json.error.message
                    });
                }
            });
    });
}

chrome.runtime.onMessage.addListener(msg => {
    if (msg && msg.noti === 'block') {
        chrome.notifications.create({
            type: 'basic',
            iconUrl: icon,
            appIconMaskUrl: icon,
            title: 'Blocked',
            message: `${msg.name}\n${msg.id}`
        });
    }
});

function log(...args) {
    console.log(...args);
}
