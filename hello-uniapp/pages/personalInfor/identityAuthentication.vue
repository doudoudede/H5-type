<template>
    <xe-layout  class="m-flexlay person-befor">
        <view>
            <view class="authen-content">
                <view class="authen-tithea">
                    欢迎进行身份认证，您需要操作以下步骤
                </view>
                <view class="authen-flor">
                    <ul>
                        <li class="flor-lis">
                            <view class="flor-tit"><span class="flor-num">1</span>填写基本信息</view>
                            <view class="flor-con">姓名、手机、店铺名称、地址</view>
                        </li>
                        <li class="flor-lis">
                            <view class="flor-tit"><span class="flor-num">2</span>填写业务信息</view>
                            <view class="flor-con">用户类型、性质、主营、证照</view>
                        </li>
                        <li class="flor-lis">
                            <view class="flor-tit"><span class="flor-num">3</span>提交审核</view>
                            <view class="flor-con">选择客户经理</view>
                        </li>
                    </ul>
                </view>
                <view class="authen-mescon">
                    <xe-checkbox size="" v-model="checkedAll">
                        <i>阅读并接受</i><router-link tag="a" :to="{name: 'AuthSupport'}">
                            《如来云商身份认证服务协议》
                        </router-link> <i>所有条款</i>
                    </xe-checkbox>
                </view>
            </view>
            <view class="person-repeat">
                <mt-button class="xe-button-primary" @click.prevent="goCategory">开始身份认证</mt-button>
            </view>
        </view>
    </xe-layout>
</template>
<script type="text/ecmascript-6">
    import {Checkbox, CheckboxGroup} from 'components/Checkbox';
    export default {
        beforeRouteEnter(to, from, next) {
            next(vm => {
                vm.status = vm.$route.query.status;
                if (vm.status === '3') {
                    vm.$router.push({name: 'CertificationDetails'});
                }
            });
        },
        data() {
            return {
                status: 1,
                checkedAll: false
            };
        },
        created() {
        },
        methods: {
            goCategory() {
                if (this.checkedAll) {
                    this.$router.push({name: 'PersonalInfor', query: {status: this.status}});
                } else {
                    this.$xeMessageBox.alert('请先接受如来云商身份认证服务协议，再进行认证');
                }
            }
        },
        components: {
            [Checkbox.name]: Checkbox,
            [CheckboxGroup.name]: CheckboxGroup
        }
    };
</script>
<style rel="stylesheet/scss" lang="scss">
    @import '../../static/styles/rules.scss';
    .person-befor {
        color: #333;
        .scrollview {
            background: #f5f5f5;
        }
        .authen-tithea {
            font-size: 30/$ppr;
            text-align: center;
            padding: 76/$ppr 0 52/$ppr;
        }
        .authen-flor {
            .flor-lis {
                position: relative;
                width: 430/$ppr;
                margin: 0 auto;
                padding: 0 0 50/$ppr 35/$ppr;
            }
            .flor-lis:not(:last-child) {
                &:before{
                    position: absolute;
                    left: 0;
                    top: 60/$ppr;
                    bottom: 0;
                    content: '';
                    background: #f23530;
                    width: 2/$ppr;
                }
            }
            .flor-tit {
                position: relative;
                line-height: 48/$ppr;
                font-size: 36/$ppr;
                .flor-num {
                    display: block;
                    position: absolute;
                    left: -50/$ppr;
                    top: 50%;
                    margin-top: -10/$ppr;
                    width: 30/$ppr;
                    height: 30/$ppr;
                    background: #f23530;
                    color: #fff;
                    font-size: 24/$ppr;
                    text-align: center;
                    line-height: 26/$ppr;
                    border-radius: 50%;
                }
            }
            .flor-con {
                line-height: 40/$ppr;
                font-size: 26/$ppr;
                color: #666;
            }
        }
        .authen-mescon {
            padding: 32/$ppr 0;
            .van-checkbox {
                padding-left: 20/$ppr;
                .xe-iconfont {
                    line-height: 38/$ppr;
                }
            }
            .van-checkbox__label {
                float: left;
                margin-left: 10/$ppr;
            }
            i {
                color: #666;
            }
        }
        .person-repeat {
            margin: 0 20/$ppr;
            .xe-button-primary {
                background: #f23530;
                color: #fff;
                width: 100%;
            }
        }
    }
</style>
