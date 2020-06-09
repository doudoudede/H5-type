<template>
    <view>
        <!--基本信息-->
        <view class="content-flor">
            <view class="m-cell">
                <ul>
                    <li class="item-content">
                        <view class="item-inner">
                            <view class="item-title">姓&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;名&nbsp;</view>
                            <view class="item-input">
                                <input type="text" ref='userName' v-model="basicInfo.userName" maxlength="10" placeholder="请填写真实姓名">
                            </view>
                        </view>
                    </li>
                    <li class="item-content">
                        <view class="item-inner">
                            <view class="item-title">手&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;机&nbsp;</view>
                            <view class="item-input">
                                <input type="tel" ref='userPhone' v-model="basicInfo.userPhone" maxlength="11" placeholder="请输入手机号">
                            </view>
                            <view class="getyzm" :class="{'nodisabled': basicInfo.userPhone && basicInfo.userPhone.length === 11}" @click="getYzmCode">{{isNaN(yzbtnText) ? yzbtnText : yzbtnText + 's'}}</view>
                        </view>
                    </li>
                    <li class="item-content" v-if="yzmFlagjy">
                        <view class="item-inner">
                            <view class="item-title">验&nbsp;证&nbsp;码&nbsp;</view>
                            <view class="item-input">
                                <input type="tel" ref='verifyCode' v-model="basicInfo.verifyCode" maxlength="4" placeholder="请输入验证码">
                            </view>
                        </view>
                    </li>
                    <li class="item-content">
                        <view class="item-inner">
                            <view class="item-title">微&nbsp;信&nbsp;号&nbsp;</view>
                            <view class="item-input">
                                <input type="text" ref='wechatNumber' v-model="basicInfo.wechatNumber" maxlength="20" placeholder="填写微信号(选填)">
                            </view>
                        </view>
                    </li>
                    <li class="item-content">
                        <view class="item-inner">
                            <view class="item-title">店铺名称</view>
                            <view class="item-input">
                                <input type="text" ref='shopName' v-model="basicInfo.shopName" maxlength="20" placeholder="请填写店铺名称">
                            </view>
                        </view>
                    </li>
                </ul>
            </view>
        </view>
        <view class="content-flor">
            <view class="m-cell">
                <ul>
                    <li class="item-content item-link" @click="chooseCity">
                        <view class="item-inner">
                            <view class="item-title">店铺地址</view>
                            <view class="item-after" :class="{'c333': adrAreaShopStr}">
                                {{adrAreaShopStr ? adrAreaShopStr : '请选择店铺地址'}}
                            </view>
                        </view>
                    </li>
                    <li class="item-content">
                        <view class="item-inner">
                            <view class="item-text">
                                <textarea ref='userAddr' style="width: 100%; height: 1rem; line-height: 1.4;" maxlength="40" v-model='basicInfo.userAddr' placeholder="请输入店铺详细地址"></textarea>
                            </view>
                        </view>
                    </li>
                </ul>
            </view>
        </view>
        <!--Dialog-->
        <xe-dialog :show.sync="yzmDialog">
            <view class="yzmcons">
                <view class="yzm-input">
                    <view class="yzm-inputin">
                        <input type="text" v-model="imgverifyCode" maxlength="4" placeholder="请输入图形验证码">
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
        <!--地址插件-->
        <xe-popup
            :show.sync="showadrpop"
            popupTit="店铺地址"
            position="bottom">
            <CitySelect
                v-model="defaultAdrs"
                :show.sync="showadrpop"
                @on-adr-change="adrChange"
            ></CitySelect>
        </xe-popup>
    </view>
</template>
<script type="text/ecmascript-6">
    import {mapState, mapMutations} from 'vuex';
    import {Dialog} from 'components/Dialog/';
    import {Popup} from 'components/Popup';
    import {CitySelect} from 'components/CitySelect/';
    export default {
        name: 'flortOne',
        data() {
            return {
                showadrpop: false,
                showadr: true,
                yzbtnText: '发送验证码',
                yzmImgCodeUrl: null,
                yzmBtnFlag: false,
                yzmDialog: false,
                yzmFlagty: false, // 检验验证码是否正确
                yzmFlagjy: false, // 检验验证码是否发送
                adrAreaShopStr: '',
                imgverifyCode: '', // 图形验证码
                basicInfo: {
                    userName: '', // 姓名
                    userPhone: '', // 电话号码
                    verifyCode: '', // 验证码
                    wechatNumber: '', // 微信号
                    shopName: '', // 店铺名称
                    provinceId: '', // 店铺地址 省
                    cityId: '', // 店铺地址 市
                    areaId: '', // 店铺地址 区
                    userAddr: '' // 店铺详细地址
                },
                userInfoData: {},
                defaultAdrs: []
            };
        },
        created() {
            let userInfoData = this.$getLocalStorage('userInfoData');
            if (userInfoData) {
                let info = JSON.parse(userInfoData);
                this.userInfoData = info.userInfo;
                Object.keys(this.userInfoData).find(item => {
                    Object.keys(this.basicInfo).find(items => {
                        if (item === items) {
                            this.basicInfo[items] = this.userInfoData[item];
                        }
                    });
                });
                if (this.basicInfo.provinceId && this.basicInfo.cityId && this.basicInfo.areaId) {
                    this.defaultAdrs = [this.basicInfo.provinceId, this.basicInfo.cityId, this.basicInfo.areaId];
                    let value = [
                        {
                            areaId: this.userInfoData.provinceId,
                            areaName: this.userInfoData.provinceName
                        },
                        {
                            areaId: this.userInfoData.cityId,
                            areaName: this.userInfoData.cityName
                        },
                        {
                            areaId: this.userInfoData.areaId,
                            areaName: this.userInfoData.areaName
                        }
                    ];
                    this.adrChange(value);
                }
            } else {
                if (this.$route.query.mobile) {
                    this.basicInfo.userPhone = this.$route.query.mobile;
                } else {
                    this.getMobile();
                }
            }
        },
        methods: {
            ...mapMutations('authPerson', {
                basicSetArea: 'setBasicArea'
            }),
            adrChange(value) {
                this.basicSetArea(value);
            },
            getMobile() {
                this.$http({
                    method: 'post',
                    url: '/xe-route/xe-app/mobileApp/checkIdentity/getMobile',
                    data: {}
                }).then(res => {
                    console.log(res);
                    this.basicInfo.userPhone = res.data.mobile;
                }).catch(error => {
                    console.log(error);
                });
            },
            submitInfo() {
                // 错误提示str
                let flag = false;
                let errorTips = {
                    userName: '请填写真实姓名', // 姓名
                    userPhone: '请输入手机号', // 电话号码
                    verifyCode: '请输入验证码', // 验证码
                    shopName: '请输入店铺名称', // 店铺名称
                    provinceId: '请选择店铺地址', // 店铺地址 省
                    cityId: '请选择店铺地址', // 店铺地址 市
                    areaId: '请选择店铺地址', // 店铺地址 区
                    userAddr: '请输入店铺详细地址' // 店铺详细地址
                };
                Object.keys(this.basicInfo).find(item => {
                    if (item !== 'wechatNumber') {
                        if (item === 'userPhone') {
                            if (!this.basicInfo[item] || !(/^1(3|4|5|6|7|8|9)\d{9}$/.test(this.basicInfo.userPhone))) {
                                this.$toast({
                                    message: '请输入正确的手机号',
                                    duration: 1500
                                });
                                flag = false;
                                return true;
                            }
                        } else if (item === 'verifyCode') {
                            if (!this.yzmFlagjy) {
                                this.$toast({
                                    message: '请先获取验证码',
                                    duration: 2000
                                });
                                flag = false;
                                return true;
                            }
                        } else {
                            if (!this.basicInfo[item] && errorTips[item]) {
                                console.log('item-->', item);
                                this.$toast({
                                    message: errorTips[item],
                                    duration: 2000
                                });
//                                if (item !== 'provinceId' && item !== 'cityId' && item !== 'areaId') {
//                                    this.$refs[item].focus();
//                                }
                                flag = false;
                                return true;
                            }
                        }
                        flag = true;
                    }
                });
                return {
                    flag: flag,
                    step: 1,
                    verifyCode: this.basicInfo.verifyCode,
                    userPhone: this.basicInfo.userPhone
                };
            },
            chooseCity() {
                this.showadrpop = true;
            },
            yzmDialogCancel() {
                this.yzmDialog = false;
                this.basicInfo.verifyCode = '';
            },
            yzmDialogSure() {
                if (!this.imgverifyCode) {
                    this.$toast({
                        message: '请输入图形验证码',
                        position: 'bottom'
                    });
                    return;
                }
                // this.checkSmsMsg();
                if (!this.yzmFlagty) {
                    this.getYzmCode();
                }
            },
            getYzmCode() {
                // 发送验证码
                if (this.yzmBtnFlag) {
                    return;
                }
                if (!this.basicInfo.userPhone || this.basicInfo.userPhone.length !== 11) {
                    return;
                }
                if (!(/^1(3|4|5|6|7|8|9)\d{9}$/.test(this.basicInfo.userPhone))) {
                    this.$toast({
                        message: '请输入正确的手机号',
                        duration: 1500
                    });
                    return;
                } else {
                    this.checkPhone((status) => {
                        if (status === true) {
                            this.yzmFlagjy = true;
                            this.yzbtnText = '发送中';
                            this.yzmBtnFlag = true;
                            this.$http({
                                method: 'post',
                                url: '/xe-route/xe-app/mobileApp/user/sendMsg',
                                data: {
                                    mobile: this.basicInfo.userPhone,
                                    type: 'authentication',
                                    checkcode: this.imgverifyCode
                                }
                            }).then(res => {
                                this.yzmvalue = '';
                                this.yzmDialog = false;
                                if (res.data.code === '2000') {
                                    this.yzbtnText = 60;
                                    this.yzmDialog = false;
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
                                    this.yzmDialog = true;
                                    this.getImgCode();
                                } else {
                                    this.yzbtnText = '重新获取';
                                    this.yzmBtnFlag = false;
                                    this.$toast({
                                        message: res.data.msg,
                                        duration: 2000
                                    });
                                }
                                this.imgverifyCode = '';
                            }).catch(error => {
                                console.log(error);
                                clearInterval(this.timer);
                                this.yzbtnText = '重新获取';
                                this.yzmBtnFlag = false;
                                this.yzmDialog = false;
                                this.yzmvalue = '';
                            });
                        } else {
                            return;
                        }
                    });
                }
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
            checkSmsMsg() {
                this.$http({
                    method: 'post',
                    url: '/xe-route/xe-app/mobileApp/checkIdentity/checkSmsMsg',
                    data: {
                        verifyCode: this.basicInfo.verifyCode,
                        userPhone: this.basicInfo.userPhone
                    }
                }).then(res => {
                    console.log(res);
                    if (res.data.remote.status !== '0000') {
                        // 校验不通过
                        this.$toast({
                            message: res.data.remote.msg,
                            duration: 3000
                        });
                        this.yzmFlagty = false;
                    } else {
                        // 校验通过
                        this.yzmFlagty = true;
                        this.yzmDialog = false;
                    }
                }).catch(error => {
                    console.log(error);
                });
            },
            checkPhone(call) { // 校验电话号码是否重复
                this.$http({
                    method: 'post',
                    url: '/xe-route/xe-app/mobileApp/checkIdentity/checkPhone',
                    data: {
                        userPhone: this.basicInfo.userPhone
                    }
                }).then(res => {
                    console.log(res);
                    if (res.data.remote.status !== '0000') {
                        // 校验不通过
                        this.$xeMessageBox({
                            title: '提示',
                            message: res.data.remote.msg,
                            closeOnClickModal: false,
                            showCancelButton: true,
                            cancelButtonText: '取消',
                            confirmButtonText: '联系客服'
                        }).then(action => {
                            console.log(action);
                            if (action === 'confirm') {
                                setTimeout(() => {
                                    window.location.href = 'tel:400-662-6366';
                                }, 16);
                            }
                        });
                        call && call(false);
                    } else {
                        // 校验通过
                        call && call(true);
                    }
                }).catch(error => {
                    console.log(error);
                });
            }
        },
        computed: {
            ...mapState('authPerson', ['basicArea'])
        },
        watch: {
            basicArea(val) {
                console.log('---', val);
                this.basicInfo = Object.assign(this.basicInfo, {
                    provinceId: val[0].areaId,
                    cityId: val[1].areaId,
                    areaId: val[2].areaId
                });
                this.adrAreaShopStr = `${val[0].areaName}${val[1].areaName}${val[2].areaName}`;
            },
            showadrpop(n) {
                this.$bus.$emit('chooseCity', n);
            }
        },
        components: {
            [Dialog.name]: Dialog,
            [Popup.name]: Popup,
            CitySelect
        },
        destroyed() {
            // this.$bus.$off('chooseCity');
        }
    };
</script>
