<template>
    <xe-layout class='m-bg-dark'>
        <div class="m-hot-pic" v-if="sliderData.length">
            <Slider
                ref="slider"
                :sliderData="sliderData"
                :picServer="picServer"
                :autoPlay="true"
                :loop="sliderData.length > 1 ? true : false"
            >
            </Slider>
        </div>
        <bannerItems :menuType="15"></bannerItems>
        <div class="hot-content" v-if="navListData.length">
            <div class="hot-content-nav">
                <xe-navtab-con :itemData="navListData" @swiperItemClick="swiperItemClick"></xe-navtab-con>
            </div>
            <div class="hot-pro-con">
                <div class="hot-pro">
                    <proItem
                        :picServerPro="picServerPro"
                        v-for="item in proListData"
                        :itemData="item"
                        :key="item.proSpu"
                    >
                    </proItem>
                </div>
            </div>
            <infinite-loading :on-infinite="onInfinite" ref="infiniteLoading" class="infinite-contanier">
                <span slot="no-more" class="infinite-no-more">
                    没有更多了~
                </span>
                <div slot="no-results" class="m-cart-none">
                    <div class="pic">
                        <img src="../../static/images/cart-n1.png" alt="">
                    </div>
                    <div class="des">
                        <p class="f28">暂无此分类商品~</p>
                    </div>
                    <!--<div class="btn">-->
                        <!--<mt-button class="xe-button-default" size="small" plain @click.prevent="toCategory">去购买~</mt-button>-->
                    <!--</div>-->
                </div>
            </infinite-loading>
        </div>
    </xe-layout>
</template>
<script type="text/ecmascript-6">
    import axios from 'axios';
    import Slider from 'components/Slider/Slider';
    import bannerItems from 'pages/index/BannerItems';
    import proItem from 'components/ProItem/ProItem';
    import {xeNavTabCon} from 'components/xeNavTab';
    export default {
        name: 'xe-page-hotproduct',
        data() {
            return {
                sliderData: [],
                navListData: [],
                nowCateId: '',
                currentPage: 1,
                picServerPro: '',
                proListData: [],
                cancel: ''
            };
        },
        created() {
            let nowRegionMap = JSON.parse(this.$getLocalStorage('REGIONMAP'));
            this.cityName = nowRegionMap.cityName;
            this.cityId = nowRegionMap.areaId;
            // 取首页焦点图
            this.getIndexBanner();
            // 获取热销商品的分类
            this.getProCate();
        },
        methods: {
            swiperItemClick(data) {
                if (this.cancel) {
                    // 取消未完成的ajax请求
                    this.cancel();
                };
                this.nowCateId = data.id; // 重新赋值ID
                this.currentPage = 1;
                this.proListData = [];
                this.$nextTick(() => {
                    this.$refs.infiniteLoading.$emit('$InfiniteLoading:reset');
                });
            },
            getIndexBanner() {
                this.$http({
                    method: 'post',
                    url: '/xe-route/xe-app/mobileApp/homepage/getIndexBanner',
                    data: {
                        cityId: this.cityId,
                        menuType: 14 // "首页-焦点图"--1  "优质商户-焦点图"--10  "热销商品-焦点图"--14
                    }
                }).then(res => {
                    console.log(res);
                    this.sliderData = res.data.contentFormList;
                    this.picServer = res.data.picServer;
                }).catch(error => {
                    console.log(error);
                });
            },
            getProCate() {
                this.$http({
                    method: 'post',
                    url: '/xe-route/xe-app/mobileApp/homepage/getProCate',
                    data: {
                        cityId: this.cityId
                    }
                }).then(res => {
                    console.log(res);
                    let navListData = res.data.cateMap;
                    let result = [];
                    for (let key in navListData) {
                        let obj = {
                            name: navListData[key],
                            id: key
                        };
                        result.push(obj);
                    };
                    if (result.length) {
                        this.nowCateId = result[0].id;
                        this.navListData = result;
                        // 根据分类ID查商品
                        this.$refs.infiniteLoading.$emit('$InfiniteLoading:reset');
                    }
                }).catch(error => {
                    console.log(error);
                });
            },
            onInfinite() {
                this.getProByCate();
            },
            getProByCate() {
                let _this = this;
                let CancelToken = axios.CancelToken;
                this.$http({
                    cancelToken: new CancelToken(function executor(c) {
                        // An executor function receives a cancel function as a parameter
                        _this.cancel = c;
                    }),
                    method: 'post',
                    url: '/xe-route/xe-app/mobileApp/homepage/getProByCate',
                    data: {
                        cityId: this.cityId,
                        currentPage: this.currentPage,
                        cateId: this.nowCateId
                    }
                }).then(res => {
                    console.log(res);
                    if (!this.picServerPro) {
                        this.picServerPro = res.data.picServerPro;
                    }
                    if (res.data.count === 0) {
                        // 无商品时
                        this.$refs.infiniteLoading.$emit('$InfiniteLoading:complete');
                    } else {
                        if (res.data.proSpuList.length > 0) {
                            this.proListData.push(...res.data.proSpuList);
                            this.currentPage++;
                            this.$refs.infiniteLoading.$emit('$InfiniteLoading:loaded');
                        } else {
                            // 所有商品都加载完时
                            this.$refs.infiniteLoading.$emit('$InfiniteLoading:complete');
                        }
                    }
                }).catch(error => {
                    console.log(error);
                    if (error.status === 'cancel') {
                        this.$refs.infiniteLoading.$emit('$InfiniteLoading:reset');
                        return;
                    }
                    this.$refs.infiniteLoading.$emit('$InfiniteLoading:complete');
                });
            }
        },
        components: {
            Slider,
            bannerItems,
            proItem,
            [xeNavTabCon.name]: xeNavTabCon
        }
    };
</script>
<style scoped rel="stylesheet/scss" lang="scss">
    @import '../../static/styles/rules.scss';
    .m-hot-pic {
        max-width: 750/$ppr;
        height: 280/$ppr;
        margin: 0 auto;
        img {
            width: 100%;
            height: 100%;
        }
    }
    .hot-content {
        max-width: 750/$ppr;
        margin: 12/$ppr auto;
        overflow: hidden;
    }
    .hot-content-nav {
        height: 80/$ppr;
        background: #fff;
    }
    .hot-pro-con {

        background: #fff;
        position: relative;
        .hot-pro-none {
            min-height: 500/$ppr;
        }
        .hot-pro {
            overflow: hidden;
        }
    }
</style>
