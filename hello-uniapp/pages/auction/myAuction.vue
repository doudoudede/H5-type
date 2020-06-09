<template>
    <xe-layout class="m-bg-dark m-flexlay">
        <view class="auction-content">
            <view class="auction-list" v-for="(item, index) in recordList" :key="index" @click.prevent.stop="goAuctionDetails(item)">
                <view class="auction-hea-box">
                    <!--  color_530 、color_666-->
                    <view class="thea-L" :class="{'color_530': item.dealStatus !== 2, 'color_666': item.dealStatus == 2}">
                        {{item.dealStatus, false | dealStatusToText}}
                    </view>
                    <view class="thea-R" v-if="item.dealStatus == 3 && item.disEndTime > 0">距结束
                        <xe-countdown timetype="second" v-if="item.disEndTime > 0" :time="item.disEndTime">
                            <span><u>{%d}</u><i>天</i></span><span><u>{%h}</u><i>时</i></span><span><u>{%m}</u><i>分</i></span><span><u>{%s}</u><i>秒</i></span>
                        </xe-countdown>
                    </view>
                </view>
                <view class="auction-bod-box">
                    <view class="aution-pro-content">
                        <view class="pro-imgbox">
                            <img v-lazy="picServer + item.proMainImg" alt="">
                        </view>
                        <view class="pro-details">
                            <view class="pro-titDetails">
                                <span class="sma_sub" v-if="item.stockFlag">{{item.stockFlag | stockFlagFilter}}</span>&nbsp;&nbsp;{{item.proName}}</view>
                            <view class="pro-shop-name">{{item.shopName}}</view>
                            <view class="pro-rules">规格：{{item.proSpec}}</view>
                            <view class="pro-contro-box">
                                <view class="pro-price">
                                    起拍价&nbsp;&nbsp;$&nbsp;<span class="big_fot" :class="{'fot_si36': (item.startPriceDoller.toString().split('.')[0].length) >= 7, 'fot_si38': (item.startPriceDoller.toString().split('.')[0].length) < 7}">{{item.startPriceDoller | moneySkinToText('dollars')}}</span>
                                </view>
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
                    <p class="f32">您还未参与任何竞拍活动~</p>
                </view>
                <view class="btn">
                    <mt-button class="xe-button-default  xe-button-red" size="small" plain @click.prevent="goToAuction">前往竞拍专区~</mt-button>
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
                recordList: [],
                pageNum: 1
            };
        },
        created() {
        },
        methods: {
            onInfinite($state) {
                this.queryAddressList($state);
            },
            queryAddressList($state) {
                this.$indicator.open('加载中...');
                this.$http({
                    method: 'post',
                    url: '/xe-route/xe-app/mobileApp/biddingPro/getBidRecordList',
                    data: {
                        pageNum: this.pageNum
                    }
                }).then(res => {
                    this.$indicator.close();
                    if (!this.picServer) {
                        this.picServer = res.data.picServer;
                    }
                    if (res.data.total === 0) {
                        $state.complete();
                    } else {
                        if (res.data.list.length > 0) {
                            this.recordList.push(...res.data.list);
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
            },
            goToAuction() {
                if (!window.xeBridge) {
                    this.$router.push({
                        name: 'AuctionArea'
                    });
                } else {
                    window.xeBridge.push(`${window.locationHrefs}auctionArea`);
                }
            },
            goAuctionDetails(item) {
                if (!window.xeBridge) {
                    this.$router.push({
                        name: 'AuctionDetails',
                        query: {
                            bidId: item.bidId
                        }
                    });
                } else {
                    window.xeBridge.push(`${window.locationHrefs}auctionDetails?bidId=${item.bidId}`);
                }
            }
        },
        filters: {
            stockFlagFilter(val) {
                let obj = ['现货', '期货'];
                return obj[val - 1];
            }
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
            @include ellipsis();
        }
    }
</style>
