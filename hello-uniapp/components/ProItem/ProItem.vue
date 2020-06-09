<template>
    <view v-if="itemData" class="m-product-item" @click="productClickFn">
        <view class="pic">
            <img v-if="itemData.skuList.length" v-lazy="picServerPro + itemData.skuList[0].proMainImg" alt="">
        </view>
        <view class="msg">
            <view class="msg-con">
                <view class="name" :class="{'arrow': showArrow && itemData.skuList.length > 1}">
                    <p>
                        <span v-if="itemData.discountStatus === 1" class="xe-iconfont xe-icon-miaoshafuben coupon-style-icon"></span><span v-if="itemData.preSaleStatus === 1" class="xe-iconfont xe-icon-yushoufuben coupon-style-icon1"></span><span v-html="itemData.proName"></span>
                    </p>
                    <span v-if="showArrow && itemData.skuList.length > 1" @click.stop="arrowClickFn" class="xe-iconfont xe-icon-unfold"></span>
                </view>
                <view class="vendor" v-if="showVendor">
                    {{itemData.shopName}}
                </view>
                <view v-for="(item, index) in itemData.skuList" :key="item.proSku">
                    <view class="msg-scon" v-if="index === 0">
                        <view class="qutaliy">{{item.minQuantity}}{{itemData.proUnit}}起订</view>
                        <!-- <view class="marketPri" v-if="itemData.priceMethod !== 3"> -->
                            <!-- &yen;{{item.unitPrice | toFixed2}}/斤 <template v-if="item.specValue">({{item.specValue}})</template>
                        </view> -->
                        <!-- <view class="marketPri" v-else>
                            <template v-if="item.specValue">({{item.specValue}})</template>
                        </view> -->
                        <view class="price">
                            <template v-if="itemData.priceMethod === 3">
                                <span class="big-price">面议</span>
                            </template>
                            <template v-else>
                                <template v-if="item.areaStepList && item.areaStepList.length">
                                    &yen;<span class="big-price">{{item.areaStepList[item.areaStepList.length - 1].stepPrice | toFixed2}}</span><span class="unit">/{{itemData.proUnit}}</span> ~ &yen;<span class="big-price">{{item.areaStepList[0].stepPrice | toFixed2}}</span><span class="unit">/{{itemData.proUnit}}</span>
                                </template>

                                <template v-else>
                                    &yen;<span class="big-price">{{item.skuPrice | toFixed2}}</span><span class="unit">/{{itemData.proUnit}}</span>
                                </template>
                            </template>
                        </view>
                        <view class="buyBtn" v-if="showBtn && itemData.priceMethod === 2">
                            <span v-if="item.saleQuantity >= item.minQuantity" @click.stop="buyBtnClickFn(item)" class="xe-iconfont xe-icon-jinhuodan1"></span>
                            <span v-else class="sold-out">售罄</span>
                        </view>
                        <view class="buyBtn" v-if="showBtn && itemData.priceMethod === 1 || itemData.priceMethod === 3">
                            <span v-if="item.saleQuantity >= item.minQuantity" @click.stop="inquiryBtnClickFn(item)" class="xe-iconfont xe-icon-xunjiadan"></span>
                            <span v-else class="sold-out">售罄</span>
                        </view>
                    </view>
                    <CollapseTransition v-else>
                        <view class="msg-scon" v-show="itemData.showMore">
                            <view class="qutaliy">{{item.minQuantity}}{{itemData.proUnit}}起订</view>
                            <view class="marketPri" v-if="itemData.priceMethod !== 3">
                                &yen;{{item.unitPrice | toFixed2}}/斤 <template v-if="item.specValue">({{item.specValue}})</template>
                            </view>
                            <view class="marketPri" v-else>
                                <template v-if="item.specValue">({{item.specValue}})</template>
                            </view>
                            <view class="price">
                                <template v-if="itemData.priceMethod === 3">
                                    <span class="big-price">面议</span>
                                </template>
                                <template v-else>
                                    <template v-if="item.areaStepList && item.areaStepList.length">
                                        &yen;<span class="big-price">{{item.areaStepList[0].stepPrice | toFixed2}}</span><span class="unit">/{{itemData.proUnit}}</span> ~ &yen;<span class="big-price">{{item.areaStepList[item.areaStepList.length - 1].stepPrice | toFixed2}}</span><span class="unit">/{{itemData.proUnit}}</span>
                                    </template>
                                    <template v-else>
                                        &yen;<span class="big-price">{{item.skuPrice | toFixed2}}</span><span class="unit">/{{itemData.proUnit}}</span>
                                    </template>
                                </template>
                            </view>
                            <view class="buyBtn" v-if="showBtn && itemData.priceMethod === 2">
                                <span v-if="item.saleQuantity >= item.minQuantity" @click.stop="buyBtnClickFn(item)" class="xe-iconfont xe-icon-jinhuodan1"></span>
                                <span v-else class="sold-out">售罄</span>
                            </view>
                            <view class="buyBtn" v-if="showBtn && itemData.priceMethod === 1 || itemData.priceMethod === 3">
                                <span v-if="item.saleQuantity >= item.minQuantity" @click.stop="inquiryBtnClickFn(item)" class="xe-iconfont xe-icon-xunjiadan"></span>
                                <span v-else class="sold-out">售罄</span>
                            </view>
                        </view>
                    </CollapseTransition>
                </view>
            </view>
        </view>
    </view>
</template>
<script type="text/ecmascript-6">
    import CollapseTransition from 'utils/collapse-transition';
    export default {
        props: {
            itemData: {
                type: Object
            },
            picServerPro: {
                type: String
            },
            showBtn: {
                // 是否显示加入购物车按钮
                type: Boolean,
                default: true
            },
            showArrow: {
                // 是否显示展开更多价格箭头按钮
                type: Boolean,
                default: true
            },
            showVendor: {
                // 是否展示商户名
                type: Boolean,
                default: true
            }
        },
        methods: {
            productClickFn() {
//                this.$emit('productClick');
                this.$router.push({name: 'ProductDetails', params: {prospu: this.itemData.proSpu}});
            },
            arrowClickFn() {
//                this.$emit('arrowClick');
                this.$set(this.itemData, 'showMore', !this.itemData.showMore);
            },
            buyBtnClickFn(item) {
                console.log(item);
                if (this.itemData.preSaleStatus === 1) {
                    // 判断是否为预售，预售加入购物车直接进入详情页
                    this.$router.push({name: 'ProductDetails', params: {prospu: this.itemData.proSpu}});
                } else {
                    this.$indicator.open();
                    this.$http({
                        method: 'post',
                        url: '/xe-route/xe-app/mobile/cart/addCart',
                        data: {
                            proSku: item.proSku,
                            quantity: item.minQuantity,
                            areaId: JSON.parse(this.$getLocalStorage('REGIONMAP')).areaId
                        }
                    }).then(res => {
                        this.$indicator.close();
                        this.$toast({
                            message: '加入购物车成功',
                            duration: 800
                        });
                    }).catch(error => {
                        this.$indicator.close();
                        console.log(error);
                    });
                }
                this.$emit('buyBtnClick');
            },
            inquiryBtnClickFn(item) {
                this.$indicator.open();
                this.$http({
                    method: 'post',
                    url: '/xe-route/xe-app/mobile/inquiry/addInquiry',
                    data: {
                        productSku: item.proSku,
                        quirySource: 3
                    }
                }).then(res => {
                    this.$indicator.close();
                    if (res.data.responseDto.status === '2003') {
                        // 没有地址
                        this.$xeMessageBox({
                            message: res.data.responseDto.msg,
                            showCancelButton: true,
                            confirmButtonText: '立即添加地址'
                        }).then((action) => {
                            if (action === 'confirm') {
                                this.$router.push({
                                    name: 'AddNewAdr',
                                    query: {
                                        redirect: this.$route.fullPath
                                    }
                                });
                            }
                        });
                    } else {
                        this.$toast({
                            message: res.data.responseDto.msg,
                            duration: 800
                        });
                    }
                }).catch(error => {
                    this.$indicator.close();
                    console.log(error);
                });
            }
        },
        computed: {
            showms() {
                let flag = false;
                this.itemData.skuList.some(item => {
                    if (item.discountStatus === 1) {
                        flag = true;
                        return true;
                    }
                });
                return flag;
            }
        },
        components: {
            CollapseTransition
        }
    };
</script>
<style rel="stylesheet/scss" lang="scss"></style>
