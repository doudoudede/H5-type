<template>
    <xe-layout class="m-bg-dark">
        <div class="p-setting-item">
            <div class="m-list-block">
                <ul>
                    <router-link tag="li" :to="{name: 'EditorPwd'}" class="item-content align-right item-link align-center">
                        <div class="item-media"><i class="xe-iconfont xe-icon-xgmm color1"></i></div>
                        <div class="item-inner">
                            <div class="item-title">修改密码</div>
                            <div class="item-after"></div>
                        </div>
                    </router-link>
                    <router-link tag="li" :to="{name: 'EditorPhone', query: {phone: $route.query.phone}}" class="item-content align-right item-link align-center">
                        <div class="item-media"><i class="xe-iconfont xe-icon-xgsj color2"></i></div>
                        <div class="item-inner">
                            <div class="item-title">修改绑定手机</div>
                            <div class="item-after"></div>
                        </div>
                    </router-link>
                </ul>
            </div>
        </div>
        <div class="p-setting-item">
            <div class="m-list-block">
                <ul>
                    <!--<router-link :to="{name: 'Support'}" tag="li" class="item-content align-right item-link align-center">-->
                        <!--<div class="item-media"><i class="xe-iconfont xe-icon-bbsm color3"></i></div>-->
                        <!--<div class="item-inner">-->
                            <!--<div class="item-title">帮助说明</div>-->
                            <!--<div class="item-after"></div>-->
                        <!--</div>-->
                    <!--</router-link>-->

                    <!--             暂     时        隐            藏           -->
                    <!-- <router-link tag="li" :to="{name: 'Cutility'}" class="item-content align-right item-link align-center">
                        <div class="item-media"><i class="xe-iconfont xe-icon-shzc color4"></i></div>
                        <div class="item-inner">
                            <div class="item-title">售后政策</div>
                            <div class="item-after"></div>
                        </div>
                    </router-link>
                    <router-link :to="{name: 'infringement'}" tag="li" class="item-content align-right item-link align-center">
                        <div class="item-media"><i class="xe-iconfont xe-icon-shensu color6"></i></div>
                        <div class="item-inner">
                            <div class="item-title">侵权申诉规则</div>
                            <div class="item-after"></div>
                        </div>
                    </router-link>
                    <router-link :to="{name: 'AboutUs'}" tag="li" class="item-content align-right item-link align-center">
                        <div class="item-media"><i class="xe-iconfont xe-icon-gywm color5"></i></div>
                        <div class="item-inner">
                            <div class="item-title">关于我们</div>
                            <div class="item-after"></div>
                        </div>
                    </router-link> -->
                      <!--             暂     时        隐            藏     完        -->
                    <!--<li class="item-content align-right item-link align-center">-->
                        <!--<div class="item-media"><i class="xe-iconfont xe-icon-qchc"></i></div>-->
                        <!--<div class="item-inner">-->
                            <!--<div class="item-title">清空缓存</div>-->
                            <!--<div class="item-after"></div>-->
                        <!--</div>-->
                    <!--</li>-->
                    <!--<li class="item-content align-right item-link align-center">-->
                        <!--<div class="item-media"><i class="xe-iconfont xe-icon-shezhi-banben"></i></div>-->
                        <!--<div class="item-inner">-->
                            <!--<div class="item-title">检测新版本</div>-->
                            <!--<div class="item-after"></div>-->
                        <!--</div>-->
                    <!--</li>-->
                </ul>
            </div>
        </div>
        <div class="p-setting-btn">
            <mt-button class="xe-button-white" style="width: 100%;" @click.prevent="logoutFn">退出登录</mt-button>
        </div>
    </xe-layout>
</template>
<script type="text/ecmascript-6">
    export default {
        name: 'xe-page-setting',
        data() {
            return {};
        },
        created() {},
        methods: {
            logoutFn() {
                this.$xeMessageBox.confirm('退出登录？').then(() => {
                    this.$http({
                        method: 'post',
                        url: '/xe-route/xe-app/mobileApp/user/logout',
                        data: {}
                    }).then(res => {
                        this.$removeLocalStorage('LOGINSTATUS');
                        this.$router.replace({name: 'My'});
                    });
                }).catch(() => {});
            }
        }
    };
</script>
<style rel="stylesheet/scss" lang="scss">
    @import '../../static/styles/rules.scss';
    .p-setting-item {
        background: #fff;
        margin: 20/$ppr 0;
        .xe-iconfont {
            color: #fff;
            &.color1 {
                background: #ee5d68;
            }
            &.color2 {
                background: #ff6f98;
            }
            &.color3 {
                background: #3eeb9a;
            }
            &.color4 {
                background: #9f86ff;
            }
            &.color5 {
                background: #ffba4e;
            }
            &.color6 {
                background: #3eeb9a;
            }
        }
    }
    .p-setting-btn {
        margin: 20/$ppr 0/$ppr;
    }
</style>
