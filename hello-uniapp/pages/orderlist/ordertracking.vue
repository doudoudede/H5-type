<template>
    <transition name="slideInRight">
        <div class="m-order-tracking" v-if="logisticInfo">
            <div class="m-tracktext">
                <div class="m-tracktext-item">
                    <div class="title">物流单号:</div>
                    <div class="msg">{{logisticInfo.logtsCode}}</div>
                </div>
                <div class="m-tracktext-item">
                    <div class="title">收货人:</div>
                    <div class="msg">{{logisticInfo.caConsignee}} {{logisticInfo.caPhone}}</div>
                </div>
                <div class="m-tracktext-item">
                    <div class="title">收货地址:</div>
                    <div class="msg">{{logisticInfo.addrDetail}}</div>
                </div>
                <div class="m-tracktext-item" v-if="logisticInfo.logtsCompany">
                    <div class="title">物流公司:</div>
                    <div class="msg">{{logisticInfo.logtsCompany}}</div>
                </div>
                <div class="m-tracktext-item" v-if='logisticInfo.logtsNumber'>
                    <div class="title">运单号:</div>
                    <div class="msg">{{logisticInfo.logtsNumber}}</div>
                </div>
                <div class="m-tracktext-item" v-if="logisticInfo.driverCarNumber">
                    <div class="title">车牌号:</div>
                    <div class="msg">{{logisticInfo.driverCarNumber}}</div>
                </div>
                <div class="m-tracktext-item" v-if='logisticInfo.driverPhone'>
                    <div class="title">联系方式:</div>
                    <div class="msg">{{logisticInfo.driverName}} {{logisticInfo.driverPhone}}</div>
                </div>
            </div>
            <div class="m-tracktext">
                <div class="m-logistics-tracking">
                    <div class="list-con" v-for="(item, index) in logisticInfo.logisticDetail" :class="{'current': index === 0}">
                        <div class="time">
                            <p>{{item.createDateStr.split(' ')[1]}}</p>
                            <p>{{item.createDateStr.split(' ')[0]}}</p>
                        </div>
                        <div class="msg">
                            {{item.logtsDesc}}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </transition>
</template>
<script type="text/ecmascript-6">
    export default {
        name: 'xe-page-orderTracking',
        beforeRouteEnter(to, from, next) {
            console.log('tracking created');
            next(vm => {
                vm.queryLogistic(vm);
            });
        },
        data() {
            return {
                logisticInfo: null
            };
        },
        methods: {
            queryLogistic() {
                this.$http({
                    method: 'post',
                    url: '/xe-route/xe-app/mobile/orderInfo/queryLogistic',
                    data: {
                        orderId: this.$route.params.oid
                    }
                }).then(res => {
                    console.log(res);
                    this.logisticInfo = res.data.logisticInfo;
                }).catch(error => {
                    console.log(error);
                });
            }
        }
    };
</script>
<style rel="stylesheet/scss" lang="scss">
    @import '../../static/styles/rules.scss';
    .m-order-tracking {
        position: fixed;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        z-index: 3;
        background: #f5f5f5;
        overflow: auto;
        -webkit-overflow-scrolling: touch;
        .m-tracktext {
            margin: 20/$ppr 0;
            background: #fff;
            padding: 10/$ppr 20/$ppr;
        }
        .m-tracktext-item {
            display: flex;
            margin: 20/$ppr 0;
            font-size: 28/$ppr;
            line-height: 1.4;
            color: $text-666;
            .title {
                margin-right: 20/$ppr;
                white-space: nowrap;
                color: $text-333;
                font-weight: 500;
                width: 140/$ppr;
                text-align: right;
            }
            .msg {
                word-break: break-all;
                word-wrap: break-word;
            }
        }
    }
    .m-logistics-tracking {
        padding: 40/$ppr 20/$ppr;
        overflow: auto;
        .list-con {
            display: flex;
            &:last-child {
                .msg {
                    padding-bottom: 0;
                    /*border-left: none;*/
                }
            }
            &.current {
                .msg {
                    color: #25ae5f;
                    &:before {
                        background: #25ae5f;
                    }
                    &:after {
                        content: '';
                        position: absolute;
                        width: 28/$ppr;
                        height: 28/$ppr;
                        background: rgba(37, 174, 95, .4);
                        top: -6/$ppr;
                        left: -14/$ppr;
                        border-radius: 50%;
                        animation-duration: 1s;
                        animation-fill-mode: both;
                        animation-iteration-count: infinite;
                        animation-name: tadas;
                    }
                }
            }
        }
        .time {
            width: 150/$ppr;
            flex: 0 0 150/$ppr;
            padding-right: 30/$ppr;
            font-size: 24/$ppr;
            color:$text-666;
            text-align: right;
            p {
                &:nth-child(2) {
                    margin-top: 5/$ppr;
                    font-size: 20/$ppr;
                    color:$text-999;
                }
            }
        }
        .msg {
            flex: 1;
            padding-left: 30/$ppr;
            font-size: 28/$ppr;
            border-left:1/$ppr solid #ddd;
            padding-bottom: 60/$ppr;
            position: relative;
            line-height: 1.2;
            &:before {
                content: '';
                width: 16/$ppr;
                height: 16/$ppr;
                background: #ddd;
                position: absolute;
                left: -8/$ppr;
                top: 0/$ppr;
                border-radius: 50%;
            }
        }
    }
</style>
