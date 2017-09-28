"use strict";
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    console.log(msg);
    if (msg.cmd === "block") {
        let id = msg.id;
        let name = msg.name;
        fetch("https://www.facebook.com/privacy/block_page/", {
            method: "POST",
            credentials: "include",
            body: objToForm({
                page_id: id,
                __a: 1,
                fb_dtsg: document.querySelector('[name="fb_dtsg"]').value,
                confirmed: 1
            })
        }).then(() => {
            chrome.runtime.sendMessage({
                noti: "block",
                id: id,
                name: name
            });

        });
    }
});

function objToForm(obj) {
    let form = new FormData;
    Object.keys(obj).map(function (d) {
        form.append(d, obj[d])
    });
    return form;
}
