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
        let input = document.createElement("input");
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
    }

}