<template>
    <xe-layout class="m-bg-dark m-flexlay">
        <div class="m-cart-top m-content-div" slot="header">
            <v-touch tag="div" class="m-cart-adr" v-on:tap="showadr = true">
                <span class="xe-iconfont xe-icon-dingwei"></span>{{cityName}}
            </v-touch>
            <div class="m-cart-edit" v-if="validVenProList && validVenProList.length > 0" @click.prevent="editorFlag = !editorFlag">
                {{editorFlag ? '完成' : '编辑'}}
            </div>
        </div>
        <div class="m-cart-contanier m-content-div">
            <div
                class="m-cart-item"
                v-for="(item, index) in validVenProList"
                :key="index"
                v-if="item.proList.length"
            >
                <div class="m-cart-title">
                    <div class="m-cart-check">
                        <xe-checkbox v-model="item.checkAll" :label="item.vendorCode" size="large" @input="proCheckAllFn(item)"></xe-checkbox>
                    </div>
                    <div class="m-cart-shop">
                        <span class="arrow-right-commons" @click.prevent="shopNavToDet(item)">{{item.vendorName}}</span>
                    </div>
                    <div class="m-cart-after" v-if="item.couponFlag === 1 && !editorFlag" @click="listTempletByVen(item.vendorCode)">
                        领券
                    </div>
                </div>
                <div class="m-shop-coupon" v-if="item.couponList.length">
                    <!--<div v-for="(item, index) in item.couponList" :key="index">本店铺单次购买满100元，送20元优惠券</div>-->
                    <div v-for="(couponitem, couponindex) in item.couponList" :key="couponindex">本店铺单次购买满{{couponitem.sendOrderAmount}}元，送{{couponitem.useDisAmount}}元优惠券</div>
                    <div v-if="item.supportPayType !== 3">
                        <template v-if="item.supportPayType === 1">仅支持在线支付</template>
                        <template v-else>仅支持货到付款</template>
                    </div>
                </div>
                <div class="m-cart-pros" v-if="item.proList && item.proList.length > 0">
                    <xe-checkbox-group v-model="item.checkedPros" @change="proCheckedChange(item)">
                        <div class="item" v-for="proItem in item.proList" :key="proItem.proSku">
                            <div class="item-check">
                                <xe-checkbox :label="proItem.proSku" size="large"></xe-checkbox>
                            </div>
                            <div class="item-pro-msg" @click.prevent="proNavToDet(proItem)">
                                <div class="pic">
                                    <img v-lazy="picServer + proItem.proMainImg" alt="">
                                </div>
                                <div class="msg">
                                    <div class="name">
                                        <p>
                                            <span v-if="proItem.preSaleFlag === 1" class="xe-iconfont xe-icon-yushoufuben coupon-style-icon1"></span><span v-if="proItem.disLimitProNum" class="xe-iconfont xe-icon-miaoshafuben coupon-style-icon"></span>{{proItem.proName}}
                                        </p>
                                    </div>
                                    <div class="pri">
                                        <div class="mp">规格: {{proItem.specValue}}</div>
                                        <template v-if="proItem.disLimitProNum">
                                            <!--商品为限时抢购-->
                                            <template v-if="proItem.originalProNum > 0">
                                                <!--购买数量大于限时抢购库存-->
                                                <div class="np"><span style="color: #999;">{{proItem.disLimitProNum}}x</span>&yen;{{proItem.disLimitProPrice | toFixed2}}<em>/{{proItem.unit}}</em></div>
                                                <div class="np"><span style="color: #999;">{{proItem.originalProNum}}x</span>&yen;{{proItem.areaPrice | toFixed2}}<em>/{{proItem.unit}}</em></div>
                                            </template>
                                            <template v-else>
                                                <div class="np">&yen;{{proItem.disLimitProPrice | toFixed2}}<em>/{{proItem.unit}}</em></div>
                                            </template>
                                        </template>
                                        <template v-else>
                                            <div class="np">&yen;{{proItem.areaPrice | toFixed2}}<em>/{{proItem.unit}}</em></div>
                                        </template>
                                    </div>
                                </div>
                                <div class="num-count" @click.stop>
                                    <div class="countnum-con">
                                        <InputNumber :min="proItem.minQuantity" :max="proItem.saleQuantity" v-model="proItem.quantity" @change="proNumChange(proItem)"></InputNumber>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </xe-checkbox-group>
                </div>
            </div>
            <div class="m-cart-item m-cart-itemsx" v-if="inValidProList && inValidProList.length > 0">
                <div class="m-cart-pros">
                    <div class="item" v-for="item in inValidProList" :key="item.proSku">
                        <div class="item-check">
                            失效
                        </div>
                        <div class="item-pro-msg">
                            <div class="pic">
                                <img :src="picServer + item.proMainImg" alt="">
                            </div>
                            <div class="msg">
                                <div class="name">
                                    <p>
                                        {{item.proName}}
                                    </p>
                                </div>
                                <div class="pri">
                                    <div class="mp">规格: {{item.specValue}}</div>
                                    <!--<div class="mp">10kg/{{item.unit}}</div>-->
                                    <div class="np">&yen;{{item.areaPrice}}<em>/{{item.unit}}</em></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="m-cart-clear">
                    <mt-button class="xe-button-primary" plain size="small" @click.prevent="clearSxPro">清空失效商品</mt-button>
                </div>
            </div>
            <div class="m-cart-none" v-if="!validVenProList  && !inValidProList">
                <div class="pic">
                    <img src="../../static/images/cart-n1.png" alt="">
                </div>
                <div class="des">
                    <p class="f32">您的购物车暂无药品~</p>
                    <!-- <p class='f28'>主人快给我挑点食物吧</p> -->
                </div>
                <div class="btn">
                    <mt-button class="xe-button-default" size="small" plain @click.prevent="toCategory">马上采购</mt-button>
                </div>
            </div>
        </div>
        <div class="m-cart-btns" slot="footer" v-if="validVenProList && validVenProList.length > 0">
            <div class="m-all-check">
                    <xe-checkbox size="large" v-model="checkedAll" @input="checkedAllFn"></xe-checkbox><span v-if="editorFlag "  class="txt">全选</span>
            </div>
            <div class="det-pri">
                <!-- <p v-show="!editorFlag">
                    <span>总价</span>{{totalPrice | currency}}
                </p> -->
                <div class="pay-coupon"  v-show="!editorFlag">
                    <p class="pay_all">合计: <span>{{totalPrice | currency}}</span></p>
                    <p class="pay_money" v-if="couponInfo">购物满{{parseFloat(couponInfo.sendOrderAmount ? couponInfo.sendOrderAmount : 0).toFixed(2)}}元，送{{parseFloat(couponInfo.useDisAmount ? couponInfo.useDisAmount : 0).toFixed(2)}}元优惠券</p>
                </div>
            </div>
            <div class="det-btns">
                <!--<router-link tag="div" class="det-tobuy xe-gradient-color" :to="{name: 'ConfirmOrder'}">结算(12)</router-link>-->
                <div v-if="editorFlag" class="det-tobuy" :class="{'editorFlag': editorFlag}" @click.prevent="deleteCartBacths">
                    删除 <span>({{getCheckedPros.length}})</span>
                </div>
                <div v-else class="det-tobuy xe-gradient-color" v-show="getCheckedPros.length > 0" @click.prevent="goConfirmOrder">
                    结算 <span>({{getCheckedPros.length}})</span>
                </div>
            </div>
        </div>
        <!--选择优惠券-->
        <xe-popup
            slot="outer"
            :show.sync="couponVisible"
            popupTit="优惠券"
            position="bottom">
            <div class="pop-cart-coupoon coupon-box-more">
                <xe-couponItem :couponList="couponListPopup"></xe-couponItem>
            </div>
        </xe-popup>
        <!--地址插件-->
        <xe-popup
            slot="outer"
            :show.sync="showadr"
            popupTit="配送至"
            position="bottom">
            <CitySelect
                v-model="defaultAdrs"
                :show.sync="showadr"
                @on-adr-change="adrChange"
            ></CitySelect>
        </xe-popup>
    </xe-layout>
</template>
<script type="text/ecmascript-6">
    import {Popup} from 'components/Popup';
    import {CitySelect} from 'components/CitySelect/';
    import CouponItem from 'components/CouponItem/CouponItem';
    import {Checkbox, CheckboxGroup} from 'components/Checkbox';
    import InputNumber from 'components/InputNumber/InputNumber';
    export default {
        data() {
            return {
                picServer: '',
                couponVisible: false,
                couponListPopup: [],
                checkedVendors: [],
                showadr: false,
                editorFlag: false,
                defaultAdrs: [],
                checkedAll: true,
                areaId: '',
                cityName: '',
                couponInfo: {},
                totalPriceTxt: '',
                validVenProList: null, // 有效商品
                inValidProList: null // 失效商品
            };
        },
        created() {
            let nowRegionMap = JSON.parse(this.$getLocalStorage('REGIONMAP'));
            this.areaId = nowRegionMap.areaId;
            this.cityName = nowRegionMap.cityName;
            this.defaultAdrs = [nowRegionMap.provinceId, nowRegionMap.cityId, nowRegionMap.areaId];
            this.listCart();
        },
        methods: {
            listCart() {
                this.$indicator.open('加载购物车数据...');
                this.$http({
                    method: 'post',
                    url: '/xe-route/xe-app/mobile/cart/listCart',
                    data: {
                        areaId: this.areaId
                    }
                }).then(res => {
                    console.log(res);
                    this.$indicator.close();
                    this.picServer = res.data.picServer;
                    if (res.data.validVenProList && res.data.validVenProList.length > 0) {
                        let validVenProList = res.data.validVenProList;
                        validVenProList.forEach(item => {
                            let checkedPros = [];
                            item.checkAll = true;
                            // 默认全选
                            item.proList.forEach(subitem => {
                                checkedPros.push(subitem.proSku);
                            });
                            item.checkedPros = checkedPros;
                            item.checkedProsBak = checkedPros;
                        });
                        this.validVenProList = validVenProList;
                    }
                    if (!res.data.inValidProList) {
                        this.inValidProList = null;
                    } else {
                        this.inValidProList = res.data.inValidProList.length ? res.data.inValidProList : null;
                    }
                }).catch(error => {
                    console.log(error);
                    this.$indicator.close();
                });
            },
            clearSxPro() {
                // 清空失效商品
                this.$xeMessageBox.confirm('确定清空失效商品？').then(() => {
                    this.deleteCartBacth(this.getSxProArr, data => {
                        this.inValidProList = null;
                        this.$toast({
                            message: '失效商品删除成功',
                            positon: 'bottom',
                            duration: 1500
                        });
                    });
                }).catch(() => {});
            },
            deleteCartBacth(arr, fn) {
                this.$indicator.open();
                this.$http({
                    method: 'post',
                    url: '/xe-route/xe-app/mobile/cart/deleteCartBacth',
                    data: {
                        proSkuList: arr
                    }
                }).then(res => {
                    console.log(res);
                    this.$indicator.close();
                    fn && fn(res);
                }).catch(error => {
                    console.log(error);
                    this.$indicator.close();
                });
            },
            proCheckAllFn(item) {
                // 店铺全选
                console.log(item.checkAll);
                item.checkAll ? item.checkedPros = item.checkedProsBak : item.checkedPros = [];
            },
            proCheckedChange(item) {
                // 商品选中
                item.checkAll = item.checkedPros.length === item.proList.length;
                this.checkedAll = this.getCheckedAllflag;
            },
            proNumChange(proItem) {
                // 商品数据加减
                this.$nextTick(() => {
                    this.$indicator.open();
                    this.$http({
                        method: 'post',
                        url: '/xe-route/xe-app/mobile/cart/modifyCart',
                        data: {
                            proSku: proItem.proSku,
                            quantity: proItem.quantity,
                            areaId: this.areaId
                        }
                    }).then(res => {
                        console.log(proItem);
                        if (proItem.stepFlag === 1) {
                            // 阶梯价
                            if (res.data.disLimitProNum) {
                                // 有促销
                                let lengths = proItem.areaStepList.length - 1;
                                let stepPrice = 0;
                                for (let i = lengths; i >= 0; i--) {
                                    let obj = proItem.areaStepList[i];
                                    let startNum = obj.startNum;
                                    if (res.data.originalProNum >= startNum) {
                                        stepPrice = obj.stepPrice;
                                        break;
                                    }
                                }
                                proItem.areaPrice = stepPrice;
                            } else {
                                if (proItem.preSaleFlag !== 1) {
                                    // 非预售价格并且为阶梯价的（价格随加减数量变化）、预售价格并且为阶梯价的(加减购物车价格不发生变化)
                                    let lengths = proItem.areaStepList.length - 1;
                                    let stepPrice = 0;
                                    for (let i = lengths; i >= 0; i--) {
                                        let obj = proItem.areaStepList[i];
                                        let startNum = obj.startNum;
                                        if (proItem.quantity >= startNum) {
                                            stepPrice = obj.stepPrice;
                                            break;
                                        }
                                    }
                                    proItem.areaPrice = stepPrice;
                                }
                            }
                        }
                        if (res.data.disLimitProNum) {
                            proItem.disLimitProNum = res.data.disLimitProNum;
                            proItem.disLimitProPrice = res.data.disLimitProPrice;
                            proItem.originalProNum = res.data.originalProNum;
                        } else {
                            proItem.disLimitProNum = 0;
                        }
                        this.$indicator.close();
                    }).catch(error => {
                        console.log(error);
                        this.$indicator.close();
                    });
                });
            },
            checkedAllFn() {
                if (this.checkedAll) {
                    this.validVenProList.forEach(item => {
                        item.checkAll = true;
                        item.checkedPros = item.checkedProsBak;
                    });
                } else {
                    this.validVenProList.forEach(item => {
                        item.checkAll = false;
                        item.checkedPros = [];
                    });
                }
            },
            goConfirmOrder() {
                // 去结算
                this.$router.push({name: 'ConfirmOrder', params: {orderSource: 1, orderPlat: 3}, query: {proSkus: this.getCheckedPros.join(',')}});
            },
            toCategory() {
                this.$router.push({name: 'Category'});
            },
            listTempletByVen(vendorCode) {
                // 购物车优惠券列表
                this.$indicator.open('加载店铺优惠券...');
                this.$http({
                    method: 'post',
                    url: '/xe-route/xe-app/mobile/cart/ListTempletByVen',
                    data: {
                        userCode: vendorCode
                    }
                }).then(res => {
                    console.log(res);
                    this.couponVisible = true;
                    this.couponListPopup = res.data.list;
                    this.$indicator.close();
                }).catch(error => {
                    console.log(error);
                    this.$indicator.close();
                });
            },
            proNavToDet(item) {
                this.$router.push({
                    name: 'ProductDetails',
                    params: {prospu: item.proSpu},
                    query: {prosku: item.proSku}
                });
            },
            shopNavToDet(item) {
                this.$router.push({
                    name: 'Store',
                    query: {userCode: item.vendorCode}
                });
            },
            adrChange(value) {
                console.log(value);
                this.$setLocalStorage('REGIONMAP', JSON.stringify({
                    provinceId: value[0].areaId,
                    provinceName: value[0].areaName,
                    cityId: value[1].areaId,
                    cityName: value[1].areaName,
                    areaId: value[2].areaId,
                    areaName: value[2].areaName
                }));
                window.location.reload();
            },
            deleteCartBacths() {
                // 删除商品
                let arrs = [];
                this.validVenProList.forEach(item => {
                    console.log(item);
                    arrs.push(...item.checkedPros);
                });
                if (!arrs.length) {
                    this.$xeMessageBox({
                        message: '请选择要删除的商品！'
                    });
                    return;
                }
                this.$xeMessageBox.confirm('确定要删除选中的商品？').then(() => {
                    this.deleteCartBacth(arrs, data => {
                        this.$toast({
                            message: '商品删除成功',
                            positon: 'bottom',
                            duration: 1500
                        });
                        this.validVenProList.forEach(item => {
                            if (item.proList.length) {
                                item.checkedPros = [];
                                item.proList = item.proList.filter(pitem => arrs.indexOf(pitem.proSku) < 0);
                            }
                        });
                        let result = this.validVenProList.filter(item => item.proList.length);
                        this.validVenProList = result.length ? result : null;
                    });
                }).catch(() => {});
            },
            getCartCoupTemplet(sendOrderAmount) {
                // 根据购物车商品总价查询优惠券
                this.$http({
                    method: 'post',
                    url: '/xe-route/xe-app/mobile/cart/getCartCoupTemplet',
                    data: {
                        sendOrderAmount: sendOrderAmount
                    }
                }).then(res => {
                    console.log(res);
                    this.couponInfo = res.data.couponInfo;
                }).catch(error => {
                    console.log(error);
                });
            }
        },
        computed: {
            getSxProArr() {
                let result = [];
                if (!this.inValidProList.length) {
                    return null;
                }
                this.inValidProList.forEach(item => {
                    result.push(item.proSku);
                });
                return result;
            },
            getCheckedAllflag() {
                if (!this.validVenProList.length) {
                    return true;
                }
                let result = true;
                this.validVenProList.some(item => {
                    if (!item.checkAll) {
                        result = false;
                        return true;
                    }
                });
                return result;
            },
            getCheckedPros() {
                let result = [];
                this.validVenProList.forEach(item => {
                    result.push(...item.checkedPros);
                });
                return result;
            },
            getCheckedProsItem() {
                let result = [];
                this.validVenProList.forEach(item => {
                    item.proList.forEach(subitem => {
                        if (item.checkedPros.indexOf(subitem.proSku) >= 0) {
                            result.push(subitem);
                        }
                    });
                });
                return result;
            },
            totalPrice() {
                let result = 0;
                if (this.getCheckedProsItem.length > 0) {
                    this.getCheckedProsItem.forEach(item => {
                        if (item.disLimitProNum) {
                            // 有限时促销
                            if (item.originalProNum > 0) {
                                result += item.originalProNum * item.areaPrice;
                                result += item.disLimitProNum * item.disLimitProPrice;
                            } else {
                                result += item.disLimitProNum * item.disLimitProPrice;
                            }
                        } else {
                            // 无限时促销
                            result += (item.areaPrice * item.quantity);
                        }
                    });
                    this.totalPriceTxt = parseFloat(result).toFixed(2);
                    return parseFloat(result).toFixed(2);
                } else {
                    this.totalPriceTxt = 0;
                    return result;
                }
            }
        },
        watch: {
            editorFlag(val) {
                if (val) {
                    this.checkedAll = false;
                    this.validVenProList.forEach(item => {
                        item.checkAll = false;
                        item.editorcheckedProsBak = item.checkedPros;
                        item.checkedPros = [];
                    });
                } else {
                    this.checkedAll = true;
                    this.validVenProList.forEach(item => {
                        let checkedPros = [];
                        item.checkAll = true;
                        // 默认全选
                        item.proList.forEach(subitem => {
                            checkedPros.push(subitem.proSku);
                        });
                        item.checkedPros = checkedPros;
                        item.checkedProsBak = checkedPros;
                    });
                }
            },
            totalPriceTxt(n) {
                this.getCartCoupTemplet(n);
            }
        },
        components: {
            [Checkbox.name]: Checkbox,
            [CheckboxGroup.name]: CheckboxGroup,
            InputNumber,
            [Popup.name]: Popup,
            [CouponItem.name]: CouponItem,
            CitySelect
        }
    };
</script>
<style rel="stylesheet/scss" lang="scss">
    @import '../../static/styles/rules.scss';
    .m-cart-top {
        width: 100%;
        height: 80/$ppr;
        padding: 20/$ppr;
        line-height: 40/$ppr;
        display: flex;
        justify-content: space-between;
        font-size: 28/$ppr;
        .m-cart-adr {
            .xe-iconfont {
                width: 36/$ppr;
                height: 40/$ppr;
                font-size: 36/$ppr;
                display: inline-block;
                vertical-align: top;
                margin-right: 8/$ppr;
            }
        }
    }

    .m-cart-item {
        padding: 0 20/$ppr;
        background: #fff;
        margin-bottom: 10/$ppr;
        &.m-cart-itemsx {
            .m-cart-pros {
                .item-check {
                    width: 54/$ppr;
                    flex: 0 0 54/$ppr;
                    margin-right: 10/$ppr;
                    height: 30/$ppr;
                    background: #bcbcbc;
                    font-size: 20/$ppr;
                    border-radius: 15/$ppr;
                    color: #fff;
                    text-align: center;
                    line-height: 30/$ppr;
                }
            }
            .m-cart-clear {
                padding: 20/$ppr;
                text-align: center;
            }
        }
        .m-cart-title {
            min-height: 89/$ppr;
            border-bottom: 1/$ppr solid $border-color-e8e;
            padding: 24/$ppr 0;
            line-height: 40/$ppr;
            display: flex;
            align-items: center;
            font-size: 26/$ppr;
            .m-cart-check {
                width: 40/$ppr;
                height: 40/$ppr;
                margin-right: 20/$ppr;
            }
            .m-cart-shop {
                flex: 1;
            }
            .m-cart-after {
                font-size: 24/$ppr;
                margin-left: 10/$ppr;
                white-space: nowrap;
            }
        }
        .m-shop-coupon {
            margin-left: 60/$ppr;
            padding: 5/$ppr 0;
            font-size: 24/$ppr;
            color: $text-666;
            border-bottom: 1/$ppr solid $border-color-e8e;
            > div {
                line-height: 1.4;
                margin: 10/$ppr 0;
            }
        }
        .m-cart-pros {
            overflow: hidden;
            .item {
                margin: 10/$ppr 0;
                display: flex;
                align-items: center;
                justify-content: flex-start;
                &:last-child {
                     margin-bottom: 0;
                    .msg {
                        border-bottom: 0;
                    }
                }
            }
            .item-check {
                margin-right: 20/$ppr;
            }
            .item-pro-msg {
                display: flex;
                position: relative;
                flex: 1;
                .num-count {
                    width: 200/$ppr;
                    height: 54/$ppr;
                    position: absolute;
                    right: 0;
                    bottom: 12/$ppr;
                }
                .pic {
                    width: 150/$ppr;
                    flex: 0 0 150/$ppr;
                    height: 150/$ppr;
                    border:1/$ppr solid $border-color-e8e;
                    margin-right: 10/$ppr;
                    border-radius: 5/$ppr;
                    overflow: hidden;
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
                    padding-bottom: 12/$ppr;
                    min-height: 164/$ppr;
                    border-bottom: 1/$ppr solid $border-color-e8e;
                }
                .name {
                    font-size: 28/$ppr;
                    height: 32/$ppr;
                    line-height: 32/$ppr;
                    overflow: hidden;
                    margin: 5/$ppr 0;
                    color: $text-333;
                    position: relative;
                    font-size: 26/$ppr;
                    p {
                        overflow : hidden;
                        text-overflow: ellipsis;
                        display: -webkit-box;
                        -webkit-line-clamp: 1;
                        -webkit-box-orient: vertical;
                    }
                }
                .pri {
                    margin-top: 10/$ppr;
                    padding-right: 210/$ppr;
                    .mp {
                        padding-bottom: 5/$ppr;
                        font-size: 24/$ppr;
                        color: $text-999;
                    }
                    .np {
                        margin-top: 5/$ppr;
                        font-size: 26/$ppr;
                        color: $main-color;
                        em {
                            font-size: 20/$ppr;
                        }
                    }
                }
            }
        }
    }
    .m-cart-btns {
        display: flex;
        align-items: center;
        width: 100%;
        max-width: 750/$ppr;
        margin: 0 auto;
        height: 98/$ppr;
        z-index: 333;
        background: #fff;
        border-top: 1/$ppr solid $border-color-e8e;
        .m-all-check {
            display: flex;
            justify-content: space-around;
            justify-items: center;
            padding-left: 20/$ppr;
        }
        .det-pri {
            flex: 1;
            // padding: 20/$ppr;
            // font-size: 32/$ppr;
            // color: $main-color;
            // height: 98/$ppr;
            // line-height: 58/$ppr;
            // span {
            //     color: $text-333;
            //     font-size: 28/$ppr;
            // }
        }
        .pay-coupon {
            padding: 7/$ppr 0  5/$ppr 14/$ppr;
            color: #333;
            &.no-margin {
                padding-left: 0;
            }
            .pay_all {
                line-height: 40/$ppr;
                font-size: 32/$ppr;
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
        .det-btns {
            display: flex;
            > div {
                flex:1;
                font-size: 34/$ppr;
                text-align: center;
                line-height: 98/$ppr;
                color: #fff;
                padding:0 30/$ppr;
            }
            .det-tocart {
                background: $com-color;
            }
            .editorFlag {
                background-color: $main-color;
            }
        }
    }
    .pop-cart-coupoon {
        padding: 20/$ppr;
    }
    .m-cart-btns .det-btns > div {
  background: linear-gradient(left,rgb(255,83,11) ,rgb(255,33,22)  ) no-repeat;
    background: -webkit-linear-gradient(left,rgb(255,83,11) ,rgb(255,33,22) ) no-repeat; }
.txt{display: block;line-height: .4rem}

</style>
