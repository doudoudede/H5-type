<template>
    <view class="m-vendor-pro">
        <router-link tag="view" :to="{name: 'ProductDetails', params: {prospu: item.proSpu}}" v-for="item in itemData" :key="item.proSpu">
            <view class="pic">
                <img v-lazy="picServerPro + item.proMainImg" alt="">
            </view>
            <p class="price" v-html="splitPrice(item.areaPrice)"></p>
        </router-link>
    </view>
</template>
<script type="text/ecmascript-6">
    export default {
        name: 'xe-endorPro',
        props: {
            picServerPro: {
                type: String
            },
            itemData: {
                type: Array
            }
        }
    };
</script>
<style rel="stylesheet/scss" lang="scss"></style>
