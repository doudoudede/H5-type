<template>
    <view class="m-banner-full" v-if="fullColumnData.length">
        <a href="#" @click.prevent="itemClickFn(fullColumnData[0])">
            <img :src="picServer + fullColumnData[0].imgUrl" alt="">
        </a>
    </view>
</template>
<script type="text/ecmascript-6">
    import {getXeUrl} from 'utils';
    export default {
        name: 'xe-fullcolumn',
        props: {
            menuType: {
                type: Number,
                default: 4
            }
        },
        data() {
            return {
                firstIn: true,
                picServer: '',
                areaId: '4',
                fullColumnData: []
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
                this.getColumnBanner();
            },
            getColumnBanner() {
                this.$http({
                    method: 'post',
                    url: '/xe-route/xe-app/mobileApp/homepage/getColumnBanner',
                    data: {
                        cityId: this.areaId,
                        menuType: this.menuType
                    }
                }).then(res => {
                    console.log(res);
                    this.picServer = res.data.picServer;
                    this.fullColumnData = res.data.contentFormList;
                }).catch(error => {
                    console.log(error);
                });
            },
            itemClickFn(item) {
                getXeUrl(item, this.$router);
            }
        }
    };
</script>
<style rel="stylesheet/scss" lang="scss"></style>
