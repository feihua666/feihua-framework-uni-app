<template>
</template>

<script>
    export default {
        props: {
        },
        data () {
            return {
            }
        },
        created () {
            console.log('fh-login-helper created')
            this.isLogin(this.type, this.val)
        },
        watch: {
        },
        methods: {
            isLogin () {
                this.$http.hasLogin().then(function () {
                }).catch(function () {
                    uni.reLaunch({
                        url:'/pages/login/login'
                    })
				})
            }
        }
    }
</script>
<style>
</style>
