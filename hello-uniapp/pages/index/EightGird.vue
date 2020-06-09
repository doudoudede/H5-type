<template>
    <view class="m-index-grid" v-if="eightData.length">
        <view class="m-grid-item" :style="{backgroundImage: backgroundImg ? 'url('+ picServer + backgroundImg+')' : ''}">
            <view class="item" v-for="(item, index) in eightData" :key="index" @click.prevent="itemClick(item)">
                <view>
                    <img :src="picServer + item.imgUrl" alt="">
                </view>
                <p>{{item.contentTitle}}</p>
            </view>
        </view>
    </view>
</template>
<script type="text/ecmascript-6">
    import {getXeUrl} from 'utils';
    export default {
        data() {
            return {
                firstIn: true,
                picServer: '',
                backgroundImg: '',
                eightData: [],
                areaId: '4'
            };
        },
        created() {
            console.log('八宫格');
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
                // 取首页八客格数据
                console.log('八宫格 ajax');
                this.getIndexPortal();
                console.log('八宫格 ajax');
            },
            itemClick(item) {
                getXeUrl(item, this.$router, this.$route.query);
                console.log('---->', item.contentUrl);
            },
            getIndexPortal() {
                this.$http({
                    method: 'post',
                    url: '/xe-route/xe-app/mobileApp/homepage/getIndexPortal',
                    data: {
                        cityId: this.areaId
                    }
                }).then(res => {
                    console.log(res);
                    this.eightData = res.data.contentFormList;
                    this.backgroundImg = res.data.backgroundImg;
                    this.picServer = res.data.picServer;
                }).catch(error => {
                    console.log(error);
                });
            }
        }
    };
</script>
<style rel="stylesheet/scss" lang="scss">
    @import '../../static/styles/rules.scss';
    .m-index-grid {
        width: 100%;
        max-width: 750/$ppr;
        margin: 0 auto;
        overflow: hidden;
        background: #fff;
        // margin-top: -20/$ppr;
        position: relative;
        z-index: 5;
        .m-grid-item {
            min-height: 172/$ppr;
            padding: 10/$ppr;
            background-size: cover;
            overflow: hidden;
            display: flex;
            flex-wrap: wrap;
            .item {
                // width: 182/$ppr;
                width: 146/$ppr;
                flex: 0 0 146/$ppr;
                margin-top: 15/$ppr;
                padding: 0 10/$ppr;
                view {
                    width: 86/$ppr;
                    height: 86/$ppr;
                    margin: 0 auto;
                    img {
                        width: 100%;
                        height: 100%;
                    }
                }
                p {
                    width: 100%;
                    height: 50/$ppr;
                    white-space: nowrap;
                    line-height: 50/$ppr;
                    text-align: center;
                    overflow: hidden;
                    font-size: 24/$ppr;
                }
            }
        }
    }
</style>
