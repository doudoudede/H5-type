<template>
    <xe-layout class="m-bg-dark">
        <template v-if="msgRecordList.length">
            <view class="m-msglist-item" v-for="(item, index) in msgRecordList">
                <view class="m-msglist-date">
                    <span>{{item.createDate | uploadTimeFormat}}</span>
                </view>
                <view class="m-msglist-con" @click.prevent="navtodet(item)">
                    <h3>{{item.msgTitle}}</h3>
                    <view class="content">
                        <view class="msg-pic" :class="'notice' + item.msgSuitType.toString() + item.status"></view>
                        <view class="msg-text">
                            {{item.msgContent}}
                        </view>
                    </view>
                </view>
            </view>
        </template>
        <infinite-loading :on-infinite="onInfinite" ref="infiniteLoading" class="infinite-contanier">
            <span slot="no-more" class="infinite-no-more">
                没有更多了~
            </span>
            <view slot="no-results" class="m-cart-none">
                <view class="pic">
                    <img src="../../static/images/cart-n1.png" alt="">
                </view>
                <view class="des">
                    <p class="f32">暂无系统消息~</p>
                </view>
            </view>
        </infinite-loading>
    </xe-layout>
</template>
<script type="text/ecmascript-6">
    export default {
        data() {
            return {
                msgRecordList: [],
                pageNum: 1,
                pageSize: 10
            };
        },
        methods: {
            navtodet(item) {
                console.log(item);
                if (item.msgSuitType === 1) {
                    // 订单通知
                    let recordParameter = JSON.parse(item.recordParameter);
                    this.$router.push({
                        name: 'OrderDet',
                        params: {
                            mid: recordParameter.morderId,
                            oid: recordParameter.orderId
                        }
                    });
                } else if (item.msgSuitType === 2) {
                    // 优惠券通知
                    this.$router.push({
                        name: 'CouponList'
                    });
                } else if (item.msgSuitType === 8) {
                    // 审批通知
//                    if (item.status === '3') {
//                        // 审核成功
//                        this.$router.push({
//                            name: 'Index'
//                        });
//                    } else if (item.status === '4') {
//                        // 审核失败
//                        this.$router.push({
//                            name: 'AuFailure',
//                            query: {
//                                status: 4
//                            }
//                        });
//                    }
                }
            },
            onInfinite() {
                this.queryMallMsgRecordList();
            },
            queryMallMsgRecordList() {
                this.$http({
                    method: 'post',
                    url: '/xe-route/xe-app/mobileApp/msgrecord/queryMallMsgRecordList',
                    data: {
                        pageNum: this.pageNum,
                        pageSize: this.pageSize
                    }
                }).then(res => {
                    if (res.data.msgRecordResDto.xePageInfoDto.total === 0) {
                        // 无消息时
                        this.$refs.infiniteLoading.$emit('$InfiniteLoading:complete');
                    } else {
                        if (res.data.msgRecordResDto.msgRecordList.length > 0) {
                            this.msgRecordList.push(...res.data.msgRecordResDto.msgRecordList);
                            this.msgRecordList.forEach(item => {
                                if (item.recordParameter) {
                                    item.status = JSON.parse(item.recordParameter).status ? JSON.parse(item.recordParameter).status.toString() : '';
                                } else {
                                    item.status = '';
                                }
                            });
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
        filters: {
            uploadTimeFormat(val) {
                var oDate = new Date(val);
                var nowData = new Date();
                var month = (oDate.getMonth() + 1) >= 10 ? oDate.getMonth() + 1 : '0' + (oDate.getMonth() + 1);
                var date = oDate.getDate() >= 10 ? oDate.getDate() : '0' + oDate.getDate();
                var hours = oDate.getHours() >= 10 ? oDate.getHours() : '0' + oDate.getHours();
                var minutes = oDate.getMinutes() >= 10 ? oDate.getMinutes() : '0' + oDate.getMinutes();
                let dis = nowData.getDate() - oDate.getDate();
                if (dis === 0) {
                    return `今天 ${hours}:${minutes}`;
                } else if (dis === 1) {
                    return `昨天 ${hours}:${minutes}`;
                } else {
                    return `${month}-${date} ${hours}:${minutes}`;
                }
            }
        }
    };
</script>
<style rel="stylesheet/scss" lang="scss">
    @import '../../static/styles/rules.scss';
    .m-msglist-item {
        margin: 40/$ppr 20/$ppr;
        .m-msglist-date {
            text-align: center;
            span {
                display: inline-block;
                height: 35/$ppr;
                line-height: 35/$ppr;
                padding:0 20/$ppr;
                background: #cecece;
                border-radius: 10/$ppr;
                color: #fff;
            }
        }
        .m-msglist-con {
            background: #fff;
            margin-top: 20/$ppr;
            padding: 20/$ppr;
            box-shadow: 0 5/$ppr 6/$ppr rgba(0, 0, 0, .1);
            h3 {
                font-size: 32/$ppr;
                color: #333;
                line-height: 1.3;
            }
            .content {
                margin-top: 20/$ppr;
                width: 100%;
                display: flex;
                align-items: flex-start;
                justify-content: flex-start;
            }
            .msg-pic {
                width: 110/$ppr;
                height: 110/$ppr;
                background: #f5f5f5;
                margin-right: 20/$ppr;
                background-size: cover;
                /*1.订单通知 2.优惠券通知 3.客户通知 4.审批通知 5.求购通知 6.回复通知 7.意向单8.身份认证通知*/
                &.notice1 {
                    background-image: url("../../static/images/notice_1.jpg");
                }
                &.notice2 {
                    background-image: url("../../static/images/notice_2.jpg");
                }
                &.notice7 {
                    background-image: url("../../static/images/notice_7.jpg");
                }
                &.notice83 {
                    background-image: url("../../static/images/notice_83.jpg"); // 审核成功
                }
                &.notice84 {
                    background-image: url("../../static/images/notice_84.jpg"); // 审核失败
                }
                /*&.notice3 {*/
                /*background-image: url("../../static/images/notice_3.jpg");*/
                /*}*/
                /*&.notice4 {*/
                /*background-image: url("../../static/images/notice_4.jpg");*/
                /*}*/
                /*&.notice5 {*/
                /*background-image: url("../../static/images/notice_5.jpg");*/
                /*}*/
                /*&.notice6 {*/
                /*background-image: url("../../static/images/notice_6.jpg");*/
                /*}*/
            }
            .msg-text {
                flex: 1;
                line-height: 1.4;
                word-break: break-all;
                word-wrap: break-word;
                font-size: 28/$ppr;
                color: #333;
            }
        }
    }
</style>
