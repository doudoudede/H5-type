<template>
    <xe-layout class="m-flexlay">
        <view class="m-content-view">
            <view class="m-sec-banner">
                <img src="../../static/images/pindaomiaosha.jpg" alt="">
            </view>
            <view class="m-sec-list">
                <view class="item" v-for="(item, index) in startList" :key="index" @click.prevent="goDetails(item)">
                    <view class="item-procon">
                        <view class="pic">
                            <img v-lazy="picServer + item.proMainImg" alt="">
                        </view>
                        <view class="msg">
                            <view class="proname">
                                <span class="xe-iconfont xe-icon-miaoshafuben coupon-style-icon"></span>
                                {{item.proName}}
                            </view>
                            <view class="pro-des">
                                {{item.shopName}}
                            </view>
                            <view class="pro-spce">
                                规格：{{item.specValue ? item.specValue : '无'}}
                            </view>
                            <view class="pro-prcent">
                                <span class='pr' :style="'width:' + item.prePercent + '%'"></span>
                            </view>
                            <view class="pro-price">
                                <span class="price" v-html="splitPrice(item.skuPrice ? item.skuPrice : 0)"></span><em class="unit" v-if="item.proUnit">/{{item.proUnit}}</em>
                                <s class="del">&yen;{{item.costPrice}}</s>
                            </view>
                            <view class="pro-btn">
                                <a href="#" class="gotoBuy">去抢购</a>
                            </view>
                        </view>
                    </view>
                </view>
            </view>
            <view slot="no-results" class="m-cart-none" v-if="!startList || startList.length === 0">
                <view class="pic">
                    <img src="../../static/images/cart-n2.png" alt="">
                </view>
                <view class="des">
                    <p class="f32">当前城市暂无秒杀活动~</p>
                </view>
                <view style="text-align: center">
                    <mt-button class="xe-button-default" size="small" plain @click.prevent="goLocal">切换城市</mt-button>
                    <mt-button class="xe-button-default xe-button-red" size="small" plain @click.prevent="goCategory">随便逛逛</mt-button>
                </view>
            </view>
            <!--<infinite-loading :on-infinite="onInfinite" ref="infiniteLoading" class="infinite-contanier">-->
                <!--<span slot="no-more" class="infinite-no-more">-->
                    <!--暂无更多数据~-->
                <!--</span>-->
            <!--<view slot="no-results" class="m-cart-none">-->
                <!--<view class="pic">-->
                    <!--<img src="../../static/images/cart-n1.png" alt="">-->
                <!--</view>-->
                <!--<view class="des">-->
                    <!--<p class="f32">当前城市暂无秒杀活动~</p>-->
                <!--</view>-->
                <!--<view class="btn">-->
                <!--<mt-button class="xe-button-default" size="small" plain @click.prevent="toCategory">去购买~</mt-button>-->
                <!--</view>-->
            <!--</view>-->
        <!--</infinite-loading>-->
        </view>
    </xe-layout>
</template>
<script>
    import {getLocalStorage, setLocalStorage} from 'utils/commonBase';
    import axios from 'utils/httpRequest';
    export default {
        data() {
            return {
                startList: [],
                paramsData: {
                    cityId: ''
                },
                picServer: ''
            };
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
                    let wxshareTitle = '秒杀专区专属好货，等你来抢～';
                    let wxshareLink = window.location.href;
                    let wxshareImgUrl = 'https://wap.xebest.com/static/img/pindaomiaosha.8238f1a.jpg';
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
            init() {
                let nowRegionMap = JSON.parse(this.$getLocalStorage('REGIONMAP'));
                if (this.$route.query.cityId) {
                    this.paramsData.cityId = this.$route.query.cityId;
                } else {
                    this.paramsData.cityId = nowRegionMap.areaId;
                }
                this.getPreSaleDetail();
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
            getPreSaleDetail() {
                this.$indicator.open();
                this.$http({
                    method: 'post',
                    url: '/xe-route/xe-app/mobileApp/homepage/getDiscountPage',
                    data: this.paramsData
                }).then(res => {
                    this.$indicator.close();
                    this.picServer = res.data.picServerPro;
                    this.startList = res.data.startList ? res.data.startList : [];
                    if (this.startList.length > 0) {
                        /* eslint-disable */
                        wx.showOptionMenu();
                    }
                }).catch(error => {
                    console.log(error);
                    this.$indicator.close();
                });
            }
        }
    };
</script>
<style lang="scss">
    @import '../../static/styles/rules.scss';
    .m-sec-banner {
        width: 100%;
        height: 280/$ppr;
        background: #f5f5f5;
        img {
            width: 100%;
            height: 100%;
        }
    }
</style>
