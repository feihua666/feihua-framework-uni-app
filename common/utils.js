export default {
    copy:function (message) {
        // #ifndef H5
        uni.setClipboardData({
            data:message,
            success(res) {
                uni.showToast({
                    icon: 'none',
                    title: '复制成功'
                });
            }
        })
        // #endif
        // #ifdef H5
        // 多年以\n分隔
        let input = document.createElement("textarea");
        input.readOnly = "readOnly"
        input.value = message;
        document.body.appendChild(input);
        input.select();
        input.setSelectionRange(0, input.value.length);
        document.execCommand('Copy');
        document.body.removeChild(input);
        uni.showToast({
            icon: 'none',
            title: '复制成功'
        });

        // #endif
    },
    ngt(url){
        uni.navigateTo({
            url: url
        });
    },
    ngr(url){
        uni.reLaunch({
            url:url
        })
    },
    // urls为图片url，如果为 字符串类型，只接收一个参数，如果为数组，可指定第二个参数
    pvi(urls,url){
        let param = {
        }
        if(typeof urls == 'string'){
            param.urls = [urls]
        }else{
            param.urls = urls
            if(url){
                param.current = url
            }
        }

        uni.previewImage(param)
    }


}