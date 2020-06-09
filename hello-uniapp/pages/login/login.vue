<template>
    <xe-layout class="m-login">
        <view class="login-box-top">
            <view >
                <img style="display:block;width:1.3rem;height:1.3rem;margin:auto" src="../../static/images/shangpinpingjia.png" alt="">
            </view>
            <view class="logo-txt">线上采购 送药到家</view>
        </view>
        <view class="loin-box-content" slot="outer">
            <view class="ml-list" v-show="loginWay === 1" key="loginPassword">
                <view class="ml-list-item">
                    <view class="con">
                        <input class="input-cls" type="number" v-model.trim="loginByPassword.loginName" placeholder="输入手机号/邮箱">
                    </view>
                    <view class="act">
                        <span class="xe-iconfont xe-icon-cuowu" v-if="loginByPassword.loginName.length" @click.prevent="loginByPassword.loginName = ''"></span>
                    </view>
                </view>
                <view class="ml-list-item">
                    <view class="con">
                        <input v-if="pwdType" class="input-cls" v-model.trim="loginByPassword.pwd" @keyup.13="loginPassFn" placeholder="输入密码" type="text">
                        <input v-else class="input-cls" v-model.trim="loginByPassword.pwd" @keyup.13="loginPassFn" placeholder="输入密码" type="password">
                    </view>
                    <view class="act">
                        <span class="xe-iconfont " :class="[pwdType ? 'xe-icon-yanjing2' : 'xe-icon-yanjing']" @click.prevent="pwdType = !pwdType"></span>
                        <span class="xe-iconfont xe-icon-cuowu" v-if="loginByPassword.pwd.length" @click.prevent="loginByPassword.pwd = ''"></span>
                    </view>
                </view>
                <view class="ml-list-item" v-if="yzmPicFlag">
                    <view class="con">
                        <input class="input-cls" placeholder="输入验证码" type="password">
                    </view>
                    <view class="act">
                        <span class="xe-iconfont xe-icon-cuowu"></span>
                    </view>
                    <view class="yzm-img"></view>
                </view>
            </view>
            <view class="ml-list" v-show="loginWay === 2" key="loginTelYzm">
                <view class="ml-list-item">
                    <view class="con">
                        <input class="input-cls" v-model.trim="loginByFast.loginName" :maxlength="11" placeholder="输入手机号" type="tel">
                    </view>
                    <view class="act">
                        <span class="xe-iconfont xe-icon-cuowu" v-if="loginByFast.loginName.length" @click.prevent="loginByFast.loginName = ''"></span>
                    </view>
                    <view class="getyzm" :class="{'nodisabled': loginByFast.loginName && loginByFast.loginName.length === 11}" @click="getYzmCode">{{isNaN(yzbtnText) ? yzbtnText : yzbtnText + 's'}}</view>
                </view>
                <view class="ml-list-item">
                    <view class="con">
                        <input class="input-cls" v-model.trim="loginByFast.verifyCode" placeholder="输入验证码" type="tel">
                    </view>
                    <view class="act">
                        <span class="xe-iconfont xe-icon-cuowu" v-if="loginByFast.verifyCode.length" @click.prevent="loginByFast.verifyCode = ''"></span>
                    </view>
                </view>
            </view>
            <view class="m-login-btn" v-if="loginWay === 1">
                <mt-button
                    type="primary"
                    :disabled="disabledFlag"
                    class="xe-button-primary"
                    style="width: 100%;"
                    @click.prevent="loginPassFn"
                >
                    登 录
                </mt-button>
            </view>
            <view class="m-login-btn" v-else>
                <mt-button
                    type="primary"
                    :disabled="disabledFlag2"
                    class="xe-button-primary"
                    style="width: 100%;"
                    @click.prevent="loginFastFn"
                >
                    登 录
                </mt-button>
            </view>
            <view class="quick-login">
                <view>
                    <view href="#" class="cor_y520" @click.prevent="navToReg">注册</view>
                    <view href="#" class="cor_y520" @click.prevent="changeLoginWay">{{loginWay === 1 ? '短信登录' : '密码登录'}}</view>
                    <router-link tag="view" :to="{name: 'RetakePassword'}" v-if="loginWay === 1">忘记密码?</router-link>
                </view>
            </view>
        </view>
        <view v-show="loginWay === 2" slot="outer" class="m-login-xy">
            <span class="xe-iconfont xe-icon-ronud_check"></span>
            <view class="con">我已阅读并同意<router-link :to="{name: 'Support'}">《如来云商服务协议》</router-link>同时开通易支付账户</view>
        </view>
        <view class="login-footer" slot="footer">
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
        <!--认证提示弹框-->
        <!-- <xe-dialog slot="outer" :show.sync="personFlag">
            <view class="person-auth">
                恭喜您注册如来云商！<br>
                认证身份，即可随心采购~
            </view>
            <template slot="footer">
                <view class="m-dialog-btn sure" @click="">稍后再说</view>
                <view class="m-dialog-btn sure" @click="">立即认证</view>
            </template>
        </xe-dialog> -->
    </xe-layout>
</template>
<script type="text/ecmascript-6">
    import {Dialog} from 'components/Dialog/';
    export default {
        name: 'xe-page-login',
        beforeRouteEnter(to, from, next) {
            if (parseInt(to.query.type) === 2) {
                next(vm => {
                    vm.loginWay = 2;
                });
            } else {
                next(vm => {
                    vm.loginWay = 1;
                });
            }
        },
        data() {
            return {
                loginWay: 1, // 登录方式 1 密码登录 2 验证码登录
                loginBtnFlag: true,
                yzmPicFlag: false,
                personFlag: false, // 认证提示弹框开关
                pwdType: false,
                loginByPassword: { // 密码登录方式
                    loginName: '',
                    pwd: ''
                },
                loginByFast: {
                    loginName: '',
                    verifyCode: '',
                    regSource: 3
                },
                yzmDialog: false,
                yzmvalue: '',
                yzbtnText: '发送验证码',
                timer: null,
                yzmImgCodeUrl: null
            };
        },
        created() {
        //    this.$xeMessageBox.confirm('账号或密码错误！');
        //    this.$toast({
        //        message: '账号或密码错误',
        //        position: 'top',
        //        duration: 100000
        //    });
        //    this.$indicator.open('加载中...');
//  this.$setLocalStorage('aa',JSON.stringify({use:'11',name:'22'}) );
//  this.$setLocalStorage('aa',JSON.stringify({use:'33',name:'44'}) );
//             // this.$setLocalStorage('aa', {use:'33',name:'44'});
//             var aa =JSON.parse(this.$getLocalStorage('aa')) 
            // console.log(aa)
        },
        mounted(){
           
        },
        methods: {
            loginPassFn() {
                // 密码登录
                this.$indicator.open('登录中...');
                this.$http({
                    method: 'post',
                    url: '/xe-route/xe-app/mobileApp/user/login',
                    data: { // 密码登录方式
                        loginName: this.loginByPassword.loginName,
                        pwd: this.loginByPassword.pwd,
                        securitySode: this.yzmvalue
                    }
                }).then(res => {
                    console.log(res);
                    this.$indicator.close();
                    if (res.data.code === '2000') {
                        this.$setLocalStorage('LOGINSTATUS', res.data.loginStatus);
                        let redirect = this.$route.query.redirect || '/';
                        this.$router.replace({path: redirect});
                    } else if (res.data.code === '2011') {
                        // 显示输入验证码
                        this.yzmDialog = true;
                        this.getImgCode();
                    } else {
                        this.$xeMessageBox.alert(res.data.msg);
                        this.$router.push({
                            path: '/'
                        });
                    }
                    this.yzmvalue = '';
                }).catch(error => {
                    console.log(error);
                    this.$indicator.close();
                });
            },
            loginFastFn() {
                // 快捷登录
                this.$indicator.open('登录中...');
                this.$http({
                    method: 'post',
                    url: '/xe-route/xe-app/mobileApp/user/fastlogin',
                    data: this.loginByFast
                }).then(res => {
                    console.log(res);
                    this.$indicator.close();
                    if (res.data.code === '2000') {
                        // 判断是登录还是注册 1是注册 2是登录
                        if (res.data.responseDto.loginORregist === 1) {
                            this.$xeMessageBox.alert('恭喜您成功注册如来云商！', '提示');
                            this.$setLocalStorage('LOGINSTATUS', res.data.responseDto.loginStatus);
                            this.$router.push({
                                path: '/'
                            });
//                             this.$xeMessageBox({
//                                 message: '恭喜您成功注册如来云商！'
//                                 // showCancelButton: true,认证身份，即可随心采购~'
//                                 // confirmButtonText: '立即认证',
//                                 // confirmButtonHighlight: true,
//                                 // cancelButtonText: '稍后再说',
//                                 // closeOnClickModal: false
//                             }).then(action => {
                                
//                                 if (action === 'confirm') {
// //                                    this.$router.replace({
// //                                        name: 'PersonalInfor',
// //                                        query: {
// //                                            mobile: res.data.loginName
// //                                        }
// //                                    });
//                                     this.$router.replace({
//                                         name: 'IdentityAuthentication'
//                                     });
//                                 } else {
                                   
//                                 }
                            // });
                        } else {
                            this.$setLocalStorage('LOGINSTATUS', res.data.responseDto.loginStatus);
                            this.$router.push({
                                path: this.$route.query.redirect ? this.$route.query.redirect : '/'
                            });
                        }
                    } else {
                        this.$xeMessageBox.alert(res.data.msg);
                        if(res.data.code == '2001'){
                            console.log('111')
                            this.$router.push({path: '/'});
                        }
                    }
                }).catch(error => {
                    console.log(error);
                    this.$indicator.close();
                });
            },
            pwdTypeChange() {},
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
                if (this.loginWay === 1) {
                    this.yzmDialog = false;
                    this.loginPassFn();
                } else {
                    this.getYzmCode();
                }
            },
            changeLoginWay() {
                this.loginWay === 1 ? this.loginWay = 2 : this.loginWay = 1;
                this.$router.replace({name: 'Login', query: {type: this.loginWay, redirect: this.$route.query.redirect ? this.$route.query.redirect : ''}});
            },
            navToReg() {
                this.$router.push({name: 'Reg', query: {redirect: this.$route.query.redirect ? this.$route.query.redirect : ''}});
            },
            getYzmCode() {
                // 发送验证码
                if (this.yzmBtnFlag) {
                    return;
                }
                if (!this.loginByFast.loginName || this.loginByFast.loginName.length !== 11) {
                    return;
                }
                if (!(/^1(3|4|5|6|7|8|9)\d{9}$/.test(this.loginByFast.loginName))) {
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
                        mobile: this.loginByFast.loginName,
                        type: 'fastLogin',
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
            }
        },
        computed: {
            disabledFlag() {
                return !(this.loginByPassword.loginName.length && this.loginByPassword.pwd.length >= 6);
            },
            disabledFlag2() {
                return !(this.loginByFast.loginName.length && this.loginByFast.verifyCode.length === 4);
            }
        },
        components: {
            [Dialog.name]: Dialog
        }
    };
</script>
<style  ref="stylesheet/scss" lang="scss" scoped="">
    @import "../../static/styles/rules.scss";
    .person-auth {
        line-height: 44/$ppr;
        font-size: 34/$ppr;
        color: #333;
        text-align: center;
    }
    .m-dialog-btn {
        border-left: 1px solid #ccc;
    }
    .m-login {
        position: relative;
        max-width: 750/$ppr;
        margin: 0 auto;
        background: #fff;
    }
    .login-footer {
        position: absolute;
        bottom: 60/$ppr;
        left: 50%;
        transform: translateX(-50%);
        a {
            font-size: 26/$ppr;
            color: #666;
        }
    }
    .m-login-xy {
        position: absolute;
        top: 910/$ppr;
    }
    .login-box-top {
        height: 612/$ppr;
        background: url('../../static/images/loginBaner.png')  no-repeat;
        background-size: cover;
        background-position:center;
        padding-top:150/$ppr;
        .xe-icon-logo {
            margin: 0 auto;
            width: 130/$ppr;
            height: 130/$ppr;
            background: #048cae;
            color: #fff;
            font-size: 100/$ppr;
            line-height: 140/$ppr;
            text-align: center;
            border-radius: 50%;
        }
        .logo-txt {
            font-size: 28/$ppr;
            color: #048cae;
            text-align: center;
            padding: 30/$ppr 0 ;
        }
    }
    .loin-box-content {
        position: absolute;
        top: 426/$ppr;
        left: 50%;
        min-height: 500/$ppr;
        width: 630/$ppr;
        background: #fff;
        margin: 0;
        border-radius: 5px;
        padding: 32/$ppr 40/$ppr 0 40/$ppr;
        transform: translateX(-50%);
        .ml-list-item {
            border-bottom: 1/$ppr solid #ccc;
        }
        .m-login-btn {
            margin: 80/$ppr 40/$ppr 40/$ppr;
        }
        .quick-login {
            text-align: center;
            >view {
                display: inline;
                >view {
                    position: relative;
                    display: inline-block;
                    padding: 0 28/$ppr;
                    line-height: 32/$ppr;
                    font-size: 26/$ppr;
                    color: #333;
                    &.cor_y520 {
                        color: #048cae
                    }
                    &:not(:last-child):after {
                        content: '';
                        position: absolute;
                        right: 0;
                        top: 50%;
                        margin-top: -11/$ppr;
                        border-right: 1px solid #999;
                        height: 22/$ppr;
                    }
                }
            }
        }
    }
</style>
