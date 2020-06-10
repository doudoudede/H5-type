<template>
    <div class="vendor-content">
        <!-- <div class="vendor-tite">
            <img src="../../static/images/vendorFont.png" alt=""><span class="big_fot">&nbsp;好商推荐</span>&nbsp;&nbsp;平台精选商家 你值得拥有！
        </div> -->
        <div class="vendor-main-box" v-if="vendorData.length">
            <swiper :options="swiperOption" ref="swiperControl">
                <swiper-slide class="swiper-item" v-for="(item, index) in vendorData" :key="index">
                    <router-link tag="div" :to="{name: 'Store', query: {userCode: item.userCode}}" style="width: 100%">
                        <div class="vendor-item-box" :style="{background: 'url(' + picServer + item.shopLogo + ')' + 'center no-repeat', backgroundSize: 'cover'}">
                            <div class="vendor-order-numCon">
                                <span>{{item.proCount}}件商品</span>
                                <span>月销{{item.orderCount}}单</span>
                            </div>
                            <div class="vendor-proItem-box" v-if="item.proSpuInfo.length">
                                <router-link tag="div" class="pro-flr"  v-for="(items, indexs) in item.proSpuInfo" v-if="indexs <= 2" :key="items.proSpu" :to="{name: 'ProductDetails', params: {prospu: items.proSpu}}">
                                    <div class="pro-imgCon">
                                        <img :src="picServerPro + items.proMainImg">
                                        <!-- <span class="hot-sub">HOT</span> -->
                                    </div>
                                    <div class="pro-titCon">{{items.proName}}</div>
                                    <div class="pro-priCon">¥&nbsp;<span>{{items.areaPrice | moneySkinToText('rmbs')}}</span></div>
                                </router-link>
                            </div>
                        </div>
                    </router-link>
                    <div class="swiper-lazy-preloader" v-if="!picServer"></div>
                </swiper-slide>
                <div class="swiper-pagination" slot="pagination"></div>
            </swiper>
        </div>
    </div>
</template>
<script type="text/ecmascript-6">
    import VendorCon from 'components/vendor/VendorCon';
    import VendorPro from 'components/vendor/VendorPro';
    // import {swiper, swiperSlide} from 'vue-awesome-swiper';
    export default {
        name: 'IndexVendor',
        data() {
            return {
                firstIn: true,
                picServer: '',
                picServerPro: '',
                vendorData: [],
                areaId: '4',
                swiperOption: {
                    notNextTick: true,
                    loop: true,
                    autoplay: false,
                    pagination: {
                        el: '.swiper-pagination',
                        dynamicBullets: true,
                        clickable: true
                    }
                }
            };
        },
        created() {
            this.init();
        },
        activated() {
            // 判断是不是第一次进入组件
            if (!this.firstIn) {
                this.init();
            }
        },
        mounted() {
            window.addEventListener('orientationchange', this.orient, false);
        },
        deactivated() {
            this.firstIn = false;
        },
        methods: {
            init() {
                let nowRegionMap = JSON.parse(this.$getLocalStorage('REGIONMAP'));
                this.areaId = nowRegionMap.areaId;
                // 获取首页优质商户
                this.getVender();
            },
            orient() {
                if (this.$refs.swiperControl.swiper) {
                    setTimeout(() => {
                        this.$refs.swiperControl.swiper.update(true);
                    }, 500);
                }
            },
            getVender() {
                this.$http({
                    method: 'post',
                    url: '/xe-route/xe-app/mobileApp/homepage/getVender',
                    data: {
                        cityId: this.areaId,
                        menuType: 5
                    }
                }).then(res => {
                    this.picServer = res.data.picServer;
                    this.picServerPro = res.data.picServerPro;
                    this.vendorData = res.data.appVenInfoFormList;
                    console.log('this.vendorData', this.vendorData);
                }).catch(error => {
                    console.log(error);
                });
            }
        },
        beforeDestroy () {
            window.removeEventListener('orientationchange', this.orient, false);
        },
        components: {
            VendorCon,
            VendorPro,
            swiper,
            swiperSlide
        }
    };
</script>
<style rel="stylesheet/scss" lang="scss">
    @import '../../static/styles/rules.scss';
    .vendor-content {
        max-width: 750/$ppr;
        margin: 25/$ppr auto 0 auto;
        .vendor-main-box {
            .vendor-item-box {
                width: 100%;
                background: #f7f7f7;
                height: 550/$ppr;
                padding: 158/$ppr 34/$ppr 0;
            }
            .vendor-order-numCon {
                max-width: 246/$ppr;
                font-size: 20/$ppr;
                color: #666;
                line-height: 32/$ppr;
                background: #fff;
                border-radius: 20/$ppr;
                span {
                    padding: 0 16/$ppr;
                    &:first-child {
                        position: relative;
                        &::after {
                            position: absolute;
                            top: 50%;
                            right: 0;
                            content: '';
                            border-right: 1px solid #666;
                            height: 14/$ppr;
                            margin-top: -7/$ppr;
                        }
                    }
                }
            }
            .vendor-proItem-box {
                margin-top: 50/$ppr;
                background: #fff;
                padding: 20/$ppr 30/$ppr 15/$ppr;
                // @include flexbox();
                // justify-content: space-around;
                display: flex;
                .pro-flr {
                    width: 180/$ppr;
                    text-align: left;
                    &:not(:last-child) {
                        margin-right: 40/$ppr;
                    }
                }
                .pro-imgCon {
                    position: relative;
                    width: 180/$ppr;
                    height: 180/$ppr;
                    img {
                        display: block;
                        width: 100%;
                        height: 100%;
                    }
                    .hot-sub {
                        position: absolute;
                        left: 0;
                        top: 0;
                        display: block;
                        padding: 9/$ppr  12/$ppr 8/$ppr 9/$ppr;
                        background: #fd4229;
                        color: #fff;
                        font-size: 14/$ppr;
                        border-top-right-radius: 20/$ppr; 
                        border-bottom-right-radius: 20/$ppr; 
                    }
                }
                .pro-titCon {
                    width: 100%;
                    font-size: 24/$ppr;
                    color: #3d3d3d;
                    line-height: 42/$ppr;
                    @include ellipsis();
                }
                .pro-priCon {
                    font-size: 18/$ppr;
                    line-height: 1;
                    color: #fd4229;
                    span {
                        font-size: 30/$ppr;
                    }
                }
            }
        }
        .swiper-pagination-bullets {
            bottom: 6/$ppr;
        }
    }
</style>
