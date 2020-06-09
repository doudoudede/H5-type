<template>
    <view class="m-navbar" v-if="barListData.length">
        <view class="m-navbar-con">
            <!--<view class="navbar-logo">-->
                <!--<view class="nav-logo xe-gradient-color xe-iconfont xe-icon-logo"></view>-->
            <!--</view>-->
            <view class="narbar-con">
                <template v-for="(item, index) in barListData">
                    <router-link tag="view" :to="{name: 'Index'}" v-if="index === 0">
                        <span>
                            <img class="nimg" :src="picServer + item.imgUrl" alt="">
                            <img class="focusImg" :src="picServer + item.focusImgUrl" alt="">
                        </span>
                    </router-link>
                    <router-link tag="view" :to="{name: 'Category'}" v-if="index === 1">
                        <span>
                            <img class="nimg" :src="picServer + item.imgUrl" alt="">
                            <img class="focusImg" :src="picServer + item.focusImgUrl" alt="">
                        </span>
                    </router-link>
                    <router-link tag="view" :to="{name: 'Cart'}" v-if="index === 2">
                        <span>
                            <!-- <img class="nimg" :src="picServer + item.imgUrl" alt="">
                            <img class="focusImg" :src="picServer + item.focusImgUrl" alt=""> -->
                            <img
                            class="nimg"
                            src="../../static/images/shop4.png"
                            alt
                        />
                        <img
                            class="focusImg"
                            src="../../static/images/shop3.png"
                            alt
                        />
                        </span>
                    </router-link>
                    <router-link tag="view" :to="{name: 'My'}" v-if="index === 3">
                        <span>
                            <img class="nimg" :src="picServer + item.imgUrl" alt="">
                            <img class="focusImg" :src="picServer + item.focusImgUrl" alt="">
                        </span>
                    </router-link>
                </template>
            </view>
        </view>
    </view>
</template>
<script type="text/ecmascript-6">
    export default {
        name: 'xe-navbar',
        data() {
            return {
                picServer: '',
                barListData: []
            };
        },
        created() {
            this.getIcon();
        },
        methods: {
            getIcon() {
                this.$http({
                    method: 'post',
                    url: '/xe-route/xe-app/mobileApp/homepage/getIcon',
                    data: {}
                }).then(res => {
                    this.picServer = res.data.picServer;
                    this.barListData = res.data.contentFormList;
                }).catch(error => {
                    console.log(error);
                });
            }
        }
    };
</script>
<style rel="stylesheet/scss" lang="scss"></style>
