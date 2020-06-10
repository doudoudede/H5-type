<template>
    <xe-layout>
        <div class="m-search-barcon" slot="header">
            <div class="m-search-back xe-iconfont xe-icon-fanhui-" @click.prevent="goBackFn"></div>
            <div class="m-search-bar m-search-bar2" :class="{'m-search-typing': focusFlag}">
                <div class="m-search-newcon">
                    <div class="search-bar-down" @click="barDownShow = !barDownShow">
                        <div>{{ searchCate | searchCateToText}}</div>
                        <transition name="slide-in">
                            <div class="bar-down" v-show="barDownShow">
                                <div class="bar-down-con">
                                    <div @click="searchCate = 1">
                                        <span><em class="xe-iconfont xe-icon-shangpin"></em>商品</span>
                                    </div>
                                    <div @click="searchCate = 2">
                                        <span><em class="xe-iconfont xe-icon-dian"></em>店铺</span>
                                    </div>
                                </div>
                            </div>
                        </transition>
                    </div>
                        <form class="s-form" id="s-search" method="get" action="/" onsubmit="return false" @submit.prevent="searchBtnFn">
                            <label for="s-search-input" class="xe-iconfont xe-icon-sousuo"></label>
                            <input v-model.trim="searchText" class="s-search-input" id="s-search-input" @focus="focusFlag = true" @blur="focusFlag = false" type="search" placeholder="输入关键词">
                        </form>
                        <span v-show="searchText.length" @click="searchText = ''" class="xe-iconfont xe-icon-cuowu"></span>
                        <div class="m-search-btn" @click="searchBtnFn">
                            <span>搜索</span>
                        </div>
                    </div>
                </div>
            </div>
        <template v-if="suggestProductList === null">
            <div class="search-item-con search-item-his" v-if="historySearchList.length">
                <div class="search-item-tit clearfix">
                    <h3 class='fl'>历史搜索</h3>
                    <span class="fr xe-iconfont xe-icon-delete" v-if="historySearchList.length" @click="delWordFn"></span>
                </div>
                <div class="search-item">
                    <a href="#" v-for="(item, index) in historySearchList" :key="index" @click.prevent="wordClickFn(item)">{{item}}</a>
                </div>
                <!--<div class="search-item-none">-->
                    <!--暂无最近搜索内容-->
                <!--</div>-->
            </div>
            <div class="search-item-con" v-if="hotWordList && hotWordList.length">
                <div class="search-item-tit clearfix">
                    <h3 class='fl'>热门搜索</h3>
                </div>
                <div class="search-item">
                    <a href="#" @click.prevent="wordClickFn('预售')">预售</a>
                    <a href="#" @click.prevent="wordClickFn('秒杀')">秒杀</a>
                    <a href="#" v-for="(item, index) in hotWordList" :key="index" @click.prevent="wordClickFn(item)" v-if="item !== '预售' && item !== '秒杀'">{{item}}</a>
                </div>
            </div>
        </template>
        <div class="suggest m-content-div" v-else>
            <ul v-show="suggestProductList.length">
                <li v-for="(item, index) in suggestProductList" @click.prevent="wordClickFn(item.keyWord)">
                    <span>{{item.keyWord}}</span>
                    <!--<em v-show="item.count">{{item.count}}</em>-->
                </li>
            </ul>
            <!--<div class="none" v-show="!suggestProductList.length">-->
                <!--<div class="m-cart-none">-->
                    <!--<div class="pic">-->
                        <!--<img src="../../static/images/cart-n1.png" alt="">-->
                    <!--</div>-->
                    <!--<div class="des">-->
                        <!--<p class="f28">抱歉，没有找到条件的{{searchCate === 1 ? '商品' : '店铺'}}</p>-->
                    <!--</div>-->
                    <!--<div class="btn">-->
                        <!--<mt-button class="xe-button-default" size="small" plain @click.prevent="searchText = ''">清空条件</mt-button>-->
                    <!--</div>-->
                <!--</div>-->
            <!--</div>-->
        </div>
    </xe-layout>
</template>
<script type="text/ecmascript-6">
    import debounce from 'throttle-debounce/debounce';
    export default {
        data() {
            return {
                firstIn: true,
                barDownShow: false,
                focusFlag: false,
                searchCate: 1,
                suggestUrl: '/xe-route/xe-app/mobileApp/product/suggestProduct', // 默认搜索商品
                searchText: '',
                provinceId: '',
                areaId: '',
                suggestProductList: null, // 搜索关键词联想
                historySearchList: [], // 查询历史搜索词
                hotWordList: [] // 热门搜索
            };
        },
        beforeRouteEnter(to, from, next) {
            next(vm => {
                if (from.name !== 'SearchResult') {
                    vm.searchText = '';
                    vm.searchCate = 1;
                }
            });
        },
        created() {
            this.provinceId = JSON.parse(this.$getLocalStorage('REGIONMAP')).provinceId;
            this.areaId = JSON.parse(this.$getLocalStorage('REGIONMAP')).areaId;
            // 根据省ID查询热词
            this.queryHotKeyWord();
            // 根据用户id查询历史搜索词
            this.queryHistorySearch();
        },
        activated() {
            if (!this.firstIn) {
                document.querySelector('#s-search-input').focus();
            }
        },
        deactivated() {
            this.firstIn = false;
        },
        mounted() {
            this.$nextTick(() => {
                document.querySelector('#s-search-input').focus();
            });
        },
        methods: {
            searchBtnFn() {
                this.$router.push({
                    name: 'SearchResult',
                    query: {
                        keyword: this.searchText,
                        type: this.searchCate
                    }
                });
            },
            wordClickFn(item) {
                this.searchText = item;
                this.$router.push({
                    name: 'SearchResult',
                    query: {
                        keyword: item,
                        type: this.searchCate
                    }
                });
            },
            suggestProduct: debounce(300, function() {
                this.$http({
                    method: 'post',
                    url: this.suggestUrl,
                    data: {
                        keyWord: this.searchText,
                        areaOrgCode: this.areaId
                    }
                }).then(res => {
                    console.log(res);
                    if (res.remote && res.remote.status === '0001') {
                        // keyword 为空
                        this.suggestProductList = null;
                    } else {
                        this.suggestProductList = res.data.word;
                    }
                }).catch(error => {
                    console.log(error);
                });
            }),
            queryHotKeyWord() {
                this.$http({
                    method: 'post',
                    url: '/xe-route/xe-app/mobileApp/product/queryHotKeyWord',
                    data: {
                        areaId: this.provinceId
                    }
                }).then(res => {
                    console.log(res);
                    this.hotWordList = res.data.hotWordList ? res.data.hotWordList : [];
                    let hotWordList = this.hotWordList;
                    // 热搜最多只展示10条信息
                    if (hotWordList.length >= 10) {
                        if (hotWordList.indexOf('预售') !== -1 && hotWordList.indexOf('秒杀') === -1) {
                            hotWordList = this.hotWordList.slice(0, 9);
                        } else if (hotWordList.indexOf('预售') === -1 && hotWordList.indexOf('秒杀') !== -1) {
                            hotWordList = this.hotWordList.slice(0, 9);
                        } else if (hotWordList.indexOf('预售') !== -1 && hotWordList.indexOf('秒杀') !== -1) {
                            hotWordList = this.hotWordList.slice(0, 8);
                        }
                        this.hotWordList = hotWordList;
                    }
                }).catch(error => {
                    console.log(error);
                });
            },
            queryHistorySearch() {
                // 根据用户id查询历史搜索词
                this.$http({
                    method: 'post',
                    url: '/xe-route/xe-app/mobileApp/product/queryHistorySearch',
                    data: {}
                }).then(res => {
                    this.historySearchList = res.data.historySearchList ? res.data.historySearchList : [];
                }).catch(error => {
                    console.log(error);
                });
            },
            delWordFn() {
                this.$xeMessageBox.confirm('确定清空历史搜索记录？').then(action => {
                    this.$http({
                        method: 'post',
                        url: '/xe-route/xe-app/mobileApp/product/clearHistorySearch',
                        data: {}
                    }).then(res => {
                        console.log(res);
                        this.historySearchList = [];
                        this.$toast({
                            message: '历史搜索记录删除成功',
                            duration: 1500,
                            position: 'bottom'
                        });
                    }).catch(error => {
                        console.log(error);
                    });
                }).catch(error => {
                    console.log(error);
                });
            }
        },
        watch: {
            searchText(newVal) {
                if (!newVal) {
                    // 数据为空时
                    this.suggestProductList = null;
                    // 根据省ID查询热词
                    this.queryHotKeyWord();
                    // 根据用户id查询历史搜索词
                    this.queryHistorySearch();
                } else {
                    this.suggestProduct();
                }
            },
            searchCate(newVal) {
                console.log(newVal);
                this.searchText = '';
                if (newVal === 1) {
                    // 商品
                    this.suggestUrl = '/xe-route/xe-app/mobileApp/product/suggestProduct';
                } else {
                    // 店铺
                    this.suggestUrl = '/xe-route/xe-app/mobileApp/vendor/suggestVendor';
                }
            }
        }
    };
</script>
<style rel="stylesheet/scss" lang="scss">
    @import '../../static/styles/rules.scss';
    .search-item-con {
        width: 750/$ppr;
        margin: 40/$ppr auto;
        padding:0 40/$ppr;
        &.search-item-his {
            margin-top: 10/$ppr;
        }
        .search-item-tit {
            height: 50/$ppr;
            padding-bottom: 10/$ppr;
            line-height: 40/$ppr;
            h3 {
                font-size: 30/$ppr;
            }
            .xe-iconfont {
                width: 40/$ppr;
                height: 40/$ppr;
                font-size: 32/$ppr;
                line-height: 40/$ppr;
                text-align: center;
                color: $text-999;
            }
        }
        .search-item {
            font-size: 0;
            overflow: hidden;
            a {
                display: inline-block;
                font-size: 24/$ppr;
                background: #f5f5f5;
                height: 50/$ppr;
                border-radius: 30/$ppr;
                padding: 10/$ppr 20/$ppr;
                line-height: 30/$ppr;
                margin: 15/$ppr 15/$ppr 0 0;
            }
        }
        .search-item-none {
            line-height: 50/$ppr;
            font-size: 24/$ppr;
            color: $text-999;
        }
    }
    .suggest {
        ul {
            padding-left: 20/$ppr;
            li {
                overflow: hidden;
                min-height: 80/$ppr;
                padding: 20/$ppr;
                padding-left: 0;
                line-height: 40/$ppr;
                border-bottom: 1/$ppr solid $border-color-e8e;
                span {
                    float: left;
                    max-width: 70%;
                    word-wrap: break-word;
                    font-size: 24/$ppr;
                }
                em {
                    float: right;
                    padding: 0/$ppr 20/$ppr;
                    font-size: 20/$ppr;
                    height: 40/$ppr;
                    line-height: 40/$ppr;
                    background: #f5f5f5;
                    border-radius: 20/$ppr;
                    color: $text-666;
                }
            }
        }
        .none {
            position: relative;
            min-height: 500/$ppr;
        }
    }
</style>
