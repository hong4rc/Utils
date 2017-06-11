document.addEventListener('DOMNodeRemoved', () => {
    checkPage();
}, false);

function checkPage() {
    let regexYsmm = /ysmm = '(.*?)';/gi.exec(document.getElementsByTagName('html')[0].innerHTML);

    if (regexYsmm && regexYsmm[1]) {
        let url = getUrl(regexYsmm[1]);
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
    let url = window.atob(key).substring(2);
    return url;
}
function redirectUrl(url) {
    window.location = url;
}