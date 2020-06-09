<template>
    <transition name="slideInRight">
        <view class="m-aftersale">
            <view class="item">
                <view class="item-time">
                    <span>05-02 12:00:00</span>
                </view>
                <view class="item-con">
                    <view class="item-con-tit">已建售后单</view>
                    <view class="item-con-msg">
                        <view class="con">
                            <view class="tit">商品名称</view>
                            <view class="msg">众品下浓缩电击文库地级市地方</view>
                        </view>
                        <view class="con">
                            <view class="tit">售后原因</view>
                            <view class="msg">质量问题</view>
                        </view>
                        <view class="con">
                            <view class="tit">退货数量</view>
                            <view class="msg">200箱</view>
                        </view>
                        <view class="con">
                            <view class="tit">售后说明</view>
                            <view class="msg">助教的文件还大雾霾单位吗</view>
                        </view>
                    </view>
                </view>
            </view>
            <view class="item">
                <view class="item-time">
                    <span>05-02 12:00:00</span>
                </view>
                <view class="item-con">
                    <view class="item-con-tit">已建退款单</view>
                    <view class="item-con-msg">
                        <view class="con">
                            <view class="tit">商品名称</view>
                            <view class="msg">众品下浓缩电击文库地级市地方</view>
                        </view>
                        <view class="con">
                            <view class="tit">退款金额</view>
                            <view class="msg"><span class="c-red">&yen;180.00</span></view>
                        </view>
                    </view>
                </view>
            </view>
            <view class="item">
                <view class="item-time">
                    <span>05-02 12:00:00</span>
                </view>
                <view class="item-con">
                    <view class="item-con-tit">退款已返还您的中国银行账户</view>
                    <view class="item-con-msg">
                        <view class="con">
                            <view class="tit">退款金额</view>
                            <view class="msg"><span class="c-red">&yen;180.00</span></view>
                        </view>
                        <view class="con">
                            <view class="msg">请至尾号为xxxx的银行账户查收</view>
                        </view>
                    </view>
                </view>
            </view>
            <view class="item">
                <view class="item-time">
                    <span>05-02 12:00:00</span>
                </view>
                <view class="item-con">
                    <view class="item-con-tit">已建售后单</view>
                    <view class="item-con-msg">
                        <view class="con">
                            <view class="tit">商品名称</view>
                            <view class="msg">众品下浓缩电击文库地级市地方</view>
                        </view>
                        <view class="con">
                            <view class="tit">售后原因</view>
                            <view class="msg">质量问题</view>
                        </view>
                        <view class="con">
                            <view class="tit">退货数量</view>
                            <view class="msg">200箱</view>
                        </view>
                        <view class="con">
                            <view class="tit">售后说明</view>
                            <view class="msg">助教的文件还大雾霾单位吗</view>
                        </view>
                    </view>
                </view>
            </view>
            <view class="item">
                <view class="item-time">
                    <span>05-02 12:00:00</span>
                </view>
                <view class="item-con">
                    <view class="item-con-tit">已建售后单</view>
                    <view class="item-con-msg">
                        <view class="con">
                            <view class="tit">商品名称</view>
                            <view class="msg">众品下浓缩电击文库地级市地方</view>
                        </view>
                        <view class="con">
                            <view class="tit">售后原因</view>
                            <view class="msg">质量问题</view>
                        </view>
                        <view class="con">
                            <view class="tit">退货数量</view>
                            <view class="msg">200箱</view>
                        </view>
                        <view class="con">
                            <view class="tit">售后说明</view>
                            <view class="msg">助教的文件还大雾霾单位吗</view>
                        </view>
                    </view>
                </view>
            </view>
        </view>
    </transition>
</template>
<script type="text/ecmascript-6">
    export default {
        name: 'xe-page-aftersale',
        data() {
            return {};
        }
    };
</script>
<style rel="stylesheet/scss" lang="scss">
    @import '../../static/styles/rules.scss';
    .m-aftersale {
        position: fixed;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
        z-index: 3;
        background: $bg-color-f5f;
        overflow: auto;
        -webkit-overflow-scrolling: touch;
        padding: 0 25/$ppr;
        .item {
            margin: 40/$ppr 0;
            .item-time {
                text-align: center;
                margin-bottom: 20/$ppr;
                span {
                    display: inline-block;
                    padding: 0 20/$ppr;
                    background: #cecece;
                    color: #fff;
                    height: 36/$ppr;
                    font-size: 20/$ppr;
                    line-height: 36/$ppr;
                    border-radius: 8/$ppr;
                }
            }
            .item-con {
                background: #fff;
                padding: 30/$ppr;
                border-radius: 10/$ppr;
                box-shadow: -1/$ppr 2/$ppr 10/$ppr rgba(0,0,0,0.1);
            }
            .item-con-tit {
                padding-bottom: 20/$ppr;
                font-size: 32/$ppr;
                line-height: 1.4;
                border-bottom: 1/$ppr solid $border-color-e8e;
            }
            .item-con-msg {
                .con {
                    display: flex;
                    margin: 16/$ppr 0;
                    color: $text-666;
                    font-size: 24/$ppr;
                    .tit {
                        line-height: 1.4;
                        white-space: nowrap;
                        margin-right: 20/$ppr;
                    }
                    .msg {
                        flex: 1;
                        line-height: 1.4;
                    }
                    &:last-child {
                         margin-bottom: 0;
                     }
                }
            }
        }
    }
</style>
