<template>
    <li class="xe-step-item" :class="{'current': stepNumber <= current}">
        <view class="radius-text xe-iconfont xe-icon-fenleizonghe" v-if="stepNumber <= current - 1"></view>
        <view class="radius-text" v-else>{{stepNumber}}</view>
        <view class="radius-bg"></view>
        <view class="bottom-text"><slot name="text"></slot></view>
    </li>
</template>
<script>
    export default {
        name: 'xe-step-item',
        data () {
            return {
                stepNumber: '',
                current: 0
            };
        },
        mounted() {
            this.$nextTick(() => {
                this.$parent.updateChild();
            });
        }
    };
</script>
