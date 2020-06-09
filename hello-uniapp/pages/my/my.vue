<template>
    <xe-layout class="m-bg-dark m-flexlay my-new-style" ref="layout">
        <!-- <view id="fixedTop">
            <view class="m-index-search">
                <view class="m-index-search-cover xe-gradient-color" :style="{opacity: searchOpacity}"></view>
                    <view class="headerbtns" v-if="loginStatus">
                        <router-link tag="view" :to="{name: 'Message'}" class="xe-iconfont xe-icon-xiaoxi">
                            <em v-show="showcircle" class="xx-circle"></em>
                        </router-link>
                        <router-link tag="view" :to="{name: 'Setting', query: {phone: userInfo.mobile}}" class="xe-iconfont xe-icon-settings"></router-link>
                    </view>
            </view>
        </view> -->
        <view class="m-my-header">
            <view class="m-my-header-top">
                <view class="headerbtns" v-if="loginStatus">
                    <router-link tag="view" :to="{name: 'Message'}" class="xe-iconfont xe-icon-xiaoxi">
                        <em v-show="showcircle" class="xx-circle"></em>
                    </router-link>
                    <router-link tag="view" :to="{name: 'Setting', query: {phone: userInfo.mobile}}" class="xe-iconfont xe-icon-settings"></router-link>
                </view>
                <view class="m-user-msg m-content-view person-auth-style" @click.prevent="toUserInfo">
                    <view class="pic">
                        <img src="../../static/images/u-01.png" alt="">
                    </view>
                    <view v-show="!noLogin" class="msg">
                        <view class="name" v-if="userInfo.shopName">{{userInfo.shopName}}</view>
                        <!-- <view class="name" v-if="userInfo.shopName && authPerson.status === 3">{{userInfo.shopName}}</view> -->
                        <view class="num">{{userInfo.mobile.substr(0, 3) + '****' + userInfo.mobile.substr(7)}}
                            <view v-if="loginStatus" class="auth-lab" @click.stop="toPerson">
                                <span class="xe-iconfont xe-icon-renzheng1"></span>
                                <template v-if="authPerson.status === '3'">已认证</template>
                                <template v-else>身份认证</template>
                                <span class="xe-iconfont xe-icon-unfold"></span>
                            </view>
                        </view>
                    </view>
                    <view v-show="noLogin" class="msg f32 arrow-right-commons">
                        登录/注册
                    </view>
                </view>
            </view>
            <view class="m-my-header-bot">
                <view class="m-my-item" style="width:100%">
                    <view class="m-list-block">
                        <ul>
                            <li class="item-content">
                                <view class="item-inner" style="background:#fff">
                                    <view class="item-title">我的钱包</view>
                                </view>
                                <view class="item-inner"  style="background:#fff;margin-left:178px">
                                <!-- <view class="item-title" @click.prevent="toSeller"  style="padding-left:120px;color: darkgray;font-weight: 400;">实名认证></view> -->
                            </view>
                            </li>
                        </ul>
                        <view class="m-my-navs">
                            <a @click.prevent="navToCoupon">
                                <view class="user-number">{{userInfo.couponCount ? userInfo.couponCount : 0}}</view>
                                <view class="user-item">我的奖励</view>
                            </a>
                            <a @click.prevent="navToCoupon">
                                <view class="user-number">{{userInfo.couponCount ? userInfo.couponCount : 0}}</view>
                                <view class="user-item">优惠券</view>
                            </a>
                            <a @click.prevent="navToMyBankList">
                                <view class="user-number">{{userBankCount ? userBankCount : 0}}</view>
                                <view class="user-item">银行卡</view>
                            </a>
                        </view>
                    </view>
                </view>
                <!-- <a @click.prevent="navToCoupon">
                    <view class="user-number">{{userInfo.couponCount ? userInfo.couponCount : 0}}</view>
                    <view class="user-item">优惠券</view>
                </a>
                <a @click.prevent="navToMyBankList">
                    <view class="user-number">{{userBankCount ? userBankCount : 0}}</view>
                    <view class="user-item">银行卡</view>
                </a> -->
            </view>
        </view>
        <view class="m-my-item" style="margin-top:1rem">
            <view class="m-list-block">
                <ul>
                    <li class="item-content">
                        <view class="item-inner" style="background:#fff">
                            <view class="item-title">我的订单</view>
                        </view>
                        <view class="item-inner" @click.prevent="navToOrder(0)" style="background:#fff;">
                            <view class="item-title"  style="padding-left:120px;color: darkgray;font-weight: 400;">全部订单></view>
                        </view>
                    </li>
                </ul>
            </view>
            <view class="m-my-navs">
                <view @click.prevent="navToOrder(5)">
                    <view class="pic">
                        <img src="../../static/images/u-02.png" alt="">
                        <view class="badge" v-if="userInfo.notPayCount > 0">{{userInfo.notPayCount}}</view>
                    </view>
                    <view class="text">待付款</view>
                </view>
                <view @click.prevent="navToOrder(3)">
                    <view class="pic">
                        <img src="../../static/images/u-03.png" alt="">
                        <view class="badge" v-if="userInfo.payCount > 0">{{userInfo.payCount}}</view>
                    </view>
                    <view class="text">待发货</view>
                </view>
                <view @click.prevent="navToOrder(2)">
                    <view class="pic">
                        <img src="../../static/images/u-04.png" alt="">
                        <view class="badge" v-if="userInfo.deliverCount > 0">{{userInfo.deliverCount}}</view>
                    </view>
                    <view class="text">待收货</view>
                </view>
            </view>
            <view class="my-logistics"  v-if="orderLogisticsInfo"  @click.prevent="queryLogistic(orderLogisticsInfo.orderIdStr)">
                <view class="my-logistics-left">
                    <p class="text">最新物流</p>
                    <p class="time">{{orderLogisticsInfo.createDateStr.split(' ')[0].split('-').slice(1).join('-')}}</p>
                </view>
                <view class="my-logistics-right">
                    <view class="img">
                        <img :src="orderLogisticsInfo.picServer + orderLogisticsInfo.proImage" alt="">
                    </view>
                    <view class="msg">
                        <view class="status">
                            <em class="xe-iconfont" :class="classObject"></em>{{orderLogisticsInfo.logtsStatus | logtsStatusToText}}
                        </view>
                        <view class="tips">
                            {{orderLogisticsInfo.logtsDesc}}
                        </view>
                    </view>
                </view>
            </view>
        </view>
        <view class="m-my-item">
            <view class="m-list-block">
                <ul>
                    <!-- <li class="item-content item-link align-right">
                        <view class="item-inner" style="background:#fff">
                            <view class="item-title f32">我的意向单</view>
                        </view>
                    </li> -->
                </ul>
            </view>
            <!-- <view class="m-my-navs">
                <view @click.prevent="navToInquiry(1)">
                    <view class="pic">
                        <img src="../../static/images/u-06.png" alt="">
                        <view class="badge" v-if="userInfo.confirmCountWish > 0">{{userInfo.confirmCountWish}}</view>
                    </view>
                    <view class="text">待确认</view>
                </view>
                <view @click.prevent="navToInquiry(2)">
                    <view class="pic">
                        <img src="../../static/images/u-07.png" alt="">
                        <view class="badge" v-if="userInfo.finishCountWish > 0">{{userInfo.finishCountWish}}</view>
                    </view>
                    <view class="text">已完成</view>
                </view>
                <view @click.prevent="navToInquiry(3)">
                    <view class="pic">
                        <img src="../../static/images/u-08.png" alt="">
                        <view class="badge" v-if="userInfo.loseCountWish > 0">{{userInfo.loseCountWish}}</view>
                    </view>
                    <view class="text">已失效</view>
                </view>
                <view @click.prevent="navToInquiry(1)">
                    <view class="pic">
                        <img src="../../static/images/u-09.png" alt="">
                    </view>
                    <view class="text">全部意向单</view>
                </view>
            </view> -->
        </view>
        <view class="my-userlist-content">
            <ul>
                <!-- <li @click.prevent="navToWallet">
                    <span class="xe-iconfont xe-icon-wodezhanghu"></span>
                    <view>我的账户</view>
                </li> -->
                <!-- <li @click.prevent="navToMyAuction">
                    <span class="xe-iconfont xe-icon-jingpai"></span>
                    <view>我的竞拍</view>
                </li> -->
                <!-- <li @click.prevent="navToInquiryList">
                    <span class="xe-iconfont xe-icon-xunjiadan3"></span>
                    <view>询价单</view>
                </li> -->
                
                <!-- <li>
                    <a href="tel:400-662-6366" >
                        <span class="xe-iconfont xe-icon-dianhua1"></span>
                        <view>热线电话</view>
                        <view>400-662-6366&nbsp;&nbsp;&nbsp;</view>
                    </a>
                </li> -->
                <li @click.prevent="extension">
                    <span class="xe-iconfont xe-icon-yijianfankui1"></span>
                    <view>我要推广</view>
                    
                </li>
                <!-- <li @click.prevent="toKeFu">
                    <span class="xe-iconfont icon-zaixiankefu"></span>
                    <view>在线客服</view>
                </li> -->
                <li @click.prevent="toPartner">
                    <span class="xe-iconfont xe-icon-yijianfankui1"></span>
                    
                    <view>成为合伙人</view>
                    <i style="padding-right:100px">{{msg1}}</i>
                </li>
                <li @click.prevent="toSeller">
                    <span class="xe-iconfont xe-icon-yijianfankui1"></span>
                    
                    <view>成为卖家</view>
                    <i style="padding-right:100px">{{msg}}</i>
                </li>
                
                <li @click.prevent="navToAdrList">
                    <span class="xe-iconfont xe-icon-dizhi"></span>
                    <view>收货地址</view>
                </li>
                <li @click.prevent="feedback">
                    <span class="xe-iconfont xe-icon-yijianfankui1"></span>
                    <view>意见反馈</view>
                </li>
            </ul>
        </view>
        <xe-logistics slot="outer" :show.sync="logisticsVisible" :datas="logisticInfo"></xe-logistics>
    </xe-layout>
</template>
<script type="text/ecmascript-6">
    import logistics from 'components/LogisticsList/LogisticsList';
    export default {
        name: 'xe-page-my',
        data() {
            return {
                userBankCount: '',
                searchOpacity: 0,
                loginStatus: '',
                userPhone: '',
                noLogin: null,
                logisticsVisible: false,
                orderLogisticsInfo: null,
                logisticInfo: {},
                userInfo: {
                    shopName: '',
                    mobile: '',
                    userAmount: '0.00', // 余额
                    accountBank: 0, // 银行卡数
                    notPayCount: 0, // 我的订单-待付款订单总数
                    payCount: 0, // 我的订单-待发货订单总数
                    deliverCount: 0, // 我的订单-待收货订单总数
                    notPayCountInquiry: 0, // 我的询价单-待询价
                    payCountInquiry: 0, // 我的询价单-询价中
                    deliverCountInquiry: 0, // 我的询价单-已报价
                    couponCount: 0 // 优惠券总数
                },
                showcircle: false,
                authPerson: {},
                msg:'',
                msg1:''
            };
        },
        created() {
            this.loginStatus = this.$getLocalStorage('LOGINSTATUS');
            console.log('this.loginStatus', this.loginStatus);
            this.queryMyInfoIndex();
            this.queryReadFlagCount();
            if (this.loginStatus && this.loginStatus !== 'undefined') {
                this.getStatus();
                // this.getbaseInfo();
            }
        },
        mounted() {
            this.$refs.layout.$el.querySelector('.scrollview').onscroll = this.searchBg;
            this.searchBg();
            this.getResult()
        },
        methods: {
            getResult(){
            this.$http({
                method:'post',
                url:"/xe-route/xe-app/mobileApp/checkIdentity/getStatus",
                data:{},
            }).then(res => {
                // var status =  res.data.myresult.status == 3
                this.msg = res.data.myresult.reason
                // var status =  res.data.hhrresult.status == 3
                this.msg1 = res.data.hhrresult.reason
            }).catch(err => {
                console.log(err)
            })
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
            searchBg() {
                let t = this.$refs.layout.$el.querySelector('.scrollview').scrollTop;
                let dis = this.$refs.eightBlock && this.$refs.eightBlock.$el.offsetTop ? this.$refs.eightBlock.$el.offsetTop : 500;
                if (t > dis) {
                    this.searchOpacity = 0.9;
                    return false;
                } else {
                    this.searchOpacity = (t / dis).toFixed(1);
                }
            },
            toKeFu() {
                window.location.href = 'http://xebest.udesk.cn/im_client?web_plugin_id=23247';
            },
            feedback() {
                this.$router.push({name: 'FeedBack'});
            },
            // 成为卖家
            toSeller(){
                this.$router.push({path:'/editinfo',query:{"name":"sell"}})
            },
            // 成为合伙人
            toPartner(){
                this.$router.push({path:'/editinfo',query:{"name":"part"}})
            },
            getStatus() {
                // 获取认证审核状态
                this.$http({
                    method: 'post',
                    url: '/xe-route/xe-app/mobileApp/checkIdentity/getStatus',
                    data: {}
                }).then(res => {
                    console.log(res);
                    this.authPerson = res.data.result;
                }).catch(error => {
                    console.log(error);
                });
            },
            queryReadFlagCount() {
                this.$http({
                    method: 'post',
                    url: '/xe-route/xe-app/mobileApp/msgrecord/queryReadFlagCount',
                    data: {}
                }).then(res => {
                    console.log(res);
                    if (res.data.count > 0) {
                        this.showcircle = true;
                    }
                }).catch(error => {
                    console.log(error);
                });
            },
            queryMyInfoIndex() {
                this.$indicator.open('加载个人信息...');
                this.$http({
                    method: 'post',
                    url: '/xe-route/xe-app/mobileApp/user/queryMyInfoIndex',
                    data: {}
                }).then(res => {
                    this.$indicator.close();
                    if (res.data.userInfo) {
                        this.userInfo.shopName = res.data.userInfo.xeUserInfoDTO.shopName ? res.data.userInfo.xeUserInfoDTO.shopName : res.data.userInfo.xeUserInfoDTO.userName;
                        this.userInfo.mobile = res.data.userInfo.xeUserInfoDTO.mobile;
                        this.userInfo.userAmount = res.data.userInfo.userAmount;
                        this.userInfo.accountBank = res.data.userInfo.accountBank;
                        this.userInfo.notPayCount = res.data.userInfo.notPayCount;
                        this.userInfo.payCount = res.data.userInfo.payCount;
                        this.userInfo.deliverCount = res.data.userInfo.deliverCount;
                        this.userInfo.notPayCountInquiry = res.data.userInfo.notPayCountInquiry;
                        this.userInfo.payCountInquiry = res.data.userInfo.payCountInquiry;
                        this.userInfo.deliverCountInquiry = res.data.userInfo.deliverCountInquiry;
                        this.userInfo.couponCount = res.data.userInfo.couponCount;
                        this.userInfo.confirmCountWish = res.data.userInfo.confirmCountWish; // 待确认
                        this.userInfo.finishCountWish = res.data.userInfo.finishCountWish; // 已完成
                        this.userInfo.loseCountWish = res.data.userInfo.loseCountWish; // 已失效
                        this.orderLogisticsInfo = res.data.orderLogisticsInfo;
                    } else {
                        this.noLogin = true;
                    }
                }).catch(error => {
                    console.log(error);
                    this.$indicator.close();
                });
            },
            queryLogistic(orderid) {
                // console.log(orderid)
                this.$http({
                    method: 'post',
                    url: '/xe-route/xe-app/mobile/orderInfo/queryLogistic',
                    data: {
                        orderId: orderid
                    }
                }).then(res => {
                    console.log(res.data);
                    this.logisticInfo = res.data.logisticInfo;
                    this.logisticsVisible = true;
                }).catch(error => {
                    console.log(error);
                });
            },
            toUserInfo() {
                if (this.loginStatus) {
                    // this.$router.push({name: 'UserInfo'});
                } else {
                    this.$router.push({name: 'Login', query: {redirect: this.$route.fullPath}});
                }
            },
            toPerson() {
                if (this.authPerson.status === '1') {
//                    this.$router.push({name: 'PersonalInfor', query: {status: this.authPerson.status}});
                    this.$router.push({name: 'IdentityAuthentication', query: {status: this.authPerson.status}});
                } else if (this.authPerson.status === '3') {
                    this.$router.push({name: 'CertificationDetails'});
                } else {
                    let status = this.authPerson.status === '2' ? 1 : 4;
                    this.$router.push({
                        name: 'AuFailure',
                        query: {
                            status: status
                        }
                    });
                }
            },
            navToOrder(type) {
                if (this.$getLocalStorage('LOGINSTATUS')) {
                    this.$router.push({name: 'OrderList', query: {type: type}});
                } else {
                    this.loginShow();
                }
            },
            navToInquiryList() {
                if (this.$getLocalStorage('LOGINSTATUS')) {
                    this.$router.push({name: 'InquiryList', query: {type: 0}});
                } else {
                    this.loginShow();
                }
            },
            navToInquiry(type) {
                if (this.$getLocalStorage('LOGINSTATUS')) {
//                    this.$router.push({name: 'InquiryList', query: {type: type}});
                    this.$router.push({name: 'IntentionList', query: {type: type}});
                } else {
                    this.loginShow();
                }
            },
            navToCoupon() {
                if (this.$getLocalStorage('LOGINSTATUS')) {
                    this.$router.push({name: 'CouponList', query: {type: 2}});
                } else {
                    this.loginShow();
                }
            },
            navToAdrList() {
                if (this.$getLocalStorage('LOGINSTATUS')) {
                    this.$router.push({name: 'AdrList'});
                } else {
                    this.loginShow();
                }
            },
            navToMyBankList() {
                if (this.$getLocalStorage('LOGINSTATUS')) {
                    // ent 等于1是银行卡是直接点个人中心（银行卡）直接进入的； 等于2还是通过我的钱包进入的
                    if (this.authPerson.status === '3') {
                        // 已认证
                        let walletUrl = `${window.locationHref}mybankcardlist?ent=1&loginStatus=${this.loginStatus}`;
                        // this.$indicator.open('跳转至我的银行卡列表...');
                        window.location.href = walletUrl;
                    } else {
                        this.$xeMessageBox.confirm('您还未进行身份认证，认证通过后即可添加银行卡~').then(action => {
                            if (this.authPerson.status === '1') {
                                this.$router.push({name: 'IdentityAuthentication', query: {status: this.authPerson.status}});
                            } else if (this.authPerson.status === '3') {
                                this.$router.push({name: 'CertificationDetails'});
                            } else {
                                let status = this.authPerson.status === '2' ? 1 : 4;
                                this.$router.push({
                                    name: 'AuFailure',
                                    query: {
                                        status: status
                                    }
                                });
                            }
                        }).catch(error => {
                            console.log(error);
                        });
                    }
                } else {
                    this.loginShow();
                }
            },
            navToWallet() {
                if (this.$getLocalStorage('LOGINSTATUS')) {
                    if (this.$getLocalStorage('LOGINSTATUS')) {
                        // this.$indicator.open('跳转至我的钱包中...');
                        let walletUrl = `${window.locationHref}mywallet?ent=1&loginStatus=${this.loginStatus}`;
                        window.location.href = walletUrl;
                    } else {
                        this.loginShow();
                    }
                } else {
                    this.loginShow();
                }
            },
            navToMyAuction() {
                if (this.$getLocalStorage('LOGINSTATUS')) {
                    this.$router.push({
                        name: 'MyAuction'
                    });
                } else {
                    this.loginShow();
                }
            },
            loginShow() {
                this.$xeMessageBox({
                    message: '您还未登录~',
                    showCancelButton: true,
                    confirmButtonText: '立即登录'
                }).then(action => {
                    if (action === 'confirm') {
                        this.$router.push({
                            name: 'Login',
                            query: {
                                redirect: this.$route.fullPath
                            }
                        });
                    }
                }).catch(() => {});
            },
            extension(){
                this.$router.push({path:'extension'})
            }
        },
        computed: {
            classObject() {
                if (this.orderLogisticsInfo.logtsStatus === 6) {
                    // 已签收
                    return {
                        'xe-icon-ronud_check': true
                    };
                } else if (this.orderLogisticsInfo.logtsStatus === 5 || this.orderLogisticsInfo.logtsStatus === 7) {
                    // 已派车、已发货
                    return {
                        'xe-icon-daifahuo': true
                    };
                } else if (this.orderLogisticsInfo.logtsStatus === 1 || this.orderLogisticsInfo.logtsStatus === 2) {
                    // 已分仓，已审核
                    return {
                        'xe-icon-zhuye': true
                    };
                } else {
                    // 已分拣
                    return {
                        'xe-icon-daishouhuo': true
                    };
                }
            }
        },
        beforeDestroy() {
            console.log(123);
            this.$indicator.close();
        },
        components: {
            [logistics.name]: logistics
        }
    };
</script>
<style rel="stylesheet/scss" lang="scss">
    @import '../../static/styles/rules.scss';
    @import '../../static/styles/base/common.scss';
    .my-new-style {
        .m-list-block  {
             .item-inner .item-title {
                 font-size: 30/$ppr;
                 font-weight: 600;
             }
            .item-inner {
                line-height: 80/$ppr;
                padding: 0;
            }
            .left{
                width:10%;
                height: 20px;
                border-right: 1px solid darkgray ;
            }
            .right{
                width:80%;
                p{
                    width: 100%;
                    height: 20px;
                }
            }
        }
        .m-my-navs {
            margin-right: 20/$ppr;
            margin-top: .2rem;
        }
        .item-content {
            padding-left: 30/$ppr;
        }
    }
    .my-userlist-content {
        max-width: 7.5rem;
        margin: auto;
        margin-bottom: 20/$ppr;
        background: #fff;
        ul {
            padding-left: 74/$ppr;
            a {
                width: 99%;
            }
        }
        li,a {
            position: relative;
            line-height: 88/$ppr;
            font-size: 30/$ppr;
            color: #3d3d3d;
            display: flex;
            justify-content:space-between;
            &:not(:last-child) {
                border-bottom: 1/$ppr solid #eee;
            }
            span {
                position: absolute;
                left: -44/$ppr;
                top:50%;
                font-size: 30/$ppr;
                margin-top: -15/$ppr;
                display: inline-block;
                width: 30/$ppr;
                height: 30/$ppr;
                line-height: 30/$ppr;
            }
        }
        li {
            @extend .arrow-right-commons;
            background-position: 97% center;
        }
    }
    .m-my-header {
        min-height: 340/$ppr;
        position: relative;
    }
    .m-my-header-top {
        height: 310/$ppr;
        padding: 80/$ppr 20/$ppr 0;
        background: url(../../static/images/blue.png) center;
        background-size: 100% 100%;
    }
    .m-my-header-bot {
        display: flex;
        position: absolute;
        left: 30/$ppr;
        right: 30/$ppr;
        top:2.2rem;
        border-radius: 8px;
        background: #fff;
        line-height: 42/$ppr;
        text-align: center;
        padding: 16/$ppr 0;
        a {
            position: relative;
            display: block;
            flex: 1;
            &:first-child {
                &:after {
                    content: '';
                    position: absolute;
                    right: 0;
                    top: 50%;
                    height: 44/$ppr;
                    margin-top: -22/$ppr;
                    border-right: 1/$ppr solid #eeeeee;
                }
            }
        }
        .user-number {
            color: #333;
            font-size: 36/$ppr;
            font-weight: 600;
        }
        .user-item {
            font-size: 28/$ppr;
            color: #999;
        }
    }
    .headerbtns {
        position: absolute;
        height: 40/$ppr;
        right: 20/$ppr;
        top: 10/$ppr;
        font-size: 0;
        color: #fff;
        .xe-iconfont {
            width: 40/$ppr;
            height: 40/$ppr;
            margin-left: 25/$ppr;
            display: inline-block;
            font-size: 36/$ppr;
            line-height: 40/$ppr;
            text-align: center;
            position: relative;
        }
        .xx-circle {
            width: 16/$ppr;
            height: 16/$ppr;
            background: #f53226;
            position: absolute;
            left: 50%;
            top: 0/$ppr;
            display: block;
            overflow: hidden;
            margin-left: 6/$ppr;
            line-height:1;
            border: 2/$ppr solid #fff;
            border-radius: 50%;
        }
    }
    .m-user-msg {
        display: flex;
        align-items: center;
        .pic {
            width: 116/$ppr;
            height: 116/$ppr;
            border: 3/$ppr solid #fff;
            border-radius: 50%;
            margin: 0 30/$ppr;
            img {
                width: 100%;
                height: 100%;
            }
        }
        .msg {
            color: #fff;
            flex: 1;
            .name {
                font-size: 40/$ppr;
                max-width: 340/$ppr;
                overflow: hidden;
                font-weight: 600;
                text-overflow:ellipsis;
                white-space: nowrap;
                + .num {
                  margin-top: 10/$ppr;
                }
            }
            .num {
                font-size: 24/$ppr;
            }
            &.f32 {
                font-size: 32/$ppr;
            }
        }
    }
    .m-my-item {
        max-width: 750/$ppr;
        margin: 20/$ppr auto;
        background: #fff;
        overflow: hidden;
        &:first-child {
            margin-top: 0;
        }
    }
    .m-yue, .m-my-navs {
        margin-left: 20/$ppr;
        // padding-right: 20/$ppr;
        display: flex;
        justify-content: space-between;
        border-top: 1/$ppr solid $border-color-e8e;
        &.no-border {
            border: none;
        }
        > view {
            flex: 1;
            margin-right: 20/$ppr;
            padding: 30/$ppr 0;
            text-align: center;
            &:last-child {
                margin-right: 0;
            }
            .price {
                font-size: 32/$ppr;
                color: $main-color;
                margin-bottom: 12/$ppr;
            }
            .pic {
                position: relative;
                width: 100%;
                height: 60/$ppr;
                text-align: center;
                img {
                    display: inline-block;
                    width: 60/$ppr;
                    height: 60/$ppr;
                }
                .badge {
                    position: absolute;
                    height: 32/$ppr;
                    padding: 0 9/$ppr;
                    background: #fd0000;
                    // border: 1/$ppr solid #f23934;
                    right: 40/$ppr;
                    top: 0/$ppr;
                    border-radius: 16/$ppr;
                    line-height: 30/$ppr;
                    font-size: 20/$ppr;
                    color: #fff;
                }
            }
            .text {
                font-size: 28/$ppr;
                color: $text-666;
                line-height: 50/$ppr;
            }
        }
    }
    .m-my-navs {
        > view {
            padding: 15/$ppr 0 22/$ppr 0;
        }
    }
    .my-logistics {
        min-height: 86/$ppr;
        // border-top: 1/$ppr solid $border-color-e8e;
        padding:0 20/$ppr 20/$ppr;
        margin: 0/$ppr 30/$ppr 20/$ppr 30/$ppr;
        // display: flex;
        background: #f7f7f7;
        border-radius: 8px;
        .my-logistics-left {
            // width: 115/$ppr;
            // flex:0 0 115/$ppr;
            display: flex;
            justify-content: space-between;
            height: 56/$ppr;
            font-size: 24/$ppr;
            color: $text-999;
            line-height: 56/$ppr;
            // padding-top: 8/$ppr;
            // .text {
            //     font-size: 22/$ppr;
            //     white-space: nowrap;
            // }
        }
        .my-logistics-right {
            // padding: 0 20/$ppr;
            flex: 1;
            display: flex;
            border-left: 1/$ppr solid #e7e7e7;
            position: relative;
            .img {
                flex: 0 0 86/$ppr;
                width: 80/$ppr;
                height: 80/$ppr;
                background: #f5f5f5;
                margin-right: 26/$ppr;
                img {
                    width: 100%;
                    height: 100%;
                }
            }
            .msg {
                padding-top: 8/$ppr;
                flex: 1;
                max-width: 548/$ppr;
            }
            .status {
                font-size: 26/$ppr;
                color: #2caefb;
                .xe-iconfont {
                    font-size: 26/$ppr;
                    line-height: 1;
                    margin-right: 15/$ppr;
                }
            }
            .tips {
                color: $text-999;
                font-size: 24/$ppr;
                margin-top: 8/$ppr;
                line-height: 1.4;
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden;
            }
            // &:after {
            //     content: '';
            //     width: 10/$ppr;
            //     height: 10/$ppr;
            //     background: #e7e7e7;
            //     position: absolute;
            //     left: -5/$ppr;
            //     top: 50%;
            //     margin-top: -5/$ppr;
            //     border-radius: 50%;
            // }
        }
    }
    .person-auth-style {
        position: relative;
        .auth-lab {
            display: inline-block;
            // position: absolute;
            // right: -20/$ppr;
            // top: 45/$ppr;
            height: 36/$ppr;
            padding: 0 20/$ppr 0 10/$ppr;
            line-height: 36/$ppr;
            font-size: 24/$ppr;
            color: #fff;
            background: rgba(26, 16, 168, 0.753);
            border-radius: 30px;
            // border-top-left-radius: 30px;
            // border-bottom-left-radius: 30px;
            .xe-icon-renzheng1 {
                display: inline-block;
                width: 36/$ppr;
                height: 26/$ppr;
                line-height: 22/$ppr;
                text-align: center;
                font-size: 22/$ppr;
                color: #f7e40b;
            }
            .xe-icon-unfold {
                display:inline-block;
                width: 28/$ppr;
                height: 12/$ppr;
                line-height: 12/$ppr;
                text-align: right;
                font-size: 20/$ppr;
                transform: rotate(-90deg);
            }
        }
    }
</style>
