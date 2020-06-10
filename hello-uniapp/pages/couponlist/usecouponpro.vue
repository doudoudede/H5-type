<template>
    <!-- <transition name="slideInRight">
    </transition> -->
    <div class="use-coupon-pro">
        <div>
            <proItem
                v-for="item in productDatas"
                :key="item.proSpu"
                :itemData="item"
                :picServerPro="picServer"
            ></proItem>
        </div>
        <infinite-loading :on-infinite="onInfinite" ref="infiniteLoading" class="infinite-contanier">
            <span slot="no-more" class="infinite-no-more">
                暂无更多数据~
            </span>
            <div slot="no-results" class="m-cart-none">
                <div class="pic">
                    <img src="../../static/images/cart-n1.png" alt="">
                </div>
                <div class="des">
                    <p class="f32">暂无商品</p>
                </div>
                <!--<div class="btn">-->
                <!--<mt-button class="xe-button-default" size="small" plain @click.prevent="toCategory">去购买~</mt-button>-->
                <!--</div>-->
            </div>
        </infinite-loading>
        <router-link :to="{name: 'Cart'}" tag="div" class="m-cart-fixed">
            <p class="xe-iconfont xe-icon-cart"></p>
            <!--<em>50</em>-->
        </router-link>
    </div>
</template>
<script type="text/ecmascript-6">
    import proItem from 'components/ProItem/ProItem';
    import InfiniteLoading from 'vue-infinite-loading';
    export default {
        name: 'xe-page-usercouponpro',
        data() {
            return {
                pageNum: 1,
                pageSize: 10,
                picServer: '',
                productDatas: []
            };
        },
        methods: {
            onInfinite() {
                this.couponImmediateUse();
            },
            couponImmediateUse() {
                this.$http({
                    method: 'post',
                    url: '/xe-route/xe-app/mobile/coupon/couponImmediateUse',
                    data: {
                        pageNum: this.pageNum,
                        pageSize: this.pageSize,
                        currentCity: JSON.parse(this.$getLocalStorage('REGIONMAP')).areaId,
                        couTempId: this.$route.query.couTempId, // 模板id
                        useRange: this.$route.query.useRange, // 使用范围 1 全部商品 2 指定品类 3 指定商品
                        useArea: this.$route.query.useArea, // 区域
                        userCode: this.$route.query.userCode, // 供应商code
                        useCate: this.$route.query.useCate || '' // 分类
                    }
                }).then(res => {
                    console.log(res);
                    if (!this.picServer) {
                        this.picServer = res.data.picServer;
                    }
                    if (res.data.product === null || res.data.product.productCount === 0) {
                        // 无商品时
                        this.$refs.infiniteLoading.$emit('$InfiniteLoading:complete');
                    } else {
                        if (res.data.product.product.length > 0) {
                            this.productDatas.push(...res.data.product.product);
                            this.pageNum++;
                            this.$refs.infiniteLoading.$emit('$InfiniteLoading:loaded');
                        } else {
                            // 所有商品都加载完时
                            this.$refs.infiniteLoading.$emit('$InfiniteLoading:complete');
                        }
                    }
                }).catch(error => {
                    console.log(error);
                });
            }
        },
        components: {
            InfiniteLoading,
            proItem
        }
    };
</script>
<style rel="stylesheet/scss" lang="scss">
    @import "../../static/styles/rules.scss";
    .use-coupon-pro {
        position: fixed;
        background: #fff;
        top: 0;
        right: 0;
        bottom:0;
        left: 0;
        z-index: 33;
        overflow: auto;
        -webkit-overflow-scrolling: touch;
    }
</style>
