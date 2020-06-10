<template>
    <div class="popup-coupon-itemcon">
        <div class="item" v-for="item in couponList" :key="item.couTempId">
            <div class="item-circle-bot"></div>
            <div class="item-circle">
                <i v-for="item in 20" :key="item"></i>
            </div>
            <div class="item-left">
                <div class="item-left-con">
                    <div class="item-t">
                        <em>&yen;</em><span class="big-pri">{{item.useDisAmount | retainedDecimalToNum}}</span><!--span class="small-pri">.00</span-->
                    </div>
                    <div class="item-d">
                        <template v-if="item.useRuleType === 1">
                            满&yen;{{item.useOrderAmount}}可用
                        </template>
                        <template v-else>
                            无门槛优惠券
                        </template>
                    </div>
                </div>
            </div>
            <div class="item-right">
                <div class="item-r-msg">{{item.useRange, item.sendPlat | useRangeToText}}</div>
                <div class="item-r-time" v-if="item.useTimeType == 1">{{item.activeTimeStart}} - {{item.activeTimeEnd}}</div>
                <div class="item-r-time" v-else>优惠券到账后{{item.activeDay}}天内有效</div>
                <div class="item-r-btn">
                    <mt-button type="primary" size='small' class="xe-button-primary is-radius" plain @click.prevent="createCoupTempletById(item)">立即领取</mt-button>
                </div>
            </div>
        </div>
    </div>
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
