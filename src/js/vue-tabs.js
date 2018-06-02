'use strict';

const DEFAULT_TAB = 0;
Vue.component('tabs', {
    props: {
        options: {
            type: Object,
            required: false,
            default: () => ({
                useUrlFragment: true,
            }),
        },
    },
    data: () => ({
        tabs: [],
        activeTabHash: '',
    }),
    mounted() {
        if (this.tabs.length) {
            this.selectTab(this.tabs[DEFAULT_TAB].hash);
        }
    },
    created() {
        this.tabs = this.$children;
    },
    methods: {
        findTab(hash) {
            return this.tabs.find(tab => tab.hash === hash);
        },
        selectTab(selectedTabHash) {
            const selectedTab = this.findTab(selectedTabHash);
            if (!selectedTab) {
                return;
            }
            if (selectedTab.isDisabled) {
                return;
            }
            this.tabs.forEach(tab => {
                tab.isActive = (tab.hash === selectedTab.hash);
            });
            this.activeTabHash = selectedTab.hash;
        },
        setTabVisible(hash, visible) {
            const tab = this.findTab(hash);
            if (!tab) {
                return;
            }
            tab.isVisible = visible;
            if (tab.isActive) {
                // If tab is active, set a different one as active.
                tab.isActive = visible;
                this.tabs.every(tab => {
                    if (tab.isVisible) {
                        tab.isActive = true;
                        return false;
                    }
                    return true;
                });
            }
        },
    },
    template: `
        <div class="tabs-component">
            <ul role="tablist" class="tabs-component-tabs">
                <li v-for="(tab, i) in tabs" :key="i" :class="{ 'is-active': tab.isActive, 'is-disabled': tab.isDisabled }" class="tabs-component-tab" role="presentation" v-show="tab.isVisible" >
                    <a v-html="tab.header" @click="selectTab(tab.hash, $event)" :href="tab.hash" class="tabs-component-tab-a" role="tab" ></a>
                </li>
            </ul>
            <div class="tabs-component-panels">
                <slot/>
            </div>
        </div>`
});
Vue.component('tab', {
    props: {
        id: {default: null},
        name: {required: true},
        badge: {default: ''},
        isDisabled: {default: false},
    },
    data: () => ({
        isActive: false,
        isVisible: true,
    }),
    computed: {
        header() {
            if (!this.badge) {
                return this.name;
            }
            return this.name + `<span class="badge">${this.badge}</span>`;
        },
        hash(a) {
            //console.log('hash', a);
            if (this.isDisabled) {
                return '#';
            }
            return this.id ?
                '#' + a.id :
                '#' + a.name.toLowerCase().replace(/ /g, '-');
        },
    },
    template: '<section v-show="isActive" :aria-hidden="! isActive" class="tabs-component-panel" :id="hash" role="tabpanel"><slot /></section>'
});
