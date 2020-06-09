<template>
    <transition name="slideInRight">
        <view class="m-stcoupon-con" v-if="couponInfo">
            <view class="stcoupon-content">
                <view class="coupon-cons">
                    <view class="couon-msg">
                        <view class="store-circle store-circle-top">
                            <i v-for="(item, index) in circleNum" :key="index"></i>
                        </view>
                        <view class="sname" v-if="couponInfo.sendPlat === 2">
                            <!-- 发放平台：1、平台 2、商户 -->
                            <span> {{couponInfo.shopName ? couponInfo.shopName : couponInfo.venName}}</span>
                        </view>
                        <view class="stime">
                            <view></view>
                            <p v-if="couponInfo.useTimeType === 1">有限期：{{couponInfo.activeTimeStart}} - {{couponInfo.activeTimeEnd}}</p>
                            <p v-else>优惠券到账后{{couponInfo.activeDay}}天内有效</p>
                            <view></view>
                        </view>
                        <view class="spri">
                            &yen; {{couponInfo.useDisAmount | toFixed2}}
                        </view>
                        <view class="sdesc" v-if="couponInfo.useRuleType === 1">
                            满&yen;{{couponInfo.useOrderAmount}}减&yen;{{couponInfo.useDisAmount}}
                        </view>
                        <view class="sdesc" v-else>
                            无门槛优惠券
                        </view>
                        <view class="store-circle store-circle-bottom">
                            <i v-for="(item, index) in circleNum" :key="index"></i>
                        </view>
                        <!-- 店铺 -->
                        <view v-if="couponInfo.shopName" class="stcoupon-icon xe-iconfont xe-icon-dian"></view>
                        <!-- 使用状态 1 已使用 2 未使用 3 已过期 -->
                        <!-- 已过期 -->
                        <view v-if="parseFloat($route.query.useStatus) == 3" class="cxcoupon-icon xe-iconfont xe-icon-yiguoqi"></view>
                        <!-- 已使用 -->
                        <view v-if="parseFloat($route.query.useStatus) == 1" class="cxcoupon-icon xe-iconfont xe-icon-yishiyong"></view>
                        <!-- 已使用 -->
                        <view v-if="parseFloat($route.query.sendStatus) == 3" class="cxcoupon-icon xe-iconfont xe-icon-yilingwan"></view>
                    </view>
                    <view class="stcoupon-des" v-if="couponInfo.usePlat">
                        <h4>使用平台</h4>
                        <p>
                            {{couponInfo.usePlat | usePlatToText}}
                        </p>
                    </view>
                    <view class="stcoupon-des">
                        <h4>适用商品</h4>
                        <p>
                            <!-- 店铺券 -->
                            <template v-if="couponInfo.sendPlat == 2">
                                <span v-if="couponInfo.useRange === 3">可购买本店铺部分单品：{{proRangeText}}</span>
                                <span v-else-if="couponInfo.useRange === 2">可购买本店铺部分品类商品：{{proRangeText}}</span>
                                <span v-else>可购买本店全部商品</span>
                            </template>
                            <!-- 如来云商券 -->
                            <template v-if="couponInfo.sendPlat == 1">
                                <span v-if="couponInfo.useRange === 3">可购买如来云商部分单品：{{proRangeText}}</span>
                                <span v-else-if="couponInfo.useRange === 2">可购买如来云商部分品类商品：{{proRangeText}}</span>
                                <span v-else>可购买如来云商全部商品</span>
                            </template>
                        </p>
                    </view>
                    <view class="stcoupon-des">
                        <h4>适用范围</h4>
                        <p>{{couponInfo.useAreaName}}</p>
                    </view>
                    <view class="stcoupon-des" v-if="couponInfo.sendType === 2">
                        <h4>领取条件</h4>
                        <p>
                            <!--  "sendPlat":1,//发放平台：1、平台 2、商户 -->
                            <!-- 店铺券 -->
                            <template v-if="couponInfo.sendPlat == 2">
                                <span>本店铺单次购买满&yen;{{couponInfo.sendOrderAmount}}发放</span>
                            </template>
                            <!-- 如来云商券 -->
                            <template v-if="couponInfo.sendPlat == 1">
                                <!-- "sendRule":"1",  //发放条件：1、满多少发放 2、新用户注册发放 3、首次身份认证成功发放 -->
                                <span  v-if="couponInfo.sendRule == 1">在如来云商商城单次购物满&yen;{{couponInfo.sendOrderAmount}}发放</span>
                                <span  v-if="couponInfo.sendRule == 2">新用户注册发放</span>
                                <span  v-if="couponInfo.sendRule == 3">首次身份认证成功发放</span>
                            </template>
                        </p>
                    </view>
                    <view class="stcoupon-des" v-if="couponInfo.useRuleType === 2">
                        <h4>使用条件</h4>
                        <p>
                            订单金额大于优惠券金额可用
                        </p>
                    </view>
                </view>
            </view>
            <view class="stcoupon-btns" v-if="parseFloat($route.query.type) == 0">
                <mt-button v-if="couponInfo.sendType == 2 && couponInfo.sendPlat == 1 && couponInfo.sendRule == 3" class="xe-button-primary" type="primary" style="width: 100%;" @click.prevent="toPerson">立即认证</mt-button>
                <mt-button v-if="couponInfo.sendType == 2 && couponInfo.sendRule !== 3" class="xe-button-primary" type="primary" style="width: 100%;" @click.prevent="buynow">开始采购</mt-button>
                <mt-button v-if="couponInfo.sendType == 1 && parseFloat($route.query.sendStatus) != 3" class="xe-button-primary" type="primary" style="width: 100%;" @click.prevent="getCoupon">立即领取</mt-button>
            </view>
            <view class="stcoupon-btns" v-if="parseFloat($route.query.type) == 2">
                <mt-button class="xe-button-primary" type="primary" style="width: 100%;" @click.prevent="useCoupon">去使用</mt-button>
            </view>
        </view>
    </transition>
</template>
<script type="text/ecmascript-6">
    export default {
        name: 'xe-store-coupondet',
        data() {
            return {
                circleNum: 40,
                authPerson: {},
                couponInfo: {}
            };
        },
        created() {
            this.getCouponInfo();
        },
        methods: {
            useCoupon(item) {
                this.$router.push({
                    name: 'UseConponPro',
                    query: {
                        'couTempId': this.$route.params.couTempId, // 模板id
                        'useRange': this.$route.query.useRange, // 使用范围 1 全部商品 2 指定品类 3 指定商品
                        'userCode': this.$route.query.userCode, // 供应商code
                        'useArea': this.couponInfo.useArea, // 供应商code
                        'useCate': this.$route.query.useCate // 分类
                    }
                });
            },
            toPerson() {
                if (this.authPerson.status === '1') {
                    this.$router.push({name: 'IdentityAuthentication', query: {status: this.authPerson.status}});
                } else if (this.authPerson.status === '3') {
                    this.$toast({
                        message: '您已身份认证过，不能享有该优惠券~',
                        duration: 1500
                    });
                } else {
                    let status = this.authPerson.status === '2' ? 1 : 4;
                    this.$router.push({
                        name: 'AuFailure',
                        query: {
                            status: status
                        }
                    });
                }
            },
            getStatus() {
                // 获取认证审核状态
                this.$http({
                    method: 'post',
                    url: '/xe-route/xe-app/mobileApp/checkIdentity/getStatus',
                    data: {}
                }).then(res => {
                    console.log(res);
                    this.authPerson = res.data.result;
                }).catch(error => {
                    console.log(error);
                });
            },
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
                    if (this.couponInfo.sendRule === 3) {
                        this.getStatus(); // 获取认证状态
                    }
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
                        let str = `${item.proName}(${item.proSpec ? item.proSpec : '无'})`;
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
            view {
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
