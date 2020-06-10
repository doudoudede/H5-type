<template>
    <xe-layout class="m-bg-dark m-flexlay">
        <div class="orderlist-nav" slot='header'>
            <xe-navtab-con :itemData="navListData" @swiperItemClick="swiperItemClick" ref="navTab"></xe-navtab-con>
        </div>
        <div class="m-content-div" v-if="mainOrderList.length">
            <div
                class="orderlist-item"
                v-for="(item, index) in mainOrderList"
                :key="item.morderId + Math.random()">
                <template v-for="subItem in item.orderList">
                    <div class="order-item-num clearfix">
                        <div class="fl">订单编号:{{subItem.orderId}}</div><div class="fr">{{item.newOrderStatus | newOrderStatusToText}}</div>
                    </div>
                    <div class="order-item-shop">
                        <router-link :to="{name: 'Store', query: {'userCode': subItem.userCode}}">
                            <span class="xe-iconfont xe-icon-dian"></span>
                            <span class="arrow-right-commons">{{subItem.venName}}</span>
                        </router-link>
                    </div>
                    <div class="order-item-procon">
                        <div
                            class="order-item-pro"
                            v-for="proItem in subItem.orderDetailList"
                            :key="proItem.proSku +  + Math.random()"
                            @click.prevent="OrderToDet(item.newOrderStatus, item.morderId, proItem, subItem.orderStatus, index)"
                        >
                            <div class="pic">
                                <img v-lazy="picServer + proItem.proPicture" alt="">
                            </div>
                            <div class="msg">
                                <div class="pro-name">
                                    <!-- <span v-if="proItem.proType === 4" class="coupon-style coupon-style-miao">秒</span>{{proItem.proName}} -->
                                    <span v-if="proItem.proType === 4" class="xe-iconfont xe-icon-miaoshafuben coupon-style-icon"></span>
                                    <span v-else-if="proItem.proType === 6" class="xe-iconfont xe-icon-yushoufuben coupon-style-icon1"></span>{{proItem.proName}}
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
                        </div>
                    </div>
                </template>
                <div class="order-item-total">
                    合计：<span>&yen;{{item.payAmount | toFixed2}}</span>
                </div>
                <!-- newOrderStatus 1 已完成 2 待收货 3待发货 4已取消 10待付款 -->
                <div v-if="item.newOrderStatus === 1" class="order-item-btns">
                    <div class="btns">
                        <mt-button v-if="item.newOrderType === 1" type='primary' size="small" class="xe-button-primary is-radius" plain @click.prevent.stop="buyAgain(item.orderList, false)">再次购买</mt-button>
                        <mt-button v-if="item.newOrderType !== 1" type='primary' size="small" class="xe-button-primary is-radius" plain @click.prevent.stop="aginInquiry(item, false)">再次询价</mt-button>
                        <mt-button size="small" v-if="item.orderList[0].payStatus == 1 && item.payType == 1" class="xe-button-default is-radius" plain @click.prevent.stop="detailsOfpayment(item)">付款详情</mt-button>
                    </div>
                </div>
                <div v-else-if="item.newOrderStatus === 2" class="order-item-btns">
                    <div class="btns">
                        <!-- 已发货 未支付 在待收货中和全部列表里应该展示立即支付 -->
                        <mt-button type='primary' size="small" v-if="item.orderList[0].payStatus == 2 && item.payType == 1" class="xe-button-primary is-radius" plain @click.prevent.stop="goToPay(item, false)">立即支付</mt-button>
                        <mt-button size="small" v-if="item.orderList[0].payStatus !== 2 && item.payType == 1" class="xe-button-default is-radius" plain @click.prevent.stop="detailsOfpayment(item)">付款详情</mt-button>
                        <mt-button type='primary' size="small" class="xe-button-primary is-radius" plain @click.prevent.stop="confirmReceipt(item.morderId, item.orderList[0].orderId, item.orderList[0].version, item.orderList[0].payStatus, index)">确认收货</mt-button>
                    </div>
                </div>
                <div v-else-if="item.newOrderStatus === 4" class="order-item-btns">
                    <div class="btns">
                        <mt-button size="small" class="xe-button-default is-radius" plain @click.prevent.stop="confirmDelOrder(item.orderList[0].orderId, index)">删除订单</mt-button>
                        <mt-button v-if="item.newOrderType === 1" type='primary' size="small" class="xe-button-primary is-radius" plain @click.prevent.stop="buyAgain(item.orderList, false)">再次购买</mt-button>
                        <mt-button v-else type='primary' size="small" class="xe-button-primary is-radius" plain @click.prevent.stop="aginInquiry(item, false)">再次询价</mt-button>
                    </div>
                </div>
                <div v-else-if="item.newOrderStatus === 10" class="order-item-btns">
                    <div class="btns">
                        <mt-button size="small" class="xe-button-default is-radius" plain @click.prevent.stop="confirmCancelOrder(item, index, false)">取消订单</mt-button>
                        <mt-button type='primary' size="small" class="xe-button-primary is-radius" plain @click.prevent.stop="goToPay(item, false)">立即支付</mt-button>
                    </div>
                </div>
                <div v-else-if="item.newOrderStatus === 11" class="order-item-btns">
                    <div class="btns">
                        <mt-button size="small" v-if="item.payType == 1" class="xe-button-default is-radius" plain @click.prevent.stop="detailsOfpayment(item)">付款详情</mt-button>
                        <mt-button type='primary' size="small" class="xe-button-primary is-radius" plain @click.prevent.stop="confirmReceipt(item.morderId, item.orderList[0].orderId, item.orderList[0].version, item.orderList[0].payStatus, index)">确认收货</mt-button>
                    </div>
                </div>
            </div>
        </div>
        <infinite-loading :on-infinite="onInfinite" ref="infiniteLoading" class="infinite-contanier">
            <span slot="no-more" class="infinite-no-more">
                暂无更多数据~
            </span>
            <div slot="no-results" class="m-cart-none">
                <div class="pic">
                    <img src="../../static/images/cart-n1.png" alt="">
                </div>
                <div class="des">
                    <!--<p class="f32">暂无{{orderType | newOrderStatusToText}}订单</p>-->
                    <p class="f32">暂无订单信息</p>
                </div>
                <div class="btn">
                    <mt-button type="primary" class="xe-button-primary" size="small" plain @click.prevent="toCategory">开始选购</mt-button>
                </div>
            </div>
        </infinite-loading>
        <!--订单详情-->
        <template slot="outer">
            <keep-alive>
                <router-view v-if="$route.meta.keepAlive"></router-view>
            </keep-alive>
            <router-view v-if="!$route.meta.keepAlive"></router-view>
        </template>
        <!--<router-view slot="outer"></router-view>-->
    </xe-layout>
</template>
<script type="text/ecmascript-6">
//    import InfiniteLoading from 'vue-infinite-loading';
    import {xeNavTabCon} from 'components/xeNavTab';
    import {Popup} from 'components/Popup';
    import axios from 'axios';
    export default {
        beforeRouteEnter(to, from, next) {
            next(vm => {
                let type = to.query.type ? parseInt(to.query.type) : 0;
                vm.orderType = type;
                vm.$refs.navTab.setDefault(type);
            });
        },
        data() {
            return {
                picServer: '',
                navListData: [
                    {
                        name: '全部',
                        id: 0
                    },
                    {
                        name: '待付款',
                        id: 5
                    },
                    {
                        name: '待发货',
                        id: 3
                    },
                    {
                        name: '待收货',
                        id: 2
                    },
                    {
                        name: '已完成',
                        id: 1
                    },
                    // {
                        // name: '预售',
                        // id: 6
                    // }
                ], // 订单状态：5待付款 1 已完成 2 已发货 （待收货）3待发货 0全部 6预售
                orderType: 0,
                pageNum: 1,
                mainOrderList: [],
                cancel: ''
            };
        },
        mounted() {},
        activated() {
            console.log('activated');
            if (this.$indicator) {
                this.$indicator.close();
            }
            let nowRegionMap = JSON.parse(this.$getLocalStorage('REGIONMAP'));
            this.cityName = nowRegionMap.cityName;
            this.cityId = nowRegionMap.areaId;
            this.pageNum = 1;
            this.mainOrderList = [];
            this.$nextTick(() => {
                this.$refs.infiniteLoading.$emit('$InfiniteLoading:reset');
            });
        },
        deactivated() {
            console.log('deactivated');
        },
        methods: {
            detailsOfpayment(item) {
                console.log(item);
                let LOGINSTATUS = this.$getLocalStorage('LOGINSTATUS');
                let walletUrl = `${window.locationHref}`;
                window.location.href = `${walletUrl}detailsOfpayment?ent=1&dealNo=${item.payNumber}&loginStatus=${LOGINSTATUS}`;
            },
            toCategory() {
                this.$router.push({name: 'Category'});
            },
            swiperItemClick(item) {
                if (this.cancel) {
                    // 取消未完成的ajax请求
                    this.cancel();
                };
                this.$router.replace({name: 'OrderList', query: {'type': item.id}});
                this.orderType = item.id;
                this.pageNum = 1;
                this.mainOrderList = [];
                this.$nextTick(() => {
                    this.$refs.infiniteLoading.$emit('$InfiniteLoading:reset');
                });
            },
            reloadQueryMyOrder() {
                this.pageNum = 1;
                this.mainOrderList = [];
                this.$nextTick(() => {
                    this.$refs.infiniteLoading.$emit('$InfiniteLoading:reset');
                });
            },
            onInfinite() {
                this.queryMyOrder();
            },
            queryMyOrder() {
                let _this = this;
                let CancelToken = axios.CancelToken;
                this.$http({
                    cancelToken: new CancelToken(function executor(c) {
                        // An executor function receives a cancel function as a parameter
                        _this.cancel = c;
                    }),
                    method: 'post',
                    url: '/xe-route/xe-app/mobile/orderInfo/queryMyOrder',
                    data: {
                        pageNum: this.pageNum,
                        pageSize: 10,
                        orderStatus: this.orderType
                    }
                }).then(res => {
                    if (!this.picServer) {
                        this.picServer = res.data.picServer;
                    }
                    if (res.data.pageInfo.total === 0) {
                        // 无商品时
                        this.$refs.infiniteLoading.$emit('$InfiniteLoading:complete');
                    } else {
                        if (res.data.mainOrderList.length > 0) {
                            this.mainOrderList.push(...res.data.mainOrderList);
                            this.pageNum++;
                            this.$refs.infiniteLoading.$emit('$InfiniteLoading:loaded');
                        } else {
                            // 所有商品都加载完时
                            this.$refs.infiniteLoading.$emit('$InfiniteLoading:complete');
                        }
                    }
                }).catch(error => {
                    if (error.status === 'cancel') {
                        this.$refs.infiniteLoading.$emit('$InfiniteLoading:reset');
                        return;
                    }
                    this.$refs.infiniteLoading.$emit('$InfiniteLoading:complete');
                });
            },
            confirmDelOrder(orderId, index, fn) {
                // 删除我的订单
                this.$xeMessageBox.confirm('确认删除订单？').then(action => {
                    console.log(action);
                    this.delOrderInfo(orderId, index, fn);
                }).catch(cancel => {
                    console.log(cancel);
                });
            },
            delOrderInfo(orderId, index, fn) {
                this.$indicator.open('正在删除订单...');
                this.$http({
                    method: 'post',
                    url: '/xe-route/xe-app/mobile/orderInfo/delOrderInfo',
                    data: {
                        orderId: orderId
                    }
                }).then(res => {
                    console.log(res);
                    this.mainOrderList.splice(index, 1);
                    this.$indicator.close();
                    this.$toast({
                        message: '删除订单成功',
                        duration: 1000,
                        position: 'bottom'
                    });
                    if (!this.mainOrderList.length) {
                        this.pageNum = 1;
                        this.$refs.infiniteLoading.$emit('$InfiniteLoading:reset');
                    }
                    fn && fn();
                }).catch(error => {
                    this.$indicator.close();
                    console.log(error);
                });
            },
            confirmCancelOrder(item, index, detFlag, fn) {
                // 取消订单
                this.$xeMessageBox.confirm('确认取消订单？').then(action => {
                    console.log(action);
                    this.cancelOrderInfo(item, index, detFlag, fn);
                }).catch(cancel => {
                    console.log(cancel);
                });
            },
            cancelOrderInfo(item, index, detFlag, fn) {
                this.$indicator.open('正在取消订单...');
                console.log(item);
                console.log(index);
                console.log(detFlag);
                console.log(fn);
                this.$http({
                    method: 'post',
                    url: '/xe-route/xe-app/mobile/orderInfo/offOrder',
                    data: {
                        morderId: detFlag ? item : item.morderId
                    }
                }).then(res => {
                    console.log(res);
                    if (detFlag) {
                        // 详情页的取消订单
                        if (this.orderType === 0) {
                            let itemobj = null;
                            this.mainOrderList.some(sitem => {
                                if (sitem.morderId === item) {
                                    itemobj = sitem;
                                    return true;
                                }
                            });
                            itemobj.newOrderStatus = 4;
                        } else {
                            this.mainOrderList.splice(index, 1);
                        }
                    } else {
                        if (this.orderType === 0) {
                            item.newOrderStatus = 4;
                        } else {
                            this.mainOrderList.splice(index, 1);
                        }
                    }
                    this.$indicator.close();
                    this.$toast({
                        message: '取消订单成功',
                        duration: 1000,
                        position: 'bottom'
                    });
                    if (!this.mainOrderList.length) {
                        this.pageNum = 1;
                        this.$refs.infiniteLoading.$emit('$InfiniteLoading:reset');
                    }
                    fn && fn();
                }).catch(error => {
                    this.$indicator.close();
                    console.log(error);
                });
            },
            confirmReceipt(morderid, orderId, version, payStatus, index, fn) {
                // 确认收货
                // console.log('morderid----', morderid);
                // console.log('orderId----', orderId);
                // console.log('version----', version);
                // console.log('index----', index);
                console.log('orderStatus->>>>>>>---', payStatus);
                if (payStatus === 1) {
                    // 已支付
                    this.$xeMessageBox.confirm('确认收货？').then(action => {
                        console.log(action);
                        this.confirmReceiptOrder(morderid, orderId, version, index, fn);
                    }).catch(cancel => {
                        console.log(cancel);
                    });
                } else {
                    // 未支付
                    this.$xeMessageBox.alert('您还未支付货款，请支付后确认收货~').then(action => {
                    }).catch(cancel => {
                        console.log(cancel);
                    });
                }
            },
            confirmReceiptOrder(morderid, orderId, version, index, fn) {
                this.$indicator.open('正在确认收货...');
                this.$http({
                    method: 'post',
                    url: '/xe-route/xe-app/mobile/orderInfo/confirmOrder',
                    data: {
                        morderId: morderid,
                        orderId: orderId,
                        version: version
                    }
                }).then(res => {
                    console.log(res);
                    this.mainOrderList.splice(index, 1);
                    this.$indicator.close();
                    this.$toast({
                        message: '确认收货成功',
                        duration: 1000,
                        position: 'bottom'
                    });
                    if (!this.mainOrderList.length) {
                        this.pageNum = 1;
                        this.$refs.infiniteLoading.$emit('$InfiniteLoading:reset');
                    }
                    fn && fn();
                }).catch(error => {
                    this.$indicator.close();
                    console.log(error);
                });
            },
            buyAgain(orderList, detFlag) {
                // 再次购买
                let result = [];
                if (detFlag) {
                    orderList.forEach(dlist => {
                        result.push(dlist.proSku);
                    });
                } else {
                    orderList.forEach(list => {
                        list.orderDetailList.forEach(dlist => {
                            result.push(dlist.proSku);
                        });
                    });
                }
                this.addCartBacth(result);
            },
            aginInquiry(item, detFlag) {
                console.log(item);
                this.$indicator.open(`生成询价单中...`);
                let pros = [];
                if (detFlag) {
                    item.forEach(dlist => {
                        let obj = {};
                        obj.productSku = dlist.proSku;
                        obj.productCount = dlist.purchaseNum;
                        pros.push(obj);
                    });
                } else {
                    item.orderList.forEach(list => {
                        list.orderDetailList.forEach(dlist => {
                            let obj = {};
                            obj.productSku = dlist.proSku;
                            obj.productCount = dlist.purchaseNum;
                            pros.push(obj);
                        });
                    });
                }
                this.$http({
                    method: 'post',
                    url: '/xe-route/xe-app/mobile/inquiry/addBatch',
                    data: {
                        pros: pros,
                        quirySource: 3
                    }
                }).then(res => {
                    this.$indicator.close();
                    this.$router.push({
                        name: 'InquiryList',
                        query: {
                            type: 0
                        }
                    });
                }).catch(error => {
                    console.log(error);
                    this.$indicator.close();
                });
            },
            addCartBacth(skus) {
                this.$indicator.open('再次购买中...');
                this.$http({
                    method: 'post',
                    url: '/xe-route/xe-app/mobile/cart/addCartBacth',
                    data: {
                        proSkuList: skus,
                        areaId: this.cityId
                    }
                }).then(res => {
                    console.log(res);
                    this.$indicator.close();
                    this.$toast({
                        message: '再次购买成功',
                        duration: 1000,
                        position: 'bottom'
                    });
                    this.$router.push({
                        name: 'Cart'
                    });
                }).catch(error => {
                    console.log(error);
                    this.$indicator.close();
                });
            },
            goToPay(item, detFlag, payType) {
            //    console.log(item)
            //     console.log(detFlag)
            //      console.log(payType)
                // this.$indicator.open('跳转至收银台中...');
                let LOGINSTATUS = this.$getLocalStorage('LOGINSTATUS');
                let walletUrl = `${window.locationHref}payDesk`;
                // console.log(LOGINSTATUS)
                //  console.log(walletUrl)
                window.location.href = `${walletUrl}?orderid=${detFlag ? item : item.payNumber}&client=1&payMethod=${detFlag ? payType : item.payType}&loginStatus=${LOGINSTATUS}`;
            },
            OrderToDet(status, mid, proItem, orderStatus, index) {
                this.$router.push({name: 'OrderDet', params: {mid: mid, oid: proItem.orderId}, query: {version: proItem.version, type: this.orderType, index: index, orderStatus: orderStatus}});
                // if (status === 2) {
                //     // 2 待收货
                // } else {
                //     // 1 已完成  3待发货 4已取消 10待付款
                //     this.$router.push({name: 'OrderDet', params: {mid: mid, oid: proItem.orderId}, query: {version: proItem.version, type: this.orderType, index: index, orderStatus: orderStatus}});
                // }
            },
            OrderToAfterSale() {
                this.$router.push({name: 'AfterSale', params: {id: 456}});
            }
        },
        components: {
//            InfiniteLoading,
            [xeNavTabCon.name]: xeNavTabCon,
            [Popup.name]: Popup
        }
    };
</script>
<style rel="stylesheet/scss" lang="scss">
    @import '../../static/styles/rules.scss';
    .orderlist-nav {
        height: 88/$ppr;
        background: #fff;
        max-width: 750/$ppr;
        margin: 0 auto;
        .xe-navtab-con .swiper-slide {
            height: 88/$ppr;
            line-height: 88/$ppr;
            padding: 0 35/$ppr;
        }
    }
    .orderlist-item {
        margin: 20/$ppr 0;
        padding-left: 20/$ppr;
        background: #fff;
        &:last-child {
            margin-bottom: 0;
        }
    }
    .order-item-num {
        min-height: 70/$ppr;
        padding: 15/$ppr 20/$ppr 15/$ppr 0;
        line-height: 40/$ppr;
        font-size: 28/$ppr;
        color: $text-666;
        border-bottom: 1/$ppr solid $border-color-e8e;
        .fl {
           max-width: 80%;
        }
        .fr {
            color: $main-color;
        }
    }
    .order-item-shop {
        min-height: 88/$ppr;
        padding: 20/$ppr 20/$ppr 20/$ppr 0;
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
    .order-item-procon {
        margin-left: -20/$ppr;
        .order-item-pro {
            display: flex;
            background: #fafafa;
            padding: 20/$ppr;
            margin-bottom: 6/$ppr;
            &:last-child {
                margin-bottom: 0;
            }
            .pic {
                width: 150/$ppr;
                height: 150/$ppr;
                flex: 0 0 150/$ppr;
                border-radius: 5/$ppr;
                background: #f1f1f1;
                overflow: hidden;
                img {
                    width: 100%;
                    height: 100%;
                }
            }
            .msg {
                padding: 0 10/$ppr 0 20/$ppr;
                flex: 1;
                .pro-name {
                    line-height: 1.2;
                    font-size: 28/$ppr;
                    overflow : hidden;
                    text-overflow: ellipsis;
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                }
                .pro-spec {
                    margin: 10/$ppr 0;
                    color: $text-666;
                    font-size: 24/$ppr;
                }
            }
            .pri {
                width: 170/$ppr;
                text-align: right;
                font-size: 24/$ppr;
                line-height: 1.5;
                .npri {
                    color: $main-color;
                }
                .opri {
                    color: $text-999;
                }
                .nums {
                    font-size: 24/$ppr;
                }
            }
        }
    }
    .order-item-total {
        padding: 20/$ppr 20/$ppr 20/$ppr 0;
        min-height: 88/$ppr;
        line-height: 48/$ppr;
        text-align: right;
        font-size: 24/$ppr;
        span {
            color: $main-color;
            font-size: 30/$ppr;
        }
    }
    .order-item-btns {
        min-height: 84/$ppr;
        padding: 14/$ppr 20/$ppr 14/$ppr 0;
        border-top: 1/$ppr solid $border-color-e8e;
        display: flex;
        .btns-pri {
            line-height: 56/$ppr;
            span {
                color: $main-color;
                font-size: 30/$ppr;
            }
        }
        .btns {
            flex: 1;
            text-align: right;
            font-size: 0;
            .mint-button {
                margin-left: 20/$ppr;
            }
        }
    }
</style>
