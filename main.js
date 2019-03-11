import Vue from 'vue'
import App from './App'
import store from './store'
import http from '@/common/httpUtil.js'
import config from '@/common/config.js'
import dictUtils from '@/common/dictUtils.js'
import bus from '@/common/eventBus.js'

Vue.config.productionTip = false

Vue.prototype.$store = store
Vue.prototype.$http = http
Vue.prototype.$config = config
Vue.prototype.$dictUtils = dictUtils
Vue.prototype.$bus= Vue.prototype.$bus ||  bus   //注册一个全局的总线组件

App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
