<template>
    <xe-layout class="m-login m-flexlay">
        <div class="m-login-logo xe-gradient-color animated tada">
            <span class="xe-iconfont xe-icon-logo"></span>
        </div>
        <div class="ml-list">
            <div class="ml-list-item">
                <div class="con">
                    <input class="input-cls" placeholder="输入手机号/邮箱" type="text">
                </div>
                <div class="act">
                    <span class="xe-iconfont xe-icon-cuowu"></span>
                </div>
            </div>
            <div class="ml-list-item">
                <div class="con">
                    <input class="input-cls" placeholder="输入密码" type="password">
                </div>
                <div class="act">
                    <span class="xe-iconfont xe-icon-yanjing"></span>
                    <span class="xe-iconfont xe-icon-cuowu"></span>
                </div>
            </div>
        </div>
        <div class="ml-tips">
            <router-link :to="{}">快捷登录</router-link>
            <router-link :to="{}">忘记密码?</router-link>
        </div>
        <div class="m-login-btn">
            <mt-button type="primary" :disabled="loginBtnFlag" class="xe-button-primary" style="width: 100%;">登 录</mt-button>
        </div>
        <div class="m-login-footer" slot="footer">
            <mt-button type="primary" size="small" class="xe-button-primary" plain>注 册</mt-button>
            <p></p>
        </div>
    </xe-layout>
</template>
<script type="text/ecmascript-6">
    export default {};
</script>
<style rel="stylesheet/scss" lang="scss"></style>
