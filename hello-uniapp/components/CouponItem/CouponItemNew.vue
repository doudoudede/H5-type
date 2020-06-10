<template>
    <div class="popup-coupon-itemcon">
        <div class="scroll-box">
            <div class="scroll-item">
                <div class="shop-coupon-name">店铺优惠券</div>
                <div class="item" v-for="item in couponList" :key="item.couTempId">
                    <div class="item-circle-bot"></div>
                    <div class="item-circle">
                        <i v-for="item in 20" :key="item"></i>
                    </div>
                    <div class="item-left">
                        <div class="item-left-con">
                            <div class="item-t">
                                <em>&yen;</em><span class="big-pri">{{item.useDisAmount}}</span><!--span class="small-pri">.00</span-->
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
                        <div class="coupn-con">
                            <p class="shop-name">河南众品股份有限公司有限公河南众品股份有限公司有限公河南众品股份有限公司有限公</p>
                            <p class="shop-prolis">
                                <!--  "sendPlat":1,//发放平台：1、平台 2、商户 -->
                                <!-- 使用范围 1 全部商品 2 指定品类 3 指定商品 -->
                                <!-- 如来云商券 -->
                                <template v-if="item.sendPlat == 1">
                                    <span v-if="item.useRange === 3">可购买如来云商铺部分单品</span>
                                    <span v-else-if="item.useRange === 2">可购买如来云商铺部分品类商品</span>
                                    <span v-else>可购买如来云商全部商品</span>
                                </template>
                                <!-- 店铺券 -->
                                <template v-if="item.sendPlat == 2">
                                    <span v-if="item.useRange === 3">可购买本店铺部分单品</span>
                                    <span v-else-if="item.useRange === 2">可购买本店铺部分品类商品</span>
                                    <span v-else>可购买本店全部商品</span>
                                </template>
                            </p>
                            <p class="shop-prolis">{{item.activeTimeStart}} - {{item.activeTimeEnd}}</p>
                        </div>
                        <div class="coupn-sele">
                            <xe-radio size="large" v-model="checkedAll" @input="checkedAllFn"></xe-radio>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="nav-bar"><span>确定</span></div>
    </div>
</template>
<script type="text/ecmascript-6">
    import {Radio, RadioGroup} from 'components/Radio';
    export default {
        name: 'xe-couponItem',
        props: {
            couponList: {
                type: Array,
                default: []
            }
        },
        data() {
            return {
                checkedAll: []
            };
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
            },
            checkedAllFn() {
            }
        },
        components: {
            [Radio.name]: Radio,
            [RadioGroup.name]: RadioGroup
        }
    };
</script>
<style rel="stylesheet/scss" lang="scss">
    @import '../../static/styles/components/couponList.scss';
</style>
