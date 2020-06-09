<template>
    <xe-layout class="m-flexlay m-bg-dark">
        <view class="personInfor-box">
            <!--进度条 class名为person-stepBox的增加class名字显示对应的步骤条step-progress-one、step-progress-two、step-progress-three、step-progress-four-->
            <!-- step -->
            <view class="m-user-step">
                <xe-step :current="stepCurrent">
                    <xe-step-item>
                        <span slot="text">基本信息</span>
                    </xe-step-item>
                    <xe-step-item>
                        <span slot="text">业务信息</span>
                    </xe-step-item>
                    <xe-step-item>
                        <span slot="text">提交审核</span>
                    </xe-step-item>
                </xe-step>
            </view>
            <!--具体内容区域-->
            <view class="person-content">
                <keep-alive>
                    <component v-if="componentflag" :is="currentView" ref='currentComponent'></component>
                </keep-alive>
            </view>
        </view>
        <view v-show='btnshow' class="person-button" slot="footer">
            <mt-button class="xe-button-white" @click="stepPrevFn" style="width: 50%;">{{stepCurrent === 1 ? '返回': '返回上一步'}}</mt-button>
            <mt-button type="primary" class="xe-button-primary" :loading="subLoading" @click="stepNextFn" style="width: 50%;background: #f53226" >{{stepCurrent >= 3 ? '提交审核': '下一步'}}</mt-button>
        </view>
    </xe-layout>
</template>
<script type="text/ecmascript-6">
    import { Step, StepItem } from 'components/Step/';
    import flortOne from './flortOne';
    import flortTwo from './flortTwo';
    import flortThree from './flortThree';
    export default {
        components: {
            [Step.name]: Step,
            [StepItem.name]: StepItem,
            flortOne,
            flortTwo,
            flortThree
        },
        beforeRouteEnter(to, from, next) {
            next(vm => {
                vm.perStatus = vm.$route.query.status;
                if (vm.perStatus === '3' || vm.perStatus === '4') {
                    let params = {};
                    vm.$http({
                        method: 'post',
                        url: '/xe-route/xe-app/mobileApp/checkIdentity/getAuthentication',
                        data: params
                    }).then(res => {
//                        vm.userInfoData = res.data.userInfo;
                        vm.$setLocalStorage('userInfoData', JSON.stringify(res.data));
                        vm.componentflag = true;
                    });
                } else {
                    vm.componentflag = true;
                    vm.$removeLocalStorage('userInfoData');
                    vm.userInfoDataOld = null;
                }
            });
        },
        data() {
            return {
                componentflag: false,
                btnshow: true,
                perStatus: '',
                showadr: false,
                basicInfo: {},
                formDatas: {},
                userInfo: {},
                formSubData: {},
                subLoading: false,
                stepCurrent: 1,
                userInfoDataOld: null,
                userInfoData: {}, // 回显数据
                currentView: 'flortOne'
            };
        },
        mounted () {
            this.userInfoDataOld = this.$getLocalStorage('userInfoData');
            if (this.userInfoDataOld !== null) {
                // this.getbaseInfo();
            }
            this.$bus.$on('chooseCity', (val) => {
                this.showadr = true;
                this.btnshow = !val;
            });
            this.$bus.$on('dailogshow', value => {
                this.btnshow = !value;
            });
        },
        methods: {
            stepPrevFn() {
                // 返回
                if (this.stepCurrent <= 1) {
                    if (this.$route.query.loginStatus) {
                        // 与原生传递消息
                        if (window.postMessage) {
                            window.postMessage(JSON.stringify({type: 'special', payload: {goPage: 'back'}}), '*');
                        };
                        return;
                    } else {
                        window.history.length > 1 ? this.$router.back() : this.$router.replace('/my');
                        return;
                    }
                }
                this.stepCurrent--;
                this.currentView = this.getCurrentView;
            },

            stepNextFn() {
                // 下一步
                if (this.stepCurrent >= 3) {
                    if (this.$refs.currentComponent.userInfo) {
                        this.userInfo = this.$refs.currentComponent.userInfo;
                    }
                    this.formSubData = Object.assign(this.basicInfo, this.formDatas, this.userInfo);
                    this.insertIdentity();
                    return;
                }
                // 组件内提交信息
                let submitInfoData = this.$refs.currentComponent.submitInfo();
                if (this.$refs.currentComponent.basicInfo) {
                    this.basicInfo = this.$refs.currentComponent.basicInfo;
                }
                if (this.$refs.currentComponent.formDatas) {
                    this.formDatas = this.$refs.currentComponent.formDatas;
                }
                if (submitInfoData.flag) {
                    if (submitInfoData.step === 1) {
                        this.checkSmsMsg(submitInfoData.verifyCode, submitInfoData.userPhone, res => {
                            console.log(res);
                            if (res.data.remote.status !== '0000') {
                                // 校验不通过
                                this.$toast({
                                    message: res.data.remote.msg,
                                    duration: 3000
                                });
                            } else {
                                // 校验通过
                                console.log('通过了');
                                this.stepCurrent++;
                                this.currentView = this.getCurrentView;
                            }
                        });
                    } else {
                        this.stepCurrent++;
                        this.currentView = this.getCurrentView;
                    }
                };
            },
            checkSmsMsg(verifyCode, userPhone, fn) {
                this.$http({
                    method: 'post',
                    url: '/xe-route/xe-app/mobileApp/checkIdentity/checkSmsMsg',
                    data: {
                        verifyCode: verifyCode,
                        userPhone: userPhone
                    }
                }).then(res => {
                    fn && fn(res);
                }).catch(error => {
                    console.log(error);
                });
            },
            // getbaseInfo() {
            //     // 银行卡获取
            //     this.$http({
            //         method: 'post',
            //         url: 'xe-route/xe-sdk/xePay/bankCard/v1_0/baseInfo',
            //         data: {}
            //     }).then(res => {
            //         console.log(res);
            //         this.userBankCount = res.data.userBankCount;
            //     }).catch(error => {
            //         console.log(error);
            //     });
            // },
            insertIdentity() {
                // 实名认证信息提交
                if (this.userInfoDataOld !== null) {
                    let info = JSON.parse(this.userInfoDataOld).userInfo;
                    if (((this.formSubData.userName !== info.userName) || (this.formSubData.userIdNumber !== info.userIdNumber)) && this.userBankCount > 0) {
                        this.$xeMessageBox.confirm('由于您修改了姓名或身份证号，您的银行卡将被解绑，确定提交？').then(() => {
                            this.identityPost();
                            // alert('1');
                        }).catch(error => {
                            console.log(error);
                        });
                    } else {
                        this.identityPost();
                        // alert('2');
                    }
                } else {
                    this.identityPost();
                    // alert('3');
                }
            },
            identityPost() {
                this.$indicator.open('提交中...');
                let URL = '';
                let params = {};
                if (this.$route.query.status === '3' || this.$route.query.status === '4') {
                    URL = '/xe-route/xe-app/mobileApp/checkIdentity/updateIdentity';
                } else {
                    URL = '/xe-route/xe-app/mobileApp/checkIdentity/insertIdentity';
                }
                params = this.formSubData;
                this.subLoading = true;
                this.$http({
                    method: 'post',
                    url: URL,
                    data: params
                }).then(res => {
                    this.subLoading = false;
                    this.$indicator.close();
                    this.$router.push({
                        name: 'AuFailure',
                        query: {
                            status: 1
                        }
                    });
                }).catch(error => {
                    console.log(error);
                    this.$indicator.close();
                    this.subLoading = false;
                });
            }
        },
        computed: {
            getCurrentView() {
                let arr = ['flortOne', 'flortTwo', 'flortThree'];
                return arr[this.stepCurrent - 1];
            }
        }
    };
</script>
<style rel="stylesheet/scss" lang="scss">
    @import "../../static/styles/rules.scss";
    .personInfor-box {
        .m-user-step {
            background: #fff;
            margin-bottom: 20/$ppr;
            padding: 50/$ppr 0 30/$ppr 0;
        }
    }
    .person-content {
        .content-flor {
            background: #fff;
            margin-bottom: 20/$ppr;
        }
        .item-input3 {
            font-size: 32/$ppr;
        }
    }
    .person-button {
       display: flex;
        .xe-button-white,.xe-button-primary {
            border-radius: 0;
        }
    }
</style>
