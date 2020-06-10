<template>
    <xe-layout class='m-bg-dark m-flexlay'>
        <div class="m-editorpwd">
            <div class="m-list-block">
                <ul>
                    <li class="item-content">
                        <div class="item-inner">
                            <div class="item-title">原密码</div>
                            <div class="item-input">
                                <input v-if="pwdType1" class="input-cls" v-model="oldpwd" placeholder="输入原始密码" type="text">
                                <input v-else class="input-cls" v-model="oldpwd" placeholder="输入原始密码" type="password">
                            </div>
                            <div class="act">
                                <span class="xe-iconfont " :class="[pwdType1 ? 'xe-icon-yanjing2' : 'xe-icon-yanjing']" @click.prevent="pwdType1 = !pwdType1"></span>
                                <span class="xe-iconfont xe-icon-cuowu" v-if="oldpwd.length" @click.prevent="oldpwd = ''"></span>
                            </div>
                        </div>
                    </li>
                    <li class="item-content">
                        <div class="item-inner">
                            <div class="item-title">新密码</div>
                            <div class="item-input">
                                <input v-if="pwdType2" class="input-cls" v-model="newpwd" placeholder="输入新密码（6-20位数字+字母）" type="text">
                                <input v-else class="input-cls" v-model="newpwd" placeholder="输入新密码（6-20位数字+字母）" type="password">
                            </div>
                            <div class="act">
                                <span class="xe-iconfont " :class="[pwdType2 ? 'xe-icon-yanjing2' : 'xe-icon-yanjing']" @click.prevent="pwdType2 = !pwdType2"></span>
                                <span class="xe-iconfont xe-icon-cuowu" v-if="newpwd.length" @click.prevent="newpwd = ''"></span>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
        <div class="m-editor-btn">
            <mt-button type="primary" :disabled="disabledBtn" class="xe-button-primary" style="width: 100%;" @click.prevent="checkPwd">确 定</mt-button>
        </div>
    </xe-layout>
</template>
<script type="text/ecmascript-6">
    export default {
        name: 'xe-page-editorpwd',
        data() {
            return {
                pwdType1: false,
                pwdType2: false,
                oldpwd: '',
                newpwd: ''
            };
        },
        methods: {
            checkPwd() {
                this.$http({
                    method: 'post',
                    url: '/xe-route/xe-app/mobile/myIndex/resetPwd',
                    data: {
                        oldPwd: this.oldpwd,
                        loginPwd: this.newpwd
                    }
                }).then(res => {
                    console.log(res);
                    if (res.data.code === '2000') {
                        this.$toast({
                            message: '密码修改成功',
                            duration: 1500
                        });
                        this.$router.replace({
                            name: 'My'
                        });
                    } else {
                        this.$toast({
                            message: res.data.msg,
                            duration: 1500
                        });
                    }
                }).catch(error => {
                    console.log(error);
                });
            }
        },
        computed: {
            disabledBtn() {
                return !(this.oldpwd.length >= 6 && this.newpwd.length >= 6);
            }
        }
    };
</script>
<style rel="stylesheet/scss" lang="scss">
    @import "../../static/styles/rules.scss";
    .m-editor-btn {
        margin: 40/$ppr 20/$ppr;
    }
    .m-editorpwd {
        margin: 20/$ppr 0;
        background: #fff;
        .item-content {
            .item-title {
                width: 120/$ppr;
                font-size: 30/$ppr;
            }
        }
    }
</style>
