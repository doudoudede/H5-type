<template>
    <div class="m-logistics">
        <transition name="fadein">
            <v-touch tag="div" v-show="showBox" class="m-mask-bg" @tap="close" @touchmove.prevent></v-touch>
        </transition>
        <transition name="slideMoveIn">
            <div v-if="showBox" class="m-logistics-con">
                <div class="m-logistics-msg">
                    <div class="m-logistics-pro xe-gradient-color">
                        <router-link tag="div" :to="{name: 'OrderDet', params: {mid: datas.morderId, oid: datas.orderId}}" class="arrow-right-commons">
                            <div class="pic">
                                <img :src="datas.picServer + datas.proImage" alt="">
                            </div>
                            <div class="msg">
                                <p class="name">{{datas.proName}}</p>
                                <p class="tips" v-if="datas.driverCarNumber">
                                    承运车辆：{{datas.driverCarNumber}}
                                    <template v-if="datas.uploadTime"><br>预计{{parseInt(datas.uploadTime) | uploadTimeFormat}}送达</template>
                                </p>
                            </div>
                        </router-link>
                    </div>
                    <div class="m-logistics-listcon" v-if="datas.logisticDetail.length">
                        <div class="m-logistics-list">
                            <div class="list-con" v-for="(item, index) in datas.logisticDetail" :key="item.index" :class="{'current': index === 0}">
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
                <div class="m-logistics-close xe-iconfont xe-icon-gb" @click="close"></div>
            </div>
        </transition>
    </div>
</template>
<script type="text/ecmascript-6">
    export default {
        name: 'xe-logistics',
        props: {
            show: {
                type: Boolean,
                default: true
            },
            datas: {
                type: Object,
                default: {}
            }
        },
        methods: {
            close() {
                this.$emit('update:show', false);
            }
        },
        filters: {
            uploadTimeFormat(val) {
                var oDate = new Date(val);
                var nowData = new Date();
//                var year = oDate.getFullYear();
                var month = (oDate.getMonth() + 1) >= 10 ? oDate.getMonth() + 1 : '0' + (oDate.getMonth() + 1);
                var date = oDate.getDate() >= 10 ? oDate.getDate() : '0' + oDate.getDate();
                var hours = oDate.getHours() >= 10 ? oDate.getHours() : '0' + oDate.getHours();
                var minutes = oDate.getMinutes() >= 10 ? oDate.getMinutes() : '0' + oDate.getMinutes();
//                var seconds = oDate.getSeconds() >= 10 ? oDate.getSeconds() : '0' + oDate.getSeconds();
                let dis = oDate.getDate() - nowData.getDate();
                if (dis === 0) {
                    return '今天';
                } else if (dis === 1) {
                    return '明天';
                } else {
                    return `${month}-${date} ${hours}:${minutes}`;
                }
            }
        },
        computed: {
            showBox() {
                return this.show;
            }
        }
    };
</script>
<style rel="stylesheet/scss" lang="scss">
    @import '../../static/styles/rules.scss';
    .m-logistics {}
    .m-logistics-con {
        position: fixed;
        left: 40/$ppr;
        right: 40/$ppr;
        top: 50/$ppr;
        bottom: 160/$ppr;
        z-index: 502;
    }
    .m-logistics-close {
        width: 80/$ppr;
        height: 80/$ppr;
        position: absolute;
        left: 50%;
        bottom: -110/$ppr;
        color: #fff;
        font-size: 80/$ppr;
        line-height: 1;
        text-align: center;
        margin-left: -40/$ppr;
    }
    .m-logistics-msg {
        height: 100%;
        width: 100%;
        background: #fff;
        border-radius: 15/$ppr;
        overflow: hidden;
        display: flex;
        flex-direction: column;
    }
    .m-logistics-pro {
        width: 100%;
        min-height: 190/$ppr;
        padding: 40/$ppr;
        .arrow-right-commons {
            display: flex;
        }
        .pic {
            width: 110/$ppr;
            height: 110/$ppr;
            flex: 0 0 110/$ppr;
            border-radius: 5/$ppr;
            overflow: hidden;
            background-color: #fff;
            margin-right: 20/$ppr;
            img {
                width: 100%;
                height: 100%;
            }
        }
        .msg {
            font-size: 28/$ppr;
            color: #fff;
            flex:1;
            line-height: 1.5;
        }
    }
    .m-logistics-listcon {
        flex: 1;
        overflow: auto;
        -webkit-overflow-scrolling: touch;
    }
    .m-logistics-list {
        padding: 40/$ppr;
        overflow: auto;
        .list-con {
            display: flex;
            &:last-child {
                .msg {
                    padding-bottom: 0;
                    border-left: none;
                }
            }
            &.current {
               .msg {
                    border-left:1/$ppr solid #ddd;
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
