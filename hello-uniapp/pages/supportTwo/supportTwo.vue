<template>
    <xe-layout>
        <div class="m-support-con">
            <div class="m-support-top">
                <h3>法律声明及隐私权政策</h3>
            </div>
            <div>
                <div class="m-support-item" v-for="(item, index) in itemData" :key="index">
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
                        <div class="m-support-text" v-show="item.show">
                            <p v-for="(content, cindex) in item.content" :key="cindex" v-html="content.text">
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
        name: 'xe-page-support',
        data() {
            return {
                itemData: [
                    {
                        show: false,
                        title: '法律声明',
                        content: [
                            {
                                text: '在使用如来云商平台服务前，请您务必仔细阅读并透彻理解本政策，在确认充分理解并同意后使用相关平台服务。如您开始使用如来云商平台服务，即表示您已充分理解并认可本政策。'
                            }
                        ]
                    },
                    {
                        show: false,
                        title: '网站服务',
                        content: [
                            {
                                text: '如来云商定位于生鲜食材大宗交易平台，如来云商唯一官方网址为：www.xebest.com，唯一中文名称为：如来云商。如来云商平台上关于会员发布或商家发布的相关商品及内容(包括但不限于公司名称，联系人及联系信息，产品的描述和说明，相关图片，视频，文章等)的信息均由会员自行提供，用户依法对其提供的任何信息承担全部责任。我们严厉打击假冒伪劣不法商家，坚决抵制欺骗行为，并力争创建一个良好的互联网环境，对此如来云商欢迎广大用户积极反馈不良信息给我们，我们将严于律己。'
                            },
                            {
                                text: '任何单位或个人认为如来云商平台网页内容 (包括但不限于如来云商平台会员发布的商品信息)可能涉嫌侵犯其合法权益，应该及时向如来云商提出书面权利通知，并提供身份证明、权属证明、具体链接(URL) 及详细侵权情况证明。我们会在收到上述法律文件后，将会依法尽快移除相关涉嫌侵权的内容。'
                            }
                        ]
                    },
                    {
                        show: false,
                        title: '注册信息',
                        content: [
                            {
                                text: '在您使用本站服务时，可能会被要求填写您的真实姓名，电话号码，和电子邮件地址等信息。如果您是公司客户，您还被要求提供您的公司的地址，电话号码和贵公司的服务和产品的简短说明。您还有权选择来填写附加信息，这些信息可能包括您公司所在的省份和城市，时区和邮政编码等。我们使用注册信息来获得用户的统计资料，我们将会用这些统计数据来给我们的用户分类，以便有针对性地向我们的用户提供新的服务。我们会通过您的邮件地址或者电话号码来通知您这些新的服务。'
                            }
                        ]
                    },
                    {
                        show: false,
                        title: '保护隐私原则',
                        content: [
                            {
                                text: '本站将对用户所提供的资料进行严格的管理及保护，本站将使用相应的技术，防止您的个人资料丢失、被盗用或遭篡改。但请注意在因特网上不存在"100%完善的安全措施"，因此我们不承诺上述资料绝对安全。我们绝不会向任何第三方提供，出售，出租，分享和交易用户的个人信息，除非本站和第三方一起为用户提供服务，在该服务结束后将禁止第三方访问这些资料。当我们被法律强制或依照政府要求提供您的信息时我们将善 意地披露您的资料。'
                            }
                        ]
                    },
                    {
                        show: false,
                        title: '权利归属',
                        content: [
                            {
                                text: '除非如来云商网另行声明，如来云商内的所有产品、技术、软件、程序、数据及其他信息（包括文字、图标、图片、照片、音频、视频、图表、色彩组合、版面设计等）的所有权利（包括版权、商标权、专利权、商业秘密及其他相关权利）均归如来云商服务提供者及/或其关联公司所有。未经如来云商服务提供者及/或其关联公司许可，任何人不得以包括通过任何手段复制、传播、展示、镜像、上载、下载等方式擅自使用如来云商内的任何内容。'
                            }
                        ]
                    },
                    {
                        show: false,
                        title: '外部链接',
                        content: [
                            {
                                text: '本网站可能包含链接到其他网站的地址，我们可能在需要的时候增加商业合作伙伴的网站链接，但是提供给他们的将仅仅是综合信息，我们将不会公开您的身份。'
                            }
                        ]
                    },
                    {
                        show: false,
                        title: 'Cookies的使用',
                        content: [
                            {
                                text: '本站会使用Cookies,以便于能够为您提供更加周到的个性化服务。当您登陆我们的网站时，本网站会使用Cookies存储相关信息，追访您的个人喜好、使用习惯，使我们的网站在您再次访问时可以辨认您的身份，为您提供更好的服务。你也可以关闭此项功能，本站将停止Cookies为您提供的服务。'
                            }
                        ]
                    },
                    {
                        show: false,
                        title: '免责条款',
                        content: [
                            {
                                text: '在如下情况下，本站将不对您的隐私泄露承担责任：'
                            },
                            {
                                text: '您同意让第三方共享资料;'
                            },
                            {
                                text: '您同意公开你的个人资料，享受为您提供的产品和服务;'
                            },
                            {
                                text: '本站需要听从法庭传票、法律命令或遵循法律程序;'
                            },
                            {
                                text: '因黑客行为或用户的保管疏忽导致帐号、密码遭他人非法使用。'
                            }
                        ]
                    },
                    {
                        show: false,
                        title: '邮件 & 短信 & 广告',
                        content: [
                            {
                                text: '本公司保留通过邮件、短信、广告的形式，对本公司网站注册、购物用户发送订单信息、促销活动等告知服务的权利。如果您在本公司网站注册、购物，表明您已默示同意接受此项服务。如果您不想接收来自本公司的邮件、短信或邮寄广告，您可以向本公司客服提出退阅申请，并注明您的E-mail地址、手机号或相关地址信息，本 公司会在收到申请后为您办理退阅。'
                            }
                        ]
                    },
                    {
                        show: false,
                        title: '修改您的资料',
                        content: [
                            {
                                text: '您可以随时在成功登录本网站后修改或者更新您的信息和密码。'
                            }
                        ]
                    },
                    {
                        show: false,
                        title: '未成年人的特别注意事项',
                        content: [
                            {
                                text: '如果您不是具备完全民事权利能力和完全民事行为能力的自然人，您无权使用如来云商平台服务，因此如来云商希望您不要向我们提供任何个人信息。'
                            }
                        ]
                    },
                    {
                        show: false,
                        title: '联系我们',
                        content: [
                            {
                                text: '如果您对本隐私声明、隐私保护措施以及您在使用中的问题有任何意见和建议，请及时和我们联系：400-662-6366'
                            }
                        ]
                    },
                    {
                        show: false,
                        title: '其他事宜',
                        content: [
                            {
                                text: '其他未尽事宜，如来云商保留一切解释的权利。'
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
