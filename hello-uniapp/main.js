import Vue from 'vue'
import App from './App'
import './static/styles/base/iconfont.scss';
import ele from 'utils/element.js'
// import axios from 'utils/httpRequest';
// import 'mint-ui/lib/style.css'
// import VueLazyload from 'vue-lazyload';

// import pageHead from './components/page-head.vue'
// import pageFoot from './components/page-foot.vue'
// import uLink from '@/components/uLink.vue'
// import store from './store'
// Vue.config.productionTip = false

// import ElementUI from 'element-ui'
App.mpType = 'app'
 
const app = new Vue({
	...App
})
app.$mount()
