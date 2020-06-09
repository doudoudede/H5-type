<template>
    <xe-layout class="m-bg-dark m-flexlay">
        <template v-if="loaded">
            <!-- <view class="m-corder-warning" slot="header" v-if="authPerson.status !== '3'" @click.prevent="navToWallet">
                <view class="xe-iconfont xe-icon-renzheng"></view>
                <view class="con arrow-right-commons">您的账户安全等级过低，建议先进行身份认证！</view>
            </view> -->
            <view class="m-corder-item" v-for="(item, index) in orderMsg.orderList" :key="index">
                <view class="order-item-shop">
                    <span class="xe-iconfont xe-icon-dian"></span>
                    <span>{{item.sellerName}}</span>
                </view>
                <view class="m-corder-pros">
                    <view class="item" v-for="proItem in item.productList" :key="proItem.proSku">
                        <view class="pic">
                            <img :src="picServer + proItem.productImg" alt="">
                        </view>
                        <view class="msg">
                            <view class="name">
                                <p>{{proItem.productName}}</p>
                            </view>
                            <view class="msg-con">
                                <view class="spec">规格: {{proItem.specvalue}}</view>
                                <view class="pricenum">
                                    <view class="price">
                                        <span>&yen;</span>{{proItem.productPrice | toFixed2}}<span>/{{proItem.unit}}</span>
                                    </view>
                                    <view class="num">
                                        x{{proItem.productCount}}
                                    </view>
                                </view>
                            </view>
                        </view>
                    </view>
                </view>
                <view class="m-list-block">
                    <ul>
                        <li class="item-content align-right align-top">
                            <view class="item-inner">
                                <view class="item-title">
                                    收货人
                                </view>
                                <view class="item-text2">
                                    {{item.conName}} {{item.conPhone}}
                                </view>
                            </view>
                        </li>
                        <li class="item-content align-right align-top">
                            <view class="item-inner">
                                <view class="item-title">
                                    收货地址
                                </view>
                                <view class="item-text2">
                                    {{item.buyerAddress}}
                                </view>
                            </view>
                        </li>
                        <li class="item-content align-right">
                            <view class="item-inner">
                                <view class="item-title">
                                    配送方式
                                </view>
                                <view class="item-after">
                                    {{item.inquiryType === 1 ? '配送' : '自提'}}
                                </view>
                            </view>
                        </li>
                        <li class="item-content align-right item-link">
                            <view class="item-inner">
                                <view class="item-title">
                                    订单备注
                                </view>
                                <view class="item-input2">
                                    <input class="item-input-right" type="text" v-model="item.orderRemark" placeholder="输入对商家的留言（30字内）" :maxlength="30">
                                </view>
                            </view>
                        </li>
                    </ul>
                </view>
            </view>
            <view class="m-corder-item">
                <view class="m-list-block">
                    <ul>
                        <li class="item-content align-right item-link">
                            <view class="item-inner">
                                <view class="item-title">
                                    支付方式
                                </view>
                                <view class="item-input">
                                    <select v-model="paytypeValue">
                                        <option v-for="item in paytypeArrs" :value='item.type' :key="item.type">{{item.name}}</option>
                                    </select>
                                </view>
                            </view>
                        </li>
                        <li class="item-content align-right item-link" @click="setInvoice">
                            <view class="item-inner">
                                <view class="item-title">
                                    发票信息
                                </view>
                                <view class="item-after">
                                    <template v-if="!orderMsg.taxInfoDto.taxTitle">
                                        请填写发票信息
                                    </template>
                                    <template v-else-if="orderMsg.taxInfoDto.taxFlag === 2">
                                        不需要发票
                                    </template>
                                    <template v-else>
                                        {{orderMsg.taxInfoDto.taxTitle | taxTitleToText}}
                                    </template>
                                </view>
                            </view>
                        </li>
                    </ul>
                </view>
            </view>
            <view class="m-corder-item">
                <view class="corder-total">
                    <view>
                        <view class="tit">商品总额</view>
                        <view class="pri">&yen;{{orderMsg.totalPrice | toFixed2}}</view>
                    </view>
                </view>
            </view>
            <!-- <view class="m-payment-agree" v-if="orderMsg.orderCount === 0">
                <xe-checkbox v-model="checkboxAgres" size="large">
                    <view class="con">阅读并同意<router-link :to="{name: 'PaymentAgreement'}">《如来云商支付协议》</router-link>所有条款</view>
                </xe-checkbox>
            </view> -->
            <view class="m-corder-btns" slot="footer">
                <view class="det-pri">
                    <span>合计：</span>&yen;{{orderMsg.totalPrice | toFixed2}}
                </view>
                <view class="det-btns">
                    <view class="det-tobuy xe-gradient-color" @click.prevent="submitOrder">提交订单</view>
                </view>
            </view>

            <!--发票信息-->
            <xe-popup
                slot="outer"
                :show.sync="invoiceVisible"
                popupTit="发票信息"
                position="right"
            >
                <xe-invoice v-if="invoiceVisible" :itemData="orderMsg"></xe-invoice>
            </xe-popup>

        </template>
    </xe-layout>
</template>
<script type="text/ecmascript-6">
    import {Popup} from 'components/Popup';
    import {Dialog} from 'components/Dialog/';
    import invoice from '../confirmorder/invoice';
    export default {
        name: 'xe-page-confirmInqOrder',
        data() {
            return {
                authPerson: '',
                loaded: false,
                picServer: '',
                invoiceVisible: false,
                orderMsg: {},
                paytypeArrs: [],
                paytypeValue: 1
            };
        },
        created() {
            this.inquiryCheckOrder();
            this.getStatus();
        },
        methods: {
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
            inquiryCheckOrder() {
//                let orderPlat = this.$route.params.orderPlat; // 订单来源 1：android 2：ios 3：微信 4 pc  9其他
//                let buyNum = this.$route.query.buyNum ? this.$route.query.buyNum : ''; // 购买数量（立即购买必传）
//                let orderSource = this.$route.params.orderSource; // 订单来源 1 购物车 2 商品详情页
//                let areaId = JSON.parse(this.$getLocalStorage('REGIONMAP')).areaId; // 区域ID
                let inquirysheetCodes = this.$route.query.inquirysheetCodes ? this.$route.query.inquirysheetCodes.split(',') : '';
                this.$indicator.open('确认订单信息加载中...');
                this.$http({
                    method: 'post',
                    url: '/xe-route/xe-app/mobile/inquiry/inquiryCheckOrder',
                    data: {
                        inquirysheetCodes: inquirysheetCodes
                    }
                }).then(res => {
                    this.$indicator.close();
                    if (res.data.orderResDto.status === '2000') {
                        // 给对应的店铺加上默认选择的配送方式
//                        res.data.checkDto.venProList.forEach(item => {
//                            item.shipTyped = item.shipTypeList[0];
//                        });
                        this.orderMsg = res.data.orderResDto;
                        this.picServer = res.data.picServer;
                        this.paytypeComputed = res.data.orderResDto.payment;
                        this.loaded = true;
                    } else {
                        this.$xeMessageBox({
                            message: res.data.orderResDto.msg,
                            closeOnClickModal: false,
                            confirmButtonText: '返回询价单列表'
                        }).then(() => {
                            this.$router.go(-1);
                        });
                    }
                }).catch(error => {
                    console.log(error);
                    this.$indicator.close();
                });
            },
            setDelivery(item) {
                console.log('setDelivery');
                console.log(item);
                console.log('setDelivery');
                // 选择配送方式
                if (item.shipTypeList.length === 1 && item.shipTypeList[0] === '1' && item.appointCarFlag === 2) {
//                    this.$toast('不能选择配送方式');
                    return;
                }
                this.venProItem = item;
                this.deliveryVisible = true;
            },
            setInvoice() {
                // 选择发票信息
                this.invoiceVisible = true;
            },
            submitOrder() {
                let productRemark = []; // 订单备注
                this.orderMsg.orderList.forEach(item => {
                    let orderRemarkObj = {};
                    orderRemarkObj[`${item.code}${item.inquiryType}${item.caId}`] = item.orderRemark ? item.orderRemark : '';
                    productRemark.push(orderRemarkObj);
                });
                console.log({
                    inquirysheetcode: this.$route.query.inquirysheetCodes.split(','),
                    totalAmount: this.orderMsg.totalPrice, // 应付金额 必填
                    taxFlag: this.orderMsg.taxInfoDto ? this.orderMsg.taxInfoDto.taxFlag ? this.orderMsg.taxInfoDto.taxFlag : 1 : 2, // 是否有发票信息 1 有 2 没有 必填
                    payType: this.paytypeValue, // 支付方式 4 在线支付 1 货到付款 必填
                    productRemark: JSON.stringify(productRemark),
                    checkOrderUUID: this.orderMsg.checkOrderUUID // 下单返回的uuid 必填
                });
                // 提交订单
                this.$indicator.open('提交订单中...');
                this.$http({
                    method: 'post',
                    url: '/xe-route/xe-app/mobile/inquiry/inquirySubmitOrder',
                    data: {
                        inquirysheetcodes: this.$route.query.inquirysheetCodes.split(','),
                        totalAmount: this.orderMsg.totalPrice, // 应付金额 必填
                        taxFlag: this.orderMsg.taxInfoDto ? this.orderMsg.taxInfoDto.taxFlag ? this.orderMsg.taxInfoDto.taxFlag : 1 : 2, // 是否有发票信息 1 有 2 没有 必填
                        payType: this.paytypeValue, // 支付方式 4 在线支付 1 货到付款 必填
                        productRemark: productRemark,
                        checkOrderUUID: this.orderMsg.checkOrderUUID // 下单返回的uuid 必填
                    }
                }).then(res => {
                    if (res.data.responseDto.status === '2000') {
                        if (this.paytypeValue === 4) {
                            // 在线支付时
                            this.goToPay(res.data.responseDto.orderId);
                        } else {
                            // 货到付款时
                            this.$indicator.close();
                            this.$router.push({
                                name: 'DeliverySucc',
                                params: {
                                    mid: res.data.responseDto.orderId,
                                    payamount: res.data.responseDto.totalPrice
                                }
                            });
                        }
                    } else {
                        this.$indicator.close();
                        this.$xeMessageBox({
                            message: res.data.responseDto.msg,
                            closeOnClickModal: false,
                            confirmButtonText: '返回询价单'
                        }).then(() => {
                            this.$router.go(-1);
                        });
                    }
                }).catch(error => {
                    console.log(error);
                    this.$indicator.close();
                });
            },
            goToPay(morderId) {
                let walletUrl = `${window.locationHref}payDesk`;
                this.$indicator.open('跳转至收银台中...');
                this.$http({
                    method: 'post',
                    url: '/xe-route/xe-app/mobile/pay/payOrderApp',
                    data: {
                        morderId: morderId
                    }
                }).then(res => {
                    console.log(res);
                    window.location.href = `${walletUrl}?orderid=${res.data.payNumber}&client=1&payMethod=${this.paytypeValue}&loginStatus=${this.loginStatus}`;
                }).catch(error => {
                    console.log(error);
                    this.$indicator.close();
                });
            },
            navToWallet() {
                if (this.authPerson.status === '1') {
                    this.$router.push({name: 'IdentityAuthentication', query: {status: this.authPerson.status}});
                } else {
                    let status = this.authPerson.status === '2' ? 1 : 4;
                    this.$router.push({
                        name: 'AuFailure',
                        query: {
                            status: status
                        }
                    });
                }
            }
        },
        computed: {
            paytypeComputed: {
                get() {
                    return this.orderMsg.payment;
                },
                set(val) {
                    console.log(val);
                    if (val === '1') {
                        this.paytypeValue = 4;
                        this.paytypeArrs = [{name: '在线支付', type: 4}];
                    } else {
                        this.paytypeValue = 4;
                        this.paytypeArrs = [{name: '在线支付', type: 4}];
                    }
                }
            }
        },
        components: {
            [invoice.name]: invoice,
            [Popup.name]: Popup,
            [Dialog.name]: Dialog
        }
    };
</script>
<style rel="stylesheet/scss" lang="scss">
    @import '../../static/styles/rules.scss';
    .m-corder-warning {
        min-height: 70/$ppr;
        background: #fff0cd;
        display: flex;
        align-items: center;
        padding: 15/$ppr 20/$ppr;
        line-height: 40/$ppr;
        color: $main-color;
        font-size: 28/$ppr;
        -webkit-transform: translateZ(0px);
        .xe-iconfont {
            width: 32/$ppr;
            height: 32/$ppr;
            line-height: 1;
            margin-right: 20/$ppr;
            font-size: 32/$ppr;
        }
        .con {
            flex: 1;
        }
    }
    .m-corder-item {
        margin: 20/$ppr 0;
        background: #fff;
        overflow: hidden;
        .order-item-shop {
            min-height: 88/$ppr;
            padding: 20/$ppr;
            line-height: 48/$ppr;
            color: $text-333;
            font-size: 32/$ppr;
            .xe-iconfont {
                width: 34/$ppr;
                height: 34/$ppr;
                line-height: 1;
                color: #919191;
                display: inline-block;
                font-size: 34/$ppr;
                vertical-align: top;
                margin-top: 7/$ppr;
            }
        }
    }
    .m-corder-pros {
        .item {
            padding: 20/$ppr;
            min-height: 150/$ppr;
            background: #fafafa;
            margin-bottom: 6/$ppr;
            display: flex;
            &:last-child {
                margin-bottom: 0;
            }
            .pic {
                width: 150/$ppr;
                height: 150/$ppr;
                border-radius: 5/$ppr;
                overflow: hidden;
                margin-right: 20/$ppr;
                img {
                    width: 100%;
                    height: 100%;
                }
            }
            .msg {
                flex: 1;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                .name {
                    font-size: 28/$ppr;
                    max-height: 64/$ppr;
                    line-height: 32/$ppr;
                    overflow: hidden;
                    p {
                        overflow : hidden;
                        text-overflow: ellipsis;
                        display: -webkit-box;
                        -webkit-line-clamp: 2;
                        -webkit-box-orient: vertical;
                    }
                }
                .msg-con{

                }
                .spec {
                    font-size: 24/$ppr;
                    margin: 10/$ppr 0;
                    color: $text-666;
                }
                .pricenum {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-top: 10/$ppr;
                    font-size: 24/$ppr;
                    .price {
                        color: $main-color;
                    }
                    span {
                        font-size: 20/$ppr;
                    }
                }
            }
        }
    }
    .corder-total {
        padding: 5/$ppr 20/$ppr;
        font-size: 28/$ppr;
        > view {
            display: flex;
            justify-content: space-between;
            margin: 15/$ppr 0;
        }
        .pri {
            color: $main-color;
        }
    }
    .m-corder-btns {
        display: flex;
        align-items: center;
        width: 100%;
        height: 98/$ppr;
        z-index: 333;
        background: #fff;
        border-top: 1/$ppr solid $border-color-e8e;
        .m-all-check {
            padding-left: 20/$ppr;
        }
        .det-pri {
            flex: 1;
            padding: 20/$ppr;
            font-size: 32/$ppr;
            color: $main-color;
            height: 98/$ppr;
            line-height: 58/$ppr;
            span {
                color: $text-333;
                font-size: 28/$ppr;
            }
        }
        .det-btns {
            display: flex;
            > view {
                flex:1;
                font-size: 34/$ppr;
                text-align: center;
                line-height: 98/$ppr;
                color: #fff;
                min-width: 230/$ppr;
                padding:0 30/$ppr;
            }
            .det-tocart {
                background: $com-color;
            }
        }
    }
    .m-payment-agree {
        padding-left: 20/$ppr;
        display: flex;
        margin-bottom: 20/$ppr;
        font-size: 26/$ppr;
        color: #666;
        line-height: 26/$ppr;
        a {
            color: #f23530;
        }
        .van-radio.van-checkbox--large .van-checkbox__input, .van-radio.van-checkbox--large .van-checkbox__control, .van-checkbox.van-checkbox--large .van-checkbox__input, .van-checkbox.van-checkbox--large .van-checkbox__control{
            width: 30/$ppr;
            height: 30/$ppr;
        }
        .van-radio.van-checkbox--large .xe-iconfont, .van-checkbox.van-checkbox--large .xe-iconfont {
            width: 30/$ppr;
            height: 30/$ppr;
            line-height: 30/$ppr;
            font-size: 30/$ppr;
        }
        .van-checkbox__input {
            position: relative;
            top:4/$ppr;
        }
    }
</style>
