<template>
    <xe-layout class="m-login">
        <view class="ml-list">
            <view class="ml-list-item">
                <view class="con">
                    <input class="input-cls" maxlength="11" v-model.trim="regTel" placeholder="输入手机号" type="tel">
                </view>
                <view class="act">
                    <span class="xe-iconfont xe-icon-cuowu" v-show="regTel.length" @click.prevent="regTel = ''"></span>
                </view>
                <view class="getyzm" :class="{'nodisabled': regTel && regTel.length === 11}" @click="getYzmCode">{{isNaN(yzbtnText) ? yzbtnText : yzbtnText + 's'}}</view>
            </view>
            <view class="ml-list-item">
                <view class="con">
                    <input class="input-cls" maxlength="6" v-model.trim='regYzm' placeholder="输入验证码" type="tel">
                </view>
                <view class="act">
                    <span class="xe-iconfont xe-icon-cuowu" v-show="regYzm.length" @click.prevent="regYzm = ''"></span>
                </view>
            </view>
            <view class="ml-list-item">
                <view class="con">
                    <input v-if="pwdType" class="input-cls" v-model.trim="regPass" placeholder="输入密码(6-20数字+字母)" type="text">
                    <input v-else class="input-cls" v-model.trim="regPass" placeholder="输入密码(6-20数字+字母)" type="password">
                </view>
                <view class="act">
                    <span class="xe-iconfont " :class="[pwdType ? 'xe-icon-yanjing2' : 'xe-icon-yanjing']" @click.prevent="pwdType = !pwdType"></span>
                    <span class="xe-iconfont xe-icon-cuowu" v-if="regPass.length" @click.prevent="regPass = ''"></span>
                </view>
            </view>
        </view>
        <view class="ml-tips" style="display: block; text-align: right;">
            <span>已有账号? <router-link :to="{name: 'Login', query: {redirect: $route.query.redirect ? $route.query.redirect : ''}}" class="a-link-blue">返回登录</router-link></span>
        </view>
        <view class="m-login-btn">
            <mt-button type="primary" :disabled="disabledFlag" class="xe-button-primary" style="width: 100%;" @click.prevent="addUser">立即注册</mt-button>
        </view>
        <view class="m-login-xy">
            <span class="xe-iconfont xe-icon-ronud_check"></span>
            <view class="con">我已阅读并同意<router-link :to="{name: 'Support'}">《如来云商用户注册协议》</router-link>和<router-link :to="{name: 'SupportTwo'}">《法律声明及隐私权政策》</router-link></view>
        </view>
        <!--Dialog-->
        <xe-dialog slot="outer" :show.sync="yzmDialog">
            <view class="yzmcons">
                <view class="yzm-input">
                    <view class="yzm-inputin">
                        <input type="text" v-model="yzmvalue" maxlength="4" placeholder="请输入图形验证码">
                    </view>
                    <view class="yzmimgcon" @click.prevent="getImgCode">
                        <img :src="yzmImgCodeUrl" id="yzmImgsrc">
                    </view>
                </view>
                <view class="yzm-tips">为了您的账户安全，请输入图文验证码！</view>
            </view>
            <template slot="footer">
                <view class="m-dialog-btn cancel" @click="yzmDialogCancel">取消</view>
                <view class="m-dialog-btn sure" @click="yzmDialogSure">确认</view>
            </template>
        </xe-dialog>
    </xe-layout>
</template>
<script type="text/ecmascript-6">
    import {Dialog} from 'components/Dialog/';
    export default {
        name: 'xe-page-reg',
        data() {
            return {
                loginBtnFlag: true,
                pwdType: false,
                regTel: '',
                regYzm: '',
                regPass: '',
                yzmBtnFlag: false,
                yzbtnText: '发送验证码',
                timer: null,
                yzmDialog: false,
                yzmvalue: '',
                yzmImgCodeUrl: ''
            };
        },
        methods: {
            getYzmCode() {
                // 发送验证码
                if (this.yzmBtnFlag) {
                    return;
                }
                if (!this.regTel || this.regTel.length !== 11) {
                    return;
                }
                if (!(/^1(3|4|5|6|7|8|9)\d{9}$/.test(this.regTel))) {
                    this.$toast({
                        message: '请输入正确的手机号',
                        duration: 1500
                    });
                    return;
                }
                this.yzbtnText = '发送中';
                this.yzmBtnFlag = true;
                this.$http({
                    method: 'post',
                    url: '/xe-route/xe-app/mobileApp/user/sendMsg',
                    data: {
                        mobile: this.regTel,
                        type: 'register',
                        checkcode: this.yzmvalue
                    }
                }).then(res => {
                    console.log(res);
                    this.yzmDialog = false;
                    this.yzmvalue = '';
                    if (res.data.code === '2000') {
                        this.yzmDialog = false;
                        this.yzbtnText = 60;
                        this.timer = setInterval(() => {
                            this.yzbtnText--;
                            if (this.yzbtnText === 0) {
                                clearInterval(this.timer);
                                this.yzbtnText = '重新获取';
                                this.yzmBtnFlag = false;
                            }
                        }, 1000);
                    } else if (res.data.code === '2011') {
                        // 弹出验证码
                        this.yzbtnText = '重新获取';
                        this.yzmBtnFlag = false;
                        this.getImgCode();
                        this.yzmDialog = true;
                    } else {
                        this.yzbtnText = '重新获取';
                        this.yzmBtnFlag = false;
                        this.$toast({
                            message: res.data.msg,
                            duration: 2000
                        });
                    }
                }).catch(error => {
                    console.log(error);
                    clearInterval(this.timer);
                    this.yzbtnText = '重新获取';
                    this.yzmBtnFlag = false;
                    this.yzmDialog = false;
                    this.yzmvalue = '';
                });
            },
            getImgCode() {
                // 获取图片验证码
//                let urlStr = 'http://qa-wap.xebest.com/';
//                if (process.env.NODE_ENV === 'production') {
//                    urlStr = 'http://wap.xebest.com/';
//                };
                let urlStr = document.location.origin;
                this.yzmImgCodeUrl = `${urlStr}/xe-route/xe-app/mobileApp/user/getImgCode?uuid=${this.$getLocalStorage('UUID')}&type=login&v=${Math.random()}&source=1`;
            },
            yzmDialogCancel() {
                this.yzmDialog = false;
                this.yzmvalue = '';
            },
            yzmDialogSure() {
                if (!this.yzmvalue) {
                    this.$toast({
                        message: '请输入验证码',
                        position: 'bottom'
                    });
                    return;
                }
                this.getYzmCode();
            },
            addUser() {
                this.$http({
                    method: 'post',
                    url: '/xe-route/xe-app/mobileApp/user/addUser',
                    data: {
                        mobile: this.regTel,
                        loginPwd: this.regPass,
                        regSource: 3,
                        verifyCode: this.regYzm
                    }
                }).then(res => {
                    console.log(res);
                    if (res.data.code === '2000') {
                        this.$xeMessageBox({
                            message: '恭喜您成功注册如来云商！认证身份，即可随心采购~',
                            showCancelButton: true,
                            confirmButtonText: '立即认证',
                            confirmButtonHighlight: true,
                            cancelButtonText: '稍后再说',
                            closeOnClickModal: false
                        }).then(action => {
                            this.$setLocalStorage('LOGINSTATUS', res.data.responseDTO.loginStatus);
                            if (action === 'confirm') {
//                                this.$router.replace({
//                                    name: 'PersonalInfor',
//                                    query: {
//                                        mobile: res.data.loginName
//                                    }
//                                });
                                this.$router.replace({
                                    name: 'IdentityAuthentication'
                                });
                            } else {
                                this.$router.push({
                                    path: '/'
                                });
                            }
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
            disabledFlag() {
                return !(this.regTel && this.regTel.length === 11 && this.regYzm && this.regYzm.length === 4 && this.regPass && this.regPass.length >= 6);
            }
        },
        components: {
            [Dialog.name]: Dialog
        }
    };
</script>
<style  ref="stylesheet/scss" lang="scss" scoped="">
    @import "../../static/styles/rules.scss";
    .ml-list-item{
        border-bottom: 0.01rem solid #26a2ff;        
    }
    .m-login-xy .xe-iconfont{
        color:#26a2ff;
    }
</style>
