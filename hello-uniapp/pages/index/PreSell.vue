<template>
    <div class="m-floor-item m-presec" v-if="productList.length >= 4">
        <div class="m-presec-tit">
            <div class="title">
                <span class="xe-iconfont xe-icon-yushouzi"></span>
                <em class="xe-iconfont xe-icon-jingqingqidai"></em>
            </div>
            <div class="more">
                <!--<a href="#">更多>></a>-->
                <router-link tag="a"  :to="{name: 'PreSell', params: {areaId: paramsData.cityId}}">
                    更多>>
                </router-link>
            </div>
        </div>
        <div class="m-presec-content">
            <div class="item"  v-for="item in productList" :key="item.proSpu + Math.random()">
                <a @click.prevent="goDetails(item)">
                    <div class="pic">
                        <img alt="" :src="item.proImg">
                    </div>
                    <div class="name">
                        {{item.proName}}
                    </div>
                    <div class="price-n" v-html="splitPrice(item.skuPrice)">
                    </div>
                    <div class="price-o">
                        <!--<s>&yen;1200.00</s>-->
                        <span v-if="item.sendDate && item.sendDate > 0">{{parseFloat(item.sendDate / 86400).toFixed(0) == 0 ? '现货' : parseFloat(item.sendDate / 86400).toFixed(0) + '日后发货'}}</span>
                        <span v-else>现货</span>
                    </div>
                </a>
            </div>
        </div>
    </div>
</template>

<script>
//    import {swiper, swiperSlide} from 'vue-awesome-swiper';
    export default {
        data() {
            return {
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
        methods: {
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
                    url: '/xe-route/xe-app/mobileApp/homepage/preSale',
                    data: this.paramsData
                }).then(res => {
                    this.$indicator.close();
                    if (res.data.product && res.data.product.length > 0) {
                        let productList = res.data.product;
                        let flaNum = 0;
                        productList.forEach(item => {
                            item.skuList.forEach((items, index) => {
                                flaNum++;
                                let list = Object.assign(items, {
                                    proName: item.proName,
                                    proImg: res.data.picServerPro + items.proMainImg
                                });
                                if (flaNum <= 4) {
                                    this.productList.push(list);
                                }
                            });
                        });
                        console.log('this.productList', this.productList);
                    }
                }).catch(error => {
                    console.log(error);
                    this.$indicator.close();
                });
            }
        }
    };
</script>
<style lang="scss" scoped>
    @import '../../static/styles/rules.scss';
    .m-presec-content {
        margin: 0 20/$ppr;
        overflow: hidden;
        .item {
            float:left;
            width: 170/$ppr;
            margin-right: 10/$ppr;
            &:last-child{
                margin: 0;
            }
        }
        .pic {
            width: 170/$ppr;
            height: 170/$ppr;
        }
    }
</style>
