<template>
    <div>
        <transition name="fadein">
            <v-touch tag="div" v-show="showBox" class="m-mask-bg" @tap="close" @touchmove.prevent></v-touch>
        </transition>
        <div class="m-index-message" v-show="showBox">
            <div class="msg-tithea">
                您有{{proListData.orderCount}}条待确认的意向单
            </div>
            <div class="msg-content">
                <!--单条意向单-->
                <div class="msg-typeone" @click.prevent="goDetails('one', proListData)" v-if="proListData.proList && proListData.proList.length == 1">
                    <div class="msg-picshow">
                        <img :src="proListData.picServer + proListData.proList[0].proPicture" alt="">
                    </div>
                    <div class="msg-pre-text">
                        <div class="pre-mainCon">
                            {{proListData.proList[0].proName}}
                        </div>
                        <div class="pre-Spes">
                            规格：<span v-if="proListData.proList[0].specValue">{{proListData.proList[0].specValue}}/{{proListData.proList[0].specName}}</span>
                                  <span v-else>无</span>
                        </div>
                        <div class="pre-frice">
                            <span class="cor_red" v-if="proListData.proList[0].matchPrice"><i>¥</i>{{proListData.proList[0].matchPrice}}<i></i></span>
                            <span class="flo_R" v-if="proListData.proList[0].matchNum">x{{proListData.proList[0].matchNum}}</span>
                        </div>
                    </div>
                </div>

                <!--多条意向单-->
                <!--<div class="msg-typemore">-->
                    <!--<swiper :options="swiperOption" class="m-presec-picScro" ref='secKillControl'>-->
                        <!--<swiper-slide class="item" v-for="item in proListData.proList"  :key="Math.random()">-->
                            <!--<a @click.prevent="goDetails('two', item, proListData)">-->
                                <!--<div class="pic">-->
                                    <!--<img :src="proListData.picServer + item.proPicture" alt="">-->
                                <!--</div>-->
                            <!--</a>-->
                        <!--</swiper-slide>-->
                    <!--</swiper>-->
                <!--</div>-->
            </div>
            <!--底部-->
            <div class="msg-footer">
                <div class="msg-allMoneycon" v-if="parseFloat(proListData.orderCount) > 0">共{{proListData.orderCount}}件商品 已为您优惠 <span>{{proListData.pmtAmount.toString().split('.')[0]}}</span><i>.{{proListData.pmtAmount.toString().split('.')[1] ? proListData.pmtAmount.toString().split('.')[1] : '00'}}</i> 元
                </div>
                <div class="msg-lastTime" v-if="proListData.endTime">还剩
                    <xe-countdown timetype="second" :time="proListData.endTime.toString().split('-')[1] / 1000" @timehasDown="timehasDown">
                        <span>{%d}<i>天</i></span><span  style="color: blue">{%h}<i>时</i></span><span style="color: blue">{%m}<i>分</i></span><span style="color: blue">{%s}<i>秒</i></span>
                    </xe-countdown>
                    失效，请尽快下单
                </div>
                <div class="msg-butcontro" v-if="proListData.endTime && proListData.endTime !== 0">
                    <span @click.prevent="goDown">去下单</span>
                </div>
            </div>
            <div class="msg-close">
                <span class="xe-iconfont xe-icon-gb" @click="close"></span>
            </div>
        </div>
    </div>
</template>

<script>
    // import {swiper, swiperSlide} from 'vue-awesome-swiper';
    import {CountDown} from 'components/CountDown';
    export default {
        props: {
            show: {
                type: Boolean,
                default: false
            },
            proListData: {
                type: Object
            }
        },
        data() {
            return {
                swiperOption: {
                    slidesPerView: 'auto',
                    loop: false,
                    autoplay: false
//                    autoplay: {
//                        delay: 3000,
//                        stopOnLastSlide: false,
//                        disableOnInteraction: false
//                    }
                },
                productList: []
            };
        },
        created() {
        },
        methods: {
            close() {
                this.$emit('update:show', false);
            },
            timehasDown() {
                this.$emit('update:show', false);
            },
            goDown() {
                if (this.proListData.proList.length === 1) {
                    this.$router.push({name: 'ConfirmorderInten', params: {orderSource: 3, orderPlat: 3}, query: {proSkus: this.proListData.proList[0].proSku, wishCode: this.wishCodes}});
                } else {
                    this.$router.push({name: 'IntentionList'});
                }
            },
            orient() {
                if (this.$refs.secKillControl.swiper) {
                    setTimeout(() => {
                        this.$refs.secKillControl.swiper.update(true);
                    }, 500);
                }
            },
            goDetails(lis, item, lisareaId) {
                if (lis === 'one') {
                    this.$router.push({name: 'ProductDetails', params: {prospu: item.proList[0].proSpu}, query: {prosku: item.proList[0].proSku, areaId: item.areaId}});
                } else {
                    this.$router.push({name: 'ProductDetails', params: {prospu: item.proSpu}, query: {prosku: item.proSku, areaId: lisareaId}});
                }
            }
        },
        computed: {
            showBox() {
                return this.show;
            },
            wishCodes() {
                if (this.proListData.proList && this.proListData.proList.length) {
                    let wishCode = [];
                    this.proListData.proList.forEach(item => {
                        wishCode.push(item.wishCode);
                    });
                    return wishCode.join(',');
                }
            }
        },
        watch: {
            showBox(val) {
                if (val) {
                    this.bodyScrollTop = document.body.scrollTop;
                    document.body.className = 'overflowHide';
                } else {
                    document.body.className = '';
                    window.scrollTo(0, this.bodyScrollTop);
                }
            }
        },
        mounted () {
            window.addEventListener('orientationchange', this.orient, false);
        },
        components: {
            swiper,
            swiperSlide,
            [CountDown.name]: CountDown
        },
        beforeDestroy() {
            document.body.className = '';
            window.removeEventListener('orientationchange', this.orient, false);
        }
    };
</script>
<style lang="scss">
    @import '../../static/styles/rules.scss';
   .m-index-message {
        position: absolute;
        left: 50%;
        top: 50%;
        z-index: 666;
        margin-left: -305/$ppr;
        margin-top: -270/$ppr;
        width:610/$ppr;
        height:570/$ppr;
        background:#f3f3f3;
       border-radius: 15px;
       .msg-tithea {
           border-top-left-radius: 15px;
           border-top-right-radius: 15px;
           text-align: center;
           font-size: 40/$ppr;
           line-height: 120/$ppr;
           background: #f23530;
           color: #fff;
       }
       .msg-content {
           padding: 30/$ppr 20/$ppr;
           border-bottom: 1px solid #e8e8e8;
       }
       .msg-typeone {
           display: flex;
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
                   display: -webkit-box;
                   overflow : hidden;
                   -webkit-line-clamp: 2;
                   -webkit-box-orient: vertical;
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
       .msg-footer {
           text-align: center;
           padding-top: 20/$ppr;
           .msg-allMoneycon {
               font-size: 28/$ppr;
               color: #333;
               line-height: 46/$ppr;
               span {
                   font-size: 30/$ppr;
                   color: #f23530;
               }
               i {
                   font-size: 24/$ppr;
                   color: #f23530;
               }
           }
           .msg-lastTime {
               font-size: 24/$ppr;
               color: #666;
               line-height: 42/$ppr;
           }
           .msg-butcontro {
               padding-top: 25/$ppr;
               span {
                   display: inline-block;
                   width: 200/$ppr;
                   line-height: 68/$ppr;
                   background: #f23530;
                   color: #fff;
                   font-size: 34/$ppr;
                   border-radius: 35px;
               }
           }
       }
       .msg-close {
           position: absolute;
           width: 48/$ppr;
           height: 48/$ppr;
           line-height: 48/$ppr;
           bottom: -72/$ppr;
           left: 50%;
           margin-left: -24/$ppr;
           color: #fdfdfd;
           span {
               font-size: 48/$ppr;
           }
       }
       .m-presec-picScro {
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
   }
</style>
