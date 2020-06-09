<template>
    <xe-layout  class="m-flexlay certification-details">
        <!--认证成功-->
        <view>
            <view class="m-item">
                <ul>
                    <li class="item-content" >
                        <view class="item-title">姓名</view>
                        <view class="item-after">
                            {{userInfoData.userName ? userInfoData.userName : '未填写'}}
                        </view>
                    </li>
                    <li class="item-content" >
                        <view class="item-title">手机号</view>
                        <view class="item-after">
                            {{userInfoData.userPhone ? userInfoData.userPhone : '未填写'}}
                        </view>
                    </li>
                    <li class="item-content" >
                        <view class="item-title">微信号</view>
                        <view class="item-after">
                            {{userInfoData.wechatNumber ? userInfoData.wechatNumber : '未填写'}}
                        </view>
                    </li>
                </ul>
            </view>
            <view class="m-item">
                <ul>
                    <li class="item-content" >
                        <view class="item-title">店铺名称</view>
                        <view class="item-after">
                            {{userInfoData.shopName ? userInfoData.shopName : '未填写'}}
                        </view>
                    </li>
                    <li class="item-content" >
                        <view class="item-title">店铺地址</view>
                        <view class="item-after">
                            {{userInfoData.provinceName}}{{userInfoData.cityName}}{{userInfoData.areaName}}{{userInfoData.userAddr ? userInfoData.userAddr : '未填写'}}
                        </view>
                    </li>
                </ul>
            </view>
            <view class="m-item">
                <ul>
                    <li class="item-content" >
                        <view class="item-title">用户性质</view>
                        <view class="item-after">
                            {{userInfoData.userProperties | userPropertiesToText}}
                        </view>
                    </li>
                    <li class="item-content" >
                        <view class="item-title">用户类型</view>
                        <view class="item-after">
                            {{userType}}
                        </view>
                    </li>
                    <li class="item-content" >
                        <view class="item-title">主营品类</view>
                        <view class="item-after">
                            {{userInfoData.businessTypeName}}
                        </view>
                    </li>
                </ul>
            </view>
            <view class="m-item">
                <ul>
                    <li class="item-content" >
                        <view class="item-title">身份证</view>
                        <view class="item-after">
                            <p class="text-num" v-if="userInfoData.userIdNumber">{{userInfoData.userIdNumber}}</p>
                            <p class="text-pic" v-if="userInfoData.idCardFrontPic">
                                <img :src="picServer +　userInfoData.idCardFrontPic" alt="">
                                <img :src="picServer +　userInfoData.idCardBackPic" alt="">
                            </p>
                        </view>
                    </li>
                    <li class="item-content" v-if="userInfoData.userProperties !== 1">
                        <view class="item-title">营业执照</view>
                        <view class="item-after">
                            <p class="text-pic" v-if="userInfoData.businessPic && userInfoData.businessPic.length">
                                <img v-for="item in userInfoData.businessPic" :src="picServer +　item" alt="">
                            </p>
                        </view>
                    </li>
                    <li class="item-content" >
                        <view class="item-title">食品流通许可证</view>
                        <view class="item-after">
                            <template>
                                <p class="text-pic" v-if="userInfoData.foodLicensePic">
                                    <img :src="picServer +　userInfoData.foodLicensePic" alt="">
                                </p>
                                <p v-else>未上传</p>
                            </template>
                        </view>
                    </li>
                    <li class="item-content" >
                        <view class="item-title">CS认证</view>
                        <view class="item-after">
                            <template>
                                <p class="text-pic" v-if="userInfoData.csPic">
                                    <img :src="picServer +　userInfoData.csPic" alt="">
                                </p>
                                <p v-else>未上传</p>
                            </template>
                        </view>
                    </li>
                    <li class="item-content" >
                        <view class="item-title">门头照</view>
                        <view class="item-after">
                            <template>
                                <p class="text-pic" v-if="userInfoData.doorPic && userInfoData.doorPic.length">
                                    <img v-for="item in userInfoData.doorPic" :src="picServer +　item" alt="">
                                </p>
                                <p v-else>未上传</p>
                            </template>
                        </view>
                    </li>
                </ul>
            </view>
            <view class="m-item">
                <ul>
                    <li class="item-content" >
                        <view class="item-title">客户经理</view>
                        <view class="item-after">
                            {{userInfoData.saleManNameAndPhone ? userInfoData.saleManNameAndPhone : '未填写'}}
                        </view>
                    </li>
                </ul>
            </view>
            <view class="person-repeat">
                <mt-button class="xe-button-primary" @click.prevent="goCategory">重新认证</mt-button>
            </view>
        </view>
    </xe-layout>
</template>
<script type="text/ecmascript-6">
    export default {
        data() {
            return {
                status: 1,
                picServer: '',
                userInfoData: {},
                userType: '', // 用户类型回显
                checkedAll: true,
                userTypeData: []
            };
        },
        created() {
            this.getAuthentication();
        },
        methods: {
            getUserType() { // 获取用户类型
                this.$http({
                    method: 'post',
                    url: '/xe-route/xe-app/mobileApp/checkIdentity/getUserType',
                    data: {}
                }).then(res => {
                    this.userTypeData = res.data.categoryList;
                    if (this.userInfoData.userTypeId) {
                        // 用户类型回显
                        this.userTypeData.find(item => {
                            if (parseInt(item.typeId) === parseInt(this.userInfoData.userTypeId)) {
                                this.userType = item.typeName;
                                return true;
                            }
                        });
                    } else {
                        this.userType = '';
                    }
                }).catch(error => {
                    console.log(error);
                });
            },
            getAuthentication() {
                let params = {};
                this.$http({
                    method: 'post',
                    url: '/xe-route/xe-app/mobileApp/checkIdentity/getAuthentication',
                    data: params
                }).then(res => {
                    this.getUserType();
                    this.picServer = res.data.picServer;
                    this.userInfoData = res.data.userInfo;
                });
            },
            goCategory() {
                this.$router.push({
                    name: 'PersonalInfor',
                    query: {
                        status: '3'
                    }
                });
            }
        }
    };
</script>
<style rel="stylesheet/scss" lang="scss">
    @import '../../static/styles/rules.scss';
    .certification-details {
        color: #333;
        .scrollview {
            padding-top: 20/$ppr;
            background: #f5f5f5;
        }
        .m-item {
            background: #fff;
            margin-bottom: 20/$ppr;
            padding-left: 36/$ppr;
            font-size: 32/$ppr;
            .item-content {
                display: flex;
                justify-content: space-between;
                padding: 28/$ppr 36/$ppr 28/$ppr 0;
                .item-title {
                    min-width: 150/$ppr;
                }
                .item-after {
                    color: #666;
                    .text-num {
                        text-align: right;
                        margin-bottom: 20/$ppr;
                    }
                    .text-pic {
                        text-align: right;
                        img {
                            display: inline-block;
                            width: 130/$ppr;
                            height: 130/$ppr;
                            margin-left: 40/$ppr;
                            border: 1px solid #ccc;
                        }
                    }
                }
            }
            .item-content:not(:last-child) {
                border-bottom: 1px solid #e8e8e8;
            }
        }
        .person-repeat {
            margin: 20/$ppr;
            .xe-button-primary {
                background: #f23530;
                color: #fff;
                width: 100%;
            }
        }
    }
</style>
