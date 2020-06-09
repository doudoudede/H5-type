<template>
    <xe-layout class="m-flexlay m-flexlay-inten">
        <view class="intention-contentDetails">
            <view class="contenDetails-scroBox">
                <view class="contenDetails-userInfo">
                    <view class="uerInfo-topItem">
                        <view class="topItem-orderlis">
                            <p>意向单编号:{{orderDtoData.wishCode}}</p>
                            <p class="col_red">{{orderDtoData.wishStatus | wishStatusToText}}</p>
                        </view>
                        <view class="topItem-orderlis" v-if="orderDtoData.wishStatus === 1">
                            <p v-if="orderDtoData.orderId">生成订单号:
                                <span class="cor_blu" v-for="(item, index) in orderDtoData.orderId.split(',')" :key="index" @click.prevent="goOrderDet(item)">
                                {{item}}&nbsp;
                            </span></p>
                        </view>
                        <view class="topItem-orderTit">{{orderDtoData.wishStatus === 1 ? '成交金额' : '意向金额'}}</view>
                        <view class="topItem-orderFri"> <i>¥</i>{{orderDtoData.wishStatus === 1 ? (orderDtoData.orderPayAmount ? parseFloat(orderDtoData.orderPayAmount).toFixed(2) : '0.00') : (orderDtoData.payAmount ? parseFloat(orderDtoData.payAmount).toFixed(2) : '0.00')}}</view>
                    </view>
                    <view class="uerInfo-botItem">
                        <view class="userInfo-item"><span class="xe-iconfont xe-icon-wo"></span>{{orderDtoData.caConsignee}}&nbsp;&nbsp;{{orderDtoData.caPhone}}</view>
                        <view class="userInfo-item"><span class="xe-iconfont xe-icon-dizhi"></span>{{orderDtoData.addrDetail}}</view>
                    </view>
                </view>
                <view class="contenDetails-proCont">
                    <view class="pro-Cont-tit">商品信息</view>
                    <view class="pro-Cont-item" v-for="(item, index) in orderDtoData.wishOrderDetailList" :key='index' @click.prevent="goDetails(item)">
                        <view class="msg-picshow">
                            <img :src="picServer + item.proPicture" alt="">
                        </view>
                        <view class="msg-pre-text">
                            <view class="pre-mainCon">
                                {{item.proName}}
                            </view>
                            <view class="pre-shopname">{{item.shopName}}</view>
                            <view class="pre-Spes">
                                规格：
                                <span v-if="item.specValue">
                                    {{item.specValue}}
                                </span>
                                <span v-else>无</span>
                            </view>
                            <view class="pre-frice">
                                <span class="cor_red" v-if="item.matchPrice"><i>¥</i>{{parseFloat(item.matchPrice).toFixed(2)}} <i>/{{item.proUnit}}</i></span>
                                <span class="flo_R">x{{item.matchNum}}</span>
                            </view>
                        </view>
                    </view>
                </view>
            </view>
            <view class="contenDetails-butfixed" v-if="orderDtoData.wishStatus === 2">
                <mt-button  class="xe-button-default" @click.prevent="orderCancel(orderDtoData.wishCode)" style="width: 50%;border-radius:0">取消</mt-button>
                <mt-button type="primary"  style="width: 50%;border-radius:0" :loading="subLoading"  class="xe-button-primary bj_red" @click.prevent="goConfirmor">去下单</mt-button>
            </view>
            <!--底部弹框-->
            <xe-popup
                :show.sync="showFlag"
                popupTit="取消原因"
                slot="outer"
                position="bottom">
                <view class='useInfor-selec-box'>
                    <view class="useInfor-selec-top">
                        <ul>
                            <xe-radio-group v-model="cancelType">
                                <li class="selec-item" v-for="(item, index) in userProperData" :key="index">
                                    <view class="selec-radio">
                                        <xe-radio :label="item.value">
                                            {{item.name}}&nbsp;&nbsp;&nbsp;
                                            <input type="text" v-model.trim="cancelRemark" v-if="item.value == 5" :maxlength="20" style="width:80%" placeholder="请输入取消原因">
                                        </xe-radio>
                                    </view>
                                </li>
                            </xe-radio-group>
                        </ul>
                    </view>
                    <view class="useInfor-selec-tishi">取消后意向单失效，不可下单</view>
                    <view class="useInfor-selec-footer">
                        <mt-button  type="primary" class="xe-button-primary" @click.prevent="dialogCancel" style="width: 50%;background: #fff;color: #333;" >取消</mt-button>
                        <mt-button  type="primary" class="xe-button-primary" style="width: 50%;" @click.prevent="orderCancelGo">确定</mt-button>
                    </view>
                </view>
            </xe-popup>
        </view>
    </xe-layout>
</template>
<script type="text/ecmascript-6">
    import {Popup} from 'components/Popup';
    import {Radio, RadioGroup} from 'components/Radio/';
    export default {
        beforeRouteEnter(to, from, next) {
            next(vm => {
                let activeIndex = to.query.activeIndex ? parseInt(to.query.activeIndex) : 0;
                vm.activeIndex = activeIndex;
            });
        },
        data() {
            return {
                activeIndex: 1,
                wishCode: '',
                picServer: '',
                caAreaId: '',
                showFlag: false,
                cancelType: '',
                cancelRemark: '',
                cancelJect: '',
                subLoading: false,
                orderDtoData: {},
                cancelOrderNum: '', // 取消意向单单号
                userProperData: [
                    {
                        name: '价格太高',
                        value: 1
                    },
                    {
                        name: '不是我想要的商品',
                        value: 2
                    },
                    {
                        name: '不是我中意的商户',
                        value: 3
                    },
                    {
                        name: '报价太晚，我已经不需要了',
                        value: 4
                    },
                    {
                        name: '其他',
                        value: 5
                    }
                ]
            };
        },
        created() {
            this.queryMallMsgRecordList();
        },
        watch: {
            cancelType(n) {
                if (n !== 5) {
                    this.userProperData.forEach(item => {
                        if (item.value === n) {
                            this.cancelJect = item.name;
                        }
                    });
                }
            },
            cancelRemark(n) {
                if (this.cancelType === 5) {
                    this.cancelJect = n;
                }
            }
        },
        computed: {
        },
        methods: {
            goOrderDet(item) {
                let mid = this.orderDtoData.morderId;
                this.$router.push({name: 'OrderDet', params: {mid: mid, oid: item}});
            },
            orderCancel(item) {
                this.showFlag = true;
                this.cancelOrderNum = item;
            },
            orderCancelGo() {
                if (this.cancelType) {
                    if (this.cancelType === 5) {
                        if (!this.cancelRemark) {
                            this.$xeMessageBox.alert('请输入取消原因');
                        } else {
                            this.offWishOrder();
                        }
                    } else {
                        this.offWishOrder();
                    }
                } else {
                    this.$xeMessageBox.alert('请选择取消原因');
                }
            },
            dialogCancel() {
                this.cancelRemark = '';
                this.showFlag = false;
            },
            goConfirmor() { // 下单
                let proSkus = [];
                let wishCode = [];
                this.orderDtoData.wishOrderDetailList.forEach(item => {
                    proSkus.push(item.proSku);
                    wishCode.push(item.wishCode);
                });
                this.subLoading = true;
                this.$router.push({name: 'ConfirmorderInten', params: {orderSource: 3, orderPlat: 3}, query: {proSkus: proSkus.join(','), wishCode: wishCode.join(',')}});
            },
            goDetails(item) {
                this.$router.push({name: 'ProductDetails', params: {prospu: item.proSpu}, query: {prosku: item.proSku, areaId: this.caAreaId}});
            },
            offWishOrder() {
                let _this = this;
                let params = {};
                params.wishCode = this.cancelOrderNum;
                params.cancelRemark = this.cancelJect;
                console.log(params);
                this.$http({
                    method: 'post',
                    url: '/xe-route/xe-app/mobile/wishOrderInfo/offWishOrder',
                    data: params
                }).then(() => {
                    this.showFlag = false;
                    setTimeout(() => {
                        _this.goBackFn();
                    }, 300);
                }).catch(error => {
                    console.log(error);
                });
            },
            queryMallMsgRecordList() {
                this.$http({
                    method: 'post',
                    url: '/xe-route/xe-app/mobile/wishOrderInfo/queryMyWishOrderDetail',
                    data: {
                        wishCode: this.$route.query.wishCode
                    }
                }).then(res => {
                    if (res.data.code !== '2000') {
                        this.$toast({
                            message: res.data.msg,
                            duration: 1500
                        });
                    } else {
                        this.picServer = res.data.picServer;
                        this.orderDtoData = res.data.orderDto;
                        this.caAreaId = this.orderDtoData.caAreaId;
                    }
                }).catch(error => {
                    console.log(error);
                });
            }
        },
        components: {
            [Popup.name]: Popup,
            [Radio.name]: Radio,
            [RadioGroup.name]: RadioGroup
        }
    };
</script>
<style rel="stylesheet/scss" lang="scss">
    @import '../../static/styles/rules.scss';
    .m-flexlay-inten {
        .scrollview {
            background: #f5f5f5;
        }
    }
    .intention-contentDetails {
        display: flex;
        flex-direction: column;
        height: 100%;
        .col_red {
            color: #f23530;
        }
        .cor_blu {
            color: #4598e6;
        }
        .contenDetails-scroBox {
            flex: 1;
            overflow-y: scroll;
            -webkit-overflow-scrolling: touch;
        }
        .contenDetails-userInfo {
            background: #fff;
            margin-bottom: 20/$ppr;
            border-bottom: 1px solid #e8e8e8;
            .uerInfo-topItem {
                padding: 32/$ppr 20/$ppr 57/$ppr;
                border-bottom: 1px solid #e8e8e8;
            }
            .topItem-orderlis {
                line-height: 42/$ppr;
                font-size: 28/$ppr;
                color: #666;
                display: flex;
                justify-content: space-between;
            }
            .topItem-orderTit {
                font-size: 28/$ppr;
                color: #333;
                padding: 55/$ppr 0 13/$ppr;
                text-align: center;
                font-weight: 600;
            }
            .topItem-orderFri {
                font-weight: 600;
                font-size: 60/$ppr;
                text-align: center;
                padding: 13/$ppr 0;
                i {
                    font-size: 30/$ppr;
                }
            }
            .uerInfo-botItem {
                padding: 18/$ppr 20/$ppr 22/$ppr;
                .userInfo-item {
                    line-height: 44/$ppr;
                    font-size: 28/$ppr;
                    color: #333;
                    .xe-iconfont {
                        display: inline-block;
                        width: 24/$ppr;
                        height: 28/$ppr;
                        font-size: 28/$ppr;
                        text-align: center;
                        line-height: 28/$ppr;
                        margin-right: 20/$ppr;
                    }
                }
            }
        }
        .contenDetails-proCont {
            background: #fff;
            padding-bottom: 14/$ppr;
            .pro-Cont-tit {
                padding: 25/$ppr 20/$ppr 32/$ppr;
                font-size: 28/$ppr;
                color: #333;
            }
            .pro-Cont-item {
                display: flex;
                background: #fafafa;
                padding: 20/$ppr;
                margin-bottom: 6/$ppr;
                .msg-picshow {
                    width: 170/$ppr;
                    height: 150/$ppr;
                    img {
                        display: block;
                        width: 150/$ppr;
                        height: 150/$ppr;
                    }
                }
                .msg-pre-text {
                    flex: 1;
                    .pre-mainCon {
                        font-size: 28/$ppr;
                        color: #333333;
                        line-height: 34/$ppr;
                        @include clamp(1);
                    }
                    .pre-shopname {
                        font-size: 26/$ppr;
                        color: #666;
                        line-height: 36/$ppr;
                        @include clamp(1);
                    }
                    .pre-Spes {
                        font-size: 24/$ppr;
                        color: #666666;
                        line-height: 50/$ppr;
                    }
                    .pre-frice {
                        font-size: 24/$ppr;
                        overflow: hidden;
                        .cor_red {
                            color: #f23530;
                            float: left;
                        }
                        .flo_R {
                            float: right;
                            color: #666;
                        }
                        i {
                            font-size: 20/$ppr;
                        }
                    }
                }
            }
        }
        .contenDetails-butfixed {
            display: flex;
            justify-content: space-around;
            p {
                flex: 1;
                line-height: 90/$ppr;
                text-align: center;
                font-size: 34/$ppr;
                color: #333;
                border-top: 1px solid #e8e8e8;
                background: #fff;
                &.bj_red {
                    color: #fff;
                    background: #f53226;
                    border-top: 1px solid #f5f5f5;
                }
            }
        }
    }
    .useInfor-selec-box {
        height: 100%;
        overflow: auto;
        font-size: 32/$ppr;
        color: #333;
        display: flex;
        flex-direction: column;
        .useInfor-selec-top {
            background: #fff;
            height: 100%;
            flex: 1;
            overflow: auto;
        }
        ul {
            padding: 0 30/$ppr;
        }
        li {
            line-height: 88/$ppr;
            border-bottom: 1px solid #e8e8e8;
            &:last-child{
                border-bottom: none;
            }
        }
        .selec-item {
            display: flex;
            justify-content: space-between;
        }
        .selec-radio {
            width: 100%;
            height: 88/$ppr;
            display: flex;
            align-items: center;
            .van-radio__control, .van-checkbox__control {
                width: 40/$ppr;
                height: 40/$ppr;
            }
            .van-radio__input, .van-checkbox__input {
                width: 40/$ppr;
                height: 40/$ppr;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .van-radio, .van-checkbox {
                width: 100%;
                display: flex;
                flex: 1;
                flex-direction: row-reverse;
                .xe-iconfont {
                    font-size: 36/$ppr;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
            }
            .van-radio__label, .van-checkbox__label {
                font-size: 30/$ppr;
                margin-left: 10/$ppr;
                flex: 1;
            }
        }
        .useInfor-selec-tishi {
            line-height: 80/$ppr;
            color: #999;
            font-size: 26/$ppr;
            text-align: center;
        }
        .useInfor-selec-footer {
            display: flex;
            .xe-button-primary {
                border-radius: 0;
            }
        }
    }
</style>
