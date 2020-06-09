<template>
    <xe-layout class="m-bg-dark m-flexlay">
        <view class="m-editorphone">
            <view class="m-list-block">
                <ul>
                    <li class="item-content">
                        <view class="item-inner">
                            <view class="item-title">原手机号</view>
                            <view class="item-input">
                                <input type="tel" readonly v-model="onephone" maxlength="11" placeholder="输入原手机号">
                            </view>
                            <!--<view class="act">-->
                                <!--<span class="xe-iconfont xe-icon-cuowu" v-if="onephone.length" @click.prevent="onephone = ''"></span>-->
                            <!--</view>-->
                            <view class="getyzm" :class="{'nodisabled': onephone && onephone.length === 11}" @click="getYzmCode">{{isNaN(yzbtnText) ? yzbtnText : yzbtnText + 's'}}</view>
                        </view>
                    </li>
                    <li class="item-content">
                        <view class="item-inner">
                            <view class="item-title">验证码</view>
                            <view class="item-input">
                                <input type="tel"  v-model="oneyzm" maxlength="4" placeholder="请输入验证码">
                            </view>
                            <view class="act">
                                <span class="xe-iconfont xe-icon-cuowu" v-if="oneyzm.length" @click.prevent="oneyzm = ''"></span>
                            </view>
                        </view>
                    </li>
                </ul>
            </view>
        </view>
        <view class="m-cphone-btn">
            <mt-button type="primary" :disabled="disabledBtn" class="xe-button-primary" style="width: 100%;" @click.prevent="btnfn">下一步</mt-button>
        </view>
        <view class="aboutus-tel" slot="footer"></view>
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
        name: 'xe-page-editorphone',
        data() {
            return {
                onephone: this.$route.query.phone,
                oneyzm: '',
                yzmDialog: false,
                yzmBtnFlag: false,
                yzmvalue: '',
                yzbtnText: '发送验证码',
                timer: null,
                yzmImgCodeUrl: null
            };
        },
        methods: {
            btnfn() {
                this.checkBindMobile();
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
            getYzmCode() {
                // 发送验证码
                if (this.yzmBtnFlag) {
                    return;
                }
                if (!this.onephone || this.onephone.length !== 11) {
                    return;
                }
                if (!(/^1(3|4|5|6|7|8|9)\d{9}$/.test(this.onephone))) {
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
                        mobile: this.onephone,
                        type: 'bindoldphone',
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
            checkBindMobile() {
                this.$http({
                    method: 'post',
                    url: '/xe-route/xe-app/mobile/myIndex/checkBindMobile',
                    data: {
                        loginName: this.onephone,
                        verifyCode: this.oneyzm
                    }
                }).then(res => {
                    if (res.data.code === '2000') {
                        this.$router.push({
                            name: 'EditorPhone2'
                        });
                    } else {
                        this.$toast({
                            message: res.data.msg,
                            duration: 1500
                        });
                    }
                });
            }
        },
        computed: {
            disabledBtn() {
                return !(this.onephone.length === 11 && this.oneyzm.length === 4);
            }
        },
        components: {
            [Dialog.name]: Dialog
        }
    };
</script>
<style rel="stylesheet/scss" lang="scss">
    @import "../../static/styles/rules.scss";
    .m-cphone-btn {
        margin: 40/$ppr 20/$ppr;
    }
    .m-editorphone {
        margin: 20/$ppr 0;
        background: #fff;
        .item-content {
            .item-title {
                width: 135/$ppr;
                font-size: 30/$ppr;
            }
        }
    }
</style>
