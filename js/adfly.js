document.addEventListener('DOMNodeRemoved', () => {
    checkPage();
}, false);

function checkPage() {
    let regex = /ysmm = '(.*?)';/gi.exec(document.getElementsByTagName('html')[0].innerHTML);

    if (regex && regex[1]) {
        let url = getUrl(regex[1]);
        redirectUrl(url);
    }
}
function getUrl(code) {
    let oddStr = '';
    let evanStr = '';

    for (let i = 0; i < code.length; i++) {
        if (i % 2 === 0) {
            oddStr += code[i];
        } else {
            evanStr = code[i] + evanStr;
        }
    }

    let key = oddStr + evanStr;
    return window.atob(key).substring(2);
}
function redirectUrl(url) {
    window.location = url;
}