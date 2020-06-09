<template>
    <xe-layout class="m-login m-flexlay">
        <view class="m-login-logo xe-gradient-color animated tada">
            <span class="xe-iconfont xe-icon-logo"></span>
        </view>
        <view class="ml-list">
            <view class="ml-list-item">
                <view class="con">
                    <input class="input-cls" placeholder="输入手机号/邮箱" type="text">
                </view>
                <view class="act">
                    <span class="xe-iconfont xe-icon-cuowu"></span>
                </view>
            </view>
            <view class="ml-list-item">
                <view class="con">
                    <input class="input-cls" placeholder="输入密码" type="password">
                </view>
                <view class="act">
                    <span class="xe-iconfont xe-icon-yanjing"></span>
                    <span class="xe-iconfont xe-icon-cuowu"></span>
                </view>
            </view>
        </view>
        <view class="ml-tips">
            <router-link :to="{}">快捷登录</router-link>
            <router-link :to="{}">忘记密码?</router-link>
        </view>
        <view class="m-login-btn">
            <mt-button type="primary" :disabled="loginBtnFlag" class="xe-button-primary" style="width: 100%;">登 录</mt-button>
        </view>
        <view class="m-login-footer" slot="footer">
            <mt-button type="primary" size="small" class="xe-button-primary" plain>注 册</mt-button>
            <p></p>
        </view>
    </xe-layout>
</template>
<script type="text/ecmascript-6">
    export default {};
</script>
<style rel="stylesheet/scss" lang="scss"></style>
