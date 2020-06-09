<template>
    <view class="popup-coupon-itemcon">
        <view class="item" v-for="item in couponList" :key="item.couTempId">
            <view class="item-circle-bot"></view>
            <view class="item-circle">
                <i v-for="item in 20" :key="item"></i>
            </view>
            <view class="item-left">
                <view class="item-left-con">
                    <view class="item-t">
                        <em>&yen;</em><span class="big-pri">{{item.useDisAmount | retainedDecimalToNum}}</span><!--span class="small-pri">.00</span-->
                    </view>
                    <view class="item-d">
                        <template v-if="item.useRuleType === 1">
                            满&yen;{{item.useOrderAmount}}可用
                        </template>
                        <template v-else>
                            无门槛优惠券
                        </template>
                    </view>
                </view>
            </view>
            <view class="item-right">
                <view class="item-r-msg">{{item.useRange, item.sendPlat | useRangeToText}}</view>
                <view class="item-r-time" v-if="item.useTimeType == 1">{{item.activeTimeStart}} - {{item.activeTimeEnd}}</view>
                <view class="item-r-time" v-else>优惠券到账后{{item.activeDay}}天内有效</view>
                <view class="item-r-btn">
                    <mt-button type="primary" size='small' class="xe-button-primary is-radius" plain @click.prevent="createCoupTempletById(item)">立即领取</mt-button>
                </view>
            </view>
        </view>
    </view>
</template>
<script type="text/ecmascript-6">
    export default {
        name: 'xe-couponItem',
        props: {
            couponList: {
                type: Array,
                default: []
            }
        },
        methods: {
            createCoupTempletById(item) {
                console.log(item);
                this.$http({
                    method: 'post',
                    url: '/xe-route/xe-app/mobile/cart/createCoupTempletById',
                    data: {
                        templetId: item.couTempId
                    }
                }).then(res => {
                    console.log(res);
                    this.$toast({
                        message: '优惠券领成功',
                        position: 'bottom',
                        duration: 1000
                    });
                }).catch(error => {
                    console.log(error);
                });
            }
        }
    };
</script>
<style rel="stylesheet/scss" lang="scss"></style>
