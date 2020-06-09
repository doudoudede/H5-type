<template>
    <view class="m-floor-item m-presec" v-if="productList.length >= 4">
        <view class="m-presec-tit">
            <view class="title">
                <span class="xe-iconfont xe-icon-miaoshazi"></span>
                <em class="xe-iconfont xe-icon-xianshiqianggou"></em>
            </view>
            <view class="more">
                <!--<a href="#">更多>></a>-->
                <router-link tag="a"  :to="{name: 'SeckillList', params: {areaId: paramsData.cityId}}">
                    更多>>
                </router-link>
            </view>
        </view>
        <swiper :options="swiperOption" class="m-presec-content" ref='secKillControl'>
            <swiper-slide class="item" v-for="item in productList"  :key="item.proSpu + Math.random()">
                <a @click.prevent="goDetails(item)">
                    <view class="pic">
                        <img alt="" :src="item.proImg">
                    </view>
                    <view class="name">
                        {{item.proName}}
                    </view>
                    <view class="price-n" v-html="splitPrice(item.skuPrice)">
                    </view>
                    <view class="price-o">
                        <s>&yen;{{parseFloat(item.costPrice ? item.costPrice : 0).toFixed(2)}}</s>
                    </view>
                </a>
            </swiper-slide>
        </swiper>
    </view>
</template>

<script>
    // import {swiper, swiperSlide} from 'vue-awesome-swiper';
    export default {
        components: {
            swiper,
            swiperSlide
        },
        data() {
            return {
                swiperOption: {
                    slidesPerView: 'auto',
                    loop: true,
                    autoplay: {
                        delay: 2000,
                        stopOnLastSlide: false,
                        disableOnInteraction: false
                    }
                },
                productList: [],
                paramsData: {
                    cityId: '4',
                    currentPage: 1
                }
            };
        },
        created() {
            this.init();
        },
        mounted () {
            window.addEventListener('orientationchange', this.orient, false);
        },
        methods: {
            orient() {
                if (this.$refs.secKillControl.swiper) {
                    setTimeout(() => {
                        this.$refs.secKillControl.swiper.update(true);
                    }, 500);
                }
            },
            init() {
                let nowRegionMap = JSON.parse(this.$getLocalStorage('REGIONMAP'));
                this.paramsData.cityId = nowRegionMap.areaId;
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
                    url: '/xe-route/xe-app/mobileApp/homepage/getDiscount',
                    data: this.paramsData
                }).then(res => {
                    this.$indicator.close();
                    if (res.data.product && res.data.product.length > 0) {
                        let productList = res.data.product;
                        let result = [];
                        productList.forEach(item => {
                            item.skuList.forEach(items => {
                                if (items.discountStatus === 1) {
                                    let list = Object.assign(items, {
                                        proName: item.proName,
                                        proImg: res.data.picServerPro + items.proMainImg
                                    });
                                    result.push(list);
                                }
                            });
                        });
                        this.productList = result;
                    }
                }).catch(error => {
                    console.log(error);
                    this.$indicator.close();
                });
            }
        },
        beforeDestroy () {
            window.removeEventListener('orientationchange', this.orient, false);
        }
    };
</script>
<style lang="scss" scoped="">
    @import '../../static/styles/rules.scss';
    .m-presec-content {
        margin: 0 20/$ppr;
    }
</style>
