import Vue from 'vue'
import App from './App'
import store from './store'
import http from '@/common/httpUtil.js'
import config from '@/common/config.js'

Vue.config.productionTip = false

Vue.prototype.$store = store
Vue.prototype.$http = http
Vue.prototype.$config = config

App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
