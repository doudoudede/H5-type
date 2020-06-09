<template>
    <xe-layout class="m-flexlay">
        <view class="m-search-barcon" slot="header">
            <view class="m-search-bar" :class="{'m-search-typing': focusFlag}">
                <view class="m-search-newcon">
                    <form class="s-form" id="s-search" method="get" action="/" onsubmit="return false">
                        <label for="s-search-input" class="xe-iconfont xe-icon-sousuo"></label>
                        <input
                            v-model.trim="searchText"
                            class="s-search-input"
                            id="s-search-input"
                            @focus="focusFlag = true"
                            @blur="focusFlag = false"
                            type="search"
                            placeholder="请输入城市名称查询"
                        >
                    </form>
                    <span v-show="searchText.length" @click="searchText = ''" class="xe-iconfont xe-icon-cuowu"></span>
                    <view class="m-search-btn" @click="searchBtnFn">
                        <span>搜索</span>
                    </view>
                </view>

            </view>
        </view>
        <view class="suggestArea" v-if="suggestAreaList === null || suggestAreaList.length">
            <ul v-show="suggestAreaList && suggestAreaList.length">
                <li v-for="item in suggestAreaList" :key="item.areaId" @click.prevent="areaClickFn(item.areaId)">{{item.areaName}}</li>
            </ul>
            <view v-show="suggestAreaList === null" class="m-cart-none">
                <view class="pic">
                    <img src="../../static/images/cart-n1.png" alt="">
                </view>
                <view class="des">
                    <p class="f32">没有找到相关区域~</p>
                </view>
                <view class="btn">
                    <mt-button class="xe-button-default" size="small" plain @click.prevent="searchText = ''">清空</mt-button>
                </view>
            </view>
        </view>
        <template v-else>
            <view class="location-item" v-if="regionMap">
                <h3>当前定位城市</h3>
                <view class="location-ul">
                    <a href="#" @click.prevent="areaClickFn(regionMap.cityId)">{{regionMap.cityName}}</a>
                </view>
            </view>
            <view class="location-item" v-if="hotCityData.length">
                <h3>热门城市</h3>
                <view class="location-ul">
                    <a href="#" v-for="item in hotCityData" :key="item.areaId" @click.prevent="areaClickFn(item.hotCityId)">
                        {{item.hotCityName.split('-')[1]}}
                    </a>
                </view>
            </view>
            <view class="location-city">
                <ul>
                    <li @click="goSearch(item.name)" v-for="(item,index) in hotCity" :key="index">{{item.name}}</li>
                </ul>
            </view>
            <view class="location-tips">
                更多城市，请通过搜索查询
            </view>
        </template>
    </xe-layout>
</template>
<script type="text/ecmascript-6">
    import device from 'utils/device';
    import debounce from 'throttle-debounce/debounce';
    export default {
        name: 'xe-page-location',
        data() {
            return {
                searchText: '',
                focusFlag: false,
                suggestAreaList: [],
                hotCityData: [],
                regionMap: null,
                hotCity:[{
                        name:'北京'
                    },
                    {
                        name:'上海'
                    },
                    {
                        name:'南京'
                    },
                    {
                        name:'厦门'
                    },
                    {
                        name:'广州'
                    },
                    {
                        name:'成都'
                    },
                    {
                        name:'沈阳'
                    },
                    {
                        name:'重庆'
                    },
                    {
                        name:'武汉'
                    },
                    {
                        name:'大连'
                    }
                ]
            };
        },
        created() {
            this.hotCityList();
        },
        mounted() {
            this.$nextTick(() => {
                if (device.isWeixin) {
                    // 微信内打开
                    this.$http({
                        method: 'post',
                        url: '/xe-route/xe-app/mobileApp/user/weChatShare',
                        data: {
                            shareUrl: window.location.href.split('#')[0]
                        }
                    }).then(res => {
                        console.log(res);
                        /* eslint-disable */
                        let wxConfig = res.data.data;
                        let _this = this;
                        wx.config({
//                          debug: true,
                            appId: wxConfig.appId,
                            timestamp: wxConfig.timestamp,
                            nonceStr: wxConfig.nonceStr,
                            signature: wxConfig.signature,
                            jsApiList: [
                                'getLocation'
                            ]
                        });
                        wx.ready(function(){
                            wx.getLocation({
                                success: function (res) {
                                    console.log(res);
                                    if (res.errMsg === 'getLocation:ok') {
                                        _this.geocoder(res.latitude, res.longitude);
                                    } else {
                                        this.$toast('微信获取经纬度异常');
                                    }
                                },
                                cancel: function (res) {
                                    alert('用户拒绝授权获取地理位置');
                                }
                            });
                        });
                    }).catch(error => {
                        console.log(error);
                    });
                } else {
                    if (navigator.geolocation) {
                        navigator.geolocation.getCurrentPosition(pos => {
                            // 成功回调函数，接受一个地理位置的对象作为参数。
                            this.geocoder(pos.coords.latitude + '', pos.coords.longitude + '');
                        }, err => {
                            // 错误的回调
                            // https://developer.mozilla.org/cn/docs/Web/API/PositionError 错误参数
                            let str = '';
                            if (err.code === 1) {
                                str = '地理位置信息的获取失败，因为该页面没有获取地理位置信息的权限.';
                            } else if (err.code === 2) {
                                str = '地理位置获取失败，因为至少有一个内部位置源返回一个内部错误.';
                            } else {
                                str = '获取地理位置超时.';
                            }
                            this.$toast({
                                message: str,
                                position: 'bottom',
                                duration: 1500
                            });
                        }, {
                            enableHighAccuracy: true, // 是否获取高精度结果
                            timeout: 10000, // 超时,毫秒
                            maximumAge: 10000 // 可以接受多少毫秒的缓存位置
                            // 详细说明 https://developer.mozilla.org/cn/docs/Web/API/PositionOptions
                        });
                    } else {
                        window.alert('抱歉！您的浏览器无法使用地位功能');
                    }
                }
            });
        },
        methods: {
            goSearch(val){
                this.searchText = val
            },
            searchBtnFn() {},
            areaClickFn(id) {
                this.queryAreaInfoByCityId(id, data => {
                    this.$setLocalStorage('REGIONMAP', JSON.stringify(data));
                    this.$route.query.redirect ? this.$router.push({path: this.$route.query.redirect}) : this.$router.push({name: 'Index'});
                });
            },
            hotCityList() {
                this.$http({
                    method: 'post',
                    url: '/xe-route/xe-app/mobileApp/homepage/hotCity',
                    data: {}
                }).then(res => {
                    this.hotCityData = res.data.hotCity;
                }).catch(error => {
                    console.log(error);
                });
            },
            geocoder(lati, long) {
                // lati 经度 long 纬度
                this.$http({
                    method: 'post',
                    url: '/xe-route/xe-app/mobileApp/areaInfo/geocoder',
                    data: {
                        location: `${lati},${long}`
                    }
                }).then(res => {
                    console.log(res);
                    this.regionMap = res.data.areaInfo;
                }).catch(error => {
                    console.log(error);
                });
            },
            queryAreaInfoByCityId(id, fn) {
                this.$indicator.open('获取区域信息...');
                this.$http({
                    method: 'post',
                    url: '/xe-route/xe-app/mobileApp/areaInfo/queryAreaInfoByCityId',
                    data: {
                        areaId: id || '2'
                    }
                }).then(res => {
                    console.log(res);
                    fn && fn(res.data.areaInfo);
                    this.$indicator.close();
                }).catch(error => {
                    console.log(error);
                    this.$indicator.close();
                });
            },
            queryAreaListByName: debounce(300, function() {
                this.$http({
                    method: 'post',
                    url: '/xe-route/xe-app/mobileApp/areaInfo/queryAreaListByName',
                    data: {
                        areaName: this.searchText
                    }
                }).then(res => {
                    console.log(res);
                    this.suggestAreaList = res.data.areaInfoList;
                }).catch(error => {
                    console.log(error);
                });
            })
        },
        watch: {
            searchText(newVal) {
                if (!newVal) {
                    // 数据为空时
                    this.suggestAreaList = [];
                } else {
                    this.queryAreaListByName();
                }
            }
        }
    };
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
    @import '../../static/styles/rules.scss';
    .location-item {
        width: 750/$ppr;
        margin: 30/$ppr auto;
        padding: 0 20/$ppr;
        h3 {
            font-size: 26/$ppr;
            font-weight: 600;
            margin-bottom: 10/$ppr;
        }
        .location-ul {
            font-size: 0;
            a {
                display: inline-block;
                width: 224/$ppr;
                height: 70/$ppr;
                border: 1/$ppr solid #c9c9c9;
                border-radius: 35/$ppr;
                padding: 10/$ppr;
                text-align: center;
                line-height: 50/$ppr;
                font-size: 28/$ppr;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                margin: 16/$ppr 16/$ppr 0 0;
                &:nth-child(3n) {
                     margin-right: 0;
                }
            }
        }
    }
    .location-tips {
        text-align: center;
        margin-top: 60/$ppr;
        color: $text-999;
        font-size: 24/$ppr;
    }
    .suggestArea {
        padding-left: 20/$ppr;
        ul {}
        li {
            height: 88/$ppr;
            padding: 24/$ppr 20/$ppr 24/$ppr 0;
            font-size: 28/$ppr;
            line-height: 40/$ppr;
            border-top:1/$ppr solid $border-color-e8e;
            &:first-child {
                border-top: none;
            }
        }
    }
    .location-city{
        width: 100%;
        height: 150px;
        // background: darkgreen;
        padding: 10px;
        max-width: 750px;
        margin: auto;
        li{
            float: left;
            width: 15%;
            height: 60px;
            color: white;
            background: #409EFF;
            margin-left: 30px;
            margin-top: 20px;
            text-align: center;
            line-height: 60px;
            border-radius: 10px;
            font-size: 20px;
        }
        li:hover{
            cursor: pointer;
        }
    }
</style>
