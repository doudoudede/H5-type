<template>
    <xe-layout class='m-bg-dark m-flexlay'>
        <div class="m-search-barcon" slot="header" style="background: #2a211f;">
            <div class="m-search-back xe-iconfont xe-icon-fanhui-" @click.prevent="goBackFn"></div>
            <div class="m-search-bar m-search-bar2" :class="{'m-search-typing': focusFlag}">
                <div class="m-search-newcon">
                    <form class="s-form" id="s-search" method="get" action="/" onsubmit="return false" @submit.prevent="searchBtnFn">
                        <label for="s-search-input" class="xe-iconfont xe-icon-sousuo"></label>
                        <input v-model.trim="searchText" class="s-search-input" id="s-search-input" @focus="focusFlag = true" @blur="focusFlag = false" type="search" placeholder="输入关键词">
                    </form>
                    <span v-show="searchText.length" @click="searchText = ''" class="xe-iconfont xe-icon-cuowu"></span>
                    <div class="m-search-btn" @click="searchBtnFn">
                        <span>搜索</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="m-bvendor-pic" v-if="sliderData.length">
            <Slider
                ref="slider"
                :sliderData="sliderData"
                :vendorPicFlag='true'
                :picServer="picServer"
                :picServerPro="picServerPro"
                :autoPlay="true"
                :keyProps="{keyName: 'shopLogo'}"
                :loop="sliderData.length > 1 ? true : false"
            >
            </Slider>
        </div>
        <div class="m-bvendor-itemcon">
            <div class="m-bvendor-con">
                <div class="bvendor-item" v-for="(item, index) in aVendorList" :key="index" v-if="item.proCount">
                    <router-link tag="div" class="item-topbox" :to="{name: 'Store', query: {userCode: item.userCode}}">
                        <div class="item-logo">
                            <img v-if="item.shopLogo" v-lazy="picServer + item.shopLogo" alt="">
                            <img v-else src="../../static/images/default.png" alt="">
                        </div>
                        <div class="item-shopPro">
                            <div class="shopName">
                                {{item.shopName}}
                            </div>
                            <div class="shopOrderDetails">
                                <div class="order-offer" v-if="item.couponInfoList.length">
                                    <template v-if="item.couponInfoList[0].useRuleType === 1">满&yen;{{item.couponInfoList[0].useOrderAmount | toFixed2}}减&yen;{{item.couponInfoList[0].useDisAmount | toFixed2}}</template>
                                    <template v-else><span class="coupon-style">券</span>无门槛优惠券&yen;{{item.couponInfoList[0].useDisAmount | toFixed2}}</template>
                                </div>
                                <div class="order-allCount">
                                    <span>{{item.proCount}}件商品&nbsp;&nbsp;&nbsp;</span><span>&nbsp;&nbsp;&nbsp;月销{{item.orderCount}}单</span>
                                </div>
                            </div>
                        </div>
                    </router-link>
                    <div class="item-botbox">
                        <router-link tag="div" class="pro-flr" v-for="(items, indexs) in item.proSpuInfo" v-if="indexs <= 2" :key='indexs' :to="{name: 'ProductDetails', params: {prospu: items.proSpu}}">
                            <div class="pro-picbox">
                                <img v-lazy="picServerPro + items.proMainImg" alt="">
                            </div>
                            <div class="pro-txtbox">
                                <span class="cor_red sma_fot">¥</span><span class="cor_red big_fot">{{items.areaPrice | moneySkinToText('rmbs')}}</span>&nbsp;&nbsp;
                                <!-- <span class="fot_deco">{{items.areaPrice | moneySkinToText('rmb')}}</span> -->
                            </div>
                        </router-link>
                    </div>
                </div>
            </div>
            <infinite-loading @infinite="onInfinite" ref="infiniteLoading" class="infinite-contanier">
                <span slot="no-more" class="infinite-no-more">
                    暂无更多数据~
                </span>
            </infinite-loading>
        </div>
    </xe-layout>
</template>
<script type="text/ecmascript-6">
    import Slider from 'components/Slider/Slider';
    import VendorCon from 'components/vendor/VendorCon';
    import VendorPro from 'components/vendor/VendorPro';
    export default {
        name: 'xe-page-bestvendor',
        data() {
            return {
                picServer: '',
                picServerPro: '',
                sliderData: [],
                currentPage: 1,
                aVendorList: [],
                focusFlag: false,
                searchText: '',
                keyProps: {
                    keyName: '999'
                }
            };
        },
        created() {
            let nowRegionMap = JSON.parse(this.$getLocalStorage('REGIONMAP'));
            this.cityName = nowRegionMap.cityName;
            this.cityId = nowRegionMap.areaId;
            // 取首页焦点图
            // 取推荐商户
            this.getVender();
            // 取非推荐商户
            // this.getVenderAll();
        },
        methods: {
            searchBtnFn() {
                if (this.searchText) {
                    this.$router.push({
                        name: 'BestVendorSearch',
                        query: {
                            keyword: this.searchText
                        }
                    });
                } else {
                    this.$toast({
                        message: '请输入店铺名搜索',
                        duration: 1500
                    });
                }
            },
            getVender() {
                this.$http({
                    method: 'post',
                    url: '/xe-route/xe-app/mobileApp/homepage/getVender',
                    data: {
                        cityId: this.cityId,
                        menuType: 13  // 根据栏位所在分页不同 传相对应的menuType  首页-优质商户 5    优质商户频道页-优质商户 13
                    }
                }).then(res => {
                    console.log(res);
                    this.picServer = res.data.picServer;
                    this.picServerPro = res.data.picServerPro;
                    this.sliderData = res.data.appVenInfoFormList;
                }).catch(error => {
                    console.log(error);
                });
            },
            onInfinite($state) {
                this.getVenderAll($state);
            },
            getVenderAll($state) {
                this.$http({
                    method: 'post',
                    url: '/xe-route/xe-app/mobileApp/homepage/getVenderAll',
                    data: {
                        cityId: this.cityId,
                        currentPage: this.currentPage
                    }
                }).then(res => {
                    console.log(res);
                    if (!this.picServer) {
                        this.picServer = res.data.picServer;
                    }
                    if (res.data.count === 0) {
                        $state.complete();
                    } else {
                        if (res.data.appVenInfoFormList.length > 0) {
                            this.aVendorList.push(...res.data.appVenInfoFormList);
                            this.currentPage++;
                            $state.loaded();
                        } else {
                            // 所有商品都加载完时
                            $state.$complete();
                            // this.$refs.infiniteLoading.$emit('$InfiniteLoading:complete');
                        }
                    }
                }).catch(error => {
                    console.log(error);
                    $state.complete();
                });
            }
        },
        components: {
            Slider,
            VendorCon,
            VendorPro
        }
    };
</script>
<style rel="stylesheet/scss" lang="scss">
    @import '../../static/styles/rules.scss';
    .m-bvendor-pic {
        padding: 0 34/$ppr 20/$ppr;
        max-width: 750/$ppr;
        margin: 0 auto;
        position: relative;
        width: 100%;
        height: 380/$ppr;
        background: #e5e4e5;
        &:before {
            position: absolute;
            content: '';
            left: 0;
            right: 0;
            top: 0;
            bottom: 70/$ppr;
            background: #2a211f;
        }
        .swiper-container {
            border-radius: 10/$ppr;
        }
    }
    .pro-itemPicbox {
        position: absolute;
        left: 30/$ppr;
        bottom: 40/$ppr;
        overflow: hidden;
        .pic-con {
            float: left;
            width: 90/$ppr;
            height: 90/$ppr;
            margin-right: 10/$ppr;
            img {
                display: block;
                width: 100%;
                height: 100%;
            }
        }
    }
    .m-bvendor-con {
        color: #f2f1f1;
    }
    .bvendor-item {
        padding: 0 34/$ppr;
        background: #fff;
        margin-bottom: 20/$ppr;
        .item-topbox {
            display: flex;
            align-items: center;
            padding: 30/$ppr 0 24/$ppr;
            .item-logo {
                width: 80/$ppr;
                img {
                    display: block;
                    width: 60/$ppr;
                    height: 60/$ppr;
                    border-radius: 5px;
                }
            }
            .item-shopPro {
                @include flex(1);
                .shopName {
                    @include clamp(1);
                    width: 100%;
                    color: #3d3d3d;
                    font-size: 32/$ppr;
                    font-weight: 600;
                    line-height: 42/$ppr;
                    word-break: break-all;
                }
                .shopOrderDetails {
                    @include flexbox();
                    font-size: 22/$ppr;
                    color: #666;
                    line-height: 28/$ppr;
                }
                .order-allCount {
                    span {
                        position: relative;
                        &:first-child::after {
                            content: '';
                            position: absolute;
                            right: 0;
                            top: 50%;
                            margin-top: -9/$ppr;
                            height: 18/$ppr;
                            border-right: 1px solid #666;
                        }
                    }
                }
            }
        }
        .item-botbox {
            display: flex;
            .pro-flr {
                width: 220/$ppr;
                margin-right: 10/$ppr;
                &:last-child {
                    margin-right: 0;
                }
            }
            .pro-picbox {
                width: 220/$ppr;
                height: 220/$ppr;
                img {
                    display: block;
                    width: 100%;
                    height: 100%;
                }
            }
            .pro-txtbox {
                line-height: 68/$ppr;
                font-size: 20/$ppr;
                color: #ccc;
                .cor_red {
                    color: #fd4229;
                }
                .big_fot {
                    font-size: 30/$ppr;
                }
                .sma_fot {
                    font-size: 18/$ppr; 
                }
                .fot_deco {
                    text-decoration: line-through;
                }
            }
        }
    }
</style>
