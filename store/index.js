import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        userinfo: {}
    },
    mutations: {
        setUserinfo(state, userinfo) {
            state.userinfo = userinfo
        },
        removeUserinfo(state) {
            state.userinfo = {}
        }
    }
})

export default store
