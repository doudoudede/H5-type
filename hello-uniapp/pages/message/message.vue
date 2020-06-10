<template>
    <xe-layout class="m-bg-dark">
        <div class="m-msg-item">
            <div class="m-list-block">
                <ul>
                    <router-link tag="li" :to="{name: 'MessageList'}" class="item-content align-right item-link align-center">
                        <div class="item-media"><i class="xe-iconfont xe-icon-xtxx color1"></i></div>
                        <div class="item-inner">
                            <div class="item-title f32">系统消息</div>
                            <div class="item-after">
                                <div class="badge" v-if="systemCount > 0">{{systemCount}}</div>
                            </div>
                        </div>
                    </router-link>
                    <!--<li class="item-content align-right item-link align-center">-->
                        <!--<div class="item-media"><i class="xe-iconfont xe-icon-ggtz color2"></i></div>-->
                        <!--<div class="item-inner">-->
                            <!--<div class="item-title f32">公告通知</div>-->
                            <!--<div class="item-after">-->
                                <!--<div class="badge">99</div>-->
                            <!--</div>-->
                        <!--</div>-->
                    <!--</li>-->
                    <li class="item-content align-right item-link align-center" @click.prevent="toKeFu">
                        <div class="item-media"><i class="xe-iconfont xe-icon-kefu1 color3"></i></div>
                        <div class="item-inner">
                            <div class="item-title f32">在线客服</div>
                            <div class="item-after"></div>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    </xe-layout>
</template>
<script type="text/ecmascript-6">
    export default {
        data() {
            return {
                systemCount: 0
            };
        },
        created() {
            // 查询用户系统消息未读条数
            this.queryReadFlagCount();
        },
        methods: {
            queryReadFlagCount() {
                this.$http({
                    method: 'post',
                    url: '/xe-route/xe-app/mobileApp/msgrecord/queryReadFlagCount',
                    data: {}
                }).then(res => {
                    this.systemCount = res.data.count;
                }).catch(error => {
                    console.log(error);
                });
            },
            toKeFu() {
                window.location.href = 'http://xebest.udesk.cn/im_client?web_plugin_id=23247';
            }
        }
    };
</script>
<style rel="stylesheet/scss" lang="scss">
    @import '../../static/styles/rules.scss';
    .m-msg-item {
        margin: 20/$ppr 0;
        background: #fff;
        .badge {
            height: 32/$ppr;
            padding: 0 10/$ppr;
            background: #f23530;
            border-radius: 16/$ppr;
            line-height: 30/$ppr;
            font-size: 20/$ppr;
            color: #fff;
            margin-top: 8/$ppr;
        }
        .m-list-block .item-media .xe-iconfont {
            background: #fff;
            font-size: 40/$ppr;
            &.color1 {
                color: #f84d75;
            }
            &.color2 {
                color: #fc841a;
            }
            &.color3 {
                color: #30b0fe;
            }
        }
    }
</style>
