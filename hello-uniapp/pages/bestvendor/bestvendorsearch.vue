<template>
    <xe-layout class='m-bg-dark m-flexlay'>
        <view class="m-search-barcon" slot="header" style="background: #fff;">
            <view class="m-search-back xe-iconfont xe-icon-fanhui-" @click.prevent="goBackFn"></view>
            <view class="m-search-bar m-search-bar2" :class="{'m-search-typing': focusFlag}">
                <view class="m-search-newcon">
                    <form class="s-form" id="s-search" method="get" action="/" onsubmit="return false" @submit.prevent="searchBtnFn">
                        <label for="s-search-input" class="xe-iconfont xe-icon-sousuo"></label>
                        <input v-model.trim="searchText" class="s-search-input" id="s-search-input" @focus="focusFlag = true" @blur="focusFlag = false" type="search" placeholder="输入关键词">
                    </form>
                    <span v-show="searchText.length" @click="searchTextClear" class="xe-iconfont xe-icon-cuowu"></span>
                    <view class="m-search-btn" @click="searchBtnFn">
                        <span>搜索</span>
                    </view>
                </view>
            </view>
        </view>
        <view class="m-bestvendor-con" v-if="vendorList.length">
            <VendorCon
                v-for="(item, index) in vendorList"
                :key="item.userCode"
                :picServer="picServerVendor"
                :showBusinessTypeName="true"
                :itemData="item"
            ></VendorCon>
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
                    <p class="f32">暂无符合条件的店铺</p>
                </view>
                <!--<view class="btn">-->
                <!--<mt-button class="xe-button-default" size="small" plain @click.prevent="toCategory">去购买~</mt-button>-->
                <!--</view>-->
            </view>
        </infinite-loading>
    </xe-layout>
</template>
<script type="text/ecmascript-6">
    import VendorCon from 'components/vendor/VendorCon';
    export default {
        data() {
            return {
                vendorList: [],
                picServerVendor: '',
                pageNum: 1,
                pageSize: 10,
                searchText: '',
                focusFlag: false
            };
        },
        components: {
            VendorCon
        },
        created() {
            this.searchText = this.$route.query.keyword;
        },
        methods: {
            searchBtnFn() {
                if (!this.searchText) {
                    this.$toast({
                        message: '请输入店铺名搜索',
                        duration: 1500
                    });
                } else {
                    this.$router.replace({
                        name: 'BestVendorSearch',
                        query: {
                            keyword: this.searchText
                        }
                    });
                    this.vendorList = [];
                    this.pageNum = 1;
                    this.$refs.infiniteLoading.$emit('$InfiniteLoading:reset');
                }
            },
            searchTextClear() {
                this.searchText = '';
                this.$router.go(-1);
            },
            onInfinite() {
                this.searchVendor();
            },
            searchVendor() {
                this.$http({
                    method: 'post',
                    url: '/xe-route/xe-app/mobileApp/vendor/searchVendor',
                    data: {
                        keyWord: this.searchText,
                        pageNum: this.pageNum,
                        pageSize: this.pageSize
                    }
                }).then(res => {
                    if (res.data.count === 0) {
                        this.$refs.infiniteLoading.$emit('$InfiniteLoading:complete');
                    } else {
                        if (!this.picServerVendor) {
                            this.picServerVendor = res.data.picServer;
                        }
                        if (res.data.venList.length > 0) {
                            this.vendorList.push(...res.data.venList);
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
        }
    };
</script>
<style rel="stylesheet/scss" lang="scss">
    @import "../../static/styles/rules.scss";
    .m-bestvendor-con {
        overflow: hidden;
        max-width: 750/$ppr;
        margin: 0 auto;
        padding-left: 20/$ppr;
    }
</style>
