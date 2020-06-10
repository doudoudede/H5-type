<template>
    <div class="m-floor-item" v-if="oftenProData.length">
        <div class="vendor-tite mar-hei">
            <img src="../../static/images/regularPur.png" alt=""><span class="big_fot">&nbsp;常购商品</span>&nbsp;&nbsp;为您量身挑选的专业货源！
        </div>
        <div class="m-often-item">
            <router-link tag="div" class="pro-item-box" v-for="(item, index) in oftenProData"  :key="item.proSpu + index" :to="{name: 'ProductDetails', params: {prospu: item.proSpu}}">
                <div class="pro-imgCon">
                    <img v-if="item.skuList.length" v-lazy="picServerPro + item.skuList[0].proMainImg" alt="">
                </div>
                <div class="pro-txtCon">
                    <div class="pro-nameCon">
                        <span class="miaosha cor_red" v-if="item.discountStatus">秒杀</span>
                        <span class="miaosha cor_red" v-if="item.preSaleStatus">预售</span>
                        {{item.proName}}</div>
                    <div class="pro-shopCon"><span> {{item.shopName}}</span></div>
                    <div class="pro-numsCon">
                        <p>
                            <span class="cor_red fot_big">
                            ¥<i>{{item.areaPrice | moneySkinToText('rmbs')}}</i>/{{item.proUnit}}</span>
                        </p>
                        <p>
                            {{item.skuList[0].minQuantity}}{{item.proUnit}}起订
                        </p>
                    </div>
                </div>
            </router-link>
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
                    <p class="f32">暂无更多数据~</p>
                </div>
            </div>
        </infinite-loading>
    </div>
</template>
<script type="text/ecmascript-6">
    import proItem from 'components/ProItem/ProItem';
    import { yushowCompro } from 'utils/index';
    export default {
        name: 'IndexOftenBuy',
        data() {
            return {
                firstIn: true,
                infiniteLoading: false,
                infiniteLoadingEnd: false,
                current: 1,
                areaId: '4',
                picServerPro: '',
                oftenProData: [] // 首页常购商品
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
        deactivated() {
            this.firstIn = false;
        },
        methods: {
            onInfinite($state) {
                this.getOftenPro($state);
            },
            init() {
                let nowRegionMap = JSON.parse(this.$getLocalStorage('REGIONMAP'));
                if (this.areaId !== nowRegionMap.areaId) {
                    // cityId 变化时
                    this.areaId = nowRegionMap.areaId;
                    this.oftenProData = [];
                    this.current = 1;
                    this.getOftenPro();
                }
            },
            getOftenPro($state) {
                this.infiniteLoading = true;
                this.$http({
                    method: 'post',
                    url: '/xe-route/xe-app/mobileApp/homepage/getOftenPro',
                    data: {
                        cityId: this.areaId,
                        currentPage: this.current,
                        homePage: true
                    }
                }).then(res => {
                    console.log(res);
                    if (!this.picServerPro) {
                        this.picServerPro = res.data.picServerPro;
                    };
                    if (res.data.count > 0) {
                        if (res.data.proSpuList.length > 0) {
                            this.oftenProData.push(...res.data.proSpuList);
                            console.log('this.oftenProData----', this.oftenProData);
                            this.current++;
                            // 预售的商品选择需要显示的对应价格
                            this.oftenProData = yushowCompro(this.oftenProData);
                            this.$nextTick(() => {
                                // $state.loaded();
                                this.$refs.infiniteLoading.$emit('$InfiniteLoading:loaded');
                            });
                        } else {
                            // 所有商品都加载完时
                            this.$refs.infiniteLoading.$emit('$InfiniteLoading:complete');
                            // $state.complete();
                        }
                    }
                }).catch(error => {
                    console.log(error);
                });
            }
        },
        components: {
            proItem
        }
    };
</script>
<style rel="stylesheet/scss" lang="scss">
    @import '../../static/styles/rules.scss';
    .vendor-tite{  background:#ffffff;}
    .m-floor-item {
        max-width: 750/$ppr;
        margin: 0 auto;
        .often-tit {
            height: 46/$ppr;
            .xe-iconfont {
                border-radius: 50%;
                color: #fff;
            }
            color: $main-color;
        }
        .m-often-item {
            margin-top: 10/$ppr;
            background: #ffffff;
            overflow: hidden;
            padding: 0 34/$ppr;
            @include flexbox();
            flex-wrap: wrap;
            .pro-item-box {
                width: 330/$ppr;
                margin-bottom: 20/$ppr;
            }
            .pro-imgCon {
                width: 100%;
                height: 330/$ppr;
                img {
                    display: block;
                    width: 100%;
                    height: 100%;
                }
            }
            .pro-txtCon {
                background: #fff;
                padding: 0 20/$ppr 26/$ppr;
            }
            .pro-nameCon {
                height: 48/$ppr;
                line-height: 48/$ppr;
                font-size: 24/$ppr;
                color: #3d3d3d;
                @include clamp(1);
                .miaosha {
                    display: inline-block;
                    padding: 2/$ppr 5/$ppr 3/$ppr;
                    line-height: 24/$ppr;
                    background: #fd4229;
                    vertical-align: text-bottom;
                    color: #fff;
                    font-size: 20/$ppr;
                    border-radius: 3/$ppr;
                    margin-right: 4/$ppr;
                }
            }
            .pro-shopCon {
                height: 24/$ppr;
                position: relative;
                font-size: 18/$ppr;
                color: #fff;
                span {
                    display: block;
                    position: absolute;
                    left: 0;
                    top: 0;
                    bottom: 0;
                    max-width: 290/$ppr;
                    padding: 0 8/$ppr;
                    line-height: 24/$ppr;
                    background: #ecbdab;
                    @include ellipsis();
                }
            }
            .pro-numsCon {
                @include flexbox();
                height: 46/$ppr;
                line-height: 46/$ppr;
                font-size: 20/$ppr;
                color: #999;
                text-align: right;
                .cor_red {
                    color: #fd4229;
                }
                p {
                    @include flex(1);
                    @include clamp(1);
                    &:first-child {
                        text-align: left;
                    }
                    &:nth-child(2) {
                        text-align: right;
                    }
                }
                span {
                    font-size: 18/$ppr;
                    display: inline-block;
                    i {
                        font-size: 30/$ppr;
                    }

                    &.fot_big {
                        position: relative;
                        top: 4/$ppr;
                    }
                }
            }
        }
        .m-cart-none {
            padding-top: 0;
        }
        .mar-hei {
            padding: 22/$ppr 34/$ppr 20/$ppr;
        }
    }
</style>
