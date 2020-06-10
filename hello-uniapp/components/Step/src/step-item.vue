<template>
    <li class="xe-step-item" :class="{'current': stepNumber <= current}">
        <div class="radius-text xe-iconfont xe-icon-fenleizonghe" v-if="stepNumber <= current - 1"></div>
        <div class="radius-text" v-else>{{stepNumber}}</div>
        <div class="radius-bg"></div>
        <div class="bottom-text"><slot name="text"></slot></div>
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
