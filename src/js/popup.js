'use strict';

const FIRST = 0;
const ONE = 1;
const BANG_CHAR_CODE = 33;
const TILDE_CHAR_CODE = 126;
const RANGE_FULL_WIDTH = 65248;
const DEFAULT_PATTERN = '*://*.';
const defaultData = {
    enable: false,
    listBlock: [DEFAULT_PATTERN],
    fbBlock: {
        'block-seen-chat': true,
        'block-typing-chat': true,
        'block-typing-post': true,
        'block-timeline': false
    },
    ringtone: 'set here'
};
const readData = new Promise(resolve => {
    chrome.storage.sync.get(defaultData, data => {
        resolve(data);
    });
});

readData.then(data => {
    const TAG_MARK = 'app';

    Vue.component('block-request', {
        props: {
            id: {default: ''}
        },
        data() {
            let parent = this.$parent;
            log('1', parent);
            while (parent.tagMark !== TAG_MARK) {
                parent = parent.$parent;
                if (parent === undefined) {
                    break;
                }
                log(parent);
            }
            return {
                checked: false,
                parent: parent

            };
        },
        created() {
            this.checked = this.parent.fbBlock[this.id] === true;
        },
        computed: {
            sendId() {
                if (this.parent.update && typeof this.parent.update === 'function') {
                    this.parent.update({key: this.id, value: this.checked});
                }
            }
        },
        template: `
            <div :class="{ checked: checked }" class="blocked-cb">
                <input :id="id" type="checkbox" :value="id" v-model="checked" :change="sendId">
                <label :for="id"><slot /></label>
            </div>`
    });

    new Vue({
        el: '#tab-view',
        data() {
            data.tagMark = TAG_MARK;
            data.msg = '';
            return data;
        },
        watch: {
            listBlock(newList) {
                if (newList.length === FIRST) {
                    this.add();
                }
            }
        },
        computed: {
            hrefList() {
                return `data:text/plain;base64,${btoa(JSON.stringify(this.listBlock))}`;
            },
            tick() {
                chrome.storage.sync.set({enable: this.enable});
                if (this.enable) {
                    return 'g-icon-check';
                }
                return 'g-icon-unchecked';
            },
            enBase64() {
                return btoa(this.msg);
            },
            deBase64() {
                try {
                    return atob(this.msg);
                } catch (e) {
                    return 'The string to be decoded is not correctly encoded.';
                }
            },
            lower() {
                return this.msg.toLocaleLowerCase();
            },
            upper() {
                return this.msg.toLocaleUpperCase();
            },
            fullWidth() {
                return this.msg.split('').map(c => {
                    const charCode = c.charCodeAt(FIRST);
                    if (charCode < BANG_CHAR_CODE || charCode > TILDE_CHAR_CODE) {
                        return c;
                    }
                    return String.fromCharCode(charCode + RANGE_FULL_WIDTH);
                }).join('');
            }
        },
        methods: {
            update(data) {
                this.fbBlock[data.key] = data.value;
                chrome.storage.sync.set({fbBlock: this.fbBlock});
            },
            add() {
                this.listBlock.unshift(DEFAULT_PATTERN);
            },
            removeRun(index) {
                this.listBlock.splice(index, ONE);
            },
            readFile(event) {
                const reader = new FileReader();
                reader.onload = event => {
                    const result = event.target.result;
                    try {
                        this.listBlock = JSON.parse(result);
                    } catch (e) {
                        log(e);
                    }
                };
                const file = event.target.files[FIRST];
                reader.readAsText(file);
            },
            saveListBlock() {
                log('this.listBlock', this.listBlock);
                chrome.storage.sync.set({listBlock: this.listBlock});
            },
            removeAll() {
                this.listBlock = [];
                this.saveListBlock();
            }
        }
    });
});

function log(...args) {
    console.log(...args);
}
