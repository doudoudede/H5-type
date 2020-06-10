<template>
    <xe-layout>
        <FixedCart slot="header"></FixedCart>
        <div class="m-content-div" v-if="oftenProData.length">
            <proItem
                v-for="(item, index) in oftenProData"
                :key="index"
                :picServerPro="picServerPro"
                :itemData="item"
            ></proItem>
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
                    <p class="f32">暂无常购商品~</p>
                </div>
                <div class="btn">
                    <mt-button class="xe-button-default" size="small" plain @click.prevent="toCategory">去购买~</mt-button>
                </div>
            </div>
        </infinite-loading>
    </xe-layout>
</template>
<script type="text/ecmascript-6">
    import proItem from 'components/ProItem/ProItem';
    import FixedCart from 'components/FixedCart/FixedCart';
    export default {
        name: 'xe-page-alwaysbuy',
        data() {
            return {
                picServerPro: '',
                currentPage: 1,
                oftenProData: []
            };
        },
        created() {
            let nowRegionMap = JSON.parse(this.$getLocalStorage('REGIONMAP'));
            this.cityName = nowRegionMap.cityName;
            this.cityId = nowRegionMap.areaId;
            // 取常购商品数据
//            this.getOftenPro();
        },
        methods: {
            onInfinite() {
                this.getOftenPro();
            },
            getOftenPro() {
                this.$http({
                    method: 'post',
                    url: '/xe-route/xe-app/mobileApp/homepage/getOftenPro',
                    data: {
                        cityId: this.cityId,
                        currentPage: this.currentPage,
                        homePage: false
                    }
                }).then(res => {
                    if (!this.picServerPro) {
                        this.picServerPro = res.data.picServerPro;
                    }
                    if (res.data.count === 0) {
                        // 无商品时
                        this.$refs.infiniteLoading.$emit('$InfiniteLoading:complete');
                    } else {
                        if (res.data.proSpuList.length > 0) {
                            this.oftenProData.push(...res.data.proSpuList);
                            this.currentPage++;
                            this.$refs.infiniteLoading.$emit('$InfiniteLoading:loaded');
                        } else {
                            // 所有商品都加载完时
                            this.$refs.infiniteLoading.$emit('$InfiniteLoading:complete');
                        }
                    }
                }).catch(error => {
                    console.log(error);
                });
            },
            toCategory() {
                this.$router.push({name: 'Category'});
            }
        },
        components: {
            proItem,
            FixedCart
        }
    };
</script>
