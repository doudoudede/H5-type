<template>
    <div class="m-navbar" v-if="barListData.length">
        <div class="m-navbar-con">
            <!--<div class="navbar-logo">-->
                <!--<div class="nav-logo xe-gradient-color xe-iconfont xe-icon-logo"></div>-->
            <!--</div>-->
            <div class="narbar-con">
                <template v-for="(item, index) in barListData">
                    <router-link tag="div" :to="{name: 'Index'}" v-if="index === 0">
                        <span>
                            <img class="nimg" :src="picServer + item.imgUrl" alt="">
                            <img class="focusImg" :src="picServer + item.focusImgUrl" alt="">
                        </span>
                    </router-link>
                    <router-link tag="div" :to="{name: 'Category'}" v-if="index === 1">
                        <span>
                            <img class="nimg" :src="picServer + item.imgUrl" alt="">
                            <img class="focusImg" :src="picServer + item.focusImgUrl" alt="">
                        </span>
                    </router-link>
                    <router-link tag="div" :to="{name: 'Cart'}" v-if="index === 2">
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
                    <router-link tag="div" :to="{name: 'My'}" v-if="index === 3">
                        <span>
                            <img class="nimg" :src="picServer + item.imgUrl" alt="">
                            <img class="focusImg" :src="picServer + item.focusImgUrl" alt="">
                        </span>
                    </router-link>
                </template>
            </div>
        </div>
    </div>
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
