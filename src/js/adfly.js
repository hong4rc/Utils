'use strict';

const FIRST = 0;
const YSMM_OFFSET = 1;
const TWO = 2;
document.addEventListener('DOMNodeRemoved', () => {
    checkPage();
}, false);

function checkPage() {
    const regex = /ysmm = '(.*?)';/gi.exec(document.getElementsByTagName('html')[FIRST].innerHTML);
    const ysmm = regex && regex[YSMM_OFFSET];
    if (ysmm) {
        const url = getUrl(ysmm);
        redirectUrl(url);
    }
}

function getUrl(code) {
    let oddStr = '';
    let evanStr = '';

    for (let i = 0; i < code.length; i++) {
        if (i % TWO) {
            evanStr = code[i] + evanStr;
        } else {
            oddStr += code[i];
        }
    }

    const key = oddStr + evanStr;
    return window.atob(key).substring(TWO);
}

function redirectUrl(url) {
    window.location = url;
}
