<template>
    <view class="van-radio-group">
        <slot></slot>
    </view>
</template>

<script>
    export default {
        name: 'xe-radio-group',
        props: {
            value: {},
            disabled: Boolean
        },
        watch: {
            value(value) {
                this.$emit('change', value);
            }
        }
    };
</script>
