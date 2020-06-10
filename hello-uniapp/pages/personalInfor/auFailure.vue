<template>
    <xe-layout  class="m-flexlay userInfor-results">
        <!--认证成功-->
        <div v-if="status == 1">
            <div class="auth-icon">
                <span class="xe-iconfont xe-icon-jinduduihao"></span>
            </div>
            <div class="auth-content">
                您已成功提交身份认证<br>
                我们将在1个工作日内完成审核~
            </div>
            <div style="text-align: center">
                <!-- <a href="tel:400-662-6366">
                    <mt-button class="xe-button-default" size="small" plain>联系客服</mt-button>
                </a> -->
                <mt-button class="xe-button-default xe-button-red" size="small" plain @click.prevent="goCategory">随便逛逛</mt-button>
            </div>
        </div>

        <!--认证失败-->
        <div v-if="status == 4">
            <div class="auth-icon">
                <span class="xe-iconfont xe-icon-round_clouse_fill"></span>
            </div>
            <div class="auth-content">
                <span style="font-weight: 500; display: block;">身份认证失败</span>
                <span style="color: #666; line-height: 1.5; margin-top: 0.15rem; display:block; word-wrap:break-word; word-break:break-all;" v-if='reason'>
                    {{reason}}
                </span>
            </div>
            <div style="text-align: center">
                <!-- <a href="tel:400-662-6366">
                    <mt-button class="xe-button-default" size="small" plain>联系客服</mt-button>
                </a> -->
                <mt-button class="xe-button-default xe-button-red" size="small" plain @click.prevent="reAuth">重新认证</mt-button>
            </div>
        </div>
    </xe-layout>
</template>
<script type="text/ecmascript-6">
    export default {
        name: '',
        beforeRouteEnter(to, from, next) {
            next(vm => {
                console.log(vm.$route.query.status);
                vm.status = parseInt(vm.$route.query.status);
            });
        },
        data() {
            return {
                status: 1,
                reason: ''
            };
        },
        created() {
            this.$nextTick(() => {
                if (this.status === 4) {
                    this.getStatus();
                }
            });
        },
        methods: {
            getStatus() {
                // 获取认证审核状态
                this.$http({
                    method: 'post',
                    url: '/xe-route/xe-app/mobileApp/checkIdentity/getStatus',
                    data: {}
                }).then(res => {
                    console.log(res);
                    this.reason = res.data.result.reason;
                }).catch(error => {
                    console.log(error);
                });
            },
            goCategory() {
                if (this.$route.query.loginStatus) {
                    // 与原生传递消息
                    if (window.postMessage) {
                        window.postMessage(JSON.stringify({type: 'special', payload: {goPage: 'category'}}), '*');
                    };
                } else {
                    this.$router.push({
                        name: 'Category'
                    });
                }
            },
            reAuth() {
                this.$router.push({
                    name: 'PersonalInfor',
                    query: {
                        status: '4'
                    }
                });
            }
        }
    };
</script>
<style rel="stylesheet/scss" lang="scss">
    @import '../../static/styles/rules.scss';
    .userInfor-results {
        background: #fff;
        padding: 0 65/$ppr;
        .auth-icon {
            margin-top: 80/$ppr;
            text-align: center;
            .xe-icon-jinduduihao {
                display: inline-block;
                width: 80/$ppr;
                height: 80/$ppr;
                border-radius: 50%;
                line-height: 85/$ppr;
                font-size: 40/$ppr;
                background: #57b900;
                color: #fff;
                text-align: center;
            }
            .xe-icon-round_clouse_fill {
                font-size: 80/$ppr;
                color: #f23530;
            }
        }
        .auth-content {
            font-size: 32/$ppr;
            color: #333;
            text-align: center;
            line-height: 44/$ppr;
            margin: 30/$ppr 0 42/$ppr;
        }
    }
</style>
