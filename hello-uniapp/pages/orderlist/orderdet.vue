<template>
    <transition name="slideInRight">
        <div class="det-inquiry-box">
            <div class="det-inquiry-con" v-if="orderDetMsg">
                <div class="det-inquiry-content">
                    <div class="m-item">
                        <div class="det-inquiry-status">
                            <div class="sta-con">
                                <!--"orderStatus": 10,//订单状态  ：1 已完成 2 已发货 3待发货 4已取消 10待处理 11支付处理中-->
                                <template v-if="orderDetMsg.orderStatus === 1">
                                    <!--已完成-->
                                    <div class="sta-text">
                                        <span class="xe-iconfont xe-icon-daifukuan"></span> 已完成
                                    </div>
                                </template>
                                <template v-if="orderDetMsg.orderStatus === 2">
                                    <!--已发货-->
                                    <div class="sta-text">
                                        <span class="xe-iconfont xe-icon-daifukuan"></span> 待收货
                                    </div>
                                </template>
                                <template v-if="orderDetMsg.orderStatus === 3">
                                    <!--待发货-->
                                    <div class="sta-text">
                                        <span class="xe-iconfont xe-icon-daifukuan"></span> 待发货
                                    </div>
                                </template>
                                <template v-if="orderDetMsg.orderStatus === 4">
                                    <!--已取消-->
                                    <div class="sta-text">
                                        <span class="xe-iconfont xe-icon-daifukuan"></span> 已取消
                                    </div>
                                </template>
                                <template v-if="orderDetMsg.orderStatus === 10">
                                    <!--待处理-->
                                    <div class="sta-text">
                                        <span class="xe-iconfont xe-icon-daifukuan"></span> 待付款
                                    </div>
                                </template>
                                <template v-if="orderDetMsg.orderStatus === 11">
                                    <!--支付处理中-->
                                    <div class="sta-text">
                                        <span class="xe-iconfont xe-icon-daifukuan"></span> 待收货
                                    </div>
                                </template>
                                <div class="sta-time" v-if="orderDetMsg.orderStatus === 10">
                                    剩余：<xe-countdown :time="orderDetMsg.endTime" timetype="second" format="{%h}时{%m}分{%s}秒"></xe-countdown>
                                </div>
                            </div>
                            <div class="sta-num">订单编号：{{orderDetMsg.orderId}}</div>
                            <div class="sta-remark" v-if="orderDetMsg.orderStatus === 4 && orderDetMsg.cancelRemark">取消原因：{{orderDetMsg.cancelRemark}}</div>
                        </div>
                        <div class="det-inquiry-adr">
                            <div class="adr-user">
                                <span>{{orderDetMsg.caConsignee}}</span><span>{{orderDetMsg.caPhone}}</span>
                            </div>
                            <div class="adr-msg">
                                <div class="xe-iconfont xe-icon-dingwei"></div>
                                <div class="adr-msg-text">{{orderDetMsg.addrDetail}}</div>
                            </div>
                        </div>
                    </div>
                    <div class="m-item">
                        <div class="orderlist-item">
                            <div class="order-item-shop">
                                <span class="xe-iconfont xe-icon-dian"></span>
                                <router-link :to="{name: 'Store', query: {userCode: orderDetMsg.userCode}}" class="arrow-right-commons">{{orderDetMsg.venName ? orderDetMsg.venName : orderDetMsg.storeName}}</router-link>
                            </div>
                            <div class="order-item-procon">
                                <router-link
                                    tag="div"
                                    class="order-item-pro"
                                    v-for="proItem in orderDetMsg.orderDetailList"
                                    :to="{name: 'ProductDetails', params: {prospu: proItem.proSpu}, query: {prosku: proItem.proSku}}"
                                    :key="proItem.itemId">
                                    <div class="pic">
                                        <img v-lazy="picServer + proItem.proPicture" alt="">
                                    </div>
                                    <div class="msg">
                                        <div class="pro-name">
                                            <span v-if="proItem.proType === 4" class="coupon-style coupon-style-miao">秒</span>
                                            <span v-if="proItem.proType === 6" class="xe-iconfont xe-icon-yushoufuben coupon-style-icon1" style="padding: 0 6px"></span>
                                            {{proItem.proName}}
                                        </div>
                                        <div class="pro-spec">规格：{{proItem.specValue}}</div>
                                        <div class="pro-spec" v-if="proItem.realSendNum">实发量：{{proItem.realSendNum}}{{proItem.proUnit}}</div>
                                    </div>
                                    <div class="pri">
                                        <div class="price">
                                            <p class="npri">&yen;{{proItem.proCostPrice | toFixed2}}/{{proItem.proUnit}}</p>
                                            <p class="opri" v-if="proItem.proCostPrice !== proItem.proBasePrice"><s>&yen;{{proItem.proBasePrice | toFixed2}}/{{proItem.proUnit}}</s></p>
                                        </div>
                                        <div class="nums">
                                            x{{proItem.purchaseNum}}
                                        </div>
                                    </div>
                                </router-link>
                            </div>
                        </div>
                    </div>
                    <div class="m-item">
                        <div class="m-list-block">
                            <ul>
                                <li class="item-content" v-if="orderDetMsg.orderType === 1">
                                    <div class="item-media"></div>
                                    <div class="item-inner">
                                        <div class="item-title">店铺优惠券</div>
                                        <div class="item-after">
                                            <template v-if="orderDetMsg.cpnsPmtAomount">
                                                &yen;{{orderDetMsg.cpnsPmtAomount | toFixed2}}
                                            </template>
                                            <template v-else>无</template>
                                        </div>
                                    </div>
                                </li>
                                <li class="item-content">
                                    <div class="item-media"></div>
                                    <div class="item-inner">
                                        <div class="item-title">配送方式</div>
                                        <div class="item-after">
                                            {{orderDetMsg.shipType | shipTypeToText}}<template v-if="orderDetMsg.shipCarDes">,{{orderDetMsg.shipCarDes}}</template>
                                        </div>
                                    </div>
                                </li>
                                <li class="item-content">
                                    <div class="item-media"></div>
                                    <div class="item-inner">
                                        <div class="item-title">订单备注</div>
                                        <div class="item-after">{{orderDetMsg.orderRemark ? orderDetMsg.orderRemark : '无'}}</div>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div class="m-item">
                        <div class="m-list-block">
                            <ul>
                                <li class="item-content">
                                    <div class="item-media"></div>
                                    <div class="item-inner">
                                        <div class="item-title">支付方式</div>
                                        <div class="item-after">{{orderDetMsg.payType | payTypeToText}}</div>
                                    </div>
                                </li>
                                <li class="item-content" v-if="orderDetMsg.orderType === 1">
                                    <div class="item-media"></div>
                                    <div class="item-inner">
                                        <div class="item-title">如来云商优惠券</div>
                                        <div class="item-after">
                                            <template v-if="orderDetMsg.platPmtAmount">
                                                &yen;{{orderDetMsg.platPmtAmount | toFixed2}}
                                            </template>
                                            <template v-else>无</template>
                                        </div>
                                    </div>
                                </li>
                                <li class="item-content">
                                    <div class="item-media"></div>
                                    <div class="item-inner" v-if='!orderDetMsg.taxTitle'>
                                        <div class="item-title">发票</div>
                                        <div class="item-after">无</div>
                                    </div>
                                    <div class="item-inner item-inner-column" v-else>
                                        <div class="item-inner-con">
                                            <div class="item-title">发票类型</div>
                                            <div class="item-after">{{orderDetMsg.taxType | taxTypeToText}}</div>
                                        </div>
                                        <div class="item-inner-con">
                                            <div class="item-title">发票抬头</div>
                                            <div class="item-after">{{orderDetMsg.taxCompany}}</div>
                                        </div>
                                        <div class="item-inner-con">
                                            <div class="item-title">发票内容</div>
                                            <div class="item-after">{{orderDetMsg.taxContent | taxContentToText}}</div>
                                        </div>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div class="m-item">
                        <div class="det-inquiry-top gray">
                            <div>
                                <div>商品总额</div>
                                <div>¥{{orderDetMsg.goodsAmount | toFixed2}}</div>
                            </div>
                            <div v-if="orderDetMsg.orderType === 1">
                                <div>优惠券</div>
                                <div>-¥{{orderDetMsg.totalPmtAomount | toFixed2}}</div>
                            </div>
                            <div v-if="orderDetMsg.specialDisamount">
                                <div>撮合总额</div>
                                <div>
                                    <template v-if="orderDetMsg.specialDisamount > 0">-</template>
                                    <template v-else>+</template>¥{{Math.abs(orderDetMsg.specialDisamount) | toFixed2}}</div>
                            </div>
                            <div>
                                <div>运费</div>
                                <div>+¥{{orderDetMsg.freAmount | toFixed2}}</div>
                            </div>
                        </div>
                        <div class="det-inquiry-top border">
                            <div>
                                <div>订单总额</div>
                                <div>¥{{orderDetMsg.totalAmount | toFixed2}}</div>
                            </div>
                            <div v-if="orderDetMsg.realRefundedAmount">
                                <div>差异退款</div>
                                <div>-¥{{orderDetMsg.realRefundedAmount | toFixed2}}</div>
                            </div>
                        </div>
                    </div>
                    <div class="m-item">
                        <div class="det-inquiry-bottom">
                            <p class="ypay">
                                <template v-if="orderDetMsg.orderStatus === 1">实付款: </template>
                                <template v-else>
                                    <template v-if="orderDetMsg.payStatus === 1">
                                        实付款:
                                    </template>
                                    <template v-else>
                                        应付款:
                                    </template>
                                </template>
                                <span>&yen;{{orderDetMsg.payAmount | toFixed2}}</span>
                            </p>
                            <p class="ctime">下单时间: {{orderDetMsg.createDate}}</p>
                            <p class="ctime" v-if="orderDetMsg.parentOrderid !== '0' && orderDetMsg.parentOrderid ">关联订单号: {{orderDetMsg.parentOrderid}}</p>
                        </div>
                    </div>
                </div>
                <div class="det-inquiry-btns">
                    <div class="lcon">
                        <!--<mt-button size="small" class="xe-button-default" plain @click="back">返回</mt-button>-->
                    </div>
                    <!--"orderStatus": 10,//订单状态  ：1 已完成 2 已发货 3待发货 4已取消 10待处理 11支付处理中-->
                    <template v-if="orderDetMsg.orderStatus === 1">
                        <!--已完成-->
                        <div class="rcon">
                            <mt-button size="small" class="xe-button-default" plain @click="goToOrderTracking">查看物流</mt-button>
                            <mt-button class="xe-button-default" plain  size="small" v-if="orderDetMsg.payType == 1" @click.prevent.stop="detailsOfMethod(orderDetMsg)">付款详情</mt-button>
                            <mt-button v-if="orderDetMsg.orderType === 1" type='primary' size="small" class="xe-button-primary" @click="buyAgain">再次购买</mt-button>
                            <mt-button v-else type='primary' size="small" class="xe-button-primary" @click="inquiryAgain">再次询价</mt-button>
                        </div>
                    </template>
                    <template v-if="orderDetMsg.orderStatus === 2">
                        <!--待收货-->
                        <div class="rcon">
                            <mt-button size="small" class="xe-button-default" plain @click="goToOrderTracking">查看物流</mt-button>
                            <mt-button type='primary' size="small" class="xe-button-primary" v-if="orderDetMsg.payStatus == 2 && orderDetMsg.payType == 1" @click.prevent.stop="goToPay()">立即支付</mt-button>
                            <mt-button class="xe-button-default" plain  size="small" v-if="orderDetMsg.payStatus !== 2 && orderDetMsg.payType == 1" @click.prevent.stop="detailsOfMethod(orderDetMsg)">付款详情</mt-button>
                            <mt-button type='primary' size="small" class="xe-button-primary" @click.prevent="confirmReceipt">确认收货</mt-button>
                        </div>
                    </template>
                    <template v-if="orderDetMsg.orderStatus === 3">
                        <!--待发货-->
                        <div class="rcon">
                            <mt-button size="small" class="xe-button-default" plain @click="goToOrderTracking">查看物流</mt-button>
                        </div>
                    </template>
                    <template v-if="orderDetMsg.orderStatus === 4">
                        <!--已取消-->
                        <div class="rcon">
                            <mt-button size="small" class="xe-button-default" plain @click="confirmDelOrder">删除订单</mt-button>
                            <mt-button v-if="orderDetMsg.orderType === 1" type='primary' size="small" class="xe-button-primary" @click="buyAgain">再次购买</mt-button>
                            <mt-button v-else type='primary' size="small" class="xe-button-primary" @click="inquiryAgain">再次询价</mt-button>
                        </div>
                    </template>
                    <template v-if="orderDetMsg.orderStatus === 10">
                        <!--待付款-->
                        <div class="rcon">
                            <mt-button size="small" class="xe-button-default" plain @click="confirmCancelOrder">取消订单</mt-button>
                            <mt-button type='primary' size="small" class="xe-button-primary" @click.prevent="goToPay()">立即支付</mt-button>
                        </div>
                    </template>
                    <template v-if="orderDetMsg.orderStatus === 11">
                        <div class="rcon">
                            <mt-button size="small" class="xe-button-default" plain @click="goToOrderTracking">查看物流</mt-button>
                            <mt-button class="xe-button-default" plain  size="small" v-if="orderDetMsg.payType == 1" @click.prevent.stop="detailsOfMethod(orderDetMsg)">付款详情</mt-button>
                            <mt-button type='primary' size="small" class="xe-button-primary" @click.prevent="confirmReceipt">确认收货</mt-button>
                        </div>
                    </template>
                </div>
            </div>

        </div>
    </transition>
</template>
<script type="text/ecmascript-6">
    import {CountDown} from 'components/CountDown';
    export default {
        name: 'xe-page-orderdet',
        data() {
            return {
                loaded: false,
                picServer: '',
                orderDetMsg: null
            };
        },
        activated() {
            console.log('123====');
            this.queryMyOrderDetail();
        },
        methods: {
            detailsOfMethod(item) {
                let LOGINSTATUS = this.$getLocalStorage('LOGINSTATUS');
                let walletUrl = `${window.locationHref}detailsOfpayment`;
                window.location.href = `${walletUrl}?ent=1&dealNo=${item.payNumber}&loginStatus=${LOGINSTATUS}&client=1`;
            },
            queryMyOrderDetail() {
                this.$indicator.open('加载订单详情...');
                this.$http({
                    method: 'post',
                    url: '/xe-route/xe-app/mobile/orderInfo/queryMyOrderDetail',
                    data: {
                        orderId: this.$route.params.oid,
                        morderId: this.$route.params.mid
                    }
                }).then(res => {
                    this.$indicator.close();
                    if (res.data.code === '2000') {
                        this.picServer = res.data.picServer;
                        this.orderDetMsg = res.data.orderDto;
                    } else if (res.data.code === '2001') {
                        this.$xeMessageBox({
                            message: '当前订单状态已发生改变',
                            closeOnClickModal: false,
                            confirmButtonText: '返回'
                        }).then(action => {
                            if (action === 'confirm') {
                                this.$router.go(-1);
                                this.$parent.$parent.reloadQueryMyOrder();
                            }
                        });
                    }
                }).catch(error => {
                    console.log(error);
                    this.$indicator.close();
                    this.$router.go(-1);
                });
            },
            goToPay() {
                // 去支付
                if (this.orderDetMsg.releOrderList && this.orderDetMsg.releOrderList.length) {
                    console.log(this.orderDetMsg.releOrderList);
                    this.$xeMessageBox({
                        title: '关联订单将一起支付',
                        showCancelButton: true,
                        confirmButtonText: '去支付',
                        message: `订单编号：${this.orderDetMsg.releOrderList.join(',')}`
                    }).then(action => {
                        if (action === 'confirm') {
                            this.$parent.$parent.goToPay(this.orderDetMsg.payNumber, true, this.orderDetMsg.payType);
                        }
                    });
                    return;
                }
                this.$parent.$parent.goToPay(this.orderDetMsg.payNumber, true, this.orderDetMsg.payType);
            },
            confirmReceipt() {
                // 确认收货已支付
                console.log('this.orderDetMsg.payStatus', this.orderDetMsg.payStatus);
                if (this.orderDetMsg.payStatus === 1) {
                    this.$parent.$parent.confirmReceipt(this.$route.params.mid, this.$route.params.oid, this.$route.query.version, this.orderDetMsg.payStatus, this.$route.query.index, () => {
                        this.back();
                    });
                } else if (this.orderDetMsg.payStatus === 2) {
                    // 未支付
                    this.$xeMessageBox.alert('您还未支付货款，请支付后确认收货~').then(action => {
                    }).catch(error => {
                        console.log(error);
                    });
                }
            },
            confirmCancelOrder() {
                // 取消订单
                this.$parent.$parent.confirmCancelOrder(this.$route.params.mid, this.$route.query.index, true, () => {
                    this.back();
                });
            },
            confirmDelOrder() {
                // 删除订单
                this.$parent.$parent.confirmDelOrder(this.$route.params.oid, this.$route.query.index, () => {
                    this.back();
                });
            },
            goToOrderTracking() {
                this.$router.push({
                    name: 'OrderTracking',
                    params: {
                        oid: this.$route.params.oid
                    }
                });
            },
            buyAgain() {
                // 再次购买
                this.$parent.$parent.buyAgain(this.orderDetMsg.orderDetailList, true);
            },
            inquiryAgain() {
                // 再次询价
                this.$parent.$parent.aginInquiry(this.orderDetMsg.orderDetailList, true);
            },
            back() {
                this.$router.go(-1);
            }
        },
        components: {
            [CountDown.name]: CountDown
        }
    };
</script>
<style rel="stylesheet/scss" lang="scss">
    @import '../../static/styles/rules.scss';
    .det-inquiry-box {
        position: fixed;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        z-index: 2;
        background: $bg-color-f5f;
        .m-list-block  {
            .item-inner {
                .item-title {
                    font-size: 28/$ppr;
                }
                color: #999;
            }
            .item-content {
                padding-left: 0;
            }
        }
        .det-inquiry-con {
            height: 100%;
            display: flex;
            flex-direction: column;
        }
        .det-inquiry-content {
            flex: 1;
            height: 100%;
            overflow: auto;
            -webkit-overflow-scrolling: touch;
        }
        .det-inquiry-btns {
            height: 98/$ppr;
            padding: 20/$ppr;
            background: #fff;
            border-top: 1/$ppr solid $border-color-e8e;
            text-align: right;
            font-size: 0;
            display:flex;
            justify-content: space-between;
            .mint-button {
                margin-left: 20/$ppr;
            }
        }
        .m-item {
            background: #fff;
            margin: 20/$ppr 0;
            &:first-child {
                margin-top: 0;
            }
        }
        .det-inquiry-status {
            min-height: 148/$ppr;
            padding: 36/$ppr 20/$ppr;
            background: linear-gradient(left, #ff8764, #ff7164) no-repeat;
            background: -webkit-linear-gradient(left, #ff8764, #ff7164) no-repeat;
            color: #fff;
            .sta-con {
                display: flex;
                justify-content: space-between;
                align-items: center;
                .sta-text {
                    font-size: 32/$ppr;
                    white-space: nowrap;
                    margin-right: 30/$ppr;
                    .xe-iconfont {
                        display: inline-block;
                        width: 34/$ppr;
                        height: 34/$ppr;
                        vertical-align: top;
                        font-size: 32/$ppr;
                        margin-top: 3/$ppr;
                        line-height: 1;
                        text-align: center;
                        margin-right: 10/$ppr;
                    }
                }
                .sta-time {
                    font-size: 26/$ppr;
                }
            }
            .sta-num {
                margin-top: 16/$ppr;
                font-size: 26/$ppr;
            }
            .sta-remark {
                margin-top: 20/$ppr;
                font-size: 24/$ppr;
            }
        }
        .det-inquiry-top {
            padding: 10/$ppr 20/$ppr;
            &.border {
                border-top: 1/$ppr solid $border-color-e8e;
             }
            &.gray {
                > div {
                    color: $text-999;
                    > div {
                        &:nth-child(2) {
                            color: $text-666;
                        }
                    }
                }
            }
            > div {
                display: flex;
                justify-content: space-between;
                font-size: 28/$ppr;
                margin: 20/$ppr 0;
                > div {
                    &:nth-child(2) {
                        color: $main-color;
                    }
                }
            }
        }
        .det-inquiry-bottom {
            margin-left: 20/$ppr;
            padding: 20/$ppr;
            padding-left: 0;
            border-top: 1/$ppr solid $border-color-e8e;
            text-align: right;
            .ypay {
                font-size: 28/$ppr;
                span {
                    color: $main-color;
                }
            }
            .ctime {
                font-size: 24/$ppr;
                margin-top: 15/$ppr;
            }
        }
    }
</style>
