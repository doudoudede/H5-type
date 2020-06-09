<template>
    <xe-layout class="m-bg-dark">
        <view class="m-succ-item">
            <view class="m-succ-top" v-if="flag20">
                <view class="xe-iconfont xe-icon-tc"></view>
                <view class="tips">
                    您的支付正在处理中...<br>
                    处理成功后，我们会尽快为您发货！
                </view>
            </view>
            <view class="m-succ-top" v-if="flag30">
                <view class="xe-iconfont xe-icon-rfill2"></view>
                <view class="tips">
                    恭喜您成功提交订单，<br>
                    我们会尽快为您发货！
                </view>
            </view>
            <view class="m-succ-top" v-if="flag40">
                <view class="xe-iconfont xe-icon-cuowu"></view>
                <view class="tips">
                    对不起，支付失败！<br>
                    请您核对支付信息是否正确或<br>选择其他支付方式！
                </view>
            </view>
            <view class="m-succ-bot">
                <!-- <view>订单编号：{{$route.params.mid}}</view> -->
                <view>应付款金额：<span>&yen;{{$route.params.payamount | toFixed2}}</span></view>
                <view>支付方式：<span>货到付款</span></view>
            </view>
        </view>
        <view class="m-succbtns">
            <mt-button class="btns-01 xe-button-white" @click.prevent="navToMy">查看订单</mt-button>
            <mt-button type="primary" class="xe-button-primary btns-01" @click.prevent="navToCategory">继续采购</mt-button>
        </view>
    </xe-layout>
</template>
<script type="text/ecmascript-6">
    export default {
        name: 'xe-page-deliverysucc',
        data() {
            return {
                flag30: false,
                flag20: false,
                flag40: false
            };
        },
        created() {
            var code = this.$route.params.code;
            if (code === '20') {
                this.flag20 = true;
            }
            if (code === '30') {
                this.flag30 = true;
            }
            if (code === '40') {
                this.flag40 = true;
            }
        },
        methods: {
            navToMy() {
                this.$router.replace({
                    name: 'My'
                });
            },
            navToCategory() {
                this.$router.push({
                    name: 'Category'
                });
            }
        }
    };
</script>
<style rel="stylesheet/scss" lang="scss">
    @import "../../static/styles/rules.scss";
    .m-succ-item {
        background: #fff;
        .m-succ-top {
            padding: 50/$ppr 20/$ppr;
            .xe-icon-rfill2, .xe-icon-cuowu, .xe-icon-tc {
                width: 100/$ppr;
                height: 100/$ppr;
                font-size: 100/$ppr;
                line-height: 1;
                text-align: center;
                margin: 0 auto;
                color: #00cc00;
            }
            .xe-icon-cuowu {
                color: #f23530;
            }
            .xe-icon-tc {
                color: #ffcc00;
            }
            .tips {
                font-size: 36/$ppr;
                text-align: center;
                line-height: 1.4;
                margin-top: 40/$ppr;
            }
        }
        .m-succ-bot {
            padding: 20/$ppr;
            border-top: 1/$ppr solid $border-color-e8e;
            view {
                line-height: 1.4;
                color: $text-999;
                font-size: 28/$ppr;
                span {
                    color: $main-color;
                }
            }
        }
    }
    .m-succbtns {
        margin: 40/$ppr 20/$ppr;
        display: flex;
        .btns-01 {
            flex: 1;
            + .btns-01 {
              margin-left: 20/$ppr;
            }
        }
    }
</style>
