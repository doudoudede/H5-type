<template>
    <xe-layout class='m-bg-dark'>
        <div class="m-search-barcon" slot="header" style="background: #fff;">
            <div class="m-search-back xe-iconfont xe-icon-fanhui-" @click.prevent="goBackFn"></div>
            <div class="m-search-bar m-search-bar2" :class="{'m-search-typing': focusFlag}">
                <form class="s-form" id="s-search" method="get" action="/" onsubmit="return false" @submit.prevent="searchBtnFn">
                    <label for="s-search-input" class="xe-iconfont xe-icon-sousuo"></label>
                    <input v-model.trim="searchText" class="s-search-input" id="s-search-input" @focus="focusFlag = true" @blur="focusFlag = false" type="search" placeholder="输入关键词">
                </form>
                <span v-show="searchText.length" @click="searchTextClear" class="xe-iconfont xe-icon-cuowu"></span>
                <div class="m-search-btn" @click="searchBtnFn">
                    <span>搜索</span>
                </div>
            </div>
        </div>
        <div v-if="productList.length">
            <proItem
                v-for="(item, index) in productList"
                :key="item.proSpu"
                :picServerPro="picServerPro"
                :itemData="item"
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
                    <p class="f32">暂无符合条件的商品</p>
                </div>
                <!--<div class="btn">-->
                <!--<mt-button class="xe-button-default" size="small" plain @click.prevent="toCategory">去购买~</mt-button>-->
                <!--</div>-->
            </div>
        </infinite-loading>
    </xe-layout>
</template>
<script type="text/ecmascript-6">
    import proItem from 'components/ProItem/ProItem';
    export default {
        data() {
            return {
                productList: [],
                picServerPro: '',
                paramsData: {
                    keyWord: '', // 关键词
                    pageNum: 1,  // 当前页
                    pageSize: 10, // 每页数量
                    areaId: '', // 地区id
                    userCode: ''
                },
                searchText: '',
                userCode: '',
                focusFlag: false
            };
        },
        components: {
            proItem
        },
        activated() {
            if (this.searchText !== this.$route.query.keyword || this.userCode !== this.$route.query.userCode) {
                this.searchText = this.$route.query.keyword;
                this.userCode = this.$route.query.usercode;
                this.paramsData.areaId = JSON.parse(this.$getLocalStorage('REGIONMAP')).areaId;
                this.productList = [];
                this.paramsData.pageNum = 1;
                this.$refs.infiniteLoading.$emit('$InfiniteLoading:reset');
            }
        },
        methods: {
            searchTextClear() {
                this.searchText = '';
                this.$router.go(-1);
            },
            searchBtnFn() {
                if (!this.searchText) {
                    this.$toast({
                        message: '请输入商品名搜索',
                        duration: 1500
                    });
                } else {
                    this.$router.replace({
                        name: 'StoreSearch',
                        query: {
                            keyword: this.searchText,
                            usercode: this.$route.query.usercode
                        }
                    });
                    this.productList = [];
                    this.paramsData.pageNum = 1;
                    this.$refs.infiniteLoading.$emit('$InfiniteLoading:reset');
                }
            },
            onInfinite() {
                this.searchProduct();
            },
            searchProduct() {
                this.paramsData.keyWord = this.searchText;
                this.paramsData.userCode = this.userCode;
                this.$http({
                    method: 'post',
                    url: '/xe-route/xe-app/mobileApp/venShopDetail/getProByCondition',
                    data: this.paramsData
                }).then(res => {
                    console.log(res);
                    if (res.data.productList.productCount === 0) {
                        this.$refs.infiniteLoading.$emit('$InfiniteLoading:complete');
                    } else {
                        if (!this.picServerPro) {
                            this.picServerPro = res.data.picServer;
                        }
                        if (res.data.productList.product && res.data.productList.product.length > 0) {
                            this.productList.push(...res.data.productList.product);
                            this.paramsData.pageNum++;
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
        }
    };
</script>
<style rel="stylesheet/scss" lang="scss"></style>
