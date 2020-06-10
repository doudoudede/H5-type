<template>
    <xe-layout>
        <div class="ml-list ml-list-top50">
            <div class="ml-list-item">
                <div class="con">
                    <input class="input-cls" v-model="reTakeTel" placeholder="输入手机号" type="tel">
                </div>
                <div class="act">
                    <span class="xe-iconfont xe-icon-cuowu" v-show="reTakeTel.length" @click.prevent="reTakeTel = ''"></span>
                </div>
                <div class="getyzm" :class="{'nodisabled': reTakeTel && reTakeTel.length === 11}" @click="getYzmCode">{{isNaN(yzbtnText) ? yzbtnText : yzbtnText + 's'}}</div>
            </div>
            <div class="ml-list-item">
                <div class="con">
                    <input class="input-cls" v-model="reTakeYzm" placeholder="输入验证码" maxlength="4" type="tel">
                </div>
                <div class="act">
                    <span class="xe-iconfont xe-icon-cuowu" v-show="reTakeYzm.length" @click.prevent="reTakeYzm = ''"></span>
                </div>
            </div>
            <div class="ml-list-item">
                <div class="con">
                    <input v-if="pwdType" class="input-cls" v-model="reTakePass" placeholder="输入密码(6-20数字+字母)" type="text">
                    <input v-else class="input-cls" v-model="reTakePass" placeholder="输入密码(6-20数字+字母)" type="password">
                </div>
                <div class="act">
                    <span class="xe-iconfont " :class="[pwdType ? 'xe-icon-yanjing2' : 'xe-icon-yanjing']" @click.prevent="pwdType = !pwdType"></span>
                    <span class="xe-iconfont xe-icon-cuowu" v-if="reTakePass.length" @click.prevent="reTakePass = ''"></span>
                </div>
            </div>
        </div>
        <div class="m-login-btn">
            <mt-button type="primary" :disabled="disabledFlag" class="xe-button-primary" style="width: 100%;" @click.prevent="findPwd">确 定</mt-button>
        </div>
        <!--Dialog-->
        <xe-dialog slot="outer" :show.sync="yzmDialog">
            <div class="yzmcons">
                <div class="yzm-input">
                    <div class="yzm-inputin">
                        <input type="text" v-model="yzmvalue" maxlength="4" placeholder="请输入图形验证码">
                    </div>
                    <div class="yzmimgcon" @click.prevent="getImgCode">
                        <img :src="yzmImgCodeUrl" id="yzmImgsrc">
                    </div>
                </div>
                <div class="yzm-tips">为了您的账户安全，请输入图文验证码！</div>
            </div>
            <template slot="footer">
                <div class="m-dialog-btn cancel" @click="yzmDialogCancel">取消</div>
                <div class="m-dialog-btn sure" @click="yzmDialogSure">确认</div>
            </template>
        </xe-dialog>
    </xe-layout>
</template>
<script type="text/ecmascript-6">
    import {Dialog} from 'components/Dialog/';
    export default {
        name: 'xe-page-retakepassword',
        data() {
            return {
                pwdType: false,
                reTakeTel: '',
                reTakeYzm: '',
                reTakePass: '',
                yzmDialog: false,
                yzmBtnFlag: false,
                yzbtnText: '发送验证码',
                timer: null,
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
                if (!this.reTakeTel || this.reTakeTel.length !== 11) {
                    return;
                }
                if (!(/^1(3|4|5|6|7|8|9)\d{9}$/.test(this.reTakeTel))) {
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
                        mobile: this.reTakeTel,
                        type: 'findPwd',
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
            findPwd() {
                this.$http({
                    method: 'post',
                    url: '/xe-route/xe-app/mobileApp/user/findPwd',
                    data: {
                        loginName: this.reTakeTel,
                        pwd: this.reTakePass,
                        regSource: 3,
                        securitySode: this.reTakeYzm
                    }
                }).then(res => {
                    console.log(res);
                    if (res.data.code === '2000') {
                        this.$toast({
                            message: '找回密码成功,请登录!',
                            duration: 2000
                        });
                        this.$router.go(-1);
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
                return !(this.reTakeTel && this.reTakeTel.length === 11 && this.reTakeYzm && this.reTakeYzm.length === 4 && this.reTakePass && this.reTakePass.length >= 6);
            }
        },
        components: {
            [Dialog.name]: Dialog
        }
    };
</script>
<style rel="stylesheet/scss" lang="scss"></style>
