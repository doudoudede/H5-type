<template>
    <router-link tag="view" :to="{name: 'Store', query: {userCode: itemData.userCode}}" class="m-vendor-con">
        <view class="pic">
            <img v-if="itemData.shopLogo" v-lazy="picServer + itemData.shopLogo" alt="">
            <img v-else src="../../static/images/default.png" alt="">
        </view>
        <view class="msg">
            <view class="name ellipsis">{{itemData.shopName ? itemData.shopName : itemData.venName}}</view>
            <view class="des" v-if="showBusinessTypeName">主营品类：{{itemData.businessTypeName}}</view>
            <view class="des">{{itemData.proCount}}件商品/月销{{itemData.orderCount}}单</view>
            <view class="coupon" v-if="itemData.couponInfoList && itemData.couponInfoList.length">
                <view>
                    <template v-if="itemData.couponInfoList[0].useRuleType === 1"><span class="coupon-style">券</span>满&yen;{{itemData.couponInfoList[0].useOrderAmount | toFixed2}}减&yen;{{itemData.couponInfoList[0].useDisAmount | toFixed2}}</template>
                    <template v-else><span class="coupon-style">券</span>无门槛优惠券&yen;{{itemData.couponInfoList[0].useDisAmount | toFixed2}}</template>
                </view>
            </view>
        </view>
    </router-link>
</template>
<script type="text/ecmascript-6">
    export default {
        name: 'xe-vendorCon',
        props: {
            picServer: {
                type: String
            },
            picServerPro: {
                type: String
            },
            itemData: {
                type: Object
            },
            showBusinessTypeName: {
                type: Boolean,
                default: false
            }
        }
    };
</script>
<style rel="stylesheet/scss" lang="scss"></style>
