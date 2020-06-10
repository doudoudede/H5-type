<template>
    <xe-layout class="m-flexlay">
        <div class="m-aboutus">
            <div class="m-login-logo xe-gradient-color animated tada">
                <span class="xe-iconfont xe-icon-logo"></span>
            </div>
            <div class="about-version">如来云商商城v4.0</div>
            <div class="about-des">如来云商（www.xebest.com）——生鲜食材电商平台，为餐饮、团膳、商超、机关、学校、企业单位等提供食材采购服务；同时为中国肉类加工企业、进口内销企业、肉类批发市场等企业用户提供信息发布、交易撮合、品牌传播、网络营销、仓储物流、金融服务、食品安全监测等多方位、全流程电子商务服务。我们希望能与您一起，建筑优质生鲜食品服务生态圈，让生活原汁原味、让新鲜回归自然。</div>
        </div>
        <div class="aboutus-tel" slot="footer"></div>
    </xe-layout>
</template>
<script type="text/ecmascript-6">
    export default {};
</script>
<style rel="stylesheet/scss" lang="scss">
    @import '../../static/styles/rules.scss';
    .about-version {
        font-size: 32/$ppr;
        color: $text-666;
        margin: 30/$ppr 0;
        text-align: center;
    }
    .about-des {
        margin: 30/$ppr 62/$ppr;
        font-size: 24/$ppr;
        color: $text-666;
        line-height: 1.5;
        text-align: center;
    }
</style>
