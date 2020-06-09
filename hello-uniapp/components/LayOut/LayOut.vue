<template>
    <view class="m-layout">
        <view class="g-flexview" :class="{'navBottom': !$route.meta.noShowBar}">
            <slot name="header"></slot>
            <view class="scrollview" id="scrollview">
                <slot></slot>
            </view>
            <slot name="footer"></slot>
        </view>
        <slot name="outer"></slot>
    </view>
</template>
<script type="text/ecmascript-6">
    export default {
        name: 'xe-layout'
    };
</script>
<style rel="stylesheet/scss" lang="scss"></style>
