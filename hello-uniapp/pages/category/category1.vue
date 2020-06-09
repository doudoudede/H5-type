<template>
    <xe-layout class="m-page-category m-flexlay">
        <view class="m-cate-search" slot="header">
            <view class="m-index-searchcons m-content-view">
                <router-link tag="view" class="adrres" :to="{name: 'Location', query: {redirect: $route.fullPath}}">
                   <img  class="img " src="../../static/images/location.png" alt="">
                    <view>{{cityName}}</view>
                </router-link>
                <router-link tag="view" class="con" :to="{name: 'Search'}">
                    <input type="text" value="搜索">
                    <span class="xe-iconfont xe-icon-sousuo"></span>
                </router-link>
            </view>
        </view>
        <view  class="m-category-con m-content-view">
            <swiper class="swiper-container-typeOne" id="swiperControls" :options="swiperOption" ref="swiperControls">
                <swiper-slide  
                    v-for="item in cateList"
                    :key="item.cateId"
                >
                    <view class="m-nav-flr" :class="{'active': item.cateId === onceTemp.cateId}">
                        <p>{{item.cateName}}</p>
                    </view>
                </swiper-slide>
            </swiper>
            <mt-spinner v-if="!filterCateListed.length" class="sp-bounce"></mt-spinner>
            <view class="m-category-right">
                <view class="m-category-listcon" ref="mCatelistcon">
                    <view v-if="cateProductList.length">
                        <view class="proImg-box">
                            <img src="../../static/images/catetory.png" alt="">
                        </view>
                        <view class="proList-content">
                         
 
  <view  v-for="item in second"   >
                       <h2 class="with_lineTitle"> <span class="line"></span> 　<span class="Tbox">{{item.cateName}}</span> <span class="line"></span></h2>
 
　 
 
   <view class="pro-item-box"  v-for="(it,index) in item.threeList" :key=index   @click.prevent="goCatThreetails(it)">
                                <view class="pro-img" v-if="it.cateImg">
                                    <img :src="picServer + it.cateImg" alt="">
                                </view>
                                <view class="pro-name">{{it.cateName}}</view>

                            </view> 



</view   >  

                        </view>
                    </view>
                    <view v-if="!cateProductList.length" class="m-cart-none">
                        <view class="pic">
                            <img src="../../static/images/cart-n1.png" alt="">
                        </view>
                        <view class="des">
                            <p class="f32">暂无商品</p>
                        </view>
                    </view>
                </view>
            </view>
        </view>
        <view class="m-cart-none" v-if=" ! cateList ">
            <view class="pic2">
                <img src="../../static/images/cart-n2.png" alt="">
            </view>
            <view class="des">
                <p class="f32">该城市暂无在售商品</p>
                <p class="f28">去其他城市看看吧~</p>
            </view>
            <view class="btn">
                <mt-button class="xe-button-default" size="small" plain @click.prevent="toLocation">切换城市</mt-button>
            </view>
        </view>
    </xe-layout>
</template>
<script type="text/ecmascript-6">
    import { swiper, swiperSlide } from 'vue-awesome-swiper';
    export default {
        name: 'xe-page-catetory',
        data() {
            let _this = this;
            return {
                firstIn: true,
                swiperOption: {
                    direction: 'vertical',
                    notNextTick: true,
                    visibleSlides: 'auto',
                    setWrapperSize: true,
                    freeMode: true,
                    freeModeMomentum: true,
                    autoPlay: false,
                    loop: false,
                    slidesPerView: 'auto',
                    on: {
                        tap: function(event) {
                            event.stopPropagation();

                            let index = this.clickedIndex;
                            
                            var second=_this.cateList[index].secondList ;
                           
                            _this.onceTemp = {cateId: _this.cateList[index].cateId};
                            // _this.$router.replace({name: 'Category', query: {type: index}});
                            let domSlider = this.clickedSlide;
                            if (index === undefined || domSlider === undefined) {
                                // 判断是否点击的是SLIDER
                                return;
                            }
                         
                            _this.activeIndex = index;
                            this.slideTo(index - 1);
                            _this.second=second;
                             console.log(_this.second);

                        }
                    }
                },
               clickedIndex:0,
                activeIndex:0,
                consIndex: 0,
                cityName: '',
                areaId: '',
                cateList: [], // 分类数据
                second:[],
                filterCateListed: [],
                secondTemp: {},
                onceTemp: {},
                thirdTemp: {},
                paramsData: {
                    keyWord: '', // 关键词
                    pageNum: 1,  // 当前页
                    pageSize: 10, // 每页数量
                    areaOrgCode: '', // 地区id
                    brandId: [], // 品牌集合(list)
                    propertys: [], // 扩展属性集合[name-value,...] 例：属性1-属性11
                    totalSaleSort: '',  // 销量排序：asc  desc
                    priceSort: '',  // 价格排序：asc  desc
                    productType: 2, // 1:询报价 2:一口价
                    cateId: []
                },
                picServer: '',
                brandIds: [],
                propertys: [],
                cateProductList: [],
                cateProductBrand: [],
                cateProductPropertys: null,
                reload: true // 分类页是否重新加载，当分类页跳转至详情页，再返回分类时，不重新请求数据
            };
        },
 
       created(){

       },
        beforeRouteEnter(to, from, next) {
            next(vm => {
                

                from.name === 'CategoryDetails' ? vm.reload = false : vm.reload = true;
                let nowRegionMap = JSON.parse(vm.$getLocalStorage('REGIONMAP'));
                vm.cityName = nowRegionMap.cityName;
                vm.areaId = nowRegionMap.areaId;
                vm.paramsData.areaOrgCode = vm.areaId;
                vm.activeIndex = to.query.type ? parseInt(to.query.type) : 0;
                // 左侧导航条置到默认点击的位置
                vm.setDefault(vm.activeIndex);
                vm.searchCateProduct();
                vm.queryProCateByCityId();
            });
        },
        methods: {
       
            toLocation() {
                this.$router.push({
                    name: 'Location'
                });
            },
            goCatThreetails(it) {
                console.log(it);
                this.$router.push({
                    name: 'CategoryDetails',
                    query: {
                        cateId: it.cateId
                    }
                });
            },
            searchCateProduct() {
                this.$http({
                    method: 'post',
                    url: '/xe-route/xe-app/mobileApp/product/searchCateProduct',
                    data: this.paramsData
                }).then(res => {
                    console.log(res);
                    this.cateProductList = res.data.product;
                    if (res.data.brand) {
                        this.cateProductBrand = res.data.brand;
                    }
                    if (res.data.propertys) {
                        this.cateProductPropertys = res.data.propertys;
                    }
                }).catch(error => {
                    console.log(error);
                });
            },
            queryProCateByCityId() {
                this.$http({
                    method: 'post',
                    url: '/xe-route/xe-app/mobileApp/product/queryProCateByCityId',
                    data: {
                        areaId: this.areaId
                    }
                }).then(res => {
                    console.log(res);
                   this.second = res.data.cateList[this.activeIndex].secondList;
                    this.picServer = res.data.picServer;
                    this.cateList = res.data.cateList;
                    this.filterCateList = this.cateList;
                    this.onceTemp = this.cateList[this.activeIndex];
                    this. filterCateListed = this.cateList[this.activeIndex].secondList;
                    console.log( this.filterCateListed )
                //    this.secondTemp = this.filterCateListed[this.activeIndex];

                  
                    
              
                 
                    // this.secondTemp = this.filterCateListed[this.activeIndex];






                }).catch(error => {
                    console.log(error);
                });
            },
            setDefault(index) {
                if (index === null) {
                    setTimeout(() => {
                        this.swiper.slideTo(0, 500, false); // 切换到指定slide，速度为1秒
                        this.activeIndex = 0;
                    }, 300);
                } else {
                    setTimeout(() => {
                        this.swiper.slideTo(index - 1, 500, false); // 切换到指定slide，速度为1秒
                        this.activeIndex = index;
                    }, 300);
                }
            }
        },
        computed: {
            filterCateList: {
                get() {
                    return this.filterCateListed;
                },
                set(val) {
                    if (!val.length) return;
                    let result = [];
                    val.forEach(item => {
                        result.push(...item.secondList);
                    });
                    this.filterCateListed = result;
                }
            },
            swiper() {
                return this.$refs.swiperControls.swiper;
            },
            threeList() {
                let data = [];
                this.filterCateListed.forEach(item => {
                    if (item.cateId === this.secondTemp.cateId) {
                        data = item.threeList || [];
                    }
                });
                return data;
            }
        },
        watch: {
            '$route'(to, from) {
                if (this.cateList && this.cateList.length) {
                    this.onceTemp.cateId = this.cateList[this.activeIndex].cateId;
                    //    this.$router.go(0); 
                    console.log(this.onceTemp.cateId)
                }
                
            }
        },
        components: {
            swiper,
            swiperSlide
        }
    };
</script>
<style rel="stylesheet/scss" lang="scss">
    @import '../../static/styles/rules.scss';
    .m-page-category {
        height: 100%;
        .popup-category-category {
            .content {
                left: 120/$ppr;
            }
        }
    }
    .m-cate-search {
        .m-index-searchcons {
            height: 88/$ppr;
            position: relative;
            background: #f3f3f3;
            padding: 12/$ppr 30/$ppr;
            display: flex;
            // height: 76/$ppr;
            line-height: 76/$ppr;
            .adrres {
                
                transform: translateX(-.16rem)
             ;
                display: flex;
                flex-direction: column;
                justify-content: space-around;
                justify-items: center;
                color: #ffffff;
                display: flex;
                font-size:22/$ppr;
                color: #ffffff;
                min-width: 80/$ppr;
                line-height:22/$ppr;
                   .img {
             
            margin-top: 0.01rem;
            margin-left: 0.2rem;
            width: 30/$ppr;
 
                    text-align: center;
                   font-size: 0.54rem;

    line-height: 0.34rem;
                    color: #ffffff;
        }
            }
            .con {
                position: relative;
            
                // height: 54/$ppr;
                flex: 1;
                line-height: .50rem;
              
                // top: 7/$ppr;
              
                input {

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
                span {
                    width: 68/$ppr;
                    position: absolute;
                    left: 0;
                    font-size: 30/$ppr;
                    text-align: center;
                    color: $text-999;
                    top: 50%;
                    margin-top: -20/$ppr;
                    width: 80/$ppr;
                    height: 40/$ppr;
                    line-height: 40/$ppr;
                }
            }
            .filter {
                // top: 18/$ppr;
                // color: #414141;
            }
        }
    }
    .m-category-con {
        position: absolute;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
    }
    .swiper-container-typeOne{
        .swiper-slide {
            height: auto;
        }
    }
    .m-category-nav,.swiper-container-typeOne {
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        width: 180/$ppr;
        background: #f3f5f7;
        overflow-y: scroll;
        -webkit-overflow-scrolling: touch;
        .mint-spinner-snake {
            width: 40/$ppr !important;
            height: 40/$ppr !important;
            position: absolute;
            left: 50%;
            top: 50%;
            margin: -20/$ppr 0 0 -20/$ppr;
        }
        .m-nav-flr {
            border-right:1/$ppr solid $border-color-e8e;
            p {
                font-size: 24/$ppr;
                width: 100%;
                color: #333;
                height: 92/$ppr;
                line-height: 92/$ppr;
                // padding: 30/$ppr 20/$ppr;
                text-align: center;
                white-space: nowrap;
                overflow: hidden;
                background: #f3f3f3;
                text-overflow: ellipsis;
                // font-weight: bold;
                border-top:1/$ppr solid #e5e5e5;
            }
            &.active {
                position: relative;
                p {
                    
                    background: #fff;
                    font-size: 26/$ppr;
                    font-weight: 600;
                    
                }
                &::before {
                    content: '';
                    position: absolute;
                    top: 50%;
                    margin-top: -13/$ppr; 
                    height: 26/$ppr;
                    border-left: 6/$ppr solid #1A8EEF;
                }
                border-right: none;
            }
        }
    }
    .m-category-right {
        position: absolute;
        right: 0;
        left: 180/$ppr;
        top:0;
        bottom: 0;
        display: flex;
        flex-direction: column;
        .m-category-listcon {
            flex: 1;
            padding: 10/$ppr;
            overflow: auto;
            -webkit-overflow-scrolling: touch;
            .proImg-box {
                height: 220/$ppr;
                img {
                    display: block;
                    height: 100%;
                }
            }
            .proList-content {
                padding-top: 50/$ppr;
               text-align: left;
                flex-wrap: wrap;

                .pro-item-box {
                   

                    display:inline-block;
                    padding: 10/$ppr 0;
                    width: 33.33%;
                    text-align: center;
                    .pro-img {
                        img {
                            width: 120/$ppr;
                            height: 120/$ppr;
                            display: block;
                            margin: 0 auto;
                            border-radius: 50%;
                        }
                    }  
                    .pro-name {
                        font-size: 24/$ppr;
                        color: #333;
                        line-height: 62/$ppr;
                    }
                }
            }
        }
    }
   .m-index-searchcons.m-content-view{background: #1B8EEF}
   .proList-content>view {display: block;width:100%;}
   .demo_line_01{
  
color: #999;

}

 .swiper-container-typeOne .m-nav-flr.active p {font-size: .28rem}
 .swiper-container-typeOne .m-nav-flr p {font-size: .26rem}
.with_lineTitle{font-family:PingFang-SC-Regular;height: .90rem;
font-weight:400;padding: .4rem 0;
color:rgba(51,51,51,1); margin: 0 auto;  display: flex;align-items: center;justify-content: center; width: 70%;padding: 0 10%; overflow: hidden;}
.with_lineTitle .line{  margin:0 .2rem; height: 2px;background-color: #999;width: 1.2rem; }
.with_lineTitle .Tbox{white-space: nowrap;font-size: 0.30rem;
font-family:PingFang-SC-Regular;
font-weight:600;
color:rgba(51,51,51,1);
  }.m-cate-search .m-index-searchcons .con{
      line-height: .65rem;
  }

.m-cate-search .m-index-searchcons .adrres{ }
</style>
