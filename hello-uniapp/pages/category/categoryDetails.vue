<template>
    <xe-layout class="m-flexlay">
        <FixedCart slot="header"></FixedCart>
        <div class="m-search-barcon" slot="header">
            <div class="m-search-back xe-iconfont xe-icon-fanhui-" @click.prevent="goBackFn"></div>
            <div class="m-search-bar m-searchresult-top">
                <div class="m-search-newcon">
                    <router-link tag="div" class="search-bar-down" :to="{name: 'Search'}">
                        <div>{{ $route.query.type ? parseInt($route.query.type) : 1 | searchCateToText}}</div>
                    </router-link>
                    <div class="m-index-searchcons">
                        <router-link tag="div" class="con" :to="{name: 'Search'}">
                            <input type="text" value="搜索" v-model="paramsData.keyWord">
                            <span class="xe-iconfont xe-icon-sousuo"></span>
                        </router-link>
                    </div>
                </div>
                <v-touch tag="div" class="filter" @tap="filterFn" v-if="cateProductBrand.length || JSON.stringify(cateProductPropertys) !== '{}'">
                    <span class="xe-iconfont xe-icon-filter"></span>
                </v-touch>
            </div>
        </div>
        <div class="m-category-tab" slot="header">
            <div>
                <p @click="showDrop = !showDrop">{{consText}}<em class="xe-iconfont xe-icon-unfold"></em></p>
                <transition name="slide-in">
                    <div class="m-dropdown" v-show="showDrop">
                        <div
                            v-for="(item, index) in consData"
                            :key="index"
                            :class="{'active': consIndex === index}"
                            @click.prevent="consClick(item, index)"
                        >{{item.name}}</div>
                    </div>
                </transition>
            </div>
            <!-- <div :class="{'active': paramsData.productType === 2}" @click.prevent="paramsData.productType = 2"><p>一口价</p></div>
            <div :class="{'active': paramsData.productType === 1}" @click.prevent="paramsData.productType = 1"><p>询报价</p></div> -->
        </div>
        <div class="m-searchresult-listcon m-content-div">
            <div v-if="(!$route.query.type || parseInt($route.query.type) === 1) && productList.length">
                <proItem
                    v-for="(item, index) in productList"
                    :key="item.proSpu + index"
                    :picServerPro="picServerPro"
                    :itemData="item"
                ></proItem>
            </div>
            <div class="m-searchven-con" v-if="parseInt($route.query.type) === 2 && vendorList.length">
                <VendorCon
                    v-for="(item, index) in vendorList"
                    :key="item.userCode + index"
                    :picServer="picServerVendor"
                    :showBusinessTypeName="true"
                    :itemData="item"
                ></VendorCon>
            </div>
            <infinite-loading @infinite="onInfinite" ref="infiniteLoading" class="infinite-contanier">
                <span slot="no-more" class="infinite-no-more">
                    暂无更多数据~
                </span>
                <div slot="no-results" class="m-cart-none">
                    <div class="pic">
                        <img src="../../static/images/cart-n1.png" alt="">
                    </div>
                    <div class="des">
                        <p class="f32">暂无符合条件的{{!$route.query.type ? '商品' : parseInt($route.query.type) === 1 ? '商品' : '店铺'}}</p>
                    </div>
                    <!--<div class="btn">-->
                    <!--<mt-button class="xe-button-default" size="small" plain @click.prevent="toCategory">去购买~</mt-button>-->
                    <!--</div>-->
                </div>
            </infinite-loading>
        </div>
        <xe-popup
            class="popup-search-result"
            slot="outer"
            ref="adrInstance"
            :show.sync="categoryFilter"
            popupTit="筛选"
            position="right">
            <div class="popup-cate-cons">
                <div class="p-cate-cons">
                    <div class="p-cate-brands" v-if="cateProductBrand.length">
                        <div class="p-cate-item">
                            <div class="p-cate-title">
                                <h3>品牌</h3>
                                <span @click.prevent="showBrandAll" :class="{'active': filterBrandAllFlag}">
                                    {{filterBrandAllFlag ? '收起' : '全部'}} <em class="xe-iconfont xe-icon-unfold"></em>
                                </span>
                            </div>
                            <div class="p-cate-list">
                                <a href="#"
                                    v-for="item in cateProductBrand.slice(0, filterBrandNum)"
                                    :key="item.brandId"
                                    :class="{'active': brandIds.indexOf(parseInt(item.brandId)) >= 0}"
                                    @click.prevent="brandIdFn(parseInt(item.brandId))"
                                >{{item.brandName}}</a>
                            </div>
                        </div>
                    </div>
                    <div class="p-cate-propertys" v-if="cateProductPropertys">
                        <div class="p-cate-item" v-for="(item, key) in cateProductPropertys" :key="key">
                            <div class="p-cate-title">
                                <h3>{{key}}</h3>
                                <span>全部 <em class="xe-iconfont xe-icon-unfold"></em></span>
                            </div>
                            <div class="p-cate-list">
                                <a href="#"
                                    v-for="(subitem, index) in item"
                                    :class="{'active': propertys.indexOf(key+'-'+subitem) >= 0}"
                                    :key="subitem + index"
                                    @click.prevent="propertysFn(key, subitem)"
                                >
                                    {{subitem}}
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="p-cate-btns">
                    <div @click.prevent="filterReset">重置</div>
                    <div @click.prevent="filterSure">确定</div>
                </div>
            </div>
        </xe-popup>
    </xe-layout>
</template>
<script type="text/ecmascript-6">
    import InfiniteLoading from 'vue-infinite-loading';
    import axios from 'axios';
    import proItem from 'components/ProItem/ProItem';
    import VendorCon from 'components/vendor/VendorCon';
    import FixedCart from 'components/FixedCart/FixedCart';
    import {Popup} from 'components/Popup';
    import { yushowCompro } from 'utils/index';
    export default {
        name: 'xe-page-searchresult',
        data() {
            return {
                firstIn: true,
                type: null,
                reload: false,
                showDrop: false, // 综合筛选
                categoryFilter: false,
                searchUrl: '/xe-route/xe-app/mobileApp/product/searchCateProduct',
                consText: '综合',
                picServerPro: '',
                picServerVendor: '',
                consData: [
                    {
                        name: '综合',
                        id: 1
                    },
                    {
                        name: '销量从高到低',
                        id: 2
                    },
                    {
                        name: '价格从高到低',
                        id: 3
                    },
                    {
                        name: '价格从低到高',
                        id: 4
                    }
                ],
                consIndex: 0,
                paramsData: {
                    keyWord: '', // 关键词
                    pageNum: 1,  // 当前页
                    pageSize: 10, // 每页数量
                    areaOrgCode: '', // 地区id
                    brandId: [], // 品牌集合(list)
                    propertys: [], // 扩展属性集合[name-value,...] 例：属性1-属性11
                    totalSaleSort: '',  // 销量排序：asc  desc
                    priceSort: '',  // 价格排序：asc  desc
                    productType: 2, // 1:询报价 2:一口价
                    cateId: []
                },
                productList: [],
                vendorList: [],
                brandIds: [],
                propertys: [],
                cateProductList: [],
                cateProductBrand: [],
                cateProductPropertys: null,
                filterBrandNum: 3, // 筛选默认展示的品牌数
                filterBrandAllFlag: false, // 筛选品牌标识
                querUserTypeFlag: false
            };
        },
        beforeRouteEnter(to, from, next) {
            next(vm => {
                if (from.name === 'ProductDetails') {
                    vm.reload = false;
                } else {
                    vm.reload = true;
                }
            });
        },
        created() {
            this.paramsData.areaOrgCode = JSON.parse(this.$getLocalStorage('REGIONMAP')).areaId;
            // this.paramsData.keyWord = this.$route.query.keyword;
            this.searchUrl = '/xe-route/xe-app/mobileApp/product/searchCateProduct';
        },
        activated() {
            if (!this.firstIn) {
                this.$nextTick(() => {
                    this.querUserType(() => {
                        if (this.reload) {
                            this.paramsData.areaOrgCode = JSON.parse(this.$getLocalStorage('REGIONMAP')).areaId;
                            this.paramsData.keyWord = this.$route.query.keyword;
                            this.resetQueryPro();
                        }
                    });
                });
            }
        },
        deactivated() {
            this.firstIn = false;
        },
        methods: {
            querUserType(fn) {
                this.$http({
                    method: 'post',
                    url: '/xe-route/xe-app/mobileApp/product/querUserType',
                    data: {}
                }).then(res => {
                    this.querUserTypeFlag = true;
                    this.paramsData.productType = res.data.userType === 2 ? 1 : 2;
                    fn && fn();
                }).catch(error => {
                    console.log(error);
                });
            },
            onInfinite($state) {
                if (this.querUserTypeFlag) {
                    this.searchProduct($state);
                } else {
                    this.querUserType(() => {
                        this.searchProduct($state);
                    });
                }
            },
            searchProduct($state) {
                let _this = this;
                let CancelToken = axios.CancelToken;
                this.paramsData.cateId = [this.$route.query.cateId];
                this.$http({
                    cancelToken: new CancelToken(function executor(c) {
                        // An executor function receives a cancel function as a parameter
                        _this.cancel = c;
                    }),
                    method: 'post',
                    url: this.searchUrl,
                    data: this.paramsData
                }).then(res => {
                    if (res.data.count === 0) {
                        $state.complete();
                    } else {
                        if (!this.picServerPro) {
                            this.picServerPro = res.data.picServer;
                        }
                        if (res.data.product && res.data.product.length > 0) {
                            this.productList.push(...res.data.product);
                            this.paramsData.pageNum++;
                            $state.loaded();
                            // 预售的商品选择需要显示的对应价格
                            this.productList = yushowCompro(this.productList);
                        } else {
                            // 所有商品都加载完时
                            $state.complete();
                        }
                    }
                    if (res.data.brand) {
                        this.cateProductBrand = res.data.brand;
                    }
                    if (res.data.propertys) {
                        this.cateProductPropertys = res.data.propertys;
                    }
                }).catch(error => {
                    console.log(error);
                    if (error.status === 'cancel') {
                        $state.reset();
                        return;
                    }
                    $state.complete();
                });
            },
            cancelFn() {
                // 取消请求
                if (this.cancel) {
                    this.cancel();
                }
            },
            resetQueryPro() {
                this.cancelFn();
                this.paramsData.pageNum = 1;
                this.productList = [];
                this.vendorList = [];
                this.$nextTick(() => {
                    this.$refs.infiniteLoading.$emit('$InfiniteLoading:reset');
                });
            },
            consClick(item, index) {
                // 综合筛选
                let id = item.id;
                this.consIndex = index;
                if (id === 1) {
                    // 综合
                    this.consText = '综合';
                    this.paramsData.totalSaleSort = '';
                    this.paramsData.priceSort = '';
                } else if (id === 2) {
                    // 销量从高到低
                    this.consText = '销量高';
                    this.paramsData.totalSaleSort = 'desc';
                    this.paramsData.priceSort = '';
                } else if (id === 3) {
                    // 价格从高到低
                    this.consText = '价格高';
                    this.paramsData.totalSaleSort = '';
                    this.paramsData.priceSort = 'desc';
                } else if (id === 4) {
                    // 价格从低到高
                    this.consText = '价格低';
                    this.paramsData.totalSaleSort = '';
                    this.paramsData.priceSort = 'asc';
                }
                this.showDrop = false;
                this.resetQueryPro();
            },
            filterFn() {
                // 点击筛选
                if (!this.productList.length) {
                    this.$toast({
                        message: '无筛选项',
                        position: 'bottom',
                        duration: 1000
                    });
                    return;
                }
                this.categoryFilter = true;
            },
            brandIdFn(id) {
                if (this.brandIds.indexOf(id) >= 0) {
                    this.brandIds.splice(this.brandIds.indexOf(id), 1);
                } else {
                    this.brandIds.push(id);
                }
            },
            propertysFn(key, value) {
                if (this.propertys.indexOf(`${key}-${value}`) >= 0) {
                    this.propertys.splice(this.propertys.indexOf(`${key}-${value}`), 1);
                } else {
                    this.propertys.push(`${key}-${value}`);
                }
            },
            filterReset() {
                this.brandIds = [];
                this.propertys = [];
            },
            filterSure() {
                this.paramsData.brandId = this.brandIds;
                this.paramsData.propertys = this.propertys;
                this.resetQueryPro();
                this.categoryFilter = false;
            },
            showBrandAll() {
                // 筛选展示所有品牌
                this.filterBrandAllFlag = !this.filterBrandAllFlag;
                if (this.filterBrandAllFlag) {
                    this.filterBrandNum = this.cateProductBrand.length;
                } else {
                    this.filterBrandNum = 3;
                }
            }
        },
        watch: {
            'paramsData.productType'(val) {
                if (this.showDrop) {
                    this.showDrop = false;
                }
                this.resetQueryPro();
            }
        },
        components: {
            InfiniteLoading,
            proItem,
            VendorCon,
            [Popup.name]: Popup,
            FixedCart
        }
    };
</script>
<style rel="stylesheet/scss" lang="scss">
    @import '../../static/styles/rules.scss';
    .m-searchresult-top {
        display: flex;
        margin: 0/$ppr;
        height: 70/$ppr;
        /*&.m-searchresult-nofilter {*/
            /*margin-right: 20/$ppr;*/
        /*}*/
         .m-search-newcon {
            flex: 1;
            display: flex;
            background: #faf9f9;
            border-radius: 5/$ppr;
            border: 1/$ppr solid $border-color-e4e;
         }
        .m-index-searchcons {
            padding: 0 0/$ppr 0 20/$ppr;
            height: 68/$ppr;
            flex: 1;
            display: flex;
            .con {
                position: relative;
                flex: 1;
                padding-top: 8/$ppr;
                input {
                    width: 100%;
                    height: 54/$ppr;
                    background: #faf9f9;
                    border-radius: 34/$ppr;
                    border: none;
                    padding: 15/$ppr 30/$ppr 15/$ppr 68/$ppr;
                    font-size: 28/$ppr;
                    line-height: 38/$ppr;
                    color: $text-999;
                }
                span {
                    width: 68/$ppr;
                    height: 68/$ppr;
                    position: absolute;
                    left: 0;
                    top: 0;
                    font-size: 30/$ppr;
                    text-align: center;
                    line-height: 68/$ppr;
                    color: $text-999;
                }
            }
        }
    }
    .m-searchresult-listcon {
        min-height: 600/$ppr;
    }
    .m-searchven-con {
        overflow: hidden;
        padding: 10/$ppr 20/$ppr;
        .m-vendor-con {
            .msg {
                padding-bottom: 20/$ppr;
                border-bottom: 1/$ppr solid $border-color-e8e;
            }
            &:last-child {
                .msg {
                    padding-bottom: 0;
                    border-bottom: none;
                }
            }
        }
    }
    .popup-search-result {
        .content {
            left: 120/$ppr;
        }
    }
        .m-category-tab>div p{width:30%; }
    .m-dropdown{position:absolute;left:3.2rem;top:0.2rem}
</style>
