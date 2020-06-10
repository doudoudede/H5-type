<template>
    <div class="van-checkbox-group">
        <slot></slot>
    </div>
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
