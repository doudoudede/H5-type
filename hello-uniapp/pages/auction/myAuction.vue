<template>
    <xe-layout class="m-bg-dark m-flexlay">
        <div class="auction-content">
            <div class="auction-list" v-for="(item, index) in recordList" :key="index" @click.prevent.stop="goAuctionDetails(item)">
                <div class="auction-hea-box">
                    <!--  color_530 、color_666-->
                    <div class="thea-L" :class="{'color_530': item.dealStatus !== 2, 'color_666': item.dealStatus == 2}">
                        {{item.dealStatus, false | dealStatusToText}}
                    </div>
                    <div class="thea-R" v-if="item.dealStatus == 3 && item.disEndTime > 0">距结束
                        <xe-countdown timetype="second" v-if="item.disEndTime > 0" :time="item.disEndTime">
                            <span><u>{%d}</u><i>天</i></span><span><u>{%h}</u><i>时</i></span><span><u>{%m}</u><i>分</i></span><span><u>{%s}</u><i>秒</i></span>
                        </xe-countdown>
                    </div>
                </div>
                <div class="auction-bod-box">
                    <div class="aution-pro-content">
                        <div class="pro-imgbox">
                            <img v-lazy="picServer + item.proMainImg" alt="">
                        </div>
                        <div class="pro-details">
                            <div class="pro-titDetails">
                                <span class="sma_sub" v-if="item.stockFlag">{{item.stockFlag | stockFlagFilter}}</span>&nbsp;&nbsp;{{item.proName}}</div>
                            <div class="pro-shop-name">{{item.shopName}}</div>
                            <div class="pro-rules">规格：{{item.proSpec}}</div>
                            <div class="pro-contro-box">
                                <div class="pro-price">
                                    起拍价&nbsp;&nbsp;$&nbsp;<span class="big_fot" :class="{'fot_si36': (item.startPriceDoller.toString().split('.')[0].length) >= 7, 'fot_si38': (item.startPriceDoller.toString().split('.')[0].length) < 7}">{{item.startPriceDoller | moneySkinToText('dollars')}}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <infinite-loading  @infinite="onInfinite" ref="infiniteLoading" class="infinite-contanier">
            <span slot="no-more" class="infinite-no-more">
                暂无更多数据~
            </span>
            <div slot="no-results" class="m-cart-none">
                <div class="pic">
                    <img src="../../static/images/cart-n2.png" alt="">
                </div>
                <div class="des">
                    <p class="f32">您还未参与任何竞拍活动~</p>
                </div>
                <div class="btn">
                    <mt-button class="xe-button-default  xe-button-red" size="small" plain @click.prevent="goToAuction">前往竞拍专区~</mt-button>
                </div>
            </div>
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
