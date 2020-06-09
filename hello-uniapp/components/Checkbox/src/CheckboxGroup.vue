<template>
    <view class="van-checkbox-group">
        <slot></slot>
    </view>
</template>

<script>
    export default {
        name: 'xe-checkbox-group',
        props: {
            value: {},
            disabled: Boolean
        },
        watch: {
            value(val) {
                this.$emit('change', val);
            }
        }
    };
</script>
