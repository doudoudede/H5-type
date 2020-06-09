<template>
    <xe-layout class="helan61">
        <view class="helan61-top">
            <p>
                <img src="/static/img/helan61/helan01.png" alt="">
            </p>
            <p>
                <img src="/static/img/helan61/helan02.png" alt="">
            </p>
            <p>
                <img src="/static/img/helan61/helan03.png" alt="">
            </p>
        </view>
        <view class="bgs">
            <img src="/static/img/helan61/helan06.png" alt="">
        </view>
        <view class="clogo">
            <p>
                <img src="/static/img/helan61/helan04.png" alt="">
            </p>
            <p>
                <img src="/static/img/helan61/helan05.png" alt="">
            </p>
        </view>
        <view class="ctext">
            <p>Vion是国际著名的肉类生产商，总部设在荷兰，为荷兰国内市场、欧洲和世界其他国家的客户提供新鲜的猪肉和牛肉及衍生产品。</p>
            <p>Vion提供最高质量的Food Family品牌新鲜猪肉。猪肉部门由坐落于荷兰跟德国的16个生产基地组成，拥有周屠宰量30万头猪的高产能。 Food Family品牌系列代表严格的品质和统一的高加工标准。</p>
            <p>Vion通过遍布全球的分销系统，始终保证为客户提供新鲜、风味、高质、安全的产品。</p>
            <p>tVion希望成为食品供应链中领先的可靠合作伙伴，为世界各地的人们提供高质量和安全的肉类产品。</p>
        </view>
        <router-link tag="view" :to="{name: 'Store', query: {userCode: 'SH171107486958'}}" class="cbtns">进入店铺</router-link>
    </xe-layout>
</template>
<style lang="scss">
    @import '../../static/styles/rules.scss';
    .helan61 {
        .scrollview {
            padding-bottom: 340/$ppr;
            background: linear-gradient(top, #b1d3f9, #f7fbff) no-repeat;
            background: -webkit-linear-gradient(top, #b1d3f9, #f7fbff) no-repeat;
        }
        .helan61-top {
            display: flex;
            max-width: 750/$ppr;
            margin: 0 auto;
            justify-content: space-between;
            p {
                width: 240/$ppr;
                height: 289/$ppr;
                img {
                    width: 100%;
                    height: 100%;
                }
            }
        }
        .clogo {
            height: 106/$ppr;
            margin: 45/$ppr 0 30/$ppr 0;
            display: flex;
            align-items: center;
            justify-content: center;
            p {
                margin: 0 10/$ppr;
                &:first-child {
                    width: 135/$ppr;
                }
                &:last-child {
                    width: 164/$ppr;
                }
                height: 106/$ppr;
                img {
                    width:  100%;
                    height: 100%;
                }
            }
        }
        .ctext {
            margin: 0 60/$ppr;
            p {
                color: #1b1a1e;
                font-size: 28/$ppr;
                line-height: 1.6;
                margin: 20/$ppr 0;
            }
        }
        .cbtns {
            position: relative;
            z-index: 3;
            margin: 40/$ppr 60/$ppr 0;
            height: 70/$ppr;
            background: #8ac140;
            border-radius: 35/$ppr;
            color: #fff;
            font-size: 34/$ppr;
            letter-spacing: 5/$ppr;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .bgs {
            position: absolute;
            z-index: 0;
            left: 50%;
            bottom: 0;
            right: 0;
            margin-left: -375/$ppr;
            width: 750/$ppr;
            height: 447/$ppr;
            img {
                width: 100%;
                height: 100%;
            }
        }
    }

</style>
