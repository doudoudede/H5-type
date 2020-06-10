<template>
    <div style="height: 100%;">
        <keep-alive>
            <router-view v-if="$route.meta.keepAlive"></router-view>
        </keep-alive>
        <router-view v-if="!$route.meta.keepAlive"></router-view>
    </div>
</template>
<script type="text/ecmascript-6">
    export default {};
</script>
<style rel="stylesheet/scss" lang="scss"></style>
