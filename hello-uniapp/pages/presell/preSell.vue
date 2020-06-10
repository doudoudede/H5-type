<template>
    <xe-layout class="m-flexlay m-bg-dark">
        <div class="m-presell-tab" slot='header'>
            <div v-for="(item, index) in navListData" :key="index" :class="{'active': currentTab === item.id}" @click="tabCheck(item.id)">
                <span>{{item.name}}</span>
            </div>
        </div>
        <div class="m-content-div">
            <div class="m-sec-list m-presell-list" v-if="proList && proList.length">
                <div class="item" v-for="(item, index) in proList" :key="index" @click.prevent="goDetails(item)">
                    <div class="timecount">
                        <xe-countdown :time="item.endTime" timetype="second" class='count-prets' :titTextFlag="true" :doneText="currentTab === 1 ? '已结束' : '已开始'" :countText="currentTab === 1 ? '距结束' : '距开始'">
                            <span class="prets">{%d}</span>天<span class="prets">{%h}</span>:<span class="prets">{%m}</span>:<span class="prets">{%s}</span>
                        </xe-countdown>
                    </div>
                    <div class="item-procon">
                        <div class="pic">
                            <img v-lazy="picServer + item.proMainImg" alt="">
                        </div>
                        <div class="msg">
                            <div class="proname">
                                <span class="xe-iconfont xe-icon-yushoufuben coupon-style-icon1"></span>
                                {{item.proName}}
                            </div>
                            <div class="pro-des">
                                {{item.shopName}}
                            </div>
                            <div class="pro-spce">
                                规格：{{item.specValue ? item.specValue : '无'}}
                            </div>
                            <div class="pro-prcent">
                                <span class='pr' :style="'width:' + item.prePercent + '%'"></span>
                            </div>
                            <div class="pro-price">
                                <span class="price" v-html="splitPrice(item.activityPrice ? item.activityPrice : 0)"></span><em class="unit" v-if="item.proUnit">/{{item.proUnit}}</em>
                                <!--<s class="del">&yen;100.00</s>-->
                            </div>
                            <div class="pro-btn">
                                <!-- prePercent 已售百分比 -->
                                <a href="" v-if="item.endTime > 0 && item.prePercent !== 100 && item.minQuantity <= item.saleQuantity" class="gotoBuy">{{currentTab == 1 ? '立即预订' : '即将开始'}}</a>
                                <a href="" v-else-if="item.minQuantity > item.saleQuantity" class="gotoBuy noneBuy">已抢光</a>
                                <a href="" v-else-if="item.endTime <= 0 && item.prePercent !== 100 && item.minQuantity < item.saleQuantity" class="gotoBuy noneBuy">已结束</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="m-cart-none" v-if="!proList || proList.length === 0">
                <div class="pic2">
                    <img src="../../static/images/cart-n2.png" alt="">
                </div>
                <div class="des">
                    <p class="f32">{{currentTab == 1 ? '当前城市暂无预售中的商品': '当前城市暂无未开始的预售商品'}}</p>
                </div>
                <div style="text-align: center">
                    <mt-button class="xe-button-default" size="small" plain @click.prevent="goLocal">切换城市</mt-button>
                    <mt-button class="xe-button-default xe-button-red" size="small" plain @click.prevent="goCategory">随便逛逛</mt-button>
                </div>
            </div>
            <!--<infinite-loading :on-infinite="onInfinite" ref="infiniteLoading" class="infinite-contanier">-->
                <!--<span slot="no-more" class="infinite-no-more">-->
                    <!--暂无更多数据~-->
                <!--</span>-->
            <!--<div slot="no-results" class="m-cart-none">-->
                <!--<div class="pic">-->
                    <!--<img src="../../static/images/cart-n1.png" alt="">-->
                <!--</div>-->
                <!--<div class="des">-->
                    <!--<p class="f32">当前城市暂无预售活动~</p>-->
                <!--</div>-->
                <!--&lt;!&ndash;<div class="btn">&ndash;&gt;-->
                <!--&lt;!&ndash;<mt-button class="xe-button-default" size="small" plain @click.prevent="toCategory">去购买~</mt-button>&ndash;&gt;-->
                <!--&lt;!&ndash;</div>&ndash;&gt;-->
            <!--</div>-->
        <!--</infinite-loading>-->
        </div>
    </xe-layout>
</template>
<script>
    import {CountDown} from 'components/CountDown';
    import {getLocalStorage, setLocalStorage} from 'utils/commonBase';
    import axios from 'utils/httpRequest';
    export default {
        components: {
            [CountDown.name]: CountDown
        },
        beforeRouteEnter: (to, from, next) => {
            let areaRegionMap = getLocalStorage('REGIONMAP');
            if (areaRegionMap && JSON.parse(areaRegionMap).areaId === parseInt(to.params.areaId)) {
                next();
            } else {
                axios({
                    method: 'post',
                    url: '/xe-route/xe-app/mobileApp/areaInfo/queryAreaInfoByCityId',
                    data: {
                        areaId: to.params.areaId
                    }
                }).then(res => {
                    setLocalStorage('REGIONMAP', JSON.stringify(res.data.areaInfo));
                    next();
                }).catch(error => {
                    console.log(error);
                    next(false);
                });
            }
        },
        data() {
            return {
                currentTab: 1,
                navListData: [
                    {
                        name: '预售中',
                        id: 1
                    },
                    {
                        name: '未开始',
                        id: 2
                    }
                ],
                paramsData: {
                    cityId: '',
                    flag: 1
                },
                proList: [],
                picServer: ''
            };
        },
        created() {
            this.init();
        },
        mounted() {
            /* eslint-disable */
            wx.hideOptionMenu();
            this.$nextTick(() => {
                this.$http({
                    method: 'post',
                    url: '/xe-route/xe-app/mobileApp/user/weChatShare',
                    data: {
                        shareUrl: window.location.href.split('#')[0]
                    }
                }).then(res => {
                    let wxConfig = res.data.data;
                    let wxshareDesc = '';
                    let wxshareTitle = '拼柜采购，零担用量，整柜价格，到家服务～';
                    let wxshareLink = window.location.href;
                    let wxshareImgUrl = 'https://wap.xebest.com/static/img/sharelogo.png';
                    wx.config({
//                        debug: true,
                        appId: wxConfig.appId,
                        timestamp: wxConfig.timestamp,
                        nonceStr: wxConfig.nonceStr,
                        signature: wxConfig.signature,
                        jsApiList: [
                            'checkJsApi',
                            'onMenuShareTimeline',
                            'onMenuShareAppMessage',
                            'onMenuShareQQ',
                            'onMenuShareQZone',
                            'hideOptionMenu',
                            'showOptionMenu'
                        ]
                    });
                    //微信分享code by zhangwen
                    wx.ready(function(){
                        //分享朋友圈
                        wx.onMenuShareTimeline({
                            title: wxshareTitle, // 分享标题
                            link: wxshareLink, // 分享链接
                            imgUrl: wxshareImgUrl, // 分享图标
                            success: function () {
                                // 用户确认分享后执行的回调函数
                            },
                            cancel: function () {
                                // 用户取消分享后执行的回调函数
                            }
                        });

                        //分享朋友
                        wx.onMenuShareAppMessage({
                            title: wxshareTitle, // 分享标题
                            desc: wxshareDesc, // 分享描述
                            link: wxshareLink, // 分享链接
                            imgUrl: wxshareImgUrl, // 分享图标
                            type: 'link', // 分享类型,music、video或link，不填默认为link
                            dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                            success: function () {
                                // 用户确认分享后执行的回调函数
                            },
                            cancel: function () {
                                // 用户取消分享后执行的回调函数
                            }
                        });
                        //分享QQ
                        wx.onMenuShareQQ({
                            title: wxshareTitle, // 分享标题
                            desc: wxshareDesc, // 分享描述
                            link: wxshareLink, // 分享链接
                            imgUrl: wxshareImgUrl, // 分享图标
                            success: function () {
                                // 用户确认分享后执行的回调函数
                            },
                            cancel: function () {
                                // 用户取消分享后执行的回调函数
                            }
                        });
                        wx.onMenuShareQZone({
                            title: wxshareTitle, // 分享标题
                            desc: wxshareDesc, // 分享描述
                            link: wxshareLink, // 分享链接
                            imgUrl: wxshareImgUrl, // 分享图标
                            success: function () {
                                // 用户确认分享后执行的回调函数
                            },
                            cancel: function () {
                                // 用户取消分享后执行的回调函数
                            }
                        });
                    });
                }).catch(error => {
                    console.log(error);
                });
            });
        },
        methods: {
//            onInfinite() {
//            },
            goLocal() {
                this.$router.push({
                    name: 'Location'
                });
            },
            goCategory() {
                this.$router.push({
                    name: 'Category'
                });
            },
            goDetails(item) {
                console.log(item);
                this.$router.push({
                    name: 'ProductDetails',
                    query: {
                        prosku: item.proSku
                    },
                    params: {
                        prospu: item.proSpu
                    }
                });
            },
            tabCheck(ids) {
                this.currentTab = ids;
                this.paramsData.flag = ids;
                this.getPreSaleDetail();
            },
            init() {
                let nowRegionMap = JSON.parse(this.$getLocalStorage('REGIONMAP'));
                if (this.$route.query.cityId) {
                    this.paramsData.cityId = this.$route.query.cityId;
                } else {
                    this.paramsData.cityId = nowRegionMap.areaId;
                }
                this.getPreSaleDetail();
            },
            getPreSaleDetail() {
                this.$indicator.open();
                this.$http({
                    method: 'post',
                    url: '/xe-route/xe-app/mobileApp/homepage/preSalePage',
                    data: this.paramsData
                }).then(res => {
                    this.$indicator.close();
                    this.picServer = res.data.picServerPro;
                    this.proList = res.data.proList ? res.data.proList : [];
                    if (this.proList.length > 0) {
                        /* eslint-disable */
                        wx.showOptionMenu();
                    }
                }).catch(error => {
                    console.log(error);
                    this.$indicator.close();
//                    this.$refs.infiniteLoading.$emit('$InfiniteLoading:complete');
                });
            }
        }
    };
</script>
<style lang="scss">
    @import '../../static/styles/rules.scss';
    .m-presell-tab {
        height: 90/$ppr;
        background: #fff;
        display: flex;
        position: relative;
        border-bottom: 1/$ppr solid $border-color-e8e;
        > div {
            flex: 1;
            text-align: center;
            span {
                display: inline-block;
                line-height: 89/$ppr;
                font-size: 28/$ppr;
                color: $text-333;
                border-bottom: 1/$ppr solid transparent;
            }
            &.active {
                span {
                    color: $main-color;
                    border-color: $main-color;
                }
            }
        }
    }
    .m-presell-list {
        .timecount {
            padding: 25/$ppr 20/$ppr 20/$ppr;
            font-size: 26/$ppr;
            color: $text-666;
            height: 73/$ppr;
        }
        .item {
            margin-left: 0;
            background: #fff;
        }
        .item-procon {
            margin-left: 20/$ppr;
        }
    }
    .count-prets {
        vertical-align: top;
        line-height: 28/$ppr;
        .prets {
            height: 28/$ppr;
            display: inline-block;
            padding:0 10/$ppr;
            font-size: 25/$ppr;
            background: #464553;
            color: #fff;
            border-radius: 5/$ppr;
            margin:0 4/$ppr;
        }
    }
</style>
