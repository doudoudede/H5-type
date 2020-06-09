<template>
    <xe-layout>
        <view class="m-support-con boldLine">
            <view class="m-support-top">
                <h3>如来云商招标投标活动管理规则</h3>
            </view>
            <view>
                <view class="m-support-item" v-for="(item, index) in itemData" :key="index">
                    <view class="m-list-block" @click.prevent="item.show = !item.show">
                        <ul>
                            <li class="item-content item-link">
                                <view class="item-inner">
                                    <view class="item-title f32">{{item.title}}</view>
                                </view>
                            </li>
                        </ul>
                    </view>
                    <CollapseTransition>
                        <view class="m-support-text" v-show="item.show">
                            <p v-for="(content, cindex) in item.content" :key="cindex" v-html="content.text"></p>
                        </view>
                    </CollapseTransition>
                </view>
            </view>
        </view>
    </xe-layout>
</template>
<script type="text/ecmascript-6">
    import CollapseTransition from 'utils/collapse-transition';
    let txt = `一、招投标主体
如来云商为各方提供招标投标活动的技术信息服务，不实际参与产品的数量价格等议定工作，而是为招投双方提供平台撮合服务，招投标的主体分别为境外供应商和境内进口商。

二、如来云商平台入驻
为了规范平台招投标活动，保证双方利益，投标客户必须按公平竞争原则参加投标，所有参加投标客户必须签订《如来云商进口期货产品网络招标活动参与招标客户承诺函》，第一次参加投标的客户中以自然人身份的需要将签字规范及有红字手印的身份证复印件，公司身份的需要提供加盖公章的公司营业执照并在如来云商进行注册。境外供应商在如来云商竞拍页面直接参与招标。

三、保证金
参加投标的客户必须缴纳2万元的保证金，保证金支付账号：
公  司：河南如来云商络科技有限公司
开户行：中国建设银行长葛支行
账  号：41001559810050214097。
如未中标，3个工作日内，保证金原路退回原账户。

四、招标的细则
1、招标活动采用线上加线下的方式进行，招标前一天供应商提供有标的价格的产品清单并在如来云商商户页面上给予展示；
2、招投标区域、时间等具体信息详见活动公告；
3、投标方式：
（1）参与竞标客户在如来云商进行注册，获取登录名和登录密码，并加入线下招标微信群；
（2）竞标客户登录如来云商后，进入招标方页面，进行产品的查看；
（3）查看到自己需要的产品规格后，在规定的时间节点内将自己可接受的的产品数量（1柜起步）和可接受价格（美元或人民币）以及国内港口进行确认后，通过微信书面信息将需求提交到王学亮的微信号中，所有需求信息以最后一次提交的为准，在规定时间外提交的信息无效；
（4）如来云商会自动根据价格由高到低的原则选取每个单品的前三名客户投标信息反馈给供应商，由供应商确认最终的成交价格和数量；
（5）中标的客户在招标结束24小时后，会通过微信群进行公示；
（6）中标客户需要在产品中标后3个工作日内支付30%的预付款到指定账户。
（7）以下情形保证金不予退还：
&nbsp;&nbsp;&nbsp;&nbsp;A、投标人在招标文件中规定的投标有效期内撤回其投标；
&nbsp;&nbsp;&nbsp;&nbsp;B、中标人在规定期限内未能：(1)根据投标人按规定签订合同或按规定接受对错误的修正；(2)根据招标文件规定未向供应商支付预付款。
&nbsp;&nbsp;&nbsp;&nbsp;C、投标人采用不正当的手段骗取中标的，经查实投标保证金不予退还。”
4、产品交付：产品订单确认后，由供应商和中标客户直接签订产品采购合同，同时也可以委托如来云商指派进口服务商代理签订购销合同。同时，如来云商国际供应链可以为客户提供全程的供应链服务。
`;
    export default {
        name: 'xe-page-support',
        data() {
            return {
                itemData: []
            };
        },
        created() {
            this.itemDataFn();
        },
        methods: {
            itemDataFn() {
                let resText = txt.split(/\n\s*\n/g);
                let resArr = [];
                resText.forEach(item => {
                    let txtSplit = item.split(/\n/g);
                    let txtContent = [];
                    txtSplit.forEach((item, index) => {
                        if (index !== 0) {
                            txtContent.push({
                                text: item.replace(/\s{4,}/g, `<strong>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</strong>`)
                            });
                        }
                    });
                    resArr.push({
                        show: true,
                        title: txtSplit[0].trim(),
                        content: txtContent
                    });
                });
                this.itemData = resArr;
            }
        },
        components: {
            CollapseTransition
        }
    };
</script>
<style rel="stylesheet/scss" lang="scss">
    @import "../../static/styles/rules.scss";
    .m-support-top {
        padding: 40/$ppr 30/$ppr;
        h3 {
            font-size: 38/$ppr;
            font-weight: 600;
            text-align: center;
            margin-bottom: 30/$ppr;
        }
        p {
            margin: 15/$ppr 0;
            font-size: 24/$ppr;
            color: $text-666;
            line-height: 1.5;
        }
    }
    .m-support-item {
        &:first-child {
            border-top: 1/$ppr solid $border-color-e8e;
        }
        .item-content {
            border-bottom: 1/$ppr solid $border-color-e8e;
        }
    }
    .m-support-text {
        padding: 20/$ppr;
        background: #f5f5f5;
        font-size: 28/$ppr;
        p {
            padding: 8/$ppr 0;
            line-height: 1.5;
            color: #666;
        }
    }
</style>
