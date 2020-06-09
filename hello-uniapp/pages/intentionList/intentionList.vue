<template>
    <xe-layout class="m-flexlay m-flexlay-inten">
        <view class="intention-content">
            <!--tab区域-->
            <view class="m-category-tab intention-tabBox">
                <view :class="{'active': activeIndex === 1}" @click.prevent="checkTab(1)"><span>待确认</span></view>
                <view :class="{'active': activeIndex === 2}" @click.prevent="checkTab(2)"><span>已完成</span></view>
                <view :class="{'active': activeIndex === 3}" @click.prevent="checkTab(3)"><span>已失效</span></view>
                <!--<view :class="{'active': paramsData.productType === 1}" @click.prevent="paramsData.productType = 1"><p>询报价</p></view>-->
            </view>
            <!--滚动区域-->
            <view class="intention-scrollBox">
                <view class="intention-scroItem" v-if="wishOrderList && wishOrderList.length"  v-for="item in wishOrderList">
                    <view class="intention-orderNum">
                        <p>意向单编号:{{item.wishCode}}</p>
                        <p class="col_red">
                            <xe-countdown v-if="activeIndex === 1 && !item.hasEnd" timetype="second" :wishCode="item.wishCode" @timehasDown="timehasDown" :time="item.endTime">
                                <span>{%d}<i>天</i></span><span>{%h}<i>时</i></span><span>{%m}<i>分</i></span><span>{%s}<i>秒</i></span>
                            </xe-countdown>
                            <span v-if="activeIndex === 1 && item.hasEnd === '结束'">已失效</span>
                            <span v-if="activeIndex === 2">已完成</span>
                            <span v-if="activeIndex === 3">已失效</span>
                        </p>
                    </view>
                    <view class="intention-proCon">
                        <!--单条信息-->
                        <template v-if="item.wishOrderDetailList && item.wishOrderDetailList.length == 1">
                            <view class="proCon-picShow"  @click.prevent="goDetails(item.wishOrderDetailList[0])">
                                <img :src="picServer + item.wishOrderDetailList[0].proPicture" alt="">
                            </view>
                            <view class="proCon-textShow" @click.prevent="goDetails(item.wishOrderDetailList[0])">
                                <view class="proCon-tithea">
                                    {{item.wishOrderDetailList[0].proName}}
                                </view>
                                <view class="proCon-shopname">{{item.wishOrderDetailList[0].shopName}}</view>
                            </view>
                        </template>
                        <template  v-if="item.wishOrderDetailList && item.wishOrderDetailList.length > 1">
                            <!--多条信息-->
                            <swiper :options="swiperOption" class="intent-proCon-picScro" ref='secKillControl'>
                                <swiper-slide class="item" v-for="items in item.wishOrderDetailList"  :key="Math.random()">
                                    <a @click.prevent="goDetails(items)">
                                        <view class="pic">
                                            <img :src="picServer + items.proPicture">
                                        </view>
                                    </a>
                                </swiper-slide>
                            </swiper>
                        </template>
                    </view>
                    <view class="intention-profoter">
                        <view class="intent-allMoney">共{{item.wishOrderDetailList.length}}件商品&nbsp;
                            <span v-if="item.pmtTotalAmount > 0">优惠￥{{parseFloat(item.pmtTotalAmount).toFixed(2)}}元</span>
                            合计：<span class="col_red" v-if="item.payAmount >= 0">￥{{item.payAmount.toString().split('.')[0]}}</span>
                            <i class="col_red" v-if="item.payAmount >= 0 && item.payAmount.toString().split('.')[1]">.{{item.payAmount.toString().split('.')[1].length === 1 ? item.payAmount.toString().split('.')[1] + '0' : item.payAmount.toString().split('.')[1]}}</i>
                            <i class="col_red" v-if="item.payAmount >= 0 && !item.payAmount.toString().split('.')[1]">.00</i>
                        </view>
                        <view class="intent-butContro" v-if="activeIndex === 1 && !item.hasEnd">
                            <span  @click.prevent="orderCancel(item.wishCode)">取消</span>
                            <span class="col_red" @click.prevent="goConfirmor(item)">去下单</span>
                        </view>
                    </view>
                </view>
                <infinite-loading :on-infinite="onInfinite" ref="infiniteLoading" class="infinite-contanier">
                    <span slot="no-more" class="infinite-no-more">
                        暂无更多数据~
                    </span>
                    <view slot="no-results" class="m-cart-none">
                        <view class="pic">
                            <img src="../../static/images/cart-n1.png" alt="">
                        </view>
                        <view class="des">
                            <!--<p class="f32">暂无{{orderType | newOrderStatusToText}}订单</p>-->
                            <p class="f32">暂无意向单信息</p>
                        </view>
                        <view class="btn">
                            <mt-button type="primary" class="xe-button-primary" size="small" plain @click.prevent="toCategory">开始选购</mt-button>
                        </view>
                    </view>
                </infinite-loading>
            </view>
            <!--底部弹框-->
            <xe-popup
                :show.sync="showFlag"
                popupTit="取消原因"
                position="bottom">
                <view class='useInfor-selec-box'>
                    <view class="useInfor-selec-top">
                        <ul>
                            <xe-radio-group v-model="cancelType">
                                <li class="selec-item" v-for="(item, index) in userProperData" :key="index">
                                    <view class="selec-radio">
                                        <xe-radio :label="item.value">
                                            {{item.name}}&nbsp;&nbsp;&nbsp;
                                            <input type="text" v-model.trim="cancelRemark" v-if="item.value == 5" style="width:80%" placeholder="请输入取消原因">
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
    import {swiper, swiperSlide} from 'vue-awesome-swiper';
    import {Radio, RadioGroup} from 'components/Radio/';
    import {CountDown} from 'components/CountDown';
    export default {
        beforeRouteEnter(to, from, next) {
            next(vm => {
                let type = to.query.type ? parseInt(to.query.type) : 1;
                if (type) {
                    vm.activeIndex = type;
                } else {
                    vm.activeIndex = 1;
                }
            });
        },
        data() {
            return {
                swiperOption: {
                    slidesPerView: 'auto',
                    loop: false,
                    autoplay: false
                },
                picServer: '',
                activeIndex: 1,
                showFlag: false,
                cancelType: '',
                cancelRemark: '',
                cancelJect: '意向单过期失效',
                cancelOrderNum: '', // 取消意向单单号
                wishOrderList: [],
                formDatas: {},
                pageNum: 1,
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
        },
        methods: {
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
            toCategory() {
                this.$router.push({name: 'Category'});
            },
            orderCancel(item) {
                this.showFlag = true;
                this.cancelOrderNum = item;
            },
            offWishOrder(val) {
                let params = {};
                if (val) {
                    params.wishCode = val;
                } else {
                    params.wishCode = this.cancelOrderNum;
                }
                params.cancelRemark = this.cancelJect;
                console.log(params);
                this.$http({
                    method: 'post',
                    url: '/xe-route/xe-app/mobile/wishOrderInfo/offWishOrder',
                    data: params
                }).then(() => {
                    this.showFlag = false;
                    this.$toast({
                        message: '意向单取消成功',
                        duration: 1000
                    });
                    setTimeout(() => {
                        window.location.reload();
                    }, 2000);
                }).catch(error => {
                    console.log(error);
                });
            },
            goConfirmor(item) { // 下单
                let proSkus = [];
                item.wishOrderDetailList.forEach(item => {
                    proSkus.push(item.proSku);
                });
                this.$router.push({name: 'ConfirmorderInten', params: {orderSource: 3, orderPlat: 3}, query: {proSkus: proSkus.join(','), wishCode: item.wishCode}});
            },
            goDetails(items) {
                this.$router.push({name: 'IntentionListDetails', query: { activeIndex: this.activeIndex, wishCode: items.wishCode }});
            },
            orient() {
                if (this.$refs.secKillControl.swiper) {
                    setTimeout(() => {
                        this.$refs.secKillControl.swiper.update(true);
                    }, 500);
                }
            },
            checkTab(indexs) {
                this.activeIndex = indexs;
                this.wishOrderList = [];
                this.pageNum = 1;
                this.$nextTick(() => {
                    this.$refs.infiniteLoading.$emit('$InfiniteLoading:reset');
                });
            },
            onInfinite() {
                this.queryMallMsgRecordList();
            },
            timehasDown(val) {
                console.log('666--->', val);
                // this.offWishOrder(val); // 取消意向单接口
                // window.location.reload();
                this.wishOrderList.forEach(item => {
                    if (item.wishCode === val) {
                        this.$set(item, 'hasEnd', '结束');
                    }
                });
            },
            queryMallMsgRecordList() {
                this.$http({
                    method: 'post',
                    url: '/xe-route/xe-app/mobile/wishOrderInfo/queryMyWishOrder',
                    data: {
                        pageNum: this.pageNum,
                        pageSize: 10,
                        wishStatus: this.wishStatus
                    }
                }).then(res => {
                    if (res.data.pageInfo.total === 0) {
                        // 无消息时
                        this.$refs.infiniteLoading.$emit('$InfiniteLoading:complete');
                    } else {
                        this.picServer = res.data.picServer;
                        if (res.data.wishOrderList.length > 0) {
                            this.wishOrderList.push(...res.data.wishOrderList);
                            this.pageNum++;
                            this.$refs.infiniteLoading.$emit('$InfiniteLoading:loaded');
                        } else {
                            // 所有商品都加载完时
                            this.$refs.infiniteLoading.$emit('$InfiniteLoading:complete');
                        }
                    }
                }).catch(error => {
                    console.log(error);
                    this.$refs.infiniteLoading.$emit('$InfiniteLoading:complete');
                });
            }
        },
        mounted () {
            window.addEventListener('orientationchange', this.orient, false);
        },
        computed: {
            wishStatus() {
                let wishStatus = '';
                if (this.activeIndex === 1) {
                    wishStatus = 2;
                } else if (this.activeIndex === 2) {
                    wishStatus = 1;
                } else if (this.activeIndex === 3) {
                    wishStatus = 7;
                }
                return wishStatus;
            }
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
        components: {
            swiper,
            swiperSlide,
            [Popup.name]: Popup,
            [Radio.name]: Radio,
            [RadioGroup.name]: RadioGroup,
            [CountDown.name]: CountDown
        },
        beforeDestroy() {
            document.body.className = '';
            window.removeEventListener('orientationchange', this.orient, false);
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
    .intention-content {
        display: flex;
        height: 100%;
        flex-direction: column;
        .col_red {
            color: #f23530;
        }
        .intention-tabBox {
            background: #fff;
            color: #333;
            margin-bottom: 20/$ppr;
            .active {
                color: #f23530;
                border-bottom: 3px solid #f23530;
            }
        }
        .intention-scrollBox {
            flex: 1;
            overflow-y: scroll;
            -webkit-overflow-scrolling: touch;
        }
        .intention-scroItem {
            margin-bottom: 20/$ppr;
            .intention-orderNum {
                padding: 22/$ppr 20/$ppr;
                background: #fff;
                font-size: 28/$ppr;
                color: #666;
                display: flex;
                justify-content: space-between;
            }

            .intention-proCon {
                padding: 20/$ppr 0 20/$ppr 20/$ppr;
                overflow: hidden;
                .proCon-picShow {
                    float: left;
                    width: 180/$ppr;
                    height: 150/$ppr;
                    img {
                        display: block;
                        width: 150/$ppr;
                        height: 150/$ppr;
                    }
                }
                .proCon-textShow {
                    float: left;
                    padding-right: 20/$ppr;
                    .proCon-tithea {
                        @include clamp(2);
                        font-size: 28/$ppr;
                        color: #333;
                        line-height: 36/$ppr;
                        padding-top: 2/$ppr;
                    }
                    .proCon-shopname {
                        @include clamp(1);
                        font-size: 26/$ppr;
                        color: #666;
                        line-height: 66/$ppr;
                    }
                }
            }
        }
        .intent-proCon-picScro {
            .swiper-slide {
                float: left;
                width: 150/$ppr;
                height: 150/$ppr;
                margin-right: 20/$ppr;
            }
            .pic {
                img {
                    display: block;
                    width: 150/$ppr;
                    height: 150/$ppr;
                }
            }
        }
        .intention-profoter {
            background: #fff;
            .intent-allMoney {
                padding: 22/$ppr 20/$ppr;
                font-size: 28/$ppr;
                color: #333;
                text-align: right;
                border-bottom: 1px solid #e8e8e8;
                span {
                    font-size: 30/$ppr;
                }
                i {
                    font-size: 24/$ppr;
                }
            }
            .intent-butContro {
                text-align: right;
                padding: 14/$ppr 20/$ppr;
                span {
                    display: inline-block;
                    font-size: 28/$ppr;
                    border: 1px solid #999;
                    border-radius: 30px;
                    width: 130/$ppr;
                    height: 56/$ppr;
                    text-align: center;
                    line-height: 52/$ppr;
                    margin-left: 18/$ppr;
                    &.col_red {
                        border: 1px solid #f23530;
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

    }
</style>
