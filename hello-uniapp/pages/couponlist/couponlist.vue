<template>
    <xe-layout class="m-bg-dark m-flexlay">
        <view class="couponlist-nav" slot='header'>
            <xe-navtab-con :itemData="navListData" @swiperItemClick="swiperItemClick" ref="navTab"></xe-navtab-con>
        </view>
        <view>
            <view class="popup-coupon-itemcon couponlist-item">
                <view class="item" v-for="(item, index) in mainCouponList" :key="index" :class="{disabled: couponType ===3 || couponType === 1 || item.sendStatus === 3}" @click.prevent.stop="ConponDetNew(item)">
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
                        <view class="item-r-name">
                            <!-- 发放平台：1、平台 2、商户 -->
                            <span v-if='item.sendPlat == 1'> 如来云商优惠券</span>
                            <span v-if='!item.sendPlat || item.sendPlat == 2'> {{item.shopName ? item.shopName : item.venName}}</span>
                        </view>
                        <view class="item-r-msg">{{item.useRange, item.sendPlat | useRangeToText}}</view>
                        <template v-if="couponType === 0">
                            <view class="item-r-time" v-if="item.useTimeType === 1">{{item.activeTimeStart | millisecondFormat}} - {{item.activeTimeEnd | millisecondFormat}}</view>
                            <view class="item-r-time" v-else>优惠券到账后{{item.activeDay}}天内有效</view>
                        </template>
                        <template v-else>
                            <view class="item-r-time">{{item.activeTimeStart | millisecondFormat}} - {{item.activeTimeEnd | millisecondFormat}}</view>
                        </template>
                        <template v-if="couponType === 0">
                            <view class="item-r-tipsnone xe-iconfont xe-icon-yilingwan" v-if="item.sendStatus === 3">
                                <!--已发完-->
                            </view>
                            <view class="item-r-btn" v-else>
                                <mt-button type="primary" size='small' class="xe-button-primary is-radius" plain @click.prevent.stop="ConponDet(item)">立即领取</mt-button>
                            </view>
                        </template>
                        <template v-if="couponType === 1">
                            <view class="item-r-tipsnone xe-iconfont xe-icon-yishiyong">
                                <!--已使用-->
                            </view>
                        </template>
                        <template v-if="couponType === 2">
                            <view class="item-r-btn">
                                <mt-button type="primary" size='small' class="xe-button-primary is-radius" plain @click.prevent.stop="useCoupon(item)">立即使用</mt-button>
                            </view>
                        </template>
                        <template v-if="couponType === 3">
                            <view class="item-r-tipsnone xe-iconfont xe-icon-yiguoqi">
                                <!--已过期-->
                            </view>
                        </template>
                    </view>
                </view>
            </view>
        </view>
        <infinite-loading @infinite="onInfinite" :distance="50" ref="infiniteLoading" class="infinite-contanier">
            <span slot="no-more" class="infinite-no-more">
                暂无更多数据~
            </span>
            <view slot="no-results" class="m-cart-none">
                <view class="pic">
                    <img src="../../static/images/cart-n1.png" alt="">
                </view>
                <view class="des">
                    <p class="f32">暂无优惠券~</p>
                </view>
                <!--<view class="btn">-->
                <!--<mt-button class="xe-button-default" size="small" plain @click.prevent="toCategory">去购买~</mt-button>-->
                <!--</view>-->
            </view>
        </infinite-loading>
        <router-view slot="outer"></router-view>
    </xe-layout>
</template>
<script type="text/ecmascript-6">
    import InfiniteLoading from 'vue-infinite-loading';
    import {xeNavTabCon} from 'components/xeNavTab';
    import axios from 'axios';
    export default {
        name: 'xe-page-couponlist',
        beforeRouteEnter(to, from, next) {
            next(vm => {
                let type = to.query.type ? parseInt(to.query.type) : 2;
                vm.couponType = type;
                vm.$refs.navTab.setDefault(type);
            });
        },
        data() {
            return {
                firstIn: true,
                navListData: [
                    {
                        name: '领券',
                        id: 0
                    },
                    {
                        name: '未使用',
                        id: 2
                    },
                    {
                        name: '已使用',
                        id: 1
                    },
                    {
                        name: '已过期',
                        id: 3
                    }
                ],
                cancel: '',
                couponType: 2,
                pageNum: 1,
                mainCouponList: []
            };
        },
        activated() {
            if (!this.firstIn) {
                let type = this.$route.query.type ? parseInt(this.$route.query.type) : 2;
                this.couponType = type;
                this.$refs.navTab.setDefault(type);
                this.mainCouponList = [];
                this.pageNum = 1;
                // this.onInfinite();
                this.$refs.infiniteLoading.$emit('$InfiniteLoading:reset');
            }
        },
        deactivated() {
            this.firstIn = false;
        },
        methods: {
            swiperItemClick(item) {
                if (this.cancel) {
                    // 取消未完成的ajax请求
                    this.cancel();
                };
                this.$router.replace({name: 'CouponList', query: {'type': item.id}});
                this.couponType = item.id;
                this.pageNum = 1;
                this.mainCouponList = [];
                this.$nextTick(() => {
                    this.$refs.infiniteLoading.$emit('$InfiniteLoading:reset');
                });
            },
            onInfinite($state) {
                if (this.couponType === 0) {
                    this.queryReceiveCouponCardList($state);
                } else {
                    this.queryCouponCardList($state);
                }
            },
            queryReceiveCouponCardList($state) {
                let _this = this;
                let CancelToken = axios.CancelToken;
                this.$http({
                    cancelToken: new CancelToken(function executor(c) {
                        // An executor function receives a cancel function as a parameter
                        _this.cancel = c;
                    }),
                    method: 'post',
                    url: '/xe-route/xe-app/mobile/coupon/queryReceiveCouponCardList',
                    data: {
                        pageNum: this.pageNum,
                        pageSize: 10
                    }
                }).then(res => {
                    console.log(res);
                    if (res.data.pageInfo.total === 0) {
                        // 无商品时
                        // this.$refs.infiniteLoading.$emit('$InfiniteLoading:complete');
                        $state.complete();
                    } else {
                        if (res.data.templetResDto.templetList.length > 0) {
                            this.mainCouponList.push(...res.data.templetResDto.templetList);
                            this.pageNum++;
                            $state.loaded();
                        } else {
                            // 所有商品都加载完时
                            // this.$refs.infiniteLoading.$emit('$InfiniteLoading:complete');
                            $state.complete();
                        }
                    }
                }).catch(error => {
                    console.log(error);
                    if (error.status === 'cancel') {
                        this.$refs.infiniteLoading.$emit('$InfiniteLoading:reset');
                        return;
                    }
                    // this.$refs.infiniteLoading.$emit('$InfiniteLoading:complete');
                    $state.complete();
                });
            },
            queryCouponCardList($state) {
                this.$http({
                    method: 'post',
                    url: '/xe-route/xe-app/mobile/coupon/queryCouponCardList',
                    data: {
                        pageNum: this.pageNum,
                        pageSize: 10,
                        useStatus: this.couponType
                    }
                }).then(res => {
                    console.log(res);
                    if (res.data.pageInfo.total === 0) {
                        // 无商品时
                        // this.$refs.infiniteLoading.$emit('$InfiniteLoading:complete');
                        $state.complete();
                    } else {
                        if (res.data.couponcardResDto.couponcardList.length > 0) {
                            this.mainCouponList.push(...res.data.couponcardResDto.couponcardList);
                            this.pageNum++;
                            $state.loaded();
                        } else {
                            // 所有商品都加载完时
                            // this.$refs.infiniteLoading.$emit('$InfiniteLoading:complete');
                            $state.complete();
                        }
                    }
                }).catch(error => {
                    console.log(error);
                    if (error.status === 'cancel') {
                        this.$refs.infiniteLoading.$emit('$InfiniteLoading:reset');
                        return;
                    }
                    // this.$refs.infiniteLoading.$emit('$InfiniteLoading:complete');
                    $state.complete();
                });
            },
            ConponDet(item) {
                console.log(item);
                this.$router.push({
                    name: 'CoCouponDet',
                    params: {
                        couTempId: item.couTempId
                    },
                    query: {
                        userCode: item.userCode,
                        sendStatus: item.sendStatus,
                        useStatus: item.useStatus,
                        type: this.$route.query.type
                    }
                });
            },
            ConponDetNew(item) {
                if (item.sendStatus !== 3) {
                    this.$router.push({
                        name: 'StorecouponNew',
                        params: {
                            couTempId: item.couTempId
                        },
                        query: {
                            userCode: item.userCode,
                            useRange: item.useRange,
                            useCate: item.useCate,
                            sendStatus: item.sendStatus,
                            useStatus: item.useStatus,
                            sendPlat: item.sendPlat,
                            type: this.$route.query.type
                        }
                    });
                }
            },
            useCoupon(item) {
                this.$router.push({
                    name: 'UseConponPro',
                    query: {
                        'couTempId': item.couTempId, // 模板id
                        'useRange': item.useRange, // 使用范围 1 全部商品 2 指定品类 3 指定商品
                        'userCode': item.userCode, // 供应商code
                        'useCate': item.useCate, // 分类
                        'useArea': item.useArea // 区域
                    }
                });
            }
        },
        components: {
            InfiniteLoading,
            [xeNavTabCon.name]: xeNavTabCon
        }
    };
</script>
<style rel="stylesheet/scss" lang="scss">
    @import '../../static/styles/rules.scss';
    .couponlist-nav {
        height: 80/$ppr;
        background: #fff;
        .swiper-slide {
            // padding:0 54/$ppr;
            text-align: center;
            flex: 1;
            span {
                width: auto;
            }
        }
    }
    .couponlist-item {
        padding: 20/$ppr 20/$ppr 0 20/$ppr;
        .item {
            min-height: 160/$ppr;
            &.disabled {
                .item-t {
                    color: $text-999;
                }
                .item-circle-bot {
                    background: $text-999;
                }
            }
        }
        .item-right {
            position: relative;
            padding: 25/$ppr 20/$ppr;
            .item-r-name {
                color: #5d5d5d;
                font-size: 24/$ppr;
                margin: 10/$ppr 0 25/$ppr;
            }
            .item-r-msg, .item-r-time {
                margin: 10/$ppr 0;
                font-size: 20/$ppr;
                color: $text-999;
            }
            .item-r-btn, .item-r-tipsnone {
                position: absolute;
                right: 20/$ppr;
                bottom: 25/$ppr;
            }
            .item-r-tipsnone {
                font-size: 140/$ppr;
                line-height: 1;
                text-align: center;
                color: #a4a4a4;
                bottom: 10/$ppr;
            }
        }
    }
</style>
