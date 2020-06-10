<template>
    <xe-layout class="m-bg-dark">
        <div class="m-succ-item">
            <div class="m-succ-top">
                <div class="xe-iconfont xe-icon-rfill2"></div>
                <div class="tips">
                    您的订单已成功提交<br>
                    我们会尽快为您安排发货！
                </div>
            </div>
            <div class="m-succ-bot">
                <!-- <div>订单编号：{{$route.params.mid}}</div> -->
                <div>应付款金额：<span>&yen;{{$route.params.payamount | toFixed2}}</span></div>
                <div>支付方式：<span>货到付款</span></div>
            </div>
        </div>
         <div class="m-succbtns">
            <mt-button class="mint-button xe-button-white btns-01" @click.prevent="navToOrderList">查看订单</mt-button>
            <mt-button type="primary" class="xe-button-primary btns-01" @click.prevent="navToCategory">继续采购</mt-button>
        </div>
    </xe-layout>
</template>
<script type="text/ecmascript-6">
    export default {
        name: 'xe-page-deliverysucc',
        methods: {
            navToOrderList() {
                this.$router.push({
                    name: 'OrderList'
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
            .xe-icon-rfill2 {
                width: 100/$ppr;
                height: 100/$ppr;
                font-size: 100/$ppr;
                line-height: 1;
                text-align: center;
                margin: 0 auto;
                color: #00cc00;
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
            div {
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
