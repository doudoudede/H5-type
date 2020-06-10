<template>
    <transition name="slideInRight">
        <div class="storedet-con" v-if="venShopInfo">
            <div class="m-shop-details">
                <div class="shop-tit">
                    <div class="shop-pic">
                        <img v-if="venShopInfo.shopLogo" :src="logoPicServer + venShopInfo.shopLogo" alt="">
                        <img v-else src="../../static/images/default.png" alt="">
                    </div>
                    <div class="shop-name"> {{venShopInfo.shopName}}</div>
                </div>
                <div class="shop-introduction" v-if="venShopInfo.comDesc">
                    <p>
                        {{venShopInfo.comDesc.slice(0, 120)}}
                    </p>
                    <CollapseTransition>
                        <p v-show="showFlag">
                            {{venShopInfo.comDesc.slice(120)}}
                        </p>
                    </CollapseTransition>
                </div>
                <div class="shop-allDetail-contro" v-if="venShopInfo.comDesc && venShopInfo.comDesc.length >= 120" @click="showFlag = !showFlag">
                    <span class="xe-iconfont xe-icon-triangle" :class="{'ralateDeg': showFlag}"></span>
                </div>
            </div>
            <div class="det-item">
                <div class="m-list-block">
                    <ul>
                        <!-- <li class="item-content align-top">
                            <div class="item-inner">
                                <div class="item-title">店铺名称</div>
                                <div class="item-text2">{{venShopInfo.shopName}}</div>
                            </div>
                        </li> -->
                        <li class="item-content align-top">
                            <div class="item-inner">
                                <div class="item-title">店主信息</div>
                                <div class="item-text2">{{venShopInfo.userName}}</div>
                            </div>
                        </li>
                        <li class="item-content align-top">
                            <div class="item-inner">
                                <div class="item-title">联系方式</div>
                                <div class="item-text2">{{venShopInfo.userPhone.substr(0, 3) + '****' + venShopInfo.userPhone.substr(7)}}</div>
                                <a class="phonecall xe-iconfont xe-icon-phone" :href="'tel:' + venShopInfo.userPhone"></a>
                            </div>
                        </li>
                        <!--<li class="item-content align-top">-->
                            <!--<div class="item-inner">-->
                                <!--<div class="item-title">联系地址</div>-->
                                <!--<div class="item-text2">北京市海淀区中关村泰鹏大厦1002泰鹏大厦1002泰鹏大厦1002</div>-->
                            <!--</div>-->
                        <!--</li>-->
                    </ul>
                </div>
            </div>
            <div class="det-item">
                <div class="m-list-block">
                    <ul>
                        <li class="item-content align-top">
                            <div class="item-inner">
                                <div class="item-title">商户名称</div>
                                <div class="item-text2">{{venShopInfo.venName}}</div>
                            </div>
                        </li>
                        <li class="item-content align-top">
                            <div class="item-inner">
                                <div class="item-title">企业性质</div>
                                <div class="item-text2">{{venShopInfo.venPropertiesName}}</div>
                            </div>
                        </li>
                        <li class="item-content align-top">
                            <div class="item-inner">
                                <div class="item-title">所在地区</div>
                                <div class="item-text2">{{venShopInfo.cityName}}</div>
                            </div>
                        </li>
                        <li class="item-content align-top">
                            <div class="item-inner">
                                <div class="item-title">入驻时间</div>
                                <div class="item-text2">{{venShopInfo.createDate}}</div>
                            </div>
                        </li>
                        <li class="item-content align-top">
                            <div class="item-inner">
                                <div class="item-title">主营产品</div>
                                <div class="item-text2">{{venShopInfo.businessTypeName}}</div>
                            </div>
                        </li>
                        <li class="item-content align-top">
                            <div class="item-inner">
                                <div class="item-title">商品数量</div>
                                <div class="item-text2">{{$route.query.proCount}}</div>
                            </div>
                        </li>
                        <li class="item-content align-top">
                            <div class="item-inner">
                                <div class="item-title">销售范围</div>
                                <div class="item-text2">{{venShopInfo.areaNames}}</div>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </transition>
</template>
<script type="text/ecmascript-6">
    import CollapseTransition from 'utils/collapse-transition';
    export default {
        name: 'xe-page-storedet',
        data() {
            return {
                logoPicServer: '',
                venShopInfo: null,
                showFlag: false
            };
        },
        created() {
            this.getVenShopInfo();
        },
        components: {
            CollapseTransition
        },
        methods: {
            getVenShopInfo() {
                this.$http({
                    method: 'post',
                    url: '/xe-route/xe-app/mobileApp/venShopDetail/getVenShopInfo',
                    data: {
                        userCode: this.$route.query.userCode
                    }
                }).then(res => {
                    console.log(res);
                    if (res.data.isExist === 1) {
                        this.logoPicServer = res.data.logoPicServer;
                        this.venShopInfo = res.data.venShopInfo;
                    } else {
                        this.$toast({
                            message: '商户不存在',
                            duration: 1500
                        });
                    }
                }).catch(error => {
                    console.log(error);
                });
            }
        }
    };
</script>
<style rel="stylesheet/scss" lang="scss">
    @import '../../static/styles/rules.scss';
    .storedet-con {
        position: fixed;
        left:0;
        right:0;
        top:0;
        bottom: 0;
        z-index: 33;
        background-color: #f5f5f5;
        overflow: auto;
        -webkit-overflow-scrolling: touch;
        .det-item {
            margin: 20/$ppr 0;
            background: #fff;
        }
        .pic {
            width: 80/$ppr;
            height: 80/$ppr;
            background: #f5f5f5;
            border-radius: 50%;
            overflow: hidden;
            img {
                width: 100%;
                height: 100%;
            }
        }
    }
    .m-shop-details {
        padding: 24/$ppr 30/$ppr 0;
        background: #fff;
        .shop-tit {
            padding-bottom: 20/$ppr; 
            display: flex;
            align-items: center;
            font-size: 32/$ppr;
            font-weight: 500;
            .shop-pic {
                width: 102/$ppr;
                img {
                    display: block;
                    width: 80/$ppr;
                    height: 80/$ppr;
                    border-radius: 50%;
                    border: 1px solid #d5d5d5;
                }
            }
        }
        .shop-introduction {
            padding: 0 20/$ppr 5/$ppr;
            overflow: hidden;
            text-indent: 60/$ppr;
            color: #666;
            font-size: 28/$ppr;
            line-height: 40/$ppr;
            word-break: break-all;
        }
        .shop-allDetail-contro {
            position: relative;
            height: 30/$ppr;
            .xe-iconfont {
                position: absolute;
                left: 50%;
                top: 50%;
                transform: translate(-50%, -50%);
                display: block;
                width: 22/$ppr;
                height: 30/$ppr;
                line-height: 20/$ppr;
                color: #c6cdd8;
                font-size: 22/$ppr;
                &.ralateDeg {
                    transform: rotate(180deg);
                    top: -8/$ppr;
                }
            }
        }
    }
</style>
