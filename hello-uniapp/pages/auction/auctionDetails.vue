<template>
    <xe-layout class="m-bg-dark m-flexlay">
        <div class="auctionDetails">
            <div class="auction-result-show mar_bot20">
                <div class="result-tit">
                    <span v-if="mybidInfo.dealStatus == 1">恭喜您</span>{{mybidInfo.dealStatus | dealStatusToText}}
                </div>
                <div class="result-con">{{mybidInfo.dealStatus | dealStatusTexFilter}}</div>
            </div>
            <div class="auction-proNumcontent mar_bot20">
                <div class="proNum-top" v-if="mybidInfo.dealStatus == 1">
                    <div>
                        成交价&nbsp;&nbsp;{{mybidInfo.dealCurrency == 1 ? '¥' : '$'}}&nbsp;<span class="big_fot" :class="{'fot_si36': (mybidInfo.dealPrice.toString().split('.')[0].length) >= 7, 'fot_si38': (mybidInfo.dealPrice.toString().split('.')[0].length) < 7}">{{mybidInfo.dealPrice, mybidInfo.dealCurrency == 1 ? 'rmbs' : 'dollars' | moneySkinToText}}</span>
                    </div>
                    <div>
                        成交数量&nbsp;&nbsp;{{mybidInfo.dealNum ? mybidInfo.dealNum : 0}}{{mybidInfo.proUnit}}
                    </div>
                </div>
                <div class="proNum-top" v-if="mybidInfo.dealStatus == 3">
                    <div>
                        竞拍价格&nbsp;&nbsp;{{mybidInfo.currency == 1 ? '¥' : '$'}}&nbsp;<span class="big_fot" :class="{'fot_si36': (mybidInfo.bidPrice.toString().split('.')[0].length) >= 7, 'fot_si38': (mybidInfo.bidPrice.toString().split('.')[0].length) < 7}">{{mybidInfo.bidPrice, mybidInfo.currency == 1 ? 'rmbs' : 'dollars' | moneySkinToText}}</span>
                    </div>
                    <div>
                        竞拍数量&nbsp;&nbsp;{{mybidInfo.bidNum}}{{mybidInfo.proUnit}}
                    </div>
                </div>
                <div class="proNum-bot">
                    <div>
                        <p  v-if="mybidInfo.dealStatus !== 3">竞拍价格&nbsp;&nbsp;{{mybidInfo.bidPrice, mybidInfo.currency == 1 ? 'rmb' : 'dollar' | moneySkinToText}}</p>
                        <p>提货港口&nbsp;&nbsp;{{mybidInfo.portName}}</p>
                    </div>
                    <div>
                        <p  v-if="mybidInfo.dealStatus !== 3">竞拍数量&nbsp;&nbsp;{{mybidInfo.bidNum}}{{mybidInfo.proUnit}}</p>
                        <p v-if="bidShipmentLast">船期&nbsp;&nbsp;{{bidShipmentLast}}</p>
                    </div>
                </div>
            </div>
            <!-- 出价次数 -->
            <div class="bid-box" v-if="myPrice.length">
                <div class="bid-tit">我的出价（{{myPrice.length}}次）</div>
                <div class="bid-con">
                    <p v-for='(item, index) in myPrice' :key='index' :class="{active: index == 0}">{{item.bidPrice, item.currency == 1 ? 'rmb' : 'dollar' | moneySkinToText}}</p>
                </div>
            </div>
            <!-- 商品信息 -->
            <div class="proDetails-content auction-list">
                <div class="proDetails-tit" @click="goToAuctionPro">
                    <div>竞品信息</div>
                    <div class="arrow-right-commons">查看</div>
                </div>
                <div class="auction-bod-box">
                    <div class="aution-pro-content">
                        <div class="pro-imgbox">
                            <img v-lazy="picServer + mybidInfo.proMainImg" alt="">
                        </div>
                        <div class="pro-details">
                            <div class="pro-tit">
                                <span class="sma_sub">{{mybidInfo.stockFlag | stockFlagToText}}</span>&nbsp;&nbsp;{{mybidInfo.proName}}</div>
                            <div class="pro-contro-box pro-contro-boxSty">
                                <div class="pro-price">
                                    起拍价&nbsp;&nbsp;$&nbsp;<span class="big_fot" v-if="mybidInfo.startPriceDoller" :class="{'fot_si36': (mybidInfo.startPriceDoller.toString().split('.')[0].length) >= 7, 'fot_si38': (mybidInfo.startPriceDoller.toString().split('.')[0].length) < 7}">{{mybidInfo.startPriceDoller,  'dollars' | moneySkinToText}}</span><span class="sma_fot">/{{mybidInfo.proUnit}}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="auction-proItem_two">
                    <div class="proItem-numCon">
                        <p>定金&nbsp;{{mybidInfo.payment,  mybidInfo.currency == 1 ? 'rmb' : 'dollar' | moneySkinToText}}</p>
                        <p>规格&nbsp;{{mybidInfo.proSpec}}</p>
                        <p>库存&nbsp;{{mybidInfo.bidQuantity}}{{mybidInfo.proUnit}}</p>
                    </div>
                    <div class="proItem-timeCon" @click="expand" v-if="bidShipmentList.length">
                        <span v-if="bidShipmentList.length > 4" class="xe-iconfont xe-icon-xiajiantou"></span>
                        <div>船期&nbsp;</div>
                        <div class="proItem-timeL">
                            <div class="proItem-line">
                                <p v-for='(item, index) in bidShipmentList' v-if="index <= 3" :key='index'>{{item}}月</p>
                            </div>
                            <CollapseTransition>
                                <div class="proItem-line" v-show="bidShipmentList.length > 4 && expandFlag">
                                    <p v-for='(item, index) in bidShipmentList' v-if="index > 3" :key='index'>{{item}}月</p>
                                </div>
                            </CollapseTransition>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </xe-layout>
</template>
<script type="text/ecmascript-6">
    import CollapseTransition from 'utils/collapse-transition';
    export default {
        data() {
            return {
                expandFlag: false,
                picServer: '',
                myPrice: [],
                mybidInfo: {}
            };
        },
        created() {
            this.queryAddressList();
        },
        methods: {
            expand() {
                if (this.bidShipmentList.length > 4) {
                    this.expandFlag = !this.expandFlag;
                }
            },
            queryAddressList() {
                this.$indicator.open('加载中...');
                this.$http({
                    method: 'post',
                    url: '/xe-route/xe-app/mobileApp/biddingPro/getBidRecordInfo',
                    data: {
                        bidId: this.$route.query.bidId
                    }
                }).then(res => {
                    this.$indicator.close();
                    console.log(res);
                    this.picServer = res.data.picServer;
                    this.myPrice = res.data.myPrice;
                    this.mybidInfo = res.data.mybidInfo;
                }).catch(error => {
                    this.$indicator.close();
                    console.log(error);
                });
            },
            goToAuctionPro() {
                if (!window.xeBridge) {
                    this.$router.push({
                        name: 'AuctionProDetails',
                        query: {
                            proSpu: this.mybidInfo.proSpu,
                            proSku: this.mybidInfo.proSku,
                            bidId: this.mybidInfo.bidId
                        }
                    });
                } else {
                    window.xeBridge.push(`${window.locationHrefs}auctionProDetails?proSpu=${this.mybidInfo.proSpu}&proSku=${this.mybidInfo.proSku}&bidId=${this.mybidInfo.bidId}`);
                }
            }
        },
        computed: {
            bidShipmentLast() {
                let str = '';
                if (this.mybidInfo.bidShipment) {
                    str = this.mybidInfo.bidShipment.split(',').pop().replace(/-/, '年') + '月';
                }
                return str;
            },
            bidShipmentList() {
                let arr = [];
                if (this.mybidInfo.bidShipment) {
                    arr = this.mybidInfo.bidShipment.replace(/-/, '年').split(',');
                }
                return arr;
            }
        },
        filters: {
            dealStatusTexFilter(val) {
                let obj = {
                    1: '会有客服与您联系，请保持电话畅通。',
                    2: '很遗憾， 您未获得该商品的购买资格。',
                    3: '竞拍活动结束48小时内，将通知您竞拍结果，敬请期待。'
                };
                return obj[val];
            }
        },
        components: {
            CollapseTransition
        }
    };
</script>
<style rel="stylesheet/scss" lang="scss">
    @import '../../static/styles/rules.scss';
    .auctionDetails {
        max-width: 750/$ppr;
        margin: 0 auto;
        .mar_bot20 {
            margin-bottom: 20/$ppr;
        }
        .pro-price {
            @include ellipsis();
        }
        .auction-result-show {
            padding: 38/$ppr 32/$ppr;
            background: #ae2111;
            color: #fff;
            .result-tit {
                font-size: 34/$ppr;
                line-height: 52/$ppr;
            }
            .result-con {
                font-size: 20/$ppr;
                line-height: 40/$ppr;
            }
        }
        .auction-proNumcontent {
            background: #fff;
            padding-left: 30/$ppr;
            .proNum-top {
                @include flexbox();
                padding-top: 14/$ppr;
                color: #ae2111;
                font-size: 28/$ppr;
                border-bottom: 1px solid #e8e8e8;
                >div {
                    @include flex(1);
                    @include ellipsis();
                    line-height: 84/$ppr;
                    .big_fot {
                        font-size: 52/$ppr;
                        &.fot_si36 {
                            font-size: 36/$ppr;
                        }
                        &.fot_si38 {
                            font-size: 38/$ppr;
                        }
                    }
                }
            }
            .proNum-bot {
                display: flex;
                padding: 22/$ppr 0;
                font-size: 28/$ppr;
                color: #333;
                >div {
                    @include flex(1);
                    width: 50%;
                    p {
                        @include flex(1);
                        @include ellipsis();
                        line-height: 42/$ppr;
                    }
                }
            }
        }
        .proDetails-content {
            padding: 5/$ppr 0 20/$ppr 30/$ppr;
            background: #fff;
            margin-top: 10/$ppr;
            .proDetails-tit {
                padding-right: 30/$ppr;
                @include flexbox();
                line-height: 70/$ppr;
                font-size: 28/$ppr;
                color: #333;
                @extend .border-1px-bot;
            }
            .auction-bod-box {
                @extend .border-1px-bot;
            }
            .pro-tit {
                @include clamp(2);
                line-height: 38/$ppr;
                height: 76/$ppr;
                font-size: 28/$ppr;
                color: #333;
                margin-bottom: 40/$ppr;
                .sma_sub {
                    position: relative;
                    top: 1/$ppr;
                    background: #fee3e2;
                    color: $main-color;
                    font-size: 20/$ppr;
                    padding: 0 10/$ppr;
                    display: inline-block;
                    line-height: 30/$ppr;
                    border-radius: 15px;
                    vertical-align: text-top;
                }
            }
        }
        .auction-proItem_two {
            padding-right: 20/$ppr;
        }
    }
</style>
