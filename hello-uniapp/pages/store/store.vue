<template>
    <xe-layout class="m-bg-dark m-flexlay">
        <view class="m-search-barcon" slot="header" style="background: #fff;">
            <view class="m-search-back xe-iconfont xe-icon-fanhui-" @click.prevent="goBackFn"></view>
            <view class="m-search-bar m-search-bar2" :class="{'m-search-typing': focusFlag}">
                <view class="m-search-newcon">
                    <form class="s-form" id="s-search" method="get" action="/" onsubmit="return false" @submit.prevent="searchBtnFn">
                        <label for="s-search-input" class="xe-iconfont xe-icon-sousuo"></label>
                        <input v-model.trim="searchText" class="s-search-input" id="s-search-input" @focus="focusFlag = true" @blur="focusFlag = false" type="search" placeholder="输入关键词">
                    </form>
                    <span v-show="searchText.length" @click="searchText = ''" class="xe-iconfont xe-icon-cuowu"></span>
                    <view class="m-search-btn" @click="searchBtnFn">
                        <span>搜索</span>
                    </view>
                </view>
            </view>
        </view>
        <router-link slot="header" v-if="vendor" tag="view" class="m-store-namecons" :to="{name: 'StoreDet', query: {userCode: this.$route.query.userCode, proCount: vendor.proCount}}">
            <view class="pic">
                <img v-if="vendor.shopLogo" :src="logoPicServer + vendor.shopLogo" alt="">
                <img v-else src="../../static/images/default.png" alt="">
            </view>
            <view class="msg">
                <view class="name-cons">
                    <view class="name">{{vendor.shopName}}</view>
                    <view class="name-count"><span>{{vendor.proCount}}件商品</span>｜<span>月销{{vendor.orderCount}}单</span><i class="u-arrow xe-iconfont xe-icon-unfold u-arrow-right"></i></view>
                </view>
                <view class="des">
                    <view>主营商品：</view><view class="content">{{vendor.businessTypeName}}</view>
                </view>
            </view>
        </router-link>
        <view class="m-store-coupon" v-if="couponList && couponList.length">
            <view class="m-store-contanier">
                <view class="store-coupon"
                        v-for="item in couponList"
                        :key="item.couTempId"
                        :class="{'disabled': item.giveOutNum >= item.sendNum}"
                        @click.prevent="stCouponClick(item)"
                >
                    <view class="store-circle">
                        <i v-for="item in circleNum" :key="item"></i>
                    </view>
                    <view class="store-coupon-num">
                        <p><em>&yen;</em>{{item.useDisAmount}}</p>
                        <view class="coupon-des">满&yen;{{item.useOrderAmount}}可用</view>
                    </view>
                    <view class="store-coupon-btns">
                        立即<br>领取
                        <view class="sold-out xe-iconfont xe-icon-yilingwan"></view>
                    </view>
                </view>
            </view>
        </view>
        <view class="store-procons">
            <view class="store-pronav" v-if="navListData.length">
                <xe-navtab-con :itemData="navListData" @swiperItemClick="swiperItemClick" ref="navTab"></xe-navtab-con>
            </view>
        </view>
        <view class="store-proitem m-content-view">
            <proItem
                v-if="productData.length"
                v-for="item in productData"
                :picServerPro="picServer"
                :itemData="item"
                :key="item.proSpu"
                :showVendor="false"
            ></proItem>
        </view>
        <infinite-loading :on-infinite="onInfinite" ref="infiniteLoading" class="infinite-contanier">
                <span slot="no-more" class="infinite-no-more">
                    暂无更多数据~
                </span>
            <view slot="no-results" class="m-cart-none">
                <view class="pic">
                    <img src="../../static/images/cart-n1.png" alt="">
                </view>
                <view class="des">
                    <p class="f32">暂无商品~</p>
                </view>
                <!--<view class="btn">-->
                <!--<mt-button class="xe-button-default" size="small" plain @click.prevent="toCategory">去购买~</mt-button>-->
                <!--</view>-->
            </view>
        </infinite-loading>
        <!--订单详情-->
        <router-view slot="outer"></router-view>
    </xe-layout>
</template>
<script type="text/ecmascript-6">
    import {xeNavTabCon} from 'components/xeNavTab';
    import proItem from 'components/ProItem/ProItem';
    import axios from 'axios';
    import { yushowCompro } from 'utils/index';
    export default {
        name: 'xe-page-store',
        data() {
            return {
                circleNum: 10,
                userCode: '',
                navListData: [],
                areaId: '',
                picServer: '',
                logoPicServer: '',
                vendor: null,
                couponList: [],
                currentPage: 1,
                currentCateId: '',
                productData: [],
                cancel: '',
                focusFlag: false,
                searchText: ''
            };
        },
        created() {
            this.searchText = '';
            let nowRegionMap = JSON.parse(this.$getLocalStorage('REGIONMAP'));
            if (this.userCode !== this.$route.query.userCode || this.areaId !== nowRegionMap.areaId) {
                this.userCode = this.$route.query.userCode;
                this.areaId = nowRegionMap.areaId;
                this.currentPage = 1;
                this.navListData = [];
                this.couponList = [];
                this.productData = [];
                this.searchText = '';
//                this.getProByCondition();
                console.log(123123123);
                this.$nextTick(() => {
                    this.$refs.infiniteLoading.$emit('$InfiniteLoading:reset');
                });
            }
        },
        methods: {
            searchBtnFn() {
                if (this.searchText) {
                    this.$router.push({
                        name: 'StoreSearch',
                        query: {
                            keyword: this.searchText,
                            usercode: this.userCode
                        }
                    });
                } else {
                    this.$toast({
                        message: '请输入商品名称/货号查询',
                        duration: 1500
                    });
                }
            },
            stCouponClick(item) {
                if (item.giveOutNum >= item.sendNum) {
                    this.$toast({
                        message: '优惠券已领完',
                        duration: 1500
                    });
                    return;
                }
                this.$router.push({name: 'StCouponDet', params: {couTempId: item.couTempId}, query: {userCode: this.$route.query.userCode}});
            },
            swiperItemClick(value) {
                console.log(value);
                if (this.cancel) {
                    this.cancel();
                }
                this.currentPage = 1;
                this.currentCateId = value.id;
                this.productData = [];
                this.$nextTick(() => {
                    this.$refs.infiniteLoading.$emit('$InfiniteLoading:reset');
                });
            },
            getVenShopDetail() {
                this.$indicator.open();
                this.$http({
                    method: 'post',
                    url: '/xe-route/xe-app/mobileApp/venShopDetail/getVenShopDetail',
                    data: {
                        'userCode': this.$route.query.userCode,    // 商户userCode
                        'areaId': this.areaId,                   // 当前区域
                        'pageNum': 1,                  // 分页页码
                        'pageSize': 10                 // 分页条数
                    }
                }).then(res => {
                    console.log(res);
                    if (!this.picServer) {
                        this.picServer = res.data.picServer;
                    }
                    if (!this.logoPicServer) {
                        this.logoPicServer = res.data.logoPicServer;
                    }
                    this.$indicator.close();
                    this.cNavListData = res.data.cateList;
                    this.vendor = res.data.vendor;
                    this.couponList = res.data.couponList;
                    if (this.navListData.length) {
                        this.currentCateId = this.navListData[0].id;
                        this.getProByCondition();
                    } else {
                        this.productData = [];
                        this.$refs.infiniteLoading.$emit('$InfiniteLoading:complete');
                    }
                }).catch(error => {
                    console.log(error);
                    this.$refs.infiniteLoading.$emit('$InfiniteLoading:complete');
                    this.$indicator.close();
                });
            },
            onInfinite() {
                console.log('onInfinite===');
                if (this.navListData.length) {
                    this.getProByCondition();
                } else {
                    this.getVenShopDetail();
                }
            },
            getProByCondition() {
                let _this = this;
                let CancelToken = axios.CancelToken;
                this.$http({
                    cancelToken: new CancelToken(function executor(c) {
                        // An executor function receives a cancel function as a parameter
                        _this.cancel = c;
                    }),
                    method: 'post',
                    url: '/xe-route/xe-app/mobileApp/venShopDetail/getProByCondition',
                    data: {
                        'userCode': this.$route.query.userCode, // 商户userCode
                        'areaId': this.areaId, // 当前区域
                        'cateId': this.currentCateId, // 分类id
                        'keyWord': '', // 搜索关键字
                        'pageNum': this.currentPage, // 分页页码
                        'pageSize': 10 // 分页条数
                    }
                }).then(res => {
                    console.log(res);
                    if (res.data.productList.productCount === 0) {
                        // 无商品时
                        this.$refs.infiniteLoading.$emit('$InfiniteLoading:complete');
                    } else {
                        if (res.data.productList.product.length > 0) {
                            this.productData.push(...res.data.productList.product);
                            this.currentPage++;
                            // 预售的商品选择需要显示的对应价格
                            this.productData = yushowCompro(this.productData);
                            this.$refs.infiniteLoading.$emit('$InfiniteLoading:loaded');
                        } else {
                            // 所有商品都加载完时
                            this.$refs.infiniteLoading.$emit('$InfiniteLoading:complete');
                        }
                    }
                }).catch(error => {
                    this.$refs.infiniteLoading.$emit('$InfiniteLoading:complete');
                    console.log(error);
                });
            }
        },
        computed: {
            cNavListData: {
                get() {
                    return null;
                },
                set(val) {
                    if (val.length) {
                        let result = [];
                        val.forEach(item => {
                            let obj = {
                                name: item.cateName,
                                id: item.cateId
                            };
                            result.push(obj);
                        });
                        this.navListData = result;
                    } else {
                        this.navListData = [];
                    }
                }
            }
        },
        components: {
            [xeNavTabCon.name]: xeNavTabCon,
            proItem
        }
    };
</script>
<style rel="stylesheet/scss" lang="scss">
    @import '../../static/styles/rules.scss';
    .m-store-namecons {
        width: 750/$ppr;
        margin: 0 auto;
        padding: 20/$ppr;
        @extend .xe-gradient-color;
        display: flex;
        .pic {
            width: 80/$ppr;
            height: 80/$ppr;
            border: 1/$ppr solid $border-color-e8e;
            background: #fff;
            border-radius: 5/$ppr;
            margin-right: 15/$ppr;
            img {
                width: 100%;
                height: 100%;
            }
        }
        .msg {
            flex: 1;
        }
        .name-cons {
            display: flex;
            justify-content: space-between;
            align-items: center;
            color: #fff;
            .name {
                font-size: 28/$ppr;
                max-width: 50%;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
        }
        .name-count {
            font-size: 24/$ppr;
        }
        .des {
            margin: 10/$ppr 0;
            font-size: 24/$ppr;
            color: #fff;
            display: flex;
            align-items: flex-start;
            line-height: 1.5;
            .content {
                flex: 1;
            }
        }
    }
    .m-store-coupon {
        width: 750/$ppr;
        margin: 0 auto;
        padding: 20/$ppr 0 20/$ppr 0/$ppr;
        background: #fff;
    }
    .store-procons {
        width: 750/$ppr;
        margin: 0 auto;
    }
    .m-store-contanier {
        padding-right: 20/$ppr;
        display: flex;
        flex-wrap: nowrap;
        overflow: auto;
        -webkit-overflow-scrolling: touch;
        .store-coupon {
            position: relative;
            height: 98/$ppr;
            display: flex;
            margin-left: 20/$ppr;
            .store-circle {
                position: absolute;
                width: 10/$ppr;
                left: -5/$ppr;
                top: 0;
                bottom: 0;
                overflow: hidden;
                i {
                    width: 10/$ppr;
                    height: 10/$ppr;
                    background: #fff;
                    display: block;
                    margin: 5/$ppr 0;
                    border-radius: 50%;
                }
            }
            &:last-child {
                padding-right: 20/$ppr;
            }
            &.disabled {
                .store-coupon-num {
                    background: #bfbfbf;
                }
                .store-coupon-btns {
                    color: #ccc;
                    .sold-out {
                        display: block;
                    }
                }
            }
        }
        .store-coupon-num {
            padding: 0 20/$ppr;
            min-width: 180/$ppr;
            background: #fc534e;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            p {
                color: #fff;
                font-size: 38/$ppr;
                line-height: 1;
                em {
                    font-size: 20/$ppr;
                    vertical-align: super;
                }
            }
            .coupon-des {
                font-size: 20/$ppr;
                color: #fff;
                margin-top: 8/$ppr;
            }
        }
        .store-coupon-btns {
            position: relative;
            width: 90/$ppr;
            height: 98/$ppr;
            font-size: 28/$ppr;
            text-align: center;
            line-height: 1.4;
            border:1/$ppr solid #e4e4e4;
            display: flex;
            align-items: center;
            justify-content: center;
            border-left: none;
            overflow: hidden;
            .sold-out {
                position: absolute;
                font-size: 70/$ppr;
                color: #858585;
                right: -12/$ppr;
                bottom: -2/$ppr;
                line-height: 1;
                display: none;
            }
        }
    }
    .store-proitem {
        background: #fff;
        overflow: hidden;
    }
</style>
