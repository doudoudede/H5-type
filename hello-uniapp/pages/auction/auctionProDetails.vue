<template>
    <xe-layout class="m-page-details m-bg-dark m-flexlay auctionProDetails">
        <template>
            <div class="m-details-cz clearfix">
                <div class="u-back fl xe-iconfont xe-icon-fanhui-" @click.prevent="goBackFn"></div>
            </div>
            <div class="m-details-sliders m-content-div">
                <xe-slider
                    :picServer="picServer"
                    :keyProps="{keyName: 'proImg'}"
                    urlPath="product/1000/1000/"
                    :sliderData="sliderImgList"
                    :loop="sliderImgList.length > 1 ? true : false"
                    :autoPlay="true"
                    ref="proSlider"
                >
                </xe-slider>
            </div>
            <!-- 内容区域 -->
            <!-- auctionStatus-box 加上class bjcol_211 变为红底色 -->
            <div class="auctionStatus-box bjcol_211">
                <span class="xe-iconfont xe-icon-jingpai"></span>
                <span v-if="biddingPro.disEndTime > 0">
                    正在竞价&nbsp;&nbsp;&nbsp;距结束 <xe-countdown timetype="second" ref="countdown" :time="biddingPro.disEndTime">
                        <span><u>{%d}</u><i>天</i></span><span><u>{%h}</u><i>时</i></span><span><u>{%m}</u><i>分</i></span><span><u>{%s}</u><i>秒</i></span>
                    </xe-countdown>
                </span> 
                <span v-else>竞拍已结束</span>
            </div>
            <div class="auction-content">
                <div class="auction-proItem_one">
                    <div class="pro-titcon">
                        <span class="sma_sub">{{biddingPro.stockFlag | stockFlagToText}}</span>{{biddingPro.proName}}
                    </div>
                    <div class="pro-pricon">
                        <span>起拍价&nbsp;&nbsp;$&nbsp;</span><span class="big_fot">{{biddingPro.startPriceDoller, 'do' | moneySkinToText}}</span>（{{biddingPro.startPriceRmb, 'rmb' | moneySkinToText}}/{{proSpuInfo.proUnit}}）
                    </div>
                </div>
                <div class="auction-proItem_two">
                    <div class="proItem-numCon">
                        <p>定金&nbsp;{{biddingPro.payment | moneySkinToText('rmb')}}</p>
                        <p>规格&nbsp;{{biddingPro.proSpec}}</p>
                        <p>库存&nbsp;{{biddingPro.bidQuantity}}{{proSpuInfo.proUnit}}</p>
                    </div>
                    <div class="proItem-timeCon" @click="expand" v-if="bidShipment.length">
                        <span v-if="bidShipment.length > 4" class="xe-iconfont xe-icon-xiajiantou"></span>
                        <div>船期&nbsp;</div>
                        <div class="proItem-timeL">
                            <div class="proItem-line">
                                <p v-for='(item, index) in bidShipment' v-if="index <= 3" :key='index'>{{item}}月</p>
                            </div>
                            <CollapseTransition>
                                <div class="proItem-line" v-show="bidShipment.length > 4 && expandFlag">
                                    <p v-for='(item, index) in bidShipment' v-if="index > 3" :key='index'>{{item}}月</p>
                                </div>
                            </CollapseTransition>
                        </div>
                    </div>
                </div>
            </div>
            <!-- 出价次数 -->
            <div class="bid-box" v-if="biddingPro.myPrice && biddingPro.myPrice.length">
                <div class="bid-tit">我的出价（{{biddingPro.myPrice.length}}次）</div>
                <div class="bid-con">
                    <p v-for='(item, index) in biddingPro.myPrice' :key='index' :class="{active: index == 0}">{{item.bidPrice, item.currency == 1 ? 'rmb' : 'dollar' | moneySkinToText}}</p>
                </div>
            </div>
            <!-- 竞拍流程 -->
            <div class="bid-box">
                <div class="bid-tit">竞拍流程</div>
                <div class="auction-process">
                    <p>
                        <span class="xe-iconfont xe-icon-jingpaibuzhou"></span>出价竞拍
                    </p>
                    <p>
                        <span class="xe-iconfont xe-icon-jingpaibuzhou3"></span>竞拍成功
                    </p>
                    <p>
                        <span class="xe-iconfont xe-icon-jingpaibuzhou2"></span>交保证金
                    </p>
                    <p>
                        <span class="xe-iconfont xe-icon-jingpaibuzhou1"></span>支付尾款
                    </p>
                    <p>
                        <span class="xe-iconfont xe-icon-jingpaibuzhou4"></span>交易成功
                    </p>
                </div>
            </div>
            <!-- 规格、图文详情 -->
            <div class="m-details-tabcon">
                <div class="det-tab">
                    <div
                        v-for="item in currentDetTab"
                        :key="item.id"
                        :class="{'active': currentDetTabIndex === item.id}"
                        @click.prevent="detTabClick(item)"
                    >
                        <span>{{item.name}}</span>
                    </div>
                </div>
                <div class="det-tab-item tabitem01" v-show="currentDetTabIndex === 1">
                    <div class="det-list-con">
                        <div class="det-list">
                            <div class="det-list-tit">品名</div>
                            <div class="det-list-content">{{proSpuInfo.proName}}</div>
                        </div>
                        <div class="det-list">
                            <div class="det-list-tit">货号</div>
                            <div class="det-list-content">{{proSpuInfo.proSkuInfo ? proSpuInfo.proSkuInfo.proNum : '无'}}</div>
                        </div>
                        <div class="det-list">
                            <div class="det-list-tit">品牌</div>
                            <div class="det-list-content">{{proSpuInfo.brandName}}</div>
                        </div>
                        <div class="det-list">
                            <div class="det-list-tit">规格</div>
                            <div class="det-list-content">{{biddingPro.proSpec}}</div>
                        </div>
                        <div class="det-list">
                            <div class="det-list-tit">贮存条件</div>
                            <div class="det-list-content">{{proSpuInfo.reserveCondition}}</div>
                        </div>
                        <div class="det-list">
                            <div class="det-list-tit">保质期</div>
                            <div class="det-list-content">{{proSpuInfo.shelfLife}}{{proSpuInfo.shelfLifeUnit}}</div>
                        </div>
                        <div class="det-list">
                            <div class="det-list-tit">产地</div>
                            <div class="det-list-content">{{proSpuInfo.madeinCountryName}}</div>
                        </div>
                        <!-- <div class="det-list" v-for="(item, index) in proSpuInfo.propertyList" :key="index">
                            <div class="det-list-tit">{{item.propertyName}}</div>
                            <div class="det-list-content">{{item.propertyValue}}</div>
                        </div> -->
                    </div>
                </div>
                <div class="det-tab-item tabitem02" v-show="currentDetTabIndex === 2">
                    <div v-if="!appDesc && !appDescLoaded" class="page-loading-con">
                        <div class="page-infinite-loading">
                            <mt-spinner type="triple-bounce" class="sp-bounce"></mt-spinner>努力加载中...
                        </div>
                    </div>
                    <div v-else-if="!appDesc && appDescLoaded" class="appDescNone">
                        此商品暂无图文详情~
                    </div>
                    <div v-else class="tabitem02-content" v-html="appDesc"></div>
                </div>
                <div class="det-tab-item tabitem03" v-show="currentDetTabIndex === 3"></div>
            </div>
            <div class="auctionPro-footer" slot="footer" @click='goAuctionFrom' v-if="biddingPro.disEndTime > 0">
                我要竞价
            </div>
        </template>
    </xe-layout>
</template>
<script type="text/ecmascript-6">
    import {CountDown} from 'components/CountDown';
    import {mapState, mapActions} from 'vuex';
    import device from 'utils/device';
    import CollapseTransition from 'utils/collapse-transition';
    export default {
        data() {
            return {
                picServer: '',
                currentDetTab: [
                    {
                        name: '规格参数',
                        id: 1
                    },
                    {
                        name: '图文详情',
                        id: 2
                    }
                ],
                areaId: '',
                expandFlag: false,
                currentDetTabIndex: 1,
                appDesc: null,
                postObj: {},
                appDescLoaded: false,
                proSpuInfo: {},
                biddingPro: {}
            };
        },
        created() {
            this.proSpuInfoFun();
            console.log('进入竞拍商品');
        },
        mounted() {
            // 与app交互
            let self = this;
            this.$bus.$on('certifiedPassing', () => {
                if (self.biddingPro.bidCount < 5) {
                    let disEndTime = self.$refs.countdown.getLastTime();
                    console.log('disEndTime', disEndTime);
                    if (!window.xeBridge) {
                        self.$router.push({
                            name: 'FilltheBidInfor',
                            query: {
                                disEndTime: disEndTime
                            }
                        });
                    } else {
                        window.xeBridge.push(`${window.locationHrefs}filltheBidInfor?disEndTime=${disEndTime}`, self.postObj);
                    }
                } else {
                    self.$toast('当日最多提交5次竞价~');
                }
            });
            this.$bus.$on('appear', () => {
                this.proSpuInfoFun();
            });
        },
        methods: {
            ...mapActions(['setBiddingPro']),
            expand() {
                if (this.bidShipment.length > 4) {
                    this.expandFlag = !this.expandFlag;
                }
            },
            goAuctionFrom() {
                if (this.$getLocalStorage('LOGINSTATUS')) {
                    this.postObj = {
                        bidId: this.biddingPro.bidId,
                        startPriceDoller: this.biddingPro.startPriceDoller, // 起拍价(美元)
                        startPriceRmb: this.biddingPro.startPriceRmb, // 起拍价(人民币)
                        proUnit: this.proSpuInfo.proUnit,
                        bidQuantity: this.biddingPro.bidQuantity,
                        bidShipment: this.biddingPro.bidShipment ? this.biddingPro.bidShipment.replace(/-/g, '年').split(',') : []
                    };
                    console.log('obj----', this.postObj);
                    this.setBiddingPro(this.postObj);
                    this.$setLocalStorage('biddingPro', JSON.stringify(this.postObj));
                    if (device.isWeixin) {
                        this.getStatus();
                    } else {
                        if (window.xeBridge) {
                            window.xeBridge.login();
                        } else {
                            // this.$toast('此处不是在微信和app中~~~');
                            this.getStatus();
                        }
                    }
                } else {
                    this.loginShow();
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
                    let authPerson = res.data.result;
                    this.goAutonPerson(authPerson);
                }).catch(error => {
                    console.log(error);
                });
            },
            loginShow() {
                this.$xeMessageBox({
                    message: '您还未登录~',
                    showCancelButton: true,
                    confirmButtonText: '立即登录'
                }).then(action => {
                    if (action === 'confirm') {
                        this.$router.replace({
                            name: 'Login',
                            query: {
                                redirect: this.$route.fullPath
                            }
                        });
                    }
                }).catch(() => {});
            },
            detTabClick(item) {
                this.currentDetTabIndex = item.id;
                if (item.id === 2 && !this.appDesc) {
                    this.querySpuDescInfo();
                };
            },
            querySpuDescInfo() {
                this.$http({
                    method: 'post',
                    url: '/xe-route/xe-app/mobileApp/proInfo/querySpuDescInfo',
                    data: {
                        proSpu: this.proSpuInfo.proSpu
                    }
                }).then(res => {
                    this.appDescLoaded = true;
                    this.appDesc = res.data.appDesc;
                }).catch(error => {
                    console.log(error);
                });
            },
            proSpuInfoFun() {
                let data = this.$route.query;
                let areaRegionMap = this.$getLocalStorage('REGIONMAP');
                console.log('areaRegionMap', areaRegionMap);
                let areaId = JSON.parse(areaRegionMap).areaId;
                let params = {
                    areaId: areaId,
                    proSpu: data.proSpu,
                    proSku: data.proSku,
                    bidId: data.bidId
                };
                this.$indicator.open('加载中...');
                this.$http({
                    method: 'post',
                    url: '/xe-route/xe-app/mobileApp/proInfo/proSpuInfo',
                    data: params
                }).then(res => {
                    this.$indicator.close();
                    this.biddingPro = res.data.biddingPro;
                    this.proSpuInfo = res.data.proSpuInfo;
                    this.picServer = res.data.picServer;
                }).catch(error => {
                    console.log(error);
                    this.$indicator.close();
                });
            }
        },
        computed: {
            ...mapState(['biddingProData']),
            sliderImgList() {
                let result = [];
                if (this.proSpuInfo.imgList && this.proSpuInfo.imgList.length) {
                    result.push(...this.proSpuInfo.imgList);
                }
                if (this.proSpuInfo.proSkuInfo) {
                    result.unshift({proImg: this.proSpuInfo.proSkuInfo.proMainImg});
                }
                return result;
            },
            bidShipment() {
                let result = [];
                if (this.biddingPro.bidShipment) {
                    result = this.biddingPro.bidShipment.replace(/-/g, '年').split(',');
                }
                // console.log('result', result);
                return result;
            }
        },
        destroyed() {
            console.log('竞拍商品详情页结束');
            this.$bus.$off('certifiedPassing');
            this.$bus.$off('appear');
        },
        components: {
            CollapseTransition,
            [CountDown.name]: CountDown
        }
    };
</script>
<style rel="stylesheet/scss" lang="scss">
    @import '../../static/styles/rules.scss';
    .m-details-cz {
        width: 750/$ppr;
        height: 50/$ppr;
        position: absolute;
        left: 50%;
        margin-left: -375/$ppr;
        top: 20/$ppr;
        padding: 0 20/$ppr;
        z-index: 222;
        text-align: right;
        font-size: 0;
        -webkit-transform: translateZ(0px);
        span, a {
            width: 50/$ppr;
            height: 50/$ppr;
            background: rgba(0, 0, 0, .5);
            display: inline-block;
            margin-left: 20/$ppr;
            border-radius: 50/$ppr;
            color: #fff;
            font-size: 32/$ppr;
            text-align: center;
            line-height: 50/$ppr;
        }
    }
    .auctionProDetails {
        .swiper-container-horizontal > .swiper-pagination-bullets.swiper-pagination-bullets-dynamic {
            left: 94%;
        }
        width: 750/$ppr;
        margin: 0 auto;
        .m-details-sliders {
            height: 708/$ppr;
            position: relative;
        }
        .auctionStatus-box {
            padding: 0 20/$ppr;
            line-height: 80/$ppr;
            background: #666;
            color: #fff;
            font-size: 32/$ppr;
            .xe-iconfont {
                display: inline-block;
                width: 34/$ppr;
                height: 34/$ppr;
                text-align: center;
                line-height: 34/$ppr;
                font-size: 34/$ppr;
                margin-right: 8/$ppr;
            }
            &.bjcol_211 {
                background: #ae2111;
            }
        }
        .auction-content {
            padding: 35/$ppr 20/$ppr 20/$ppr;
            margin-bottom: 10/$ppr;
            background: #fff;
            .pro-titcon {
                line-height: 42/$ppr;
                @include clamp(2);
                font-size: 34/$ppr;
                color: #333;
            }
            .sma_sub {
                position: relative;
                top: 4/$ppr;
                background: #fee3e2;
                color: $main-color;
                font-size: 20/$ppr;
                padding: 0 10/$ppr;
                display: inline-block;
                line-height: 30/$ppr;
                border-radius: 15px;
                margin-right: 10/$ppr;
                vertical-align: text-top;
            }
            .pro-pricon {
                width: 100%;
                @include ellipsis();
                font-size: 28/$ppr;
                color: #999;
                padding: 28/$ppr 0 34/$ppr;
                border-bottom: 1px solid #e8e8e8;
                span {
                    color: #ae2111;
                    &.big_fot {
                        position: relative;
                        top: 2/$ppr;
                        font-size: 52/$ppr;
                        display: inline-block;
                        line-height: 1;
                    }
                }
            }
        }
        .auction-process {
            @include flexbox();
            font-size: 24/$ppr;
            line-height: 24/$ppr;
            color: #999;
            padding-right: 30/$ppr;
            .xe-iconfont {
                display: inline-block;
                width: 22/$ppr;
                height: 22/$ppr;
                text-align: center;
                font-size: 22/$ppr;
                color: #b33021;
                line-height: 22/$ppr;
                margin-right: 8/$ppr;
            }
        }
        .auctionPro-footer {
            background: #f23530;
            color: #fff;
            font-size: 34/$ppr;
            line-height: 98/$ppr;
            text-align: center;
        }
    }
</style>
