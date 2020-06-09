<template>
    <xe-layout class="m-page-category m-flexlay">
        <view class="m-cate-search" slot="header">
            <view class="m-index-searchcon m-content-view">
                <router-link tag="view" class="adr" :to="{name: 'Location', query: {redirect: $route.fullPath}}">
                    <span class="xe-iconfont xe-icon-dingwei"></span>
                    <p>{{cityName}}</p>
                </router-link>
                <router-link tag="view" class="con" :to="{name: 'Search'}">
                    <input type="text" value="搜索">
                    <span class="xe-iconfont xe-icon-sousuo"></span>
                </router-link>
                <!-- <v-touch tag="view" class="filter" @tap="filterFn">
                    <span class="xe-iconfont xe-icon-filter"></span>
                    <p>筛选</p>
                </v-touch> -->
            </view>
        </view>
        <view v-if="cateList.length" class="m-category-con m-content-view">
            <view class="m-category-nav" ref="categoryNav">
                <ul v-if="filterCateList.length">
                    <li
                        v-for="(item, index) in filterCateListed"
                        :key="index + Math.random()"
                        :class="{'active': item.cateId === secondTemp.cateId}"
                        @click="secondItemClick(item)"
                    >
                        <p>{{item.cateName}}</p>
                        <collapse-transition>
                            <ol
                                v-show="item.cateId === secondTemp.cateId"
                                v-if="item.threeList && item.threeList.length"
                            >
                                <li
                                    :class="{'active': subitem.cateId === thirdTemp.cateId}"
                                    v-for="subitem in item.threeList"
                                    :key="subitem.cateId + Math.random()"
                                    @click="thirdItemClick(subitem)"
                                >{{subitem.cateName}}</li>
                            </ol>
                        </collapse-transition>
                    </li>
                </ul>
                <mt-spinner v-else class="sp-bounce"></mt-spinner>
            </view>
            <view class="m-category-right">
                <view class="m-category-tab">
                    <view>
                        <p @click="showDrop = !showDrop">{{consText}}<em class="xe-iconfont xe-icon-unfold"></em></p>
                        <transition name="slide-in">
                            <view class="m-dropdown" v-show="showDrop">
                                <view
                                    v-for="(item, index) in consData"
                                    :key="index + Math.random()"
                                    :class="{'active': consIndex === index}"
                                    @click.prevent="consClick(item, index)"
                                >{{item.name}}</view>
                            </view>
                        </transition>
                    </view>
                    <view :class="{'active': paramsData.productType === 2}" @click.prevent="paramsData.productType = 2"><p>一口价</p></view>
                    <view :class="{'active': paramsData.productType === 1}" @click.prevent="paramsData.productType = 1"><p>询报价</p></view>
                </view>
                <view class="m-category-listcon" ref="mCatelistcon" @click.prevent="parentclick">
                    <view v-if="cateProductList.length">
                        <proItem
                            v-for="(item, index) in cateProductList"
                            :key="index"
                            :picServerPro="picServer"
                            :itemData="item"
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
                                <p class="f32">暂无商品</p>
                            </view>
                            <!--<view class="btn">-->
                            <!--<mt-button class="xe-button-default" size="small" plain @click.prevent="toCategory">去购买~</mt-button>-->
                            <!--</view>-->
                        </view>
                    </infinite-loading>
                </view>
            </view>
        </view>
        <view class="m-cart-none" v-else>
            <view class="pic2">
                <img src="../../static/images/cart-n2.png" alt="">
            </view>
            <view class="des">
                <p class="f32">该城市暂无在售商品</p>
                <p class="f28">去其他城市看看吧~</p>
            </view>
            <view class="btn">
                <mt-button class="xe-button-default" size="small" plain @click.prevent="toLocation">切换城市</mt-button>
            </view>
        </view>
        <xe-popup
            class="popup-category-category"
            slot="outer"
            ref="adrInstance"
            :show.sync="categoryFilter"
            popupTit="筛选"
            position="right">
            <view class="popup-cate-cons">
                <view class="p-cate-cons">
                    <view class="p-cate-brands" v-if="cateProductBrand.length">
                        <view class="p-cate-item">
                            <view class="p-cate-title">
                                <h3>品牌</h3>
                                <span @click.prevent="showBrandAll" :class="{'active': filterBrandAllFlag}">
                                    {{filterBrandAllFlag ? '收起' : '全部'}} <em class="xe-iconfont xe-icon-unfold"></em>
                                </span>
                            </view>
                            <view class="p-cate-list">
                                <a href="#"
                                   v-for="item in cateProductBrand.slice(0, filterBrandNum)"
                                   :key="item.brandId + Math.random()"
                                   :class="{'active': brandIds.indexOf(parseInt(item.brandId)) >= 0}"
                                   @click.prevent="brandIdFn(parseInt(item.brandId))"
                                >{{item.brandName}}</a>
                            </view>
                        </view>
                    </view>
                    <view class="p-cate-propertys" v-if="cateProductPropertys">
                        <view class="p-cate-item" v-for="(item, key) in cateProductPropertys">
                            <view class="p-cate-title">
                                <h3>{{key}}</h3>
                                <!--<span>全部 <em class="xe-iconfont xe-icon-unfold"></em></span>-->
                            </view>
                            <view class="p-cate-list">
                                <a href="#"
                                   v-for="(subitem, index) in item"
                                   :class="{'active': propertys.indexOf(key+'-'+subitem) >= 0}"
                                   :key="subitem + Math.random()"
                                   @click.prevent="propertysFn(key, subitem)"
                                >
                                    {{subitem}}
                                </a>
                            </view>
                        </view>
                    </view>
                </view>
                <view class="p-cate-btns">
                    <view @click.prevent="filterReset">重置</view>
                    <view @click.prevent="filterSure">确定</view>
                </view>
            </view>
        </xe-popup>
    </xe-layout>
</template>
<script type="text/ecmascript-6">
    import CollapseTransition from 'utils/collapse-transition';
    import InfiniteLoading from 'vue-infinite-loading';
    import proItem from 'components/ProItem/ProItem';
    import {Popup} from 'components/Popup';
    import axios from 'axios';
    import { yushowCompro } from 'utils/index';
    export default {
        name: 'xe-page-catetory',
        data() {
            return {
                firstIn: true,
                categoryFilter: false,
                showDrop: false, // 综合筛选
                consText: '综合',
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
                cityName: '',
                areaId: '',
                cateList: [], // 分类数据
                filterCateListed: [],
                secondTemp: {},
                thirdTemp: {},
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
                picServer: '',
                brandIds: [],
                propertys: [],
                cateProductList: [],
                cateProductBrand: [],
                cateProductPropertys: null,
                filterBrandNum: 3, // 筛选默认展示的品牌数
                filterBrandAllFlag: false, // 筛选品牌标识
                reload: true, // 分类页是否重新加载，当分类页跳转至详情页，再返回分类时，不重新请求数据
                querUserTypeFlag: false
            };
        },
        activated() {
            console.log('activated');
            let nowRegionMap = JSON.parse(this.$getLocalStorage('REGIONMAP'));
            let distop = this.$getLocalStorage('catePageScrollTop');
            this.cityName = nowRegionMap.cityName;
            this.areaId = nowRegionMap.areaId;
            this.paramsData.areaOrgCode = this.areaId;
            // 分类回显
            if (this.reload) {
                let orgcode = this.$route.query.orgcode;
                if (orgcode && orgcode.split('_').length === 3) {
                    this.secondTemp = {cateId: parseInt(orgcode.split('_')[1])};
                    this.thirdTemp = {cateId: parseInt(orgcode.split('_')[2])};
                    this.paramsData.cateId = [this.thirdTemp.cateId];
                    this.resetQueryPro();
                } else {
                    this.secondTemp = {};
                    this.thirdTemp = {};
                    this.paramsData.cateId = [];
                    this.resetQueryPro();
                }
            }
            this.queryProCateByCityId();
            if (this.$refs.mCatelistcon) {
                this.$refs.mCatelistcon.scrollTop = distop ? parseInt(distop) : 0;
            }
            this.$removeLocalStorage('catePageScrollTop');
        },
        deactivated() {
            console.log('deactivated');
        },
        beforeRouteLeave(to, from, next) {
            console.log('beforeRouteLeave');
            to.name === 'ProductDetails' ? this.reload = false : this.reload = true;
            next();
        },
        methods: {
            toLocation() {
                this.$router.push({
                    name: 'Location'
                });
            },
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
            parentclick() {
                this.$setLocalStorage('catePageScrollTop', this.$refs.mCatelistcon.scrollTop);
            },
            secondItemClick(item) {
                this.secondTemp = {cateId: item.cateId};
                if (this.showDrop) {
                    this.showDrop = false;
                }
            },
            thirdItemClick(item) {
                if (this.showDrop) {
                    this.showDrop = false;
                }
                this.thirdTemp = {cateId: item.cateId};
                this.paramsData.cateId = [item.cateId];
                this.resetQueryPro();
            },
            onInfinite() {
                if (this.querUserTypeFlag) {
                    this.searchCateProduct();
                } else {
                    this.querUserType(() => {
                        this.searchCateProduct();
                    });
                }
            },
            searchCateProduct() {
                let _this = this;
                let CancelToken = axios.CancelToken;
                this.$http({
                    cancelToken: new CancelToken(function executor(c) {
                        // An executor function receives a cancel function as a parameter
                        _this.cancel = c;
                    }),
                    method: 'post',
                    url: '/xe-route/xe-app/mobileApp/product/searchCateProduct',
                    data: this.paramsData
                }).then(res => {
                    console.log(res);
                    if (!this.picServer) {
                        this.picServer = res.data.picServer;
                    }
                    if (res.data.count === 0) {
                        this.$refs.infiniteLoading.$emit('$InfiniteLoading:complete');
                    } else {
                        if (res.data.product.length > 0) {
                            this.cateProductList.push(...res.data.product);
                            this.paramsData.pageNum++;
                            // 预售的商品选择需要显示的对应价格
                            this.cateProductList = yushowCompro(this.cateProductList);
                            this.$refs.infiniteLoading.$emit('$InfiniteLoading:loaded');
                        } else {
                            // 所有商品都加载完时
                            this.$refs.infiniteLoading.$emit('$InfiniteLoading:complete');
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
                        this.$refs.infiniteLoading.$emit('$InfiniteLoading:reset');
                        return;
                    }
                    this.$refs.infiniteLoading.$emit('$InfiniteLoading:complete');
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
                this.cateProductList = [];
                if (this.$refs.infiniteLoading) {
                    this.$nextTick(() => {
                        this.$refs.infiniteLoading.$emit('$InfiniteLoading:reset');
                    });
                }
            },
            queryProCateByCityId() {
                this.$http({
                    method: 'post',
                    url: '/xe-route/xe-app/mobileApp/product/queryProCateByCityId',
                    data: {
                        areaId: this.areaId
                    }
                }).then(res => {
                    console.log(res);
                    this.cateList = res.data.cateList;
                    this.filterCateList = this.cateList;
                }).catch(error => {
                    console.log(error);
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
                if (!this.cateProductList.length) {
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
        computed: {
            filterCateList: {
                get() {
                    return this.cateList;
                },
                set(val) {
                    if (!val.length) return;
                    let result = [];
                    val.forEach(item => {
                        result.push(...item.secondList);
                    });
                    this.filterCateListed = result;
                    this.filterCateListed.some((item, index) => {
                        if (item.cateId === this.secondTemp.cateId) {
                            this.$nextTick(() => {
                                let proDom = this.$refs.categoryNav;
                                let singleItem = proDom.querySelector('li');
//                                console.log(singleItem);
//                                console.log(singleItem.offsetHeight);
//                                console.log(proDom.offsetHeight);
//                                console.log(index * singleItem.offsetHeight);
//                                console.log(index * singleItem.offsetHeight - proDom.offsetHeight / 3);
                                proDom.scrollTop = index * singleItem.offsetHeight - proDom.offsetHeight / 3;
                            });
                            return true;
                        }
                    });
                }
            }
        },
        watch: {
            'paramsData.productType'(val) {
                console.log(val);
                if (this.showDrop) {
                    this.showDrop = false;
                }
                this.resetQueryPro();
            }
        },
        components: {
            InfiniteLoading,
            CollapseTransition,
            proItem,
            [Popup.name]: Popup
        }
    };
</script>
<style rel="stylesheet/scss" lang="scss">
    @import '../../static/styles/rules.scss';
    .m-page-category {
        height: 100%;
        .popup-category-category {
            .content {
                left: 120/$ppr;
            }
        }
    }
    .m-cate-search {
        .m-index-searchcon {
            height: 108/$ppr;
            padding: 20/$ppr 108/$ppr 20/$ppr 112/$ppr;
            .adr {
                top: 18/$ppr;
                color: #414141;
            }
            .con {
                input {
                    background: #faf9f9;
                    border:1/$ppr solid $border-color-e4e;
                }
            }
            .filter {
                top: 18/$ppr;
                color: #414141;
            }
        }
    }
    .m-category-con {
        position: absolute;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
    }
    .m-category-nav {
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        width: 180/$ppr;
        background: #f3f5f7;
        overflow-y: scroll;
        -webkit-overflow-scrolling: touch;
        .mint-spinner-snake {
            width: 40/$ppr !important;
            height: 40/$ppr !important;
            position: absolute;
            left: 50%;
            top: 50%;
            margin: -20/$ppr 0 0 -20/$ppr;
        }
        ul {
            li {
                p {
                    font-size: 26/$ppr;
                    width: 100%;
                    height: 99/$ppr;
                    line-height: 40/$ppr;
                    padding: 30/$ppr 20/$ppr;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    font-weight: bold;
                    border-top:1/$ppr solid $border-color-e8e;
                }
                ol {
                    background: #fff;
                    border-top:1/$ppr solid $border-color-e8e;
                    li {
                        padding: 15/$ppr 20/$ppr;
                        font-size: 26/$ppr;
                        line-height: 1.4;
                        position: relative;
                        &.active {
                             color: #26a2ff;
                        }
                        &.active:after{
                            content: '';
                            position: absolute;
                            top: 50%;
                            margin-top: -.13rem;
                            height: .26rem;
                            border-left: .06rem solid #1A8EEF;
                            left:0;
                        }
                    }
                }
                
                // &.active {
                //     p {
                //         background: #fff;
                //     }
                //     ol {
                //         display: block;
                //     }
                // }
            }
        }
    }
    .m-category-right {
        position: absolute;
        right: 0;
        left: 180/$ppr;
        top:0;
        bottom: 0;
        display: flex;
        flex-direction: column;
        .m-category-tab {
            width: 570/$ppr;
            .active{
                color: #1A8EEF;
            }
        }
        .m-category-listcon {
            flex: 1;
            padding-right: 20/$ppr;
            overflow: auto;
            -webkit-overflow-scrolling: touch;
        }
    }
    .m-category-tab > view.active p{
    color: #1A8EEF;
}
</style>
