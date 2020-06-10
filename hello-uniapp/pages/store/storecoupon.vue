<template>
    <transition name="slideInRight">
        <div class="m-stcoupon-con" v-if="couponInfo">
            <div class="stcoupon-content">
                <div class="coupon-cons">
                    <div class="couon-msg">
                        <div class="store-circle store-circle-top">
                            <i v-for="(item, index) in circleNum" :key="index"></i>
                        </div>
                        <div class="sname">
                            {{couponInfo.shopName}}
                        </div>
                        <div class="stime">
                            <div></div>
                            <p v-if="couponInfo.useTimeType === 1">有限期：{{couponInfo.activeTimeStart}} - {{couponInfo.activeTimeEnd}}</p>
                            <p v-else>优惠券到账后{{couponInfo.activeDay}}天内有效</p>
                            <div></div>
                        </div>
                        <div class="spri">
                            &yen; {{couponInfo.useDisAmount | toFixed2}}
                        </div>
                        <div class="sdesc" v-if="couponInfo.useRuleType === 1">
                            满&yen;{{couponInfo.useOrderAmount}}减&yen;{{couponInfo.useDisAmount}}
                        </div>
                        <div class="sdesc" v-else>
                            无门槛优惠券
                        </div>
                        <div class="store-circle store-circle-bottom">
                            <i v-for="item in circleNum" :key="item"></i>
                        </div>
                        <!-- 店铺 -->
                        <div class="stcoupon-icon xe-iconfont xe-icon-dian"></div>
                    </div>
                    <div class="stcoupon-des">
                        <h4>适用商品</h4>
                        <p>
                            <template v-if="couponInfo.useRange === 3">可购买本店铺部分单品：{{proRangeText}}</template>
                            <template v-else-if="couponInfo.useRange === 2">可购买本店铺部分品类商品：{{proRangeText}}</template>
                            <template v-else>可购买本店全部商品</template>
                        </p>
                    </div>
                    <div class="stcoupon-des">
                        <h4>适用范围</h4>
                        <p>{{couponInfo.useAreaName}}</p>
                    </div>
                    <div class="stcoupon-des" v-if="couponInfo.useRuleType === 2">
                        <h4>使用条件</h4>
                        <p>订单金额大于优惠券金额可用</p>
                    </div>
                    <div class="stcoupon-des" v-if="couponInfo.sendType === 2">
                        <h4>领取条件</h4>
                        <p>本店铺单次购买满&yen;{{couponInfo.sendOrderAmount}}发放</p>
                    </div>
                </div>
            </div>
            <div class="stcoupon-btns">
                <mt-button v-if="couponInfo.sendType === 2 && couponInfo.sendPlat === 2" class="xe-button-primary" type="primary" style="width: 100%;" @click.prevent="buynow">开始采购</mt-button>
                <mt-button v-if='couponInfo.sendType !== 2' class="xe-button-primary" type="primary" style="width: 100%;" @click.prevent="getCoupon">立即领取</mt-button>
            </div>
        </div>
    </transition>
</template>
<script type="text/ecmascript-6">
    export default {
        name: 'xe-store-coupondet',
        data() {
            return {
                circleNum: 40,
                couponInfo: null
            };
        },
        created() {
            this.getCouponInfo();
        },
        methods: {
            getCouponInfo() {
                this.$http({
                    method: 'post',
                    url: '/xe-route/xe-app/mobileApp/venShopDetail/getCouponInfo',
                    data: {
                        userCode: this.$route.query.userCode,
                        couTempId: this.$route.params.couTempId
                    }
                }).then(res => {
                    console.log(res);
                    this.couponInfo = res.data.couponInfo;
                }).catch(error => {
                    console.log(error);
                });
            },
            getCoupon() {
                this.$http({
                    method: 'post',
                    url: '/xe-route/xe-app/mobile/cart/createCoupTempletById',
                    data: {
                        templetId: this.$route.params.couTempId
                    }
                }).then(res => {
                    console.log(res);
                    this.$toast({
                        message: '领券成功',
                        duration: 1500
                    });
                }).catch(error => {
                    console.log(error);
                });
            },
            buynow() {
                // 1、平台 2、商户
                if (this.couponInfo.sendPlat === 1) {
                    // 进入分类页面
                    this.$router.push({
                        name: 'Category'
                    });
                } else if (this.couponInfo.sendPlat === 2) {
                    // 进入店铺页面
                    this.$router.push({
                        name: 'Store',
                        query: {
                            userCode: this.$route.query.userCode
                        }
                    });
                }
            }
        },
        computed: {
            proRangeText() {
                if (this.couponInfo.useRange === 1) {
                    // 全部商品
                    return '全部商品';
                } else if (this.couponInfo.useRange === 2) {
                    // 指定品类
                    return this.couponInfo.userCateName;
                } else {
                    // 指定商品
                    let result = [];
                    this.couponInfo.couponProList.forEach(item => {
                        let str = `${item.proName}(${item.proSpec ? item.proSpec : '无'}))`;
                        result.push(str);
                    });
                    return result.join(',');
                }
            }
        }
    };
</script>
<style rel="stylesheet/scss" lang="scss">
    @import '../../static/styles/rules.scss';
    .m-stcoupon-con {
        position: fixed;
        background: #f5f5f5;
        top: 0;
        right: 0;
        bottom:0;
        left: 0;
        z-index: 33;
        display: flex;
        flex-direction: column;
    }
    .stcoupon-content {
        flex: 1;
        overflow: auto;
        -webkit-overflow-scrolling: touch;
    }
    .coupon-cons {
        padding: 20/$ppr;
        padding-bottom: 0;
        background: #fff;
    }
    .couon-msg {
        padding: 24/$ppr 20/$ppr 40/$ppr;
        background: linear-gradient(left, #ff8764, #ff7164) no-repeat;
        background: -webkit-linear-gradient(left, #ff8764, #ff7164) no-repeat;
        position: relative;
        margin-bottom: 20/$ppr;
        .sname {
            margin-bottom: 10/$ppr;
            text-align: center;
            font-size: 24/$ppr;
            color: #fff;
        }
        .stime {
            margin: 10/$ppr 0;
            text-align: center;
            color: #fff;
            display: flex;
            align-items: center;
            p {
                flex: 1;
                font-size: 20/$ppr;
            }
            div {
                width: 120/$ppr;
                flex: 0 0 120/$ppr;
                border: 1/$ppr solid #fff;
                height: 4/$ppr;
                border-left: none;
                border-right: none;
            }
        }
        .spri {
            font-size: 60/$ppr;
            color: #fff;
            line-height: 1;
            margin: 16/$ppr 0 28/$ppr;
        }
        .sdesc {
            color: #fff;
            font-size: 28/$ppr;
            line-height: 1;
        }
        .stcoupon-icon {
            position: absolute;
            right: 20/$ppr;
            bottom: 20/$ppr;
            color: #fc8877;
            width: 145/$ppr;
            height: 145/$ppr;
            font-size: 140/$ppr;
            line-height: 1;
            text-align: center;
        }
        .cxcoupon-icon {
            position: absolute;
            right: 32/$ppr;
            top: 40/$ppr;
            color: #ffbab3;
            // color: #fff;
            width: 208/$ppr;
            height: 208/$ppr;
            font-size: 200/$ppr;
            line-height: 1;
            text-align: center;
        }
        .store-circle {
            position: absolute;
            height: 10/$ppr;
            left: 0/$ppr;
            right: 0;
            overflow: hidden;
            font-size: 0;
            i {
                width: 10/$ppr;
                height: 10/$ppr;
                background: #fff;
                display: inline-block;
                margin: 0/$ppr 6/$ppr;
                border-radius: 50%;
            }
            &.store-circle-top {
                top: -5/$ppr;
            }
            &.store-circle-bottom {
                bottom: -5/$ppr;
            }
        }
    }
    .stcoupon-des {
        padding: 20/$ppr 0;
        border-bottom:1/$ppr solid $border-color-e8e;
        h4 {
            font-size: 28/$ppr;
        }
        p {
            font-size: 28/$ppr;
            color: $text-666;
            margin-top: 15/$ppr;
            line-height: 1.4;
        }
        &:last-child {
            border-bottom: none;
        }
    }
    .stcoupon-btns {
        .xe-button-primary {
            border-radius: 0;
        }
    }
</style>

