<template>
	<text> {{label || text}}</text>
</template>

<script>
    export default {
        props: {
            type: {
                default: null
            },
            val: {
                default: null
            },
            text: {
                default: ''
            }
        },
        data () {
            return {
                label: null
            }
        },
        created () {
            console.log('fh-dict-text onReady')
            this.setLabel(this.type, this.val)
        },
        watch: {
            type () {
                this.setLabel(this.type, this.val)
            },
            val () {
                this.setLabel(this.type, this.val)
            }
        },
        methods: {
            setLabel (type, val) {
                if (type && val) {
                    let self = this
                    this.$http.getDictByValue(type, val).then(function (dict) {
                        self.label = dict.name
                    })
                }
            }
        }
    }
</script>
<style>
</style>
