import 'babel-polyfill';
import VueClipboard from 'vue-clipboard2'
// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import './static/styles/base/iconfont.scss';
import Vue from 'vue';
import ele from 'utils/element.js'
import App from './App';
import VueLazyload from 'vue-lazyload';
import router from './router';
import filters from './filters';
import FastClick from 'fastclick';
import Mixin from './mixins';
import bus from './bus.js';
import store from './store';
import axios from 'utils/httpRequest';
import VueTouch from 'vue-touch';
import { setLocalStorage, getLocalStorage, removeLocalStorage } from 'utils/commonBase';
import Cookies from 'js-cookie';
import ulid from 'ulid';
import ElementUI from 'element-ui'
require('swiper/dist/css/swiper.css');
// 看用户没有UUID
if (!getLocalStorage('UUID')) {
    let UUID = ulid();
    setLocalStorage('UUID', UUID);
}
import { MessageBox, Toast, Indicator, Button, Spinner } from 'mint-ui';
const vueComponents = [
    Button,
    Spinner
];
vueComponents.map(component => {
    Vue.component(component.name, component);
});
Object.defineProperty(Vue.prototype, '$xeMessageBox', { value: MessageBox });
Object.defineProperty(Vue.prototype, '$toast', { value: Toast });
Object.defineProperty(Vue.prototype, '$indicator', { value: Indicator });
Object.defineProperty(Vue.prototype, '$setLocalStorage', { value: setLocalStorage });
Object.defineProperty(Vue.prototype, '$getLocalStorage', { value: getLocalStorage });
Object.defineProperty(Vue.prototype, '$removeLocalStorage', { value: removeLocalStorage });
Object.defineProperty(Vue.prototype, '$bus', { value: bus });
Object.defineProperty(Vue, '$http', { value: axios });
Object.defineProperty(Vue.prototype, '$http', { value: axios });
Object.defineProperty(Vue.prototype, '$cookie', { value: Cookies });
// 实例化Vue的filters
Object.keys(filters).forEach(k => Vue.filter(k, filters[k]));

if ('addEventListener' in document) {
    document.addEventListener('DOMContentLoaded', function() {
        FastClick.attach(document.body, { click: true });
    }, false);
};
Vue.use(ElementUI);
Vue.use(VueLazyload);
Vue.use(VueClipboard)
Vue.use(VueTouch, { name: 'v-touch' });
// 布局组件
import LayOut from 'components/LayOut/LayOut';
Vue.component(LayOut.name, LayOut);

import Slider from 'components/Slider/Slider';
Vue.component(Slider.name, Slider);

import InfiniteLoading from 'vue-infinite-loading';
Vue.component('infinite-loading', InfiniteLoading);

Vue.config.productionTip = false;
Vue.mixin(Mixin);
if (process.env.NODE_ENV === 'production') {
    window.locationHref = 'http://wap.yilis.com/#/';
    window.locationHrefs = 'http://wap.yilise.com/#/';
} else if (process.env.NODE_ENV === 'qa') {
    window.locationHref = 'http://pay.yilise.com/#/';
    window.locationHrefs = 'http://wap.yilise.com/#/';
} else if (process.env.NODE_ENV === 'development') {
    window.locationHref = 'http://pay.yilise.com/#/';
    window.locationHrefs = 'http://wap.yilise.com/#/';
    // window.locationHref = 'https://newpay.xebest.com/#/';
    // window.locationHref = `http://${process.env.IP || 'localhost'}:8081/#/`;
} else {
    window.locationHref = '';
    // window.locationHref = 'https://newpay.xebest.com/#/';
}
/* eslint-disable no-new */
new Vue({
    el: '#app',
    ele,
    router,
    store,
    template: '<App/>',
    components: { App }
});