import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        /**
         * 是否需要强制登录
         */
        splash:true,
        forcedLogin: true,
        hasLogin: false,
        userinfo: null,
        dicts: {},
        regs:null
    },
    mutations: {
        setUserinfo(state, userinfo) {
            state.userinfo = userinfo
			if(userinfo) {
			    state.hasLogin = true;
			}
        },
        removeUserinfo(state) {
            state.userinfo = {};
            state.hasLogin = false;
        },
        setDicts(state, dicts) {
            state.dicts = dicts
        },
        setRegs(state, regs) {
            state.regs = regs
        },
        setSplash(state, splash) {
            state.splash = splash
        },
        setSearch(state, search) {
            state.search = search
        }
    }
})

export default store
