'use strict';

chrome.runtime.onMessage.addListener(msg => {
    console.log(msg);
    if (msg.cmd === 'block') {
        const id = msg.id;
        const name = msg.name;
        fetch('https://www.facebook.com/privacy/block_page/', {
            method: 'POST',
            credentials: 'include',
            body: objToForm({
                page_id: id,
                __a: 1,
                fb_dtsg: document.querySelector('[name="fb_dtsg"]').value,
                confirmed: 1
            })
        }).then(() => {
            chrome.runtime.sendMessage({
                noti: 'block',
                id: id,
                name: name
            });

        });
    }
});

function objToForm(obj) {
    const form = new FormData();
    Object.keys(obj).map(d => {
        form.append(d, obj[d]);
    });
    return form;
}
