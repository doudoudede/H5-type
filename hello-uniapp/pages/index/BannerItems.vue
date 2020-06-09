<template>
    <view class="m-banner-item clearfix" v-if="adData.length === 4">
        <view class="banner-left fl">
            <a href="#" @click.prevent="itemClickFn(adData[0])">
                <img :src="picServer + adData[0].imgUrl" alt="">
            </a>
        </view>
        <view class="banner-right fr">
            <view class="banner-right-top clearfix">
                <view class="fl">
                    <a href="#" @click.prevent="itemClickFn(adData[1])">
                        <img :src="picServer + adData[1].imgUrl">
                    </a>
                </view>
                <view class="fr">
                    <a href="#" @click.prevent="itemClickFn(adData[2])">
                        <img :src="picServer + adData[2].imgUrl">
                    </a>
                </view>
            </view>
            <view class="banner-right-bottom">
                <a href="#" @click.prevent="itemClickFn(adData[3])">
                    <img :src="picServer + adData[3].imgUrl" alt="">
                </a>
            </view>
        </view>
    </view>
</template>
<script type="text/ecmascript-6">
    import {getXeUrl} from 'utils';
    export default {
        props: {
            menuType: {
                type: Number,
                default: 3 // 根据栏位所在分页不同 传相对应的menuType "首页-广告位"--3 "优质商户-广告位"--11 "热销商品-广告位"--15
            }
        },
        data() {
            return {
                firstIn: true,
                areaId: '4',
                adData: [],
                picServer: ''
            };
        },
        created() {
            this.init();
        },
        activated() {
            // 判断是不是第一次进入组件
            if (!this.firstIn) {
                this.init();
            }
        },
        deactivated() {
            this.firstIn = false;
        },
        methods: {
            init() {
                let nowRegionMap = JSON.parse(this.$getLocalStorage('REGIONMAP'));
                this.areaId = nowRegionMap.areaId;
                // 取首页四个广告位
                this.getIndexAd();
            },
            itemClickFn(item) {
                // console.log(item)
                getXeUrl(item, this.$router);
            },
            getIndexAd() {
                this.$http({
                    method: 'post',
                    url: '/xe-route/xe-app/mobileApp/homepage/getIndexAd',
                    data: {
                        cityId: this.areaId,
                        menuType: this.menuType
                    }
                }).then(res => {
                    this.picServer = res.data.picServer;
                    this.adData = res.data.contentFormList;
                }).catch(error => {
                    console.log(error);
                });
            }
        }
    };
</script>
<style rel="stylesheet/scss" lang="scss"></style>
