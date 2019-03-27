import Vue from 'vue'
import App from './App'
import store from './store'
import http from '@/utils/httpUtil.js'
import config from '@/config/config.js'
import utils from '@/utils/utils.js'
import bus from '@/utils/eventBus.js'
import storageUtils from '@/utils/storageUtils.js'

Vue.config.productionTip = false

Vue.prototype.$store = store
Vue.prototype.$http = http
Vue.prototype.$config = config
Vue.prototype.$utils = utils
Vue.prototype.$storageUtils = storageUtils
Vue.prototype.$bus= Vue.prototype.$bus ||  bus   //注册一个全局的总线组件

App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
