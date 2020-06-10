<template>
    <div class="m-layout">
        <div class="g-flexview" :class="{'navBottom': !$route.meta.noShowBar}">
            <slot name="header"></slot>
            <div class="scrollview" id="scrollview">
                <slot></slot>
            </div>
            <slot name="footer"></slot>
        </div>
        <slot name="outer"></slot>
    </div>
</template>
<script type="text/ecmascript-6">
    export default {
        name: 'xe-layout'
    };
</script>
<style rel="stylesheet/scss" lang="scss"></style>
