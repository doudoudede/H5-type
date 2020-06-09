<template>
    <xe-layout class="m-bg-dark m-flexlay m-flexlay-confirm">
        <template v-if="loaded">
            <!-- <view class="m-corder-warning" slot="header" v-if="authPerson.status !== '3'" @click.prevent="navToWallet">
                <view class="xe-iconfont xe-icon-renzheng"></view>
                <view class="con arrow-right-commons">您的账户安全等级过低，建议先进行身份认证！</view>
            </view> -->
            <view class="det-inquiry-adr">
                <view @click.prevent="adrVisibleFn" v-if="adrTempItem">
                    <view class="adr-user">
                        <span>{{adrTempItem.caConsignee}}</span><span>{{adrTempItem.caPhone}}</span>
                    </view>
                    <view class="adr-msg">
                        <view class="xe-iconfont xe-icon-dingwei"></view>
                        <view class="adr-msg-text arrow-right-commons">{{adrTempItem.caProvName}}{{adrTempItem.caCityName}}{{adrTempItem.caAreaName}}{{adrTempItem.caStreet}}</view>
                    </view>
                </view>
                <template v-else-if="orderMsg.addrFlag === '2'">
                    <view class="adr-none">
                        <mt-button class="xe-button-primary is-radius" @click.prevent="adrVisibleFn" size="small" plain>+ 选择地址</mt-button>
                    </view>
                </template>
                <template v-else>
                    <view class="adr-none">
                        <mt-button class="xe-button-primary is-radius" size="small" plain @click.prevent="navToAddNewAdr">+ 新增地址</mt-button>
                    </view>
                </template>
            </view>
            <view class="m-corder-item" v-for="(item, index) in orderMsg.venProList" :key="index">
                <view class="order-item-shop">
                    <span class="xe-iconfont xe-icon-dian"></span>
                    <span>{{item.venName}}</span>
                </view>
                <view class="m-corder-pros">
                    <view class="item" v-for="proItem in item.proList" :key="proItem.proSku">
                        <view class="pic">
                            <img :src="picServer + proItem.proMainImg" alt="">
                        </view>
                        <view class="msg">
                            <view class="name">
                                <p>
                                    <!-- <span v-if="proItem.disLimitProNum" class="coupon-style coupon-style-miao">秒</span>{{proItem.proName}} -->
                                    <span v-if="proItem.disLimitProNum" class="xe-iconfont xe-icon-miaoshafuben coupon-style-icon"></span>
                                    <span v-if="proItem.preSaleFlag === 1" class="xe-iconfont xe-icon-yushoufuben coupon-style-icon1"></span>
                                    {{proItem.proName}}
                                </p>
                            </view>
                            <view class="msg-con">
                                <view class="spec">规格: {{proItem.specValue}}</view>
                                <view class="pricenum">
                                    <view class="price">
                                        <template v-if="proItem.disLimitProNum">
                                            <!--商品为限时抢购-->
                                            <template v-if="proItem.buyNum > proItem.disLimitProNum">
                                                <!--购买数量大于限时抢购库存-->
                                                <p><em style="color: #999;">{{proItem.disLimitProNum}}x</em><span>&yen;</span>{{proItem.disLimitProPrice | toFixed2}}<span>/{{proItem.proUnit}}</span></p>
                                                <p><em style="color: #999;">{{parseInt(proItem.buyNum - proItem.disLimitProNum)}}x</em><span>&yen;</span>{{proItem.areaPrice | toFixed2}}<span>/{{proItem.proUnit}}</span></p>
                                            </template>
                                            <template v-else>
                                                <p><span>&yen;</span>{{proItem.disLimitProPrice | toFixed2}}<span>/{{proItem.proUnit}}</span></p>
                                            </template>
                                        </template>
                                        <template v-else>
                                            <p><span>&yen;</span>{{proItem.areaPrice | toFixed2}}<span>/{{proItem.proUnit}}</span></p>
                                        </template>
                                    </view>
                                    <view class="num">
                                        x{{proItem.buyNum}}
                                    </view>
                                </view>
                            </view>
                        </view>
                    </view>
                </view>
                <view class="m-list-block">
                    <ul>
                        <li class="item-content align-right" @click="showCouponList(item)" :class="{'item-link': item.couponList && item.couponList.length > 0}">
                            <view class="item-inner">
                                <view class="item-title">
                                    店铺优惠券
                                </view>
                                <view class="item-after" v-if="item.couponList && item.couponList.length > 0">
                                    <span class="coupon-mark" v-if="item.disAomuntZw === 0 || !item.disAomuntZw">可用{{item.couponList.length}}张</span>
                                    <span v-else>&yen;{{item.disAomuntZw}}</span>
                                </view>
                                <view v-else class="item-after">
                                    暂无可用优惠券
                                </view>
                            </view>
                        </li>
                        <li class="item-content align-right item-link" :class="{'item-link': !(item.shipTypeList.length === 1 && item.shipTypeList[0] === '1' && item.appointCarFlag === 2)}" @click.prevent="setDelivery(item)">
                            <view class="item-inner">
                                <view class="item-title">
                                    配送方式
                                </view>
                                <view class="item-after">
                                    <template v-if="item.shipTyped">
                                        {{parseInt(item.shipTyped) | shipTypeToText}}
                                    </template>
                                    <template v-else>
                                        {{parseInt(item.shipTypeList[0]) | shipTypeToText}}
                                    </template>
                                </view>
                            </view>
                        </li>
                        <li class="item-content">
                            <view class="item-inner">
                                <view class="item-title">
                                    订单备注
                                </view>
                                <view class="item-input">
                                    <input type="text" v-model="item.orderRemark" placeholder="输入对商家的留言（30字内）" :maxlength="30">
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
                        <li class="item-content align-right" @click="showCouponListxb()" :class="{'item-link': orderMsg.platCouponList && orderMsg.platCouponList.length > 0}">
                            <view class="item-inner">
                                <view class="item-title">
                                    如来云商优惠券
                                </view>
                                <view class="item-after" v-if="orderMsg.platCouponList && orderMsg.platCouponList.length > 0">
                                    <span class="coupon-mark" v-if="!couponTypePlatAmount">可用{{orderMsg.platCouponList.length}}张</span>
                                    <span v-else>&yen;{{couponTypePlatAmount}}</span>
                                </view>
                                <view v-else class="item-after">
                                    暂无可用如来云商优惠券
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
                        <view class="pri">&yen;{{orderMsg.totalAmount | toFixed2}}</view>
                    </view>
                    <view>
                        <view class="tit">优惠金额</view>
                        <view class="pri">-&yen;{{(parseFloat(disAmount) + parseFloat(couponTypePlatAmount)) | toFixed2}}</view>
                    </view>
                    <view>
                        <view class="tit">运费</view>
                        <view class="pri">+&yen;{{freAmount | toFixed2}}</view>
                    </view>
                </view>
            </view>
            <view class="m-payment-agree" v-if="orderMsg.orderCount === 0">
                <xe-checkbox v-model="checkboxAgres" size="large">
                    <view class="con">阅读并同意<router-link :to="{name: 'PaymentAgreement'}">《如来云商支付协议》</router-link>所有条款</view>
                </xe-checkbox>
            </view>
            <view class="m-corder-btns" slot="footer">
                <view class="det-pri">
                    <!-- <span>合计：</span>&yen;{{payTotalPrice}} -->
                    <view class="allmoney">
                        <view class="pay-coupon no-margin">
                            <p class="pay_all" :class="{'pay_top': !couponTempMaxNum}">合计: <span>&yen;{{payTotalPrice}}</span></p>
                            <p class="pay_money" v-if="couponTempMaxNum" >订单确认收货后可得{{couponTempMaxNum}}元优惠券</p>
                        </view>
                    </view>
                </view>
                <view class="det-btns">
                    <!-- <view class="det-tobuy"  @click.prevent="submitOrder">提交订单</view> -->
                    <mt-button :disabled='submitOrderLoading' class="det-tobuy xe-button-primary"  @click.prevent="submitOrder">提交订单</mt-button>
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

            <!--配送方式-->
            <xe-popup
                slot="outer"
                :show.sync="deliveryVisible"
                popupTit="配送方式"
                position="right"
            >
                <xe-delivery v-if="deliveryVisible" :itemData="venProItem"></xe-delivery>
            </xe-popup>

            <!--选择地址-->
            <xe-popup
                slot="outer"
                ref="adrInstance"
                :show.sync="adrVisible"
                popupTit="选择地址"
                position="bottom">
                <ChooseAdrItem :adrDatas="adrDatas" :defaultCaId="defaultCaId" @on-adr-change="adrChangeFn" @on-click-toadd="toAddFn"></ChooseAdrItem>
            </xe-popup>

            <!--优惠券-->
            <xe-popup
                slot="outer"
                :show.sync="couponVisible"
                popupTit="优惠券"
                position="bottom">
                <view class="popup-coupon-itemcon coupon-itemcon-confirm" v-if="couponList.length">
                    <view class="itemcon-confirm">
                        <view class="item" v-for="item in couponList" :key="item.couTempId">
                        <view class="item-circle-bot"></view>
                        <view class="item-circle">
                            <i v-for="item in 20" :key="item"></i>
                        </view>
                        <view class="item-left">
                            <view class="item-left-con">
                                <view class="item-t">
                                    <em>&yen;</em><span class="big-pri">{{item.useDisAmount | retainedDecimalToNum}}</span><!--span class="small-pri">.00</span-->
                                </view>
                                <view class="item-d">
                                    <template v-if="item.useRuleType === 1">
                                        满&yen;{{item.useOrderAmount}}可用
                                    </template>
                                    <template v-else>
                                        无门槛优惠券
                                    </template>
                                </view>
                            </view>
                        </view>
                        <view class="item-right">
                            <view class="item-r-msg">{{item.useRange, item.sendPlat | useRangeToText}}</view>
                            <view class="item-r-time">{{item.activeTimeStart | millisecondFormat}} - {{item.activeTimeEnd | millisecondFormat}}</view>
                            <!-- <view class="item-r-time" v-else>优惠券到账后{{item.activeDay}}天内有效</view> -->
                            <view class="item-r-btn">
                                <mt-button type="primary" size='small' class="xe-button-primary is-radius" plain @click.prevent="createCoupTempletById(item)">立即使用</mt-button>
                            </view>
                        </view>
                    </view>
                    </view>
                    <view class="item-btn" @click.prevent="delCoupTemplet">
                        暂不使用优惠券
                    </view>
                </view>
            </xe-popup>

            <!--Dialog-->
            <xe-dialog slot="outer" :show.sync="yzmDialog">
                <view class="yzmcons">
                    <view class="yzm-input">
                        <view class="yzm-inputin">
                            <input type="tel" v-model.trim="orderConfirmTel" maxlength="11" placeholder="客户经理手机号">
                        </view>
                        <transition name="slide-in">
                            <view class="yzm-suggest" v-show="showSuggest">
                                <p v-for="item in suggestData" :key="item.mobile" @click.prevent="suggestClick(item)">{{item.mobile}}({{item.name}})</p>
                            </view>
                        </transition>
                    </view>
                    <view class="yzm-input">
                        <view class="yzm-inputin">
                            <input type="tel" v-model.trim="smsCode" maxlength="4" placeholder="验证码">
                        </view>
                        <view class="yzmbtns" :class="{'nodisabled': orderConfirmTel && orderConfirmTel.length === 11}" @click="getYzmCode">{{isNaN(yzbtnText) ? yzbtnText : yzbtnText + 's'}}</view>
                    </view>
                    <view class="yzm-tips-xieyi">
                        请核对您购买产品的产品名称、产地、产品型号、产品标准(重量、包装)、数量、价格；如有“产品超出保质期、产品严重变质、配送一周未到货三种情况”，您可在2日内，包装完好的情况下，我公司无条件接受退货；其他情形退货，产生的物流费、装卸费以及产品损失由您本人承担。
                    </view>
                </view>
                <template slot="footer">
                    <view class="m-dialog-btn cancel" @click="yzmDialogCancel">取消</view>
                    <view class="m-dialog-btn sure" @click="yzmDialogSure">确认</view>
                </template>
            </xe-dialog>
        </template>
    </xe-layout>
</template>
<script type="text/ecmascript-6">
    import debounce from 'throttle-debounce/debounce';
    import {Popup} from 'components/Popup';
    import {Dialog} from 'components/Dialog/';
    import ChooseAdrItem from 'pages/productdetails/ChooseAdrItem';
    import invoice from './invoice';
    import delivery from './delivery';
    import {Checkbox} from 'components/Checkbox';
    let stroageCaIdKey = 'confirmOrderCaId';
    export default {
        name: 'xe-page-confirmOrder',
        data() {
            return {
                authPerson: '',
                loginStatus: '',
                checkboxAgres: '',
                loaded: false,
                picServer: '',
                yzmDialog: false,
                showSuggest: false,
                submitOrderLoading: false, // 防止多次提交
                suggestData: [],
                yzmBtnFlag: false,
                yzbtnText: '获取验证码',
                smsCode: '',
                codMobile: '',
                orderConfirmTel: '',
                invoiceVisible: false, // 发票信息弹窗
                deliveryVisible: false, // 配送方式弹窗
                venProItem: {}, // 支持的配送方式
                orderMsg: {},
                paytypeArrs: [],
                couponTempMaxNum: 0, // 合计满减最大值
                couponVisible: false,
                couponList: [],
                couponType: '', // 区分是如来云商优惠券还是普通优惠券 couponplat: 如来云商优惠券； couponshop：普通优惠券；
                couponTypePlatAmount: 0, // 如来云商优惠券金额
                adrDatas: [], // 收货地址
                defaultCaId: '', // 默认选中地址
                adrTempItem: null, // 选中的地址信息
                adrVisible: false, // 显示地址列表
                paytypeValue: 1,
                shopTempItem: null, // 领取商铺优惠券时暂存的店铺ITEM
                platTempItem: null, // 领取如来云商优惠券时暂存的店铺ITEM
                addAddrInfo: null
            };
        },
        created() {
//            this.getCaIdInStroage();
            this.loginStatus = this.$getLocalStorage('LOGINSTATUS');
            this.toPlaceOrder();
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
            toPlaceOrder() {
                let orderPlat = this.$route.params.orderPlat; // 订单来源 1：android 2：ios 3：微信 4 pc  9其他
                let buyNum = this.$route.query.buyNum ? this.$route.query.buyNum : ''; // 购买数量（立即购买必传）
                let orderSource = this.$route.params.orderSource; // 订单来源 1 购物车 2 商品详情页
                let areaId = JSON.parse(this.$getLocalStorage('REGIONMAP')).areaId; // 区域ID
                let proSkus = this.$route.query.proSkus ? this.$route.query.proSkus.split(',') : '';
                if (this.$route.query.areaId && this.$route.query.caId) {
                    areaId = this.$route.query.areaId;
                }
                this.$indicator.open('确认订单信息加载中...');
                this.$http({
                    method: 'post',
                    url: '/xe-route/xe-app/mobile/checkOrder/toPlaceOrder',
                    data: {
                        areaId: areaId,
                        orderSource: orderSource,
                        buyNum: buyNum,
                        orderPlat: orderPlat,
                        sourceType: 3,
                        proSkus: proSkus
                    }
                }).then(res => {
                    this.$indicator.close();
                    let rescode = res.data.code;
                    if (rescode === '2000') {
                        // 给对应的店铺加上默认选择的配送方式
                        res.data.checkDto.venProList.forEach(item => {
                            item.shipTyped = item.shipTypeList[0];
                        });
                        this.addAddrInfo = res.data.addAddrInfo;
                        this.orderMsg = res.data.checkDto;
                        this.picServer = res.data.checkDto.imgUrl;
                        this.paytypeComputed = res.data.checkDto.payType;
                        this.adrDatas = res.data.checkDto.addrList;
                        if (this.$route.query.areaId && this.$route.query.caId) {
                            res.data.checkDto.addrList.some(item => {
                                if (item.caId === this.$route.query.caId) {
                                    this.adrTempItem = item;
                                    return true;
                                }
                            });
                        } else {
                            if (res.data.checkDto.addrFlag === '1') {
                                // 标记为1时默认取数组内第一个
                                this.adrTempItem = res.data.checkDto.addrList[0];
                            }
                        }
                        this.getCaIdInStroage();
                        this.loaded = true;
                    } else if (rescode === '2050') {
                        this.$xeMessageBox({
                            title: '店铺支付方式不同，请分别下单',
                            message: res.data.msg,
                            closeOnClickModal: false,
                            confirmButtonText: '返回购物车'
                        }).then(() => {
                            this.$router.replace({
                                name: 'Cart'
                            });
                        });
                    } else if (rescode === '2052' || rescode === '2053' || rescode === '2054' || rescode === '2055' || rescode === '2100' || rescode === '2101' || rescode === '2102') {
                        let msgstr = {
                            '2052': '商品库存不足',
                            '2053': '商品起订量变更，请重新确定购买数量～',
                            '2054': '促销活动已结束，是否原价购买商品？',
                            '2055': '促销商品库存变更，请重新确认购买数量～',
                            '2100': '该商品预售活动已结束',
                            '2101': '该时段预售活动已结束',
                            '2102': '预售商品信息发生变更',
                            '2057': '您还未进行身份认证,认证后即可下单~',
                            '2058': '您的身份认证正在审核中,联系客服了解详情~',
                            '2059': '您的身份认证未通过,联系客服了解详情~'
                        };
                        this.$xeMessageBox({
                            title: msgstr[rescode],
                            message: res.data.msg,
                            closeOnClickModal: false,
                            confirmButtonText: buyNum ? '返回详情页' : '返回购物车'
                        }).then(() => {
                            if (buyNum) {
                                this.$router.go(-1);
                            } else {
                                this.$router.replace({
                                    name: 'Cart'
                                });
                            }
                        });
                    } else if (rescode === '2057' || rescode === '2058' || rescode === '2059') {
                        let msgstr = {
                            '2057': '您还未进行身份认证,认证后即可下单~',
                            // '2058': '您的身份认证正在审核中,联系客服了解详情~',
                              '2058': '您的身份认证正在审核中',
                            '2059': '您的身份认证未通过,联系客服了解详情~'
                        };
                        this.$xeMessageBox({
                            title: '提示',
                            message: msgstr[rescode],
                            closeOnClickModal: false,
                            showCancelButton: true,
                            cancelButtonClass: rescode === '2059' ? 'blue' : '',
                            cancelButtonText: rescode === '2059' ? '重新提交' : '稍后再说',
                            // confirmButtonText: rescode === '2057' ? '立即认证' : '联系客服'
                        }).then(action => {
                            console.log(action);
                            if (action === 'cancel') {
                                if (rescode === '2059') {
                                    this.$router.replace({
                                        name: 'PersonalInfor',
                                        query: {
                                            status: '4'
                                        }
                                    });
                                } else {
                                    if (buyNum) {
                                        this.$router.go(-1);
                                    } else {
                                        this.$router.replace({
                                            name: 'Cart'
                                        });
                                    }
                                }
                            } else {
                                if (rescode === '2057') {
//                                    this.$router.replace({
//                                        name: 'PersonalInfor'
//                                    });
                                    this.$router.replace({
                                        name: 'IdentityAuthentication'
                                    });
                                } else{
                                     this.$router.replace({
                                        name: 'IdentityAuthentication'
                                    });
                                }
                                // else {
                                //     this.$router.go(-1);
                                //     setTimeout(() => {
                                //         window.location.href = 'tel:400-662-6366';
                                //     }, 16);
                                // }
                            }
                        });
                    } else {
                        this.$xeMessageBox({
                            message: res.data.msg,
                            closeOnClickModal: false,
                            confirmButtonText: buyNum ? '返回详情页' : '返回购物车'
                        }).then(() => {
                            if (buyNum) {
                                this.$router.go(-1);
                            } else {
                                this.$router.replace({
                                    name: 'Cart'
                                });
                            }
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
                if (item.shipTypeList.length === 1 && item.shipTypeList[0] === '3') {
                    this.$toast('商户仅支持到店自提');
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
                if (!this.adrTempItem) {
                    // 没有选择地址
                    this.$toast({
                        message: '请选择地址',
                        duration: 1500
                    });
                    return;
                }
                console.log('this.orderM---->', this.orderMsg.orderCount);
                // 判断用户是不是第一次去商城支付
                if (this.orderMsg.orderCount === 0 && !this.checkboxAgres) {
                    this.$toast({
                        message: '请同意《如来云商支付协议》',
                        duration: 1500
                    });
                    return;
                }
                let cardNums = []; // 优惠券码
                let orderRemarks = []; // 订单备注
                let shipTypeStr = []; // 配送方式的
                let appointCarStr = []; // 指定车辆信息
                let buyNum = this.$route.query.buyNum ? this.$route.query.buyNum : ''; // 购买数量（立即购买必传）
                this.orderMsg.venProList.forEach(item => {
                    if (item.disAomuntZw) {
                        item.proList.forEach(items => {
                            if (items.preSaleFlag === 1) {
                                cardNums.push({cardNum: item.disAomuntCardNum, proSku: items.proSku});
                            } else {
                                cardNums.push({cardNum: item.disAomuntCardNum});
                            }
                        });
//                        cardNums.push(item.disAomuntCardNum);
                    }
                    let orderRemarkObj = {};
                    orderRemarkObj.userCode = item.userCode;
                    orderRemarkObj.orderRemark = item.orderRemark ? item.orderRemark : '';
                    orderRemarks.push(orderRemarkObj);
                    item.proList.forEach(items => {
                        if (items.preSaleFlag === 1) {
                            orderRemarkObj.proSku = items.proSku;
                        }
                    });
                    let shipTypeStrObj = {};
                    shipTypeStrObj.userCode = item.userCode;
                    shipTypeStrObj.shipType = item.shipTyped;
                    shipTypeStr.push(shipTypeStrObj);

                    if (item.shipTyped !== '3') {
                        let appointCarStrObj = {};
                        appointCarStrObj.userCode = item.userCode;
                        appointCarStrObj.shipCarId = item.shipCarId ? item.shipCarId : '';
                        appointCarStrObj.shipCarDes = item.shipCarDes ? item.shipCarDes : '';
                        appointCarStr.push(appointCarStrObj);
                    }
                });
                // 如来云商优惠券
                console.log('this.platTempItem', this.platTempItem);
                if (this.platTempItem) {
                    cardNums.push({
                        cardNum: this.platTempItem
                    });
                }
                if (this.paytypeValue === 1 && this.orderMsg.codCheckMsgFlag === '1' && !this.codMobile) {
                    // 支付方式为货到付款且codCheckMsgFlag为1时 弹窗 最后一步做此验证
                    this.yzmDialog = true;
                    return;
                }
                console.log({
                    caId: this.adrTempItem.caId,
                    payAmount: this.payTotalPrice, // 应付金额 必填
                    taxFlag: this.orderMsg.taxInfoDto ? this.orderMsg.taxInfoDto.taxFlag ? this.orderMsg.taxInfoDto.taxFlag : 1 : 2, // 是否有发票信息 1 有 2 没有 必填
                    proSkus: this.$route.query.proSkus.split(','), // sku的arr 必填
                    payType: this.paytypeValue, // 支付方式 4 在线支付 1 货到付款 必填
                    cardNumStr: JSON.stringify(cardNums),
                    codMobile: this.paytypeValue === 4 ? '' : this.codMobile,
                    orderRemarks: JSON.stringify(orderRemarks),
                    shipTypeStr: JSON.stringify(shipTypeStr),
                    appointCarStr: JSON.stringify(appointCarStr),
                    checkOrderUUID: this.orderMsg.checkOrderUUID // 下单返回的uuid 必填
                });
                // 提交订单
                this.$indicator.open('提交订单中...');
                this.submitOrderLoading = true;
                this.$http({
                    method: 'post',
                    url: '/xe-route/xe-app/mobile/checkOrder/submitOrder',
                    data: {
                        caId: this.adrTempItem.caId,
                        payAmount: this.payTotalPrice, // 应付金额 必填
                        orderPlat: 3,
                        taxFlag: this.orderMsg.taxInfoDto ? this.orderMsg.taxInfoDto.taxFlag ? this.orderMsg.taxInfoDto.taxFlag : 1 : 2, // 是否有发票信息 1 有 2 没有 必填
                        proSkus: this.$route.query.proSkus.split(','), // sku的arr 必填
                        payType: this.paytypeValue, // 支付方式 4 在线支付 1 货到付款 必填
                        cardNumStr: JSON.stringify(cardNums),
                        codMobile: this.codMobile,
                        orderRemarks: JSON.stringify(orderRemarks),
                        shipTypeStr: JSON.stringify(shipTypeStr),
                        appointCarStr: JSON.stringify(appointCarStr),
                        checkOrderUUID: this.orderMsg.checkOrderUUID // 下单返回的uuid 必填
                    }
                }).then(res => {
                    console.log('====订单提交====');
                    console.log(res);
                    console.log('====订单提交====');
                    this.$indicator.close();
                    let rescode = res.data.code;
                    if (rescode === '2000') {
                        if (this.paytypeValue === 4) {
                            // 在线支付时
                            this.goToPay(res.data.morderId);
                        } else {
                            // 货到付款时
                            this.$router.push({
                                name: 'DeliverySucc',
                                params: {
                                    mid: res.data.morderId,
                                    payamount: res.data.payAmount
                                }
                            });
                        }
                    } else if (rescode === '2050') {
                        this.$xeMessageBox({
                            title: '店铺支付方式不同，请分别下单',
                            message: res.data.msg,
                            closeOnClickModal: false,
                            confirmButtonText: '返回购物车'
                        }).then(() => {
                            this.$router.replace({
                                name: 'Cart'
                            });
                        });
                        this.submitOrderLoading = false;
                    } else if (rescode === '2052') {
                        this.$xeMessageBox({
                            title: '商品库存不足',
                            message: res.data.msg,
                            closeOnClickModal: false,
                            confirmButtonText: '返回购物车'
                        }).then(() => {
                            this.$router.replace({
                                name: 'Cart'
                            });
                        });
                        this.submitOrderLoading = false;
                    } else if (rescode === '2053') {
                        this.$xeMessageBox({
                            title: '商品起订量变更，请重新确定购买数量～',
                            message: res.data.msg,
                            closeOnClickModal: false,
                            confirmButtonText: buyNum ? '返回详情页' : '返回购物车'
                        }).then(() => {
                            if (buyNum) {
                                this.$router.go(-1);
                            } else {
                                this.$router.replace({
                                    name: 'Cart'
                                });
                            }
                        });
                        this.submitOrderLoading = false;
                    } else if (rescode === '2054') {
                        this.$xeMessageBox({
                            title: '促销活动已结束，是否原价购买商品？',
                            message: res.data.msg,
                            closeOnClickModal: false,
                            confirmButtonText: buyNum ? '返回详情页' : '返回购物车'
                        }).then(() => {
                            if (buyNum) {
                                this.$router.go(-1);
                            } else {
                                this.$router.replace({
                                    name: 'Cart'
                                });
                            }
                        });
                    } else if (rescode === '2055') {
                        this.$xeMessageBox({
                            title: '促销商品库存变更，请重新确认购买数量～',
                            message: res.data.msg,
                            closeOnClickModal: false,
                            confirmButtonText: buyNum ? '返回详情页' : '返回购物车'
                        }).then(() => {
                            if (buyNum) {
                                this.$router.go(-1);
                            } else {
                                this.$router.replace({
                                    name: 'Cart'
                                });
                            }
                        });
                        this.submitOrderLoading = false;
                    } else if (rescode === '2100') {
                        this.$xeMessageBox({
                            title: '该商品预售活动已结束',
                            message: res.data.msg,
                            closeOnClickModal: false,
                            confirmButtonText: buyNum ? '返回详情页' : '返回购物车'
                        }).then(() => {
                            if (buyNum) {
                                this.$router.go(-1);
                            } else {
                                this.$router.replace({
                                    name: 'Cart'
                                });
                            }
                        });
                        this.submitOrderLoading = false;
                    } else if (rescode === '2057' || rescode === '2058' || rescode === '2059') {
                        let msgstr = {
                            '2057': '您还未进行身份认证,认证后即可下单~',
                            '2058': '您的身份认证正在审核中,联系客服了解详情~',
                            '2059': '您的身份认证未通过,联系客服了解详情~'
                        };
                        this.$xeMessageBox({
                            title: '提示',
                            message: msgstr[rescode],
                            closeOnClickModal: false,
                            showCancelButton: true,
                            cancelButtonClass: rescode === '2059' ? 'blue' : '',
                            cancelButtonText: rescode === '2059' ? '重新提交' : '稍后再说',
                            // confirmButtonText: rescode === '2057' ? '立即认证' : '联系客服'
                        }).then(action => {
                            console.log(action);
                            if (action === 'cancel') {
                                if (rescode === '2059') {
                                    this.$router.replace({
                                        name: 'PersonalInfor',
                                        query: {
                                            status: '4'
                                        }
                                    });
                                } else {
                                    this.$router.replace({
                                        name: 'Cart'
                                    });
                                }
                            } else {
                                if (rescode === '2057') {
                                    this.$router.replace({
                                        name: 'IdentityAuthentication'
                                    });
                                } else {
                                    this.$router.replace({
                                        name: 'Cart'
                                    });
                                    setTimeout(() => {
                                        window.location.href = 'tel:400-662-6366';
                                    }, 16);
                                }
                            }
                        });
                        this.submitOrderLoading = false;
                    } else if (rescode === '2113') {
                        this.$xeMessageBox({
                            message: '您有未支付的货到付款订单，请支付后再下单~也可选择在线支付方式提交订单',
                            closeOnClickModal: false,
                            confirmButtonText: '确定'
                        }).then(() => {
                        });
                        this.submitOrderLoading = false;
                    } else {
                        this.$xeMessageBox({
                            message: res.data.msg,
                            closeOnClickModal: false,
                            confirmButtonText: '返回购物车'
                        }).then(() => {
                            this.$router.replace({
                                name: 'Cart'
                            });
                        });
                        this.submitOrderLoading = false;
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
            adrVisibleFn() {
                if (this.adrTempItem) {
                    this.defaultCaId = this.adrTempItem.caId;
                }
                this.adrVisible = true;
            },
            toAddFn() {
                this.$router.push({
                    name: 'AddNewAdr',
                    query: {
                        redirect: this.$route.fullPath,
                        lockAdr: 1,
                        adrInfo: this.addAddrInfo ? JSON.stringify(this.addAddrInfo) : ''
                    }
                });
            },
            adrChangeFn(item) {
                // 切换地址时
                console.log(item);
//                {"provinceId":998,"provinceName":"河南","areaName":"中原区","areaId":1000,"cityName":"郑州市","cityId":999}
                // 更新缓存内的地址数据
                let stroageAdrItem = {
                    provinceId: item.caProvince,
                    provinceName: item.caProvName,
                    cityId: item.caCity,
                    cityName: item.caCityName,
                    areaId: item.caArea,
                    areaName: item.caAreaName
                };
                this.$setLocalStorage('REGIONMAP', JSON.stringify(stroageAdrItem));
                if (!this.adrTempItem) {
                    // 没有默认数据时 addrflag 为2 3时
                    this.$setLocalStorage(stroageCaIdKey, item.caId);
//                    this.$router.go(0);
                    window.location.reload();
                } else {
                    // 1时
                    if (this.adrTempItem.caArea === item.caArea) {
                        // 选择相同区域时
                        this.adrTempItem = item;
                    } else {
                        this.$setLocalStorage(stroageCaIdKey, item.caId);
//                        this.$router.go(0);
                        window.location.reload();
                    }
                }
                this.adrVisible = false;
            },
            getCaIdInStroage() {
                let storageCaId = this.$getLocalStorage(stroageCaIdKey);
                this.adrDatas.some(item => {
                    if (item.caId === storageCaId) {
                        this.adrTempItem = item;
                    }
                });
                this.$removeLocalStorage(stroageCaIdKey);
            },
            showCouponList(item) {
                // 商户券
                if (item.disableDisAmount) {
                    this.$toast({
                        message: '同一个商户一次只能使用一张优惠券！',
                        duration: 1500
                    });
                    return;
                }
                if (item.couponList && item.couponList.length) {
                    this.couponList = item.couponList;
                    if (!item.disAomuntZw && item.disAomuntZw !== 0) {
                        this.$set(item, 'disAomuntZw', 0); // 在item里加入存放选中的优惠券金额字段
                    }
                    this.shopTempItem = item;
                    console.log(item);
                    this.couponVisible = true;
                    this.couponType = 'couponshop';
                }
            },
            showCouponListxb() {
                // 如来云商券
                if (this.orderMsg.platCouponList && this.orderMsg.platCouponList.length) {
                    if ((this.orderMsg.totalAmount - this.disAmount) >= 0) {
                        this.couponList = this.orderMsg.platCouponList;
                        this.couponVisible = true;
                        this.couponType = 'couponplat';
                    } else {
                        this.$toast({
                            message: '您选用的优惠券总和已超出订单金额，不要太贪心哦~',
                            duration: 1500
                        });
                    }
                }
            },
            createCoupTempletById(item) {
                if (this.couponType === 'couponshop') {
                    // 普通商户优惠券-------
                    // 立即使用优惠券
                    if ((parseFloat(item.useDisAmount) + parseFloat(this.couponTypePlatAmount)) < this.orderMsg.totalAmount) {
                        this.shopTempItem.disAomuntZw = item.useDisAmount;
                        this.shopTempItem.disAomuntCardNum = item.cardNum;
                        // 查询是否有相同的商户
                        this.orderMsg.venProList.filter(item => {
                            return item.userCode === this.shopTempItem.userCode && !item.disAomuntZw;
                        }).forEach(item => {
                            item.disableDisAmount = true;
                        });
                        this.couponVisible = false;
                    } else {
                        this.$toast({
                            message: '您选用的优惠券总和已超出订单金额，不要太贪心哦~',
                            duration: 1500
                        });
                    }
                } else if (this.couponType === 'couponplat') {
                    // 如来云商优惠券---------
                    if ((parseFloat(item.useDisAmount) + parseFloat(this.disAmount)) >= this.orderMsg.totalAmount) {
                        this.$toast({
                            message: '您选用的优惠券总和已超出订单金额，不要太贪心哦~',
                            duration: 1500
                        });
                    } else {
                        this.couponVisible = false;
                        this.platTempItem = item.cardNum;
                        this.couponTypePlatAmount = item.useDisAmount; // 如来云商优惠券金额
                        console.log('item.disAmount', item.useDisAmount);
                    }
                }
            },
            delCoupTemplet() {
                if (this.couponType === 'couponshop') {
                    this.shopTempItem.disAomuntZw = 0;
                    this.shopTempItem.disAomuntCardNum = null;
                    // 查询是否有相同的商户
                    this.orderMsg.venProList.filter(item => {
                        return item.userCode === this.shopTempItem.userCode;
                    }).forEach(item => {
                        item.disableDisAmount = false;
                    });
                } else if (this.couponType === 'couponplat') {
                    this.platTempItem = '';
                    this.couponTypePlatAmount = 0; // 如来云商优惠券金额
                }
                this.couponVisible = false;
            },
            yzmDialogSure() {
                // 验证手机号确认
                if (!this.smsCode) {
                    this.$toast({
                        message: '请输入验证码',
                        duration: 1500
                    });
                    return;
                }
                this.checkSmsCodeForOrder();
            },
            yzmDialogCancel() {
                // 验证手机号取消
                this.yzmDialog = false;
            },
            querySalemanInfoForOrder: debounce(300, function() {
                this.$http({
                    method: 'post',
                    url: '/xe-route/xe-app/mobile/checkOrder/querySalemanInfoForOrder',
                    data: {
                        mobile: this.orderConfirmTel,
                        areaId: JSON.parse(this.$getLocalStorage('REGIONMAP')).areaId
                    }
                }).then(res => {
                    if (res.data.saleManArr.length) {
                        this.suggestData = res.data.saleManArr;
                        this.showSuggest = true;
                    } else {
                        this.showSuggest = false;
                    }
                }).catch(error => {
                    console.log(error);
                });
            }),
            suggestClick(item) {
                console.log(item);
                this.orderConfirmTel = item.mobile;
                this.showSuggest = false;
            },
            getYzmCode() {
                // 发送验证码
                if (this.yzmBtnFlag) {
                    return;
                }
                if (!this.orderConfirmTel || this.orderConfirmTel.length !== 11) {
                    return;
                }
                if (!(/^1(3|4|5|6|7|8|9)\d{9}$/.test(this.orderConfirmTel))) {
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
                    url: '/xe-route/xe-app/mobile/checkOrder/sendSmsCodeForOrder',
                    data: {
                        mobile: this.orderConfirmTel,
                        areaId: JSON.parse(this.$getLocalStorage('REGIONMAP')).areaId
                    }
                }).then(res => {
                    console.log(res);
                    this.yzbtnText = 60;
                    this.timer = setInterval(() => {
                        this.yzbtnText--;
                        if (this.yzbtnText === 0) {
                            clearInterval(this.timer);
                            this.yzbtnText = '重新获取';
                            this.yzmBtnFlag = false;
                        }
                    }, 1000);
                }).catch(error => {
                    console.log(error);
                    clearInterval(this.timer);
                    this.yzbtnText = '重新获取';
                    this.yzmBtnFlag = false;
                });
            },
            checkSmsCodeForOrder() {
                // 校验验证码
                this.$http({
                    method: 'post',
                    url: '/xe-route/xe-app/mobile/checkOrder/checkSmsCodeForOrder',
                    data: {
                        mobile: this.orderConfirmTel,
                        smsCode: this.smsCode
                    }
                }).then(res => {
                    console.log(res);
                    this.yzmDialog = false;
                    this.codMobile = this.orderConfirmTel;
                    this.$nextTick(() => {
                        this.submitOrder();
                    });
                }).catch(error => {
                    console.log(error);
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
            },
            navToAddNewAdr() {
                this.$router.push({
                    name: 'AddNewAdr',
                    query: {
                        redirect: this.$route.fullPath,
                        lockAdr: 1 // 1为锁定新增地址的省和市
                    }
                });
            }
        },
        computed: {
            paytypeComputed: {
                get() {
                    return this.orderMsg.payType;
                },
                set(val) {
                    console.log(val);
                    if (val === '1') {
                        this.paytypeValue = 4;
                        this.paytypeArrs = [{name: '在线支付', type: 4}];
                    }
                    else if (val === '2') {
                        this.paytypeValue = 1;
                        this.paytypeArrs = [{name: '货到付款', type: 1}];
                    }
                    else {
                        this.paytypeValue = 4;
                        this.paytypeArrs = [{name: '在线支付', type: 4}, {name: '货到付款', type: 1}];
                        // this.paytypeArrs = [{name: '在线支付', type: 4}];
                    }
                }
            },
            disAmount() {
                // 优惠金额
                let result = 0;
                if (this.orderMsg.venProList.length > 0) {
                    this.orderMsg.venProList.forEach(item => {
                        let itemValue = !item.disAomuntZw || item.disAomuntZw === 0 ? 0 : item.disAomuntZw;
                        result += itemValue;
                    });
                }
                return result.toFixed(2);
            },
            freAmount() {
                let result = 0;
                if (this.orderMsg.venProList.length > 0) {
                    this.orderMsg.venProList.forEach(item => {
                        if (item.shipTypeList[0] === '1' && item.shipTyped === '1') {
                            // 只取有配送或者选中配送的运费
                            result += item.venFreAmount;
                        }
                    });
                }
                console.log('computed freAmount');
                console.log(result.toFixed(2));
                console.log('computed freAmount');
                return result.toFixed(2);
            },
            payTotalPrice() {
                // 总价  商品总金额 + 运费金额 - 优惠金额(店铺)- 优惠券（如来云商券）
                console.log('computed totalPrice');
                if (this.orderMsg.venProList.length > 0) {
                    let totalPrice = (((parseFloat(this.orderMsg.totalAmount) + parseFloat(this.freAmount)) - parseFloat(this.disAmount)).toFixed(2) - parseFloat(this.couponTypePlatAmount)).toFixed(2);
                    let couponTempletsDtoList = this.orderMsg.couponTempletsDtoList;
                    if (couponTempletsDtoList && couponTempletsDtoList.length) {
                        let useDisAmountArray = [];
                        couponTempletsDtoList.forEach(item => {
                            if (item.sendOrderAmount <= totalPrice) {
                                useDisAmountArray.push(item.useDisAmount);
                            }
                        });
                        if (useDisAmountArray.length) {
                            this.couponTempMaxNum = Math.max.apply(null, useDisAmountArray);
                        } else {
                            this.couponTempMaxNum = 0;
                        }
                    }
                    return totalPrice;
                } else {
                    this.couponTempMaxNum = 0;
                    return 0;
                }
            }
        },
        watch: {
            orderConfirmTel(val) {
                if (val.length === 11) {
                    return;
                }
                this.querySalemanInfoForOrder();
            }
        },
        destroyed() {
            clearInterval(this.timer);
        },
        components: {
            [Checkbox.name]: Checkbox,
            [invoice.name]: invoice,
            [Popup.name]: Popup,
            [delivery.name]: delivery,
            ChooseAdrItem,
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
            // padding: 0 20/$ppr;
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
            .det-tobuy {
                flex:1;
                font-size: 34/$ppr;
                text-align: center;
                line-height: 98/$ppr;
                border-radius: 0;
                height: 100%;
                color: #fff;
                min-width: 230/$ppr;
                padding:0 30/$ppr;
                background: #f23531;
            }
            .det-tocart {
                background: $com-color;
            }
        }
    }
    /*优惠券*/
    .popup-coupon-itemcon {
        &.coupon-itemcon-confirm {
            display: flex;
            flex-direction: column;
            height: 100%;
            .itemcon-confirm {
                flex: 1;
                padding: 20/$ppr;
                overflow: auto;
                -webkit-overflow-scrolling: touch;
            }
            .item-btn {
                height: 88/$ppr;
                background-color: #fff;
                border-top: 1/$ppr solid $border-color-e8e;
                text-align: center;
                line-height: 88/$ppr;
                font-size: 32/$ppr;
            }
        }
    }
    .m-flexlay-confirm {
        .m-list-block .item-inner .item-title {
            font-size: 28/$ppr;
            font-weight: 400;
        }
    }
    .allmoney {
        padding: 8/$ppr 0 0 20/$ppr;
        // @include flexbox();
        box-sizing: border-box;
        .pay-coupon {
            padding: 7/$ppr 0  5/$ppr 14/$ppr;
            color: #333;
            &.no-margin {
                padding-left: 0;
            }
            .pay_all {
                line-height: 40/$ppr;
                font-size: 32/$ppr;
                &.pay_top{
                    line-height: 70/$ppr;
                }
                span {
                    color: #f23530;
                }
                i {
                    font-size: 24/$ppr;
                    color: #999;
                    padding-left: 8/$ppr;
                }
            }
            .pay_money {
                line-height: 32/$ppr;
                font-size: 24/$ppr;
            }
        }
    }
</style>
