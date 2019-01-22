import Vue from 'vue'
import App from './App'
import store from './store'
import http from '@/common/httpUtil.js'
import config from '@/common/config.js'
import dictUtils from '@/common/dictUtils.js'

Vue.config.productionTip = false

Vue.prototype.$store = store
Vue.prototype.$http = http
Vue.prototype.$config = config
Vue.prototype.$dictUtils = dictUtils

App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
