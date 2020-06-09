<template>
    <xe-layout class="m-bg-dark m-flexlay" ref="layout">
        <view id="fixedTop">
            <view class="m-index-search">
                <view class="m-index-search-cover xe-gradient-color" :style="{opacity: searchOpacity}"></view>
                <!--<view class="m-index-searchcon m-index-searchconnomsg">-->
                <view class="m-index-searchcon m-index-searchcon-type1">
                    <router-link tag="view" class="adrress" :to="{name: 'Location'}">
                       <img  class="img " src="../../static/images/location.png" alt="">
                        <view>{{cityName}}</view>
                    </router-link>
                    <router-link tag="view" class="con" :to="{name: 'Search'}">
                        <input type="text" value="搜索">
                        <!-- <span class="xe-iconfont xe-icon-sousuo"></span> -->
                    </router-link>
                    <router-link tag="view" :to="{name: 'Message'}" class="message">
                        <em class="msg-circle" v-show="showcircle"></em>
                        <span class="xe-iconfont xe-icon-xiaoxi"></span>
                    </router-link>
                </view>
            </view>
        </view>
        <view class="m-emptybj-red xe-gradient-color"></view>
        <view class="m-index-slider m-index-slider_other xe-gradient-color">
            <xe-slider
                ref="slider"
                :defautlOption='true'
                v-if="sliderData.length"
                :sliderData="sliderData"
                :picServer="picServer"
                :autoPlay="true"
                :loop="sliderData.length > 1 ? true : false"
            >
            </xe-slider>
        </view>
        <!--八宫格-->
        <GridEight ref="eightBlock"></GridEight>
        <!--四个广告位-->
        <BannersItem></BannersItem>
        <!--通栏Banner-->
        <FullColumnBanner></FullColumnBanner>
        <!-- 秒杀 -->
        <SecKill></SecKill>
        <!-- 预售 -->
        <PreSell></PreSell>
        <!--优质商户-->
        <!-- <IndexVendor></IndexVendor> -->
        <!--通栏Banner-->
        <FullColumnBanner :menuType="6"></FullColumnBanner>
        <!--常购清单-->
        <IndexOftenBuy></IndexOftenBuy>
        <!--意向单弹框 -->
        <!--<MessageAlert :show.sync="messageDialog" :proListData="proListData" slot="outer"></MessageAlert>-->
    </xe-layout>
</template>
<script type="text/ecmascript-6">
    import GridEight from './EightGird';
    import BannersItem from './BannerItems'; // 广告四个广告位
    import FullColumnBanner from './fullColumnBanner';
    import IndexVendor from './IndexVendor'; // 优质商户
    import IndexOftenBuy from './IndexOftenBuy'; // 常购清单
    import SecKill from './SecKill'; // 秒杀
    import PreSell from './PreSell'; // 预售
    import MessageAlert from './MessageAlert'; // 预售
    export default {
        name: 'xe-page-index',
        data() {
            return {
                showcircle: false,
                searchOpacity: 0,
                picServer: '',
                cityName: '',
                areaId: '4',
                reload: true,
                proListData: {},
                messageDialog: false, // 弹框开关
                sliderData: [] // 首页
            };
        },
        mounted() {
            console.log('mounted');
            this.$refs.layout.$el.querySelector('.scrollview').onscroll = this.searchBg;
            this.searchBg();
//            window.addEventListener('scroll', this.searchBg, false);
            let nowRegionMap = JSON.parse(this.$getLocalStorage('REGIONMAP'));
            this.cityName = nowRegionMap.cityName;
            this.areaId = nowRegionMap.areaId;
            // 取首页焦点图
            this.getIndexBanner();
            this.queryReadFlagCount();
            if (this.$getLocalStorage('LOGINSTATUS') !== 'undefined') {
                // this.myWishOrder();
            }
            if (this.reload) {
                let oftenBuyScrollTop = this.$getLocalStorage('oftenBuyScrollTop');
                setTimeout(() => {
                    document.getElementById('scrollview').scrollTop = oftenBuyScrollTop;
                    this.$removeLocalStorage('oftenBuyScrollTop');
                }, 200);
                console.log('oftenBuyScrollTop', oftenBuyScrollTop);
            } else {
                this.$removeLocalStorage('oftenBuyScrollTop');
            }
            // console.log('=--=-', this.$getLocalStorage('LOGINSTATUS'));
        },
        beforeRouteEnter (to, from, next) {
            next(vm => {
                from.name === 'ProductDetails' ? vm.reload = false : vm.reload = true;
            });
        },
        beforeRouteLeave (to, from, next) {
            let oftenBuyScrollTop = document.getElementById('scrollview').scrollTop;
            this.$setLocalStorage('oftenBuyScrollTop', oftenBuyScrollTop);
            next();
        },
        methods: {
            myWishOrder() {
                // this.$indicator.open();
                let params = {};
                this.$http({
                    method: 'post',
                    url: '/xe-route/xe-app/mobile/wishOrderInfo/queryMyWishOrderIndex',
                    data: params
                }).then((res) => {
                    // this.$indicator.close();
                    this.proListData = res.data;
                }).catch(error => {
                    console.log(error);
                    this.$indicator.close();
                });
            },
            queryReadFlagCount() {
                this.$http({
                    method: 'post',
                    url: '/xe-route/xe-app/mobileApp/msgrecord/queryReadFlagCount',
                    data: {}
                }).then(res => {
                    console.log(res);
                    if (res.data.count > 0) {
                        this.showcircle = true;
                    }
                }).catch(error => {
                    console.log(error);
                });
            },
            getIndexBanner() {
                this.$http({
                    method: 'post',
                    url: '/xe-route/xe-app/mobileApp/homepage/getIndexBanner',
                    data: {
                        cityId: this.areaId,
                        menuType: 1 // "首页-焦点图"--1  "优质商户-焦点图"--10  "热销商品-焦点图"--14
                    }
                }).then(res => {
                    console.log(res);
                    this.sliderData = res.data.contentFormList;
                    this.picServer = res.data.picServer;
                }).catch(error => {
                    console.log(error);
                });
            },
            searchBg() {
                let t = this.$refs.layout.$el.querySelector('.scrollview').scrollTop;
                let dis = this.$refs.eightBlock && this.$refs.eightBlock.$el.offsetTop ? this.$refs.eightBlock.$el.offsetTop : 500;
                if (t > dis) {
                    this.searchOpacity = 0.9;
                    return false;
                } else {
                    this.searchOpacity = (t / dis).toFixed(1);
                }
            }
        },
        beforeDestroy() {
//            this.$refs.layout.$el.querySelector('.scrollview').removeEventListener('scroll', this.searchBg, false);
            this.$refs.layout.$el.querySelector('.scrollview').onscroll = null;
        },
        watch: {
            'proListData.proList.length'(n) {
                if (n > 0) {
                    this.messageDialog = true;
                }
            }
        },
        components: {
            GridEight,
            IndexVendor,
            IndexOftenBuy,
            BannersItem,
            FullColumnBanner,
            SecKill,
            PreSell,
            MessageAlert
        }
    };
</script>
<style rel="stylesheet/scss" lang="scss">
    @import '../../static/styles/rules.scss';
   .xe-gradient-color {background: red}
    .m-emptybj-red {
        max-width: 750/$ppr;
        margin: 0 auto;
        height: 88/$ppr;
    }
    .m-banner-iconBox {
        max-width: 750/$ppr;
        margin: 0 auto;
        padding: 20/$ppr 120/$ppr;
        @include flexbox();
        color: #fff;
        font-size: 24/$ppr;
        .item-icon {
            line-height: 1;
        }
        .xe-iconfont {
            display: inline-block;
            vertical-align: text-top;
            margin-right: 10/$ppr;
            width: 32/$ppr;
            height: 32/$ppr;
            font-size: 32/$ppr;
            text-align: center;
            line-height: 32/$ppr;
        }
    }
    .vendor-tite {
        background: #f7f7f7;
        line-height: 32/$ppr;
        padding: 24/$ppr 34/$ppr 20/$ppr;
        font-size: 24/$ppr;
        color: #999;
        .big_fot {
            position: relative;
            top: 2/$ppr;
            font-size: 32/$ppr;
            color: #3d3d3d;
            font-weight: 600;
        }
        img {
            position: relative;
            top: 4/$ppr;
            display: inline-block;
            width: 30/$ppr;
            height: 30/$ppr;
        }
    }
    .m-index-slider {
        max-width: 750/$ppr;
        height: 340/$ppr;
        margin: 0 auto;
        .swiper-container-horizontal > .swiper-pagination-bullets {
            bottom: 30/$ppr;
        }
    }
    .m-index-slider_other {
        .swiper-item {
            width: 80%!important;
            margin: 0 5/$ppr;
            opacity: .5;
            transform: scaleY(0.9);
        }
        .swiper-slide-active {
            opacity: 1;
            transform: scaleY(1);
            transition: all 0.3s ease;
        }
    }
  .m-index-slider.m-index-slider_other.xe-gradient-color{  margin-top: .3rem; background: #ffffff}
    .m-banner-full {
        /*width: 100%;*/
        max-width: 750/$ppr;
        background: #fff;
        margin: 10/$ppr auto;
        &.mt20 {
            margin-top: -25/$ppr;
        }
        img {
            width: 100%;
            vertical-align: top;
        }
    }
    .m-index-searchcon {
        &.m-index-searchcon-type1 {
            position: relative;
            padding: 18/$ppr 0 0 154/$ppr;
            .con {
                    line-height: .50rem;
                position: relative;
                // top: 7/$ppr;
                width: 500/$ppr;
                input,span {
                   
                    width: 100%;
                    border-radius: 34/$ppr;
                    border: none;
                    padding: 15/$ppr 30/$ppr 15/$ppr 68/$ppr;
                    font-size: 28/$ppr;
                    color: $text-999;
                    height: 54/$ppr;
                    line-height: 54/$ppr;
                    background-color: #ffffff;
                    border:1/$ppr solid #dcdcdc;
                    box-shadow: 0 0 0 1000px#ffffff inset
                }
            }
            .message {
                .xe-icon-xiaoxi {
                    display: inline-block;
                    font-size: 40/$ppr;
                    width: 40/$ppr;
                    height: 68/$ppr;
                    line-height: 68/$ppr;
                }
            }
        }
    }
    .adrress {   
          display: flex;
                flex-direction: column;
                justify-content: space-around;
                justify-items: center;
        position: absolute;
        left: 10/$ppr;
        top: 35%;
        margin-top: -27/$ppr;
        color: #414141;
        display: flex;
        font-size:22/$ppr;
        min-width: 70/$ppr;
    
   
        color: #fff;
        .img {
        
            margin-top: 0.1rem;
            margin-left: 0.2rem;
            width:30/$ppr;
                    text-align: center;
 
 
    line-height: 0.34rem;
                    color: #ffffff;
        }
    }
  .m-banner-item {height:3.56rem }
  .m-banner-item .banner-right-top {
    height: 1.8rem;
}
.m-banner-item .banner-right-bottom {
 
    height: 1.66rem;
    
}
.m-index-searchcon.m-index-searchcon-type1 .con{line-height: .52rem}
.m-index-searchcon.m-index-searchcon-type1 .con { position: absolute;left: 1.0rem;width:74%}
</style>
