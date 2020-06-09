<template>
    <xe-layout class="m-bg-dark m-flexlay">
        <view class="auction-content">
            <view class="auction-list" v-for="(item, index) in proList" :key='index'>
                <view class="auction-bod-box">
                    <view class="auction-lastTime">
                        {{item.disEndTime > 0 ? '距结束：' : '已结束'}}<xe-countdown timetype="second" v-if="item.disEndTime > 0" :time="item.disEndTime">
                            <span><u>{%d}</u><i>天</i></span><span><u>{%h}</u><i>时</i></span><span><u>{%m}</u><i>分</i></span><span><u>{%s}</u><i>秒</i></span>
                        </xe-countdown>
                    </view>
                    <view class="aution-pro-content">
                        <view class="pro-imgbox">
                            <img v-lazy="picServer + item.proMainImg" alt="">
                        </view>
                        <view class="pro-details">
                            <view class="pro-titDetails">
                                <span class="sma_sub">{{item.stockFlag | stockFlagToText}}</span>&nbsp;&nbsp;{{item.proName}}</view>
                            <view class="pro-shop-name">{{item.shopName}}</view>
                            <view class="pro-rules">规格：{{item.proSpec}}</view>
                            <view class="pro-contro-box">
                                <view class="pro-price colr_530">
                                    起拍价&nbsp;$&nbsp;<span class="big_fot" :class="{'fot_si36': (item.startPriceDoller.toString().split('.')[0].length) >= 7, 'fot_si38': (item.startPriceDoller.toString().split('.')[0].length) < 7}">{{item.startPriceDoller | moneySkinToText('do')}}</span>
                                </view>
                                <view class="pro-price-btn" @click="auctionFun(item)">我要竞价</view>
                            </view>
                        </view>
                    </view>
                </view>
            </view>
        </view>
        <infinite-loading  @infinite="onInfinite" ref="infiniteLoading" class="infinite-contanier">
            <span slot="no-more" class="infinite-no-more">
                暂无更多数据~
            </span>
            <view slot="no-results" class="m-cart-none">
                <view class="pic">
                    <img src="../../static/images/cart-n2.png" alt="">
                </view>
                <view class="des">
                    <p class="f32">暂无竞拍活动~</p>
                </view>
                <view class="btn">
                    <mt-button class="xe-button-default  xe-button-red" size="small" plain @click.prevent="goCategory">随便逛逛~</mt-button>
                </view>
            </view>
        </infinite-loading>
    </xe-layout>
</template>
<script type="text/ecmascript-6">
    import {CountDown} from 'components/CountDown';
    export default {
        data() {
            return {
                picServer: '',
                proList: [],
                pageNum: 1
            };
        },
        created() {
            console.log('进入专区');
            // this.biddingProList();
        },
        methods: {
            goCategory() {
                if (!window.xeBridge) {
                    this.$router.push({
                        name: 'Category'
                    });
                } else {
                    // 与原生传递消息
                    window.xeBridge.goTab(1);
                }
            },
            onInfinite($state) {
                this.biddingProList($state);
            },
            auctionFun(item) {
                if (!window.xeBridge) {
                    this.$router.push({
                        name: 'AuctionProDetails',
                        query: {
                            proSpu: item.proSpu,
                            proSku: item.proSku,
                            bidId: item.bidId
                        }
                    });
                } else {
                    window.xeBridge.push(`${window.locationHrefs}auctionProDetails?proSpu=${item.proSpu}&proSku=${item.proSku}&bidId=${item.bidId}`);
                }
            },
            biddingProList ($state) {
                this.$indicator.open('加载中...');
                this.$http({
                    method: 'post',
                    url: '/xe-route/xe-app/mobileApp/biddingPro/biddingProList',
                    data: {
                        pageNum: this.pageNum
                    }
                }).then(res => {
                    this.$indicator.close();
                    console.log(res);
                    if (!this.picServer) {
                        this.picServer = res.data.picServer;
                    }
                    if (res.data.total === 0) {
                        $state.complete();
                    } else {
                        if (res.data.proList.length > 0) {
                            this.proList.push(...res.data.proList);
                            this.pageNum++;
                            $state.loaded();
                        } else {
                            // 所有商品都加载完时
                            $state.complete();
                        }
                    }
                }).catch(error => {
                    this.$indicator.close();
                    console.log(error);
                    $state.complete();
                });
            }
        },
        destroyed() {
            console.log('专区结束');
        },
        computed: {
        },
        components: {
            [CountDown.name]: CountDown
        }
    };
</script>
<style rel="stylesheet/scss" lang="scss">
    @import '../../static/styles/rules.scss';
    .auction-content {
        max-width: 750/$ppr;
        margin: 0 auto;
        .pro-price {
            color: #f23530;
            max-width: 330/$ppr;
            @include ellipsis();
        }
        .auction-lastTime {
            u {
                color: #f23530;
                text-decoration: none;
            }
        }
    }
</style>
