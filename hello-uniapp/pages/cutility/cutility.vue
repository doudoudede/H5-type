<template>
    <xe-layout>
        <div class="m-support-con">
            <div class="m-cutility-top">
                <h3>如来云商的售后条款</h3>
                <p>尊敬的如来云商会员，感谢您选择如来云商！为保护您的权益，请仔细阅读以下内容：</p>
                <p>1、依据《中华人民共和国产品质量法》、《中华人民共和国消费者权益保护法》等法律法规，如来云商承诺规定完善的退换货管理制度保障用户的权利,为已销售的存在质量问题的商品办理退换货。</p>
                <p>2、您签收商品时请按照如来云商验货签收与拒收之要求进行验货，检查无误后再行签收。</p>
                <p>3、请保管好需办理售后业务的商品及其包装、票据和赠品，作为办理相关业务的依据，若发生退换货时，需事先与如来云商客服中心取得确认。</p>
            </div>
            <div>
                <div class="m-cutility-item" v-for="(item, index) in itemData" :key="index">
                    <div class="m-list-block" @click.prevent="item.show = !item.show">
                        <ul>
                            <li class="item-content item-link">
                                <div class="item-inner">
                                    <div class="item-title f32">{{item.title}}</div>
                                </div>
                            </li>
                        </ul>
                    </div>
                    <CollapseTransition>
                        <div class="m-cutility-text" v-show="item.show">
                            <p v-for="(content, cindex) in item.content" :key="cindex">
                                {{content.text}}
                            </p>
                        </div>
                    </CollapseTransition>
                </div>
            </div>
        </div>
    </xe-layout>
</template>
<script type="text/ecmascript-6">
    import CollapseTransition from 'utils/collapse-transition';
    export default {
        name: 'xe-page-cutility',
        data() {
            return {
                itemData: [
                    {
                        show: false,
                        title: '01：退换货的涵义',
                        content: [
                            {
                                text: '1.1退货：采购商在购买商品后的一定时间内，对确有质量问题的商品要求供货商家给予退掉商品和退还等价现金。'
                            },
                            {
                                text: '1.2换货：顾客以某种理由要求供货商家予以更换商品，或供货商家对顾客购买的有质量问题的商品按国家有关法律只能作换货处理。'
                            }
                        ]
                    },
                    {
                        show: false,
                        title: '02：退换货条款',
                        content: [
                            {
                                text: '因如来云商定位与生鲜食材类交易平台，存在质量问题的产品，均可退货换货，需要客户提供存在质量问题相关证明，但由于客户使用等自身原因造成产品质量问题的，如来云商商户不予办理退、换货手续。所以须遵循以下条款声明：'
                            },
                            {
                                text: '2.1为保证食品安全，请采购商在签收此类商品时仔细查验，当场验收。若商品存在外包装破损、缺少、变质等问题，应在承运单据上注明，并立即与供应商取得联系。'
                            },
                            {
                                text: '2.2生鲜产品（蔬菜、水果、肉类及肉肠制品）的质量问题，请自签收订单起48小时内与我们联系，如是商品质量问题或者配送不当的原因，我们将及时为您进行退、换货，如因采购商个人原因造成质量问题的商品，恕不退换。'
                            },
                            {
                                text: '2.3经合法食品检验机构检验，确属于不符合食品安全标准的食品，予以退换货。'
                            },
                            {
                                text: '2.4对国家质量监督检验检疫总局公告的存在质量问题的食品，予以退货。'
                            },
                            {
                                text: '2.5如商品包装破损，请当面及时向承运商提出，以便我们能尽快的为您处理。'
                            },
                            {
                                text: '2.6对于商品数量缺失的情况我们只受理当场投诉，即货物配送到目的地后，客户当面清点货物数量并及时向承运商提出的投诉。一旦签收，我们将不受理此退换要求。'
                            },
                            {
                                text: '2.7图片及信息仅供参照，商品将以实物为准。因拍摄灯光及不同显示器色差等问题可能造成商品图片与实物有一定色差，不属质量问题。'
                            },
                            {
                                text: '2.8如来云商的供应商家所售商品均经过质量认证，并可提供发票。'
                            }
                        ]
                    },
                    {
                        show: false,
                        title: '03：以下情况不予办理退换货',
                        content: [
                            {
                                text: '3.1任何非如来云商出售的商品；'
                            },
                            {
                                text: '3.2换货商品只能针对同一商品、不同批次的更换，不支持商品间换货及差价换货；'
                            },
                            {
                                text: '3.3任何已使用过的商品，有质量问题的除外；'
                            },
                            {
                                text: '3.4任何因您个人原因导致超过保质期的商品；'
                            },
                            {
                                text: '3.5未经授权的误用、疏忽、滥用、事故、改动、不正确的使用方法所造成的商品质量问题，或撕毁、涂改标贴、防伪标记的商品不予退换货；'
                            },
                            {
                                text: '3.6任何因非正常使用及保管导致出现质量问题的商品。'
                            }
                        ]
                    },
                    {
                        show: false,
                        title: '04：温馨提示',
                        content: [
                            {
                                text: ' 为保障您的权益，请您收到货物后即与承运商当面核对商品的种类、数量、规格、保质期等是否正确，确认无误后再进行签收。'
                            },
                            {
                                text: '在特殊情况下，您委托他人签收的行为视同于您本人已对商品进行签收。您对商品进行签收后，如来云商将不再接受以上问题的投诉。 如有任何问题，请致电：400-662-6366，客服人员会及时为您处理。'
                            }
                        ]
                    }
                ]
            };
        },
        components: {
            CollapseTransition
        }
    };
</script>
<style rel="stylesheet/scss" lang="scss">
    @import "../../static/styles/rules.scss";
    .m-cutility-top {
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
    .m-cutility-item {
        &:first-child {
            border-top: 1/$ppr solid $border-color-e8e;
        }
        .item-content {
            border-bottom: 1/$ppr solid $border-color-e8e;
        }
    }
    .m-cutility-text {
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
