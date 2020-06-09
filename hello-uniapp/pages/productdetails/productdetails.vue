<template>
    <xe-layout class="m-page-details m-flexlay m-bg-dark">
        <template v-if="infoLoaded">
            <view class="m-details-cz clearfix">
                <view class="u-back fl xe-iconfont xe-icon-fanhui-" @click.prevent="goBackFn"></view>
                <p class="fr">
                    <router-link v-if="proSpuInfo.priceMethod === 2" :to="{name: 'Cart'}" tag="span" class="xe-iconfont xe-icon-jinhuodan2"></router-link>
                    <router-link v-else :to="{name: 'InquiryList'}" tag="span" class="xe-iconfont xe-icon-xiangqingye"></router-link>
                    <!-- <template v-if="proSpuInfo.proSkuInfo.proSkuStatus === 1 && proSpuInfo.buyStatus !== '2' && proSpuInfo.proSkuInfo.proSkuStatus === 1">
                        <span class="xe-iconfont" :class="[isCollect === 1 ? 'xe-icon-faill' : 'xe-icon-favor']" @click.prevent="collectProduct"></span>
                    </template> -->
                    <a href="http://xebest.udesk.cn/im_client?web_plugin_id=23247" class="xe-iconfont xe-icon-kefu" id="kefuId"></a>
                </p>
            </view>
            <view class="m-details-slider m-content-view">
                <xe-slider
                    :picServer="picServer"
                    :keyProps="{keyName: 'proImg'}"
                    urlPath="product/1000/1000/"
                    :sliderData="sliderImgList"
                    :loop="sliderImgList.length > 1 ? true : false"
                    :autoPlay="true"
                    ref="proSlider"
                >
                </xe-slider>
            </view>
            <!--预售 begin-->
            <view v-if="proSpuInfo.proSkuInfo.proArea && proSpuInfo.proSkuInfo.proArea.preSalePro" class="m-details-seckill m-content-view m-det-presale">
                <view class="seckill-pri">
                    <view class="n-price">
                        <span class="n-pri">
                            <span class="currency-price" v-html='splitPrice(proSpuInfo.proSkuInfo.proArea.preSalePro.currentPreSalePrice)'></span>/{{proSpuInfo.proUnit}}
                        </span>
                        <span class="d-pri">
                            <span v-html="splitPrice(proSpuInfo.proSkuInfo.proArea.preSalePro.preSaleUnitPrice)"></span>/斤
                        </span>
                        <!-- <span class="d-pri"><s>&yen;{{skuDelPrice}}</s></span> -->
                    </view>
                    <!-- <view class="s-price">
                        <span>{{proSpuInfo.proSkuInfo.proArea.preSalePro.preSaleUnitPrice | currency}}/斤</span>
                    </view> -->
                    <view class="pre-det-tips">
                        <span class="xe-iconfont xe-icon-yushoufuben"></span>
                        <template v-if="proSpuInfo.proSkuInfo.proArea.preSalePro.activeSendTime > 0">{{proSpuInfo.proSkuInfo.proArea.preSalePro.activeSendTime | getDayByMis}}</template>
                        <template v-else>现货</template>
                    </view>
                </view>
                <view class="seckill-time">
                    <view class="time-count">
                        <!-- timeStatus 时间状态 1：距开始 2：距结束 3：已结束 -->
                        <!--<span class="xe-iconfont xe-icon-miaosha"></span>-->
                        <span class="time-text">
                             <span v-if="proSpuInfo.proSkuInfo.proArea.preSalePro.status !== 1 || proSpuInfo.proSkuInfo.proArea.preSalePro.activityStatus !== 1">
                                已结束
                            </span>
                            <span v-else>
                                <template v-if='fixed'>
                                    <xe-countdown v-if='proSpuInfo.proSkuInfo.proArea.preSalePro.timeStatus !== 3' timetype="second" :time="proSpuInfo.proSkuInfo.proArea.preSalePro.activeDate / 1000" :callback="preEndFn">
                                        <template v-if='proSpuInfo.proSkuInfo.proArea.preSalePro.timeStatus === 1'>距开始</template>
                                        <template v-else>距结束</template>
                                        <span>{%d}<i>天</i></span><span>{%h}<i>时</i></span><span>{%m}<i>分</i></span><span>{%s}<i>秒</i></span>
                                    </xe-countdown>
                                </template>
                            </span>
                        </span>
                    </view>
                    <view class="time-progress">
                        <p>
                            <span :style="{width: proSpuInfo.proSkuInfo.proArea.preSalePro.activePercentage + '%'}"></span>
                            <em>已售{{proSpuInfo.proSkuInfo.proArea.preSalePro.activePercentage}}%</em>
                        </p>
                    </view>
                </view>
            </view>
            <!--预售 end-->
            <!--秒杀 begin-->
            <view v-if="proSpuInfo.proSkuInfo.proArea && proSpuInfo.proSkuInfo.proArea.venDisLimitPro !== null" class="m-details-seckill  m-content-view">
                <view class="seckill-pri">
                    <view class="n-price">
                        <span class="n-pri">
                            &yen;<em>{{proSpuInfo.proSkuInfo.proArea.venDisLimitPro.limitPrice | toFixed2}}</em>/{{proSpuInfo.proUnit}}
                        </span>
                        <span class="d-pri"><s>&yen;{{skuDelPrice}}</s></span>
                    </view>
                    <view class="s-price">
                        <span>&yen;{{proSpuInfo.proSkuInfo.proArea.venDisLimitPro.limitPriceUnitPrice | toFixed2}}/斤</span>
                    </view>
                </view>
                <view class="seckill-time">
                    <view class="time-count">
                        <!--<span class="xe-iconfont xe-icon-miaosha"></span>-->
                        <span class="time-text">
                            <xe-countdown timetype="second" :time="proSpuInfo.proSkuInfo.proArea.venDisLimitPro.activeDate / 1000">
                                距结束<span>{%d}<i>天</i></span><span>{%h}<i>时</i></span><span>{%m}<i>分</i></span><span>{%s}<i>秒</i></span>
                            </xe-countdown>
                        </span>
                    </view>
                    <view class="time-progress">
                        <p>
                            <span :style="{width: proSpuInfo.proSkuInfo.proArea.venDisLimitPro.activePercentage + '%'}"></span>
                            <em>已售{{proSpuInfo.proSkuInfo.proArea.venDisLimitPro.activePercentage}}%</em>
                        </p>
                    </view>
                </view>
            </view>
            <!--秒杀 end-->
            <view class="m-details-item m-content-view" style="margin-top: 0;">
                <view class="prouctname">
                    {{proSpuInfo.proName}}
                </view>
                <view class="productdes" v-if='proSpuInfo.proIntro'>
                    {{proSpuInfo.proIntro}}
                </view>
                <!-- 预售时间 begin -->
                <YsTimes v-if='proSpuInfo.proSkuInfo.proArea && proSpuInfo.proSkuInfo.proArea.preSalePro' :timedata="proSpuInfo.proSkuInfo.proArea.preSalePro.preSalePriceList" :priceUnit="proSpuInfo.proUnit"></YsTimes>
                <!-- 预售时间 end -->
                <view class="productpri">
                    <!-- proSpuInfo.proSkuInfo.proArea && !proSpuInfo.proSkuInfo.proArea.venDisLimitPro && !proSpuInfo.proSkuInfo.proArea.preSalePro -->
                    <template v-if="proSpuInfo.priceMethod !== 3">
                        <!--非面议商品-->
                        <template v-if="proSpuInfo.proSpuStatus === 1">
                            <!--spu上架-->
                            <template v-if="!proSpuInfo.proSkuInfo.proArea">
                                <!--SKU上没有有区域-->
                                <view>
                                    <view class="pri01">{{proSpuInfo.proSkuInfo.skuPrice | toFixed2}}元/{{proSpuInfo.proUnit}}</view>
                                    <!-- <view class="pri02"><em>单价:</em> {{proSpuInfo.proSkuInfo.unitPrice | toFixed2}}元/斤</view> -->
                                </view>
                            </template>
                            <template v-else>
                                <!--sku上有区域-->
                                <template v-if='!proSpuInfo.proSkuInfo.proArea.venDisLimitPro && !proSpuInfo.proSkuInfo.proArea.preSalePro'>
                                    <!-- 无预售和秒杀 -->
                                    <template v-if="proSpuInfo.proSkuInfo.proArea && proSpuInfo.proSkuInfo.proArea.stepFlag === 1">
                                        <!--SKU为阶梯价-->
                                        <view v-for="(areaitem, areaindex) in proSpuInfo.proSkuInfo.proArea.areaStepList" :key="areaindex">
                                            <view class="pri03">
                                                {{areaitem.startNum}}-{{areaitem.endNum}}{{proSpuInfo.proUnit}}
                                            </view>
                                            <view class="pri01">&yen;{{areaitem.stepPrice | toFixed2}}</view>
                                            <!-- <view class="pri02" style="color: #999;">&yen;{{areaitem.stepUnitPrice | toFixed2}}/斤</view> -->
                                        </view>
                                    </template>
                                    <template v-else>
                                        <view>
                                            <view class="pri01">{{proSpuInfo.proSkuInfo.proArea.areaPrice | toFixed2}}元/{{proSpuInfo.proUnit}}</view>
                                            <!-- <view class="pri02"><em>单价:</em> {{proSpuInfo.proSkuInfo.proArea.unitPrice | toFixed2}}元/斤</view> -->
                                        </view>
                                    </template>
                                </template>
                            </template>
                        </template>
                    </template>
                    <template v-else>
                        <!--SKU上没有有区域-->
                        <view>
                            <view class="pri01">面议</view>
                        </view>
                    </template>
                </view>
                <view class="productmsg">
                    <view v-if="proSpuInfo.priceMethod === 2 && proSpuInfo.proSkuInfo.proSkuStatus !== 4">运费：<template v-if='proSpuInfo.proSkuInfo.firstPrice'>&yen;{{proSpuInfo.proSkuInfo.firstPrice | toFixed2}}</template>
                        <template v-else>&yen;0</template>
                    </view>
                    <view>销售量：{{proSpuInfo.totalSale}}</view>
                    <view v-if="proSpuInfo.madeinProvinceName && proSpuInfo.madeinCityName">产地：{{proSpuInfo.madeinProvinceName}} {{proSpuInfo.madeinCityName}}</view>
                    <view v-else>
                        产地：{{proSpuInfo.madeinCountryName}}
                    </view>
                </view>
                <view class="productspec">
                    <view class="spec-tit">规格：</view>
                    <view class="spec-con">
                        <ul class="spec-con-ul">
                            <li v-for="item in proSpuInfo.skuList" :key="item.proSku"
                                :class="{'current': item.proSku === currentSku}"
                                @click.prevent="skuItemClick(item)">
                                {{item.proSkuSpecList | skuNameFilter}}
                            </li>
                        </ul>
                    </view>
                </view>
                <template v-if="proSpuInfo.priceMethod === 2 && proSpuInfo.buyStatus !== '2' && proSpuInfo.proSkuInfo.proSkuStatus === 1">
                    <!--一口价商品时才展示数量加减-->
                    <view class="productnum" v-if="proSpuInfo.proSkuInfo.proSkuStatus === 1">
                        <view class="num-tit">数量：</view>
                        <!-- 判断是否为预售 -->
                        <view class="num-con" v-if="proSpuInfo.proSkuInfo.proArea && proSpuInfo.proSkuInfo.proArea.preSalePro">
                            <!-- 为预售时 -->
                            <view class="all-num">库存
                                <!--{{proSpuInfo.proSkuInfo.proArea.preSalePro.preQuantity - proSpuInfo.proSkuInfo.proArea.preSalePro.soldQuantity}}-->
                                {{proSpuInfo.proSkuInfo.saleQuantity}}
                                {{proSpuInfo.proUnit}}
                            </view>
                            <view class="num-act">
                                <InputNumber
                                    v-model.trim="proSkuCountNum"
                                    @change="proSkuCountNumChange"
                                    :min="proSpuInfo.proSkuInfo.minQuantity"
                                    :max="proSpuInfo.proSkuInfo.saleQuantity"
                                ></InputNumber>
                            </view>
                        </view>
                        <view v-else class="num-con">
                            <!-- 不为预售时 -->
                            <view class="all-num">库存{{proSpuInfo.proSkuInfo.saleQuantity}}{{proSpuInfo.proUnit}}</view>
                            <view class="num-act">
                                <InputNumber
                                    v-model.trim="proSkuCountNum"
                                    @change="proSkuCountNumChange"
                                    :min="proSpuInfo.proSkuInfo.minQuantity"
                                    :max="proSpuInfo.proSkuInfo.saleQuantity"
                                ></InputNumber>
                            </view>
                        </view>
                    </view>
                </template>
            </view>
            <template v-if="proSpuInfo.priceMethod === 2 && proSpuInfo.buyStatus !== '2' && proSpuInfo.proSkuInfo.proSkuStatus === 1">
                <!--一口价才展示领券-->
                <v-touch tag="view" class="m-details-item" v-on:tap="couponVisibleFn" v-if="proSpuInfo.proSkuInfo.couponList && proSpuInfo.proSkuInfo.couponList.length > 0">
                    <view class="productcoupon">
                        <view class="coupon-tit">领券：</view>
                        <view class="coupon-con arrow-right-commons">
                            <view class="coupon-item" v-for="item in proSpuInfo.proSkuInfo.couponList" :key="item.couTempId">
                                <template v-if="item.useRuleType === 1">
                                    <span class="coupon-style">券</span>满&yen;{{item.useOrderAmount | toFixed2}}减&yen;{{item.useDisAmount | toFixed2}}
                                </template>
                                <template v-else>
                                    <span class="coupon-style">券</span>无门槛优惠券&yen;{{item.useDisAmount | toFixed2}}
                                </template>
                            </view>
                        </view>
                    </view>
                </v-touch>
            </template>
            <template v-if="proSpuInfo.priceMethod === 2">
                <!--一口价才展示送至-->
                <v-touch tag="view" class="m-details-item" v-on:tap="showadr = true">
                    <view class="productadr">
                        <view class="adr-tit">送至：</view>
                        <view class="adr-con">
                            <view class="adr-cons arrow-right-commons">
                                <span class="xe-iconfont xe-icon-dingwei"></span>
                                {{defaultAdrsText.join(' ')}}
                            </view>
                            <view class="adr-des" v-if="proSpuInfo.preSaleFlag !== 1 && proSpuInfo.buyStatus !== '2' && proSpuInfo.proSkuInfo.proSkuStatus === 1">
                                <!--<span>现货</span>,当天22:30前下单，预计商品次日送达-->
                                <!-- {{proSpuInfo.buyDateTitle}} -->
                            </view>
                            <view class="adr-des" v-else-if="proSpuInfo.proSkuInfo.proSkuStatus === 4">当前区域暂不支持配送</view>
                            <view class="adr-des" v-else-if="proSpuInfo.proSkuInfo.proSkuStatus === 5">未设置预售活动</view>
                        </view>
                    </view>
                </v-touch>
            </template>
            <router-link tag="view" v-if="proSpuInfo.venInfo" :to="{name: 'Store', query: {userCode: proSpuInfo.venInfo.userCode}}" class="m-details-item">
                <view class="productshop">
                    <view class="shop-pic">
                        <img v-if="proSpuInfo.venInfo.shopLogo" v-lazy="picServer + proSpuInfo.venInfo.shopLogo" alt="">
                        <img v-else src="../../static/images/default.png" alt="">
                    </view>
                    <view class="shop-con arrow-right-commons">{{proSpuInfo.venInfo.shopName}}</view>
                </view>
            </router-link>

            <view class="m-details-tabcon">
                <view class="det-tab">
                    <view
                        v-for="item in currentDetTab"
                        :key="item.id"
                        :class="{'active': currentDetTabIndex === item.id}"
                        @click.prevent="detTabClick(item)"
                    >
                        <span>{{item.name}}</span>
                    </view>
                </view>
                <view class="det-tab-item tabitem01" v-show="currentDetTabIndex === 1">
                    <view class="det-list-con">
                        <view class="det-list">
                            <view class="det-list-tit">品名</view>
                            <view class="det-list-content">{{proSpuInfo.proName}}</view>
                        </view>
                        <view class="det-list">
                            <view class="det-list-tit">货号</view>
                            <view class="det-list-content">{{proSpuInfo.proSkuInfo.proNum}}</view>
                        </view>
                        <view class="det-list">
                            <view class="det-list-tit">分类</view>
                            <view class="det-list-content">{{proSpuInfo.categoryName}}</view>
                        </view>
                        <view class="det-list">
                            <view class="det-list-tit">品牌</view>
                            <view class="det-list-content">{{proSpuInfo.brandName}}</view>
                        </view>
                        <view class="det-list">
                            <view class="det-list-tit">规格</view>
                            <view class="det-list-content">{{specValue}}</view>
                        </view>
                        <view class="det-list">
                            <view class="det-list-tit">贮存条件</view>
                            <view class="det-list-content">{{proSpuInfo.reserveCondition}}</view>
                        </view>
                        <view class="det-list">
                            <view class="det-list-tit">保质期</view>
                            <view class="det-list-content">{{proSpuInfo.shelfLife}}{{proSpuInfo.shelfLifeUnit}}</view>
                        </view>
                        <view class="det-list">
                            <view class="det-list-tit">生产日期</view>
                            <view class="det-list-content" v-if="proSpuInfo.madeDate">{{proSpuInfo.madeDate | millisecondFormat}}</view>
                            <view class="det-list-content" v-else>见商品包装</view>
                        </view>
                        <view class="det-list" v-for="(item, index) in proSpuInfo.propertyList" :key="index">
                            <view class="det-list-tit">{{item.propertyName}}</view>
                            <view class="det-list-content">{{item.propertyValue}}</view>
                        </view>
                    </view>
                    <!--<view v-show="!proSpuInfo.propertyList.length" class="appDescNone">-->
                        <!--此商品暂无规格参数~-->
                    <!--</view>-->
                </view>
                <view class="det-tab-item tabitem02" v-show="currentDetTabIndex === 2">
                    <view v-if="!appDesc && !appDescLoaded" class="page-loading-con">
                        <view class="page-infinite-loading">
                            <mt-spinner type="triple-bounce" class="sp-bounce"></mt-spinner>努力加载中...
                        </view>
                    </view>
                    <view v-else-if="!appDesc && appDescLoaded" class="appDescNone">
                        此商品暂无图文详情~
                    </view>
                    <view v-else class="tabitem02-content" v-html="appDesc"></view>
                    <!--<view class="det02-text">众品鲜猪头 带耳猪头 散装众品鲜猪头 带耳猪头 散装众品 鲜猪头 带耳猪头 散装</view>-->
                    <!--<view class="det02-img">-->
                        <!--<img src="https://gw.alicdn.com/imgextra/i1/15534907/TB2Za6nXfAPyuJjy0FcXXbCzpXa_!!15534907.jpg_970x970q50s150.jpg_.webp" alt="">-->
                        <!--<img src="https://gw.alicdn.com/imgextra/i1/15534907/TB2lDF0vYplpuFjSspiXXcdfFXa_!!15534907.jpg_970x970q50s150.jpg_.webp" alt="">-->
                    <!--</view>-->
                </view>
                <view class="det-tab-item tabitem03" v-show="currentDetTabIndex === 3"></view>
            </view>
            <!--详情页按钮-->
            <view class="m-details-btns" slot="footer">
                <!--判断SPU价格维护状态（buyStatus） 1.正常购买 2.价格维护中-->
                <template v-if="proSpuInfo.buyStatus === '1'">
                    <template v-if="proSpuInfo.priceMethod === 2">
                        <!--商品为一口价-->
                        <template v-if="proSpuInfo.proSpuStatus === 1">
                            <template v-if="proSpuInfo.proSkuInfo.proSkuStatus === 1">
                                <!-- p按断是否为预售 -->
                                <template v-if="proSpuInfo.proSkuInfo.proArea && proSpuInfo.proSkuInfo.proArea.preSalePro">
                                    <!-- 预售商品 -->
                                    <template v-if="proSpuInfo.proSkuInfo.proArea.preSalePro.status !== 1 || proSpuInfo.proSkuInfo.proArea.preSalePro.activityStatus !== 1" style="width: 100%">
                                        <view class="det-btn-tips">
                                            已结束
                                        </view>
                                    </template>
                                    <template v-else style="width: 100%">
                                        <view class="det-btns" v-if="proSpuInfo.proSkuInfo.proArea.preSalePro.timeStatus === 1">
                                            <view class="det-tocart">活动即将开始</view>
                                        </view>
                                        <view class="det-btn-tips" v-else-if="proSpuInfo.proSkuInfo.proArea.preSalePro.timeStatus === 3">
                                            已结束
                                        </view>
                                        <template v-else>
                                            <view class="det-pri">
                                                <span>总价</span>{{skuTotalPrice | currency}}
                                            </view>
                                            <view class="det-btns">
                                                <view class="det-tocart add" @click.prevent="addCart">加购物车</view>
                                                <view class="det-tobuy xe-gradient-color buy" @click.prevent='buyNowFn'>立即购买</view>
                                            </view>
                                        </template>
                                    </template>
                                </template>
                                <template v-else-if="proSpuInfo.preSaleFlag === 1 && !proSpuInfo.proSkuInfo.proArea.preSalePro">
                                    <view class="det-btn-tips">
                                        该商品预售活动已结束
                                    </view>
                                </template>
                                <template v-else>
                                    <view class="det-pri">
                                        <span>总价</span>{{skuTotalPrice | currency}}
                                    </view>
                                    <view class="det-btns">
                                        <view class="det-tocart" @click.prevent="addCart">加购物车</view>
                                        <view class="det-tobuy xe-gradient-color" @click.prevent='buyNowFn'>立即购买</view>
                                    </view>
                                </template>
                            </template>
                            <template v-else>
                                <view class="det-btn-tips">
                                    {{proSpuInfo.proSkuInfo.proSkuStatus | proSkuStatusToText}}
                                </view>
                            </template>
                        </template>
                        <template v-if="proSpuInfo.proSpuStatus === 2">
                            <view class="det-btn-tips">
                                {{proSpuInfo.proSpuStatus | proSkuStatusToText}}
                            </view>
                        </template>
                        <template v-if="proSpuInfo.proSpuStatus === 5">
                            <view class="det-btn-tips">
                                {{proSpuInfo.proSpuStatus | proSkuStatusToText}}
                            </view>
                        </template>
                    </template>
                    <template v-else>
                        <!--商品为询报价-->
                        <template v-if="proSpuInfo.proSpuStatus === 1">
                            <template v-if="proSpuInfo.proSkuInfo.proSkuStatus === 1">
                                <view class="det-btns">
                                    <view class="det-tocart" @click.prevent="addInquiryList(proSpuInfo.proSkuInfo.proSku)">加入询价单</view>
                                    <view class="det-tobuy xe-gradient-color" @click.prevent="showInquiryVisible">立即询价</view>
                                </view>
                            </template>
                            <template v-else>
                                <view class="det-btn-tips">
                                    {{proSpuInfo.proSkuInfo.proSkuStatus | proSkuStatusToText}}
                                </view>
                            </template>
                        </template>
                        <template v-if="proSpuInfo.proSpuStatus === 2">
                            <view class="det-btn-tips">
                                {{proSpuInfo.proSpuStatus | proSkuStatusToText}}
                            </view>
                        </template>
                    </template>
                </template>
                <template v-else>
                    <view class="det-btn-tips">
                        {{proSpuInfo.priceUpdateTitle}}
                    </view>
                </template>
            </view>

            <!--加入询价单-->
            <xe-popup
                slot="outer"
                :show.sync="inquiryVisible"
                popupTit="立即询价"
                position="right"
            >
                <view class="det-inquiry-box">
                    <view class="det-inquiry-con">
                        <view class="m-product-item">
                            <view class="pic">
                                <img v-lazy="picServer + 'product/150/150/' + proSpuInfo.proSkuInfo.proMainImg" alt="">
                            </view>
                            <view class="msg">
                                <view class="msg-con">
                                    <view class="name">
                                        <p v-html="proSpuInfo.proName"></p>
                                    </view>
                                    <view class="vendor">
                                        {{proSpuInfo.venInfo.shopName ? proSpuInfo.venInfo.shopName : proSpuInfo.venInfo.venName}}
                                    </view>
                                    <view class="msg-scon">
                                        <view class="qutaliy">{{proSpuInfo.proSkuInfo.minQuantity}}{{proSpuInfo.proUnit}}起订 ({{specValue}})</view>
                                        <!--<view class="marketPri">-->
                                            <!--&yen;{{proSpuInfo.proSkuInfo.unitPrice}}/{{proSpuInfo.proUnit}}-->
                                        <!--</view>-->
                                        <view class="price" v-if="proSpuInfo.priceMethod !== 3">
                                            &yen;<span class="big-price">{{proSpuInfo.proSkuInfo.skuPrice | toFixed2}}</span><span class="unit">/{{proSpuInfo.proUnit}}</span>
                                        </view>
                                        <view class="price" v-else>
                                            面议
                                        </view>
                                    </view>
                                </view>
                            </view>
                        </view>
                        <view class="det-inquiry-item">
                            <view class="item">
                                <view class="item-left">采购数量</view>
                                <view class="item-right">
                                    <view class="num-con">
                                        <InputNumber
                                            v-model="inquiryParams.productCount"
                                            :min="proSpuInfo.proSkuInfo.minQuantity"
                                            :max="proSpuInfo.proSkuInfo.saleQuantity"
                                        ></InputNumber>
                                    </view>
                                </view>
                            </view>
                            <view class="item">
                                <view class="item-left">采购询价</view>
                                <view class="item-right">
                                    <template v-if="proSpuInfo.priceMethod !== 3">
                                        <input maxlength="8" type="number" v-model.number="inquiryParams.proPrice" @blur="inquiryParams.proPrice = Number(Math.abs(parseFloat(inquiryParams.proPrice)).toFixed(2))" placeholder="请输入价格" class="inquiry-input"><span>元/{{proSpuInfo.proUnit}}</span>
                                    </template>
                                    <template v-else>
                                        <input maxlength="8" type="number" v-model.number="inquiryParams.myprice" @blur="inquiryParams.myprice = Number(Math.abs(parseFloat(inquiryParams.myprice)).toFixed(2))" placeholder="请输入价格" class="inquiry-input"><span>元/{{proSpuInfo.proUnit}}</span>
                                    </template>
                                </view>
                            </view>
                            <view class="item">
                                <view class="item-left">询价类型</view>
                                <view class="item-right">
                                    <xe-radio-group v-model="inquiryParams.inquiryType">
                                        <view class="clearfix" v-if="proSpuInfo.deliveryType === 1">
                                            <view class="fl radio-item"><xe-radio :label="1">配送价</xe-radio></view>
                                        </view>
                                        <view class="clearfix" v-else-if="proSpuInfo.deliveryType === 2">
                                            <view class="fl radio-item"><xe-radio :label="0">自提价</xe-radio></view>
                                        </view>
                                        <view class="clearfix" v-else>
                                            <view class="fl radio-item"><xe-radio :label="1">配送价</xe-radio></view>
                                            <view class="fl radio-item"><xe-radio :label="0">自提价</xe-radio></view>
                                        </view>
                                    </xe-radio-group>
                                </view>
                            </view>
                        </view>
                        <v-touch v-if="proDetAdritem" class="det-inquiry-item det-inquiry-itemadr" tag="view" @tap="adrVisibleFn">
                            <view class="arrow-right-commons">
                                <view class="item">
                                    <view class="item-left">收货人</view>
                                    <view class="item-right">{{proDetAdritem.caConsignee}} {{proDetAdritem.caPhone}}</view>
                                </view>
                                <view class="item">
                                    <view class="item-left">收货地址</view>
                                    <view class="item-right">
                                        <view class="item-right-adr">{{proDetAdritem.caProvName}}{{proDetAdritem.caCityName}}{{proDetAdritem.caAreaName}}{{proDetAdritem.caStreet}}</view>
                                    </view>
                                </view>
                            </view>
                        </v-touch>
                        <view class="adr-none" v-else>
                            <mt-button class="xe-button-primary is-radius" size="small" plain @click.prevent="navToAddNewAdr">+ 新增地址</mt-button>
                        </view>
                    </view>
                    <view class="det-btns">
                        <view class="m-details-btns">
                            <view class="det-pri">
                                <span>总价：</span>&yen;{{inquiryPri}}
                            </view>
                            <view class="det-btns">
                                <view class="det-tobuy xe-gradient-color" @click.prevent="realTimeInquiry(proSpuInfo.proSkuInfo.proSku)">{{inquiryText}}</view>
                            </view>
                        </view>
                    </view>
                </view>
            </xe-popup>
        </template>

        <!--选择优惠券-->
        <xe-popup
            slot="outer"
            :show.sync="couponVisible"
            popupTit="优惠券"
            position="bottom">
            <view class="pop-det-coupoon">
                <xe-couponItem :couponList="couponListPopup"></xe-couponItem>
            </view>
        </xe-popup>

        <!--选择地址-->
        <xe-popup
            slot="outer"
            ref="adrInstance"
            :show.sync="adrVisible"
            popupTit="选择地址"
            position="bottom">
            <ChooseAdrItem :adrDatas="adrDatas" @on-adr-change="adrChangeFn" @on-click-toadd="toAddFn"></ChooseAdrItem>
        </xe-popup>

        <!--地址插件-->
        <xe-popup
            slot="outer"
            :show.sync="showadr"
            popupTit="配送至"
            position="bottom">
            <CitySelect
                v-model="defaultAdrs"
                :show.sync="showadr"
                @on-adr-change="adrChange"
            ></CitySelect>
        </xe-popup>
    </xe-layout>
</template>
<script type="text/ecmascript-6">
    import Vue from 'vue';
    import {CitySelect} from 'components/CitySelect/';
    import {Popup} from 'components/Popup';
    import proItem from 'components/ProItem/ProItem';
    import {Radio, RadioGroup} from 'components/Radio/';
    import CouponItem from 'components/CouponItem/CouponItem';
    import ChooseAdrItem from './ChooseAdrItem';
    import InputNumber from 'components/InputNumber/InputNumber';
    import {CountDown} from 'components/CountDown';
    import YsTimes from './ystimes';
    export default {
        beforeRouteEnter(to, from, next) {
            let nowRegionMap = JSON.parse(Vue.prototype.$getLocalStorage('REGIONMAP'));
            Vue.prototype.$indicator.open('加载详情...');
            Vue.$http({
                method: 'post',
                url: '/xe-route/xe-app/mobileApp/proInfo/proSpuInfo',
                data: {
                    areaId: to.query.areaId ? to.query.areaId : nowRegionMap.areaId,
                    proSku: to.query.prosku,
                    proSpu: to.params.prospu
                }
            }).then(res => {
                // 判断spu信息是否为null
                if (!res.data.proSpuInfo) {
                    Vue.prototype.$xeMessageBox.alert('商品不存在').then(res => {
                        next(false);
                    });
                } else {
                    if (!res.data.proSpuInfo.proSkuInfo) {
                        let instance = Vue.prototype.$toast('该商品规格已下架或已删除');
                        setTimeout(() => {
                            instance.close();
                            next(false);
                        }, 1500);
                    } else {
                        next(vm => {
                            vm.isCollect = res.data.isCollect; // 收藏状态
                            vm.picServer = res.data.picServer;
                            vm.proSpuInfo = res.data.proSpuInfo;
                            vm.infoLoaded = true;
                            vm.currentSku = to.query.prosku ? to.query.prosku : res.data.proSpuInfo.proSkuInfo.proSku;
                            vm.areaId = nowRegionMap.areaId;
                            vm.defaultAdrs = [nowRegionMap.provinceId, nowRegionMap.cityId, nowRegionMap.areaId];
                            vm.defaultAdrsText = [nowRegionMap.provinceName, nowRegionMap.cityName, nowRegionMap.areaName];
                        });
                    }
                }
                Vue.prototype.$indicator.close();
            }).catch(error => {
                console.log(error);
                Vue.prototype.$indicator.close();
                next(false);
            });
        },
        data() {
            return {
                fixed: true,
                couponVisible: false,
                inquiryVisible: false, // 显示加入询价单
                adrVisible: false,
                text: '',
                radio1: 1,
                proSkuCountNum: 1, // 商品购买数量
                isCollect: null, // 是否收藏
                picServer: '',
                proSpuInfo: {},
                infoLoaded: false,
                currentSku: '',
                currentDetTab: [
                    {
                        name: '规格参数',
                        id: 1
                    },
                    {
                        name: '图文详情',
                        id: 2
                    }
//
                ],
                currentDetTabIndex: 1,
                appDesc: null,
                appDescLoaded: false,
                showadr: false,
                areaId: '',
                defaultAdrs: [],
                defaultAdrsText: '',
                couponListPopup: [], // popup内优惠券列表
                inquiryParams: {
                    'inquiryType': 1, // 询价类型（0 自提价 1 配送价）
                    'proPrice': '', // 询价价格
                    'productCount': 1, // 询价数量
                    'caId': null, // 收货地址id
                    'quirySource': 3,  // 询价单来源   1：android,2：ios,3：微信,4:pc,5：代客下单,6：其它
                    'myprice': ''
                },
                inquiryText: '立即询价',
                adrDatas: [],
                proDetAdritem: null
            };
        },
        mounted() {
            this.$nextTick(() => {
                this.$http({
                    method: 'post',
                    url: '/xe-route/xe-app/mobileApp/user/weChatShare',
                    data: {
                        shareUrl: window.location.href.split('#')[0]
                    }
                }).then(res => {
                    let wxConfig = res.data.data;
                    let wxshareDesc = '买冻品，上如来云商！省钱省事，安全放心！';
                    let wxshareTitle = this.proSpuInfo.proName;
                    let wxshareLink = window.location.href;
                    let wxshareImgUrl = this.picServer + 'product/150/150/' + this.proSpuInfo.proSkuInfo.proMainImg;
                    /* eslint-disable */
                    wx.config({
//                        debug: true,
                        appId: wxConfig.appId,
                        timestamp: wxConfig.timestamp,
                        nonceStr: wxConfig.nonceStr,
                        signature: wxConfig.signature,
                        jsApiList: [
                            'checkJsApi',
                            'onMenuShareTimeline',
                            'onMenuShareAppMessage',
                            'onMenuShareQQ',
                            'onMenuShareQZone',
                            'hideOptionMenu',
                            'showOptionMenu'
                        ]
                    });
                    //微信分享code by zhangwen
                    wx.ready(function(){
                        //分享朋友圈
                        wx.onMenuShareTimeline({
                            title: wxshareTitle, // 分享标题
                            link: wxshareLink, // 分享链接
                            imgUrl: wxshareImgUrl, // 分享图标
                            success: function () {
                                // 用户确认分享后执行的回调函数
                            },
                            cancel: function () {
                                // 用户取消分享后执行的回调函数
                            }
                        });

                        //分享朋友
                        wx.onMenuShareAppMessage({
                            title: wxshareTitle, // 分享标题
                            desc: wxshareDesc, // 分享描述
                            link: wxshareLink, // 分享链接
                            imgUrl: wxshareImgUrl, // 分享图标
                            type: 'link', // 分享类型,music、video或link，不填默认为link
                            dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                            success: function () {
                                // 用户确认分享后执行的回调函数
                            },
                            cancel: function () {
                                // 用户取消分享后执行的回调函数
                            }
                        });
                        //分享QQ
                        wx.onMenuShareQQ({
                            title: wxshareTitle, // 分享标题
                            desc: wxshareDesc, // 分享描述
                            link: wxshareLink, // 分享链接
                            imgUrl: wxshareImgUrl, // 分享图标
                            success: function () {
                                // 用户确认分享后执行的回调函数
                            },
                            cancel: function () {
                                // 用户取消分享后执行的回调函数
                            }
                        });
                        wx.onMenuShareQZone({
                            title: wxshareTitle, // 分享标题
                            desc: wxshareDesc, // 分享描述
                            link: wxshareLink, // 分享链接
                            imgUrl: wxshareImgUrl, // 分享图标
                            success: function () {
                                // 用户确认分享后执行的回调函数
                            },
                            cancel: function () {
                                // 用户取消分享后执行的回调函数
                            }
                        });
                    });
                }).catch(error => {
                    console.log(error);
                });
            });
        },
        methods: {
            // preNotice() {
            //     alert('预售提醒要设计啊~~');
            // },
            preEndFn() {
                this.proSkuInfo();
                this.$bus.$emit('yschange');
            },
            adrVisibleFn() {
                this.$refs.adrInstance.$el.querySelector('.m-mask-bg').style.zIndex = 501;
                this.$refs.adrInstance.$el.querySelector('.content').style.zIndex = 502;
                this.adrVisible = true;
            },
            adrChange(value) {
                console.log(value);
                this.$setLocalStorage('REGIONMAP', JSON.stringify({
                    provinceId: value[0].areaId,
                    provinceName: value[0].areaName,
                    cityId: value[1].areaId,
                    cityName: value[1].areaName,
                    areaId: value[2].areaId,
                    areaName: value[2].areaName
                }));
                this.reloadProSpuInfo();
            },
            skuItemClick(item) {
                // 切换规格
                if (item.proSku !== this.currentSku) {
                    this.currentSku = item.proSku;
                    this.$router.replace({name: 'ProductDetails', params: {prospu: this.$route.params.prospu}, query: {prosku: item.proSku}});
                    this.fixed = false;
                    this.proSkuInfo();
                }
            },
            reloadProSpuInfo() {
                let nowRegionMap = JSON.parse(this.$getLocalStorage('REGIONMAP'));
                this.$indicator.open('加载详情...');
                Vue.$http({
                    method: 'post',
                    url: '/xe-route/xe-app/mobileApp/proInfo/proSpuInfo',
                    data: {
//                        areaId: nowRegionMap.areaId,
                        areaId: this.$route.query.areaId ? this.$route.query.areaId : nowRegionMap.areaId,
                        proSpu: this.$route.params.prospu
                    }
                }).then(res => {
                    console.log(res);
                    // 判断spu信息是否为null
                    if (!res.data.proSpuInfo) {
                        this.$xeMessageBox.alert('商品不存在').then(res => {
                            this.$router.replace({
                                name: 'Index'
                            });
                        });
                    } else {
                        this.isCollect = res.data.isCollect; // 收藏状态
                        this.picServer = res.data.picServer;
                        this.proSpuInfo = res.data.proSpuInfo;
                        this.infoLoaded = true;
                        this.currentSku = res.data.proSpuInfo.proSkuInfo.proSku;
                        this.areaId = nowRegionMap.areaId;
                        this.defaultAdrs = [nowRegionMap.provinceId, nowRegionMap.cityId, nowRegionMap.areaId];
                        this.defaultAdrsText = [nowRegionMap.provinceName, nowRegionMap.cityName, nowRegionMap.areaName];
                    }
                    this.$indicator.close();
                }).catch(error => {
                    console.log(error);
                    this.$indicator.close();
                });
            },
            proSkuInfo() {
                this.$indicator.open('加载规格详情...');
                this.fixed = false;
                this.$http({
                    method: 'post',
                    url: '/xe-route/xe-app/mobileApp/proInfo/proSkuInfo',
                    data: {
                        areaId: this.areaId,
                        proSku: this.currentSku
                    }
                }).then(res => {
                    this.fixed = true;
                    if (res.data.skuStatus === 1) {
                        // sku状态 1正常 2spu为空 3sku为空
                        this.proSpuInfo.proSkuInfo = res.data.proSkuInfo;
                        this.fixed = true;
                        this.proSkuCountNum = this.proSpuInfo.proSkuInfo.minQuantity;
                    } else if (res.data.skuStatus === 2) {
                        // spu为空
                        this.reloadProSpuInfo();
                    } else {
                        let instance = this.$toast('该商品规格已删除,正在重新获取商品信息...');
                        setTimeout(() => {
                            instance.close();
                            this.reloadProSpuInfo();
                        }, 1500);
                    }
                    this.$indicator.close();
                }).catch(error => {
                    this.$indicator.close();
                    console.log(error);
                });
            },
            detTabClick(item) {
                this.currentDetTabIndex = item.id;
                if (item.id === 2 && !this.appDesc) {
                    this.querySpuDescInfo();
                };
            },
            couponVisibleFn() {
                // 优惠券popup展示
                this.$indicator.open('加载优惠券...');
                this.$http({
                    method: 'post',
                    url: '/xe-route/xe-app/mobileApp/proInfo/couponList',
                    data: {
                        areaId: this.areaId,
                        cateId: this.proSpuInfo.cateId,
                        proSku: this.currentSku,
                        userCode: this.proSpuInfo.userCode
                    }
                }).then(res => {
                    this.$indicator.close();
                    this.couponListPopup = res.data.couponList;
                    this.couponVisible = true;
                }).catch(error => {
                    console.log(error);
                    this.$indicator.close();
                    if (error.status !== 'xe404') {
                        this.$toast({
                            message: error.msg,
                            position: 'bottom'
                        });
                    }
                });
            },
            querySpuDescInfo() {
                this.$http({
                    method: 'post',
                    url: '/xe-route/xe-app/mobileApp/proInfo/querySpuDescInfo',
                    data: {
                        proSpu: this.proSpuInfo.proSpu
                    }
                }).then(res => {
                    this.appDescLoaded = true;
                    this.appDesc = res.data.appDesc;
                }).catch(error => {
                    console.log(error);
                });
            },
            proSkuCountNumChange(val) {},
            collectProduct() {
                this.$http({
                    method: 'post',
                    url: '/xe-route/xe-app/mobileApp/proInfo/collectProduct',
                    data: {
                        proSpu: this.proSpuInfo.proSpu
                    }
                }).then(res => {
                    if (res.data.proInfoState === 1) {
                        this.isCollect = res.data.collectCode;
                        this.$toast({
                            message: this.isCollect === 1 ? '收藏商品成功' : '取消商品收藏成功',
                            duration: 1000
                        });
                    } else {
                        let tips = '商品不存在';
                        if (res.data.proInfoState === 4 || res.data.proInfoState === 5) {
                            tips = '该商品规格已下架'
                        } else if (res.data.proInfoState === 6 || res.data.proInfoState === 7) {
                            tips = '该区域商品已下架';
                        }
                        this.$toast({
                            message: tips,
                            duration: 1500
                        });
                    }
                }).catch(error => {
                    console.log(error);
                });
            },
            addCart() {
                // 加入购物车
                let _this = this;
                this.$indicator.open('加入购物车中...');
                this.$http({
                    method: 'post',
                    url: '/xe-route/xe-app/mobile/cart/addCart',
                    data: {
//                        proSku: this.currentSku,
                        proSku: this.proSpuInfo.preSaleFlag === 1 ? this.proSpuInfo.proSkuInfo.proSku : this.currentSku, // 判断是否是预售商品（（未刷新页面的情况下）防止商品点进去还是预售过几分钟之后已经不是预售商品，需要把详情中返回的的spu带过去）
                        quantity: this.proSkuCountNum,
                        areaId: this.areaId,
                        preSalePriceId: this.preSalePriceId ? this.preSalePriceId : ''
                    }
                }).then(res => {
                    console.log(res);
                    this.$indicator.close();
                    this.$toast({
                        message: '加入购物车成功',
                        duration: 1000
                    });
                }).catch(error => {
                    console.log(error);
                    this.$indicator.close();
                });
            },
            addInquiryList(sku) {
                // 加入询价单
                this.$indicator.open('加入询价单中...');
                this.$http({
                    method: 'post',
                    url: '/xe-route/xe-app/mobile/inquiry/addInquiry',
                    data: {
                        productSku: sku,
                        quirySource: 3
                    }
                }).then(res => {
                    console.log(res);
                    this.$indicator.close();
                    if (res.data.responseDto.status === '2003') {
                        // 没有地址
                        this.$xeMessageBox({
                            message: res.data.responseDto.msg,
                            showCancelButton: true,
                            confirmButtonText: '立即添加地址'
                        }).then((action) => {
                            if (action === 'confirm') {
                                this.$router.push({
                                    name: 'AddNewAdr',
                                    query: {
                                        redirectType: 1
                                    }
                                });
                            }
                        }).catch(() => {});
                    } else {
                        this.$toast({
                            message: res.data.responseDto.msg,
                            duration: 1500
                        });
                    }
                }).catch(error => {
                    this.$indicator.close();
                    console.log(error);
                });
            },
            showInquiryVisible() {
                if (this.$getLocalStorage('LOGINSTATUS')) {
                    this.inquiryParams.proPrice = this.proSpuInfo.proSkuInfo.skuPrice ? parseFloat(this.proSpuInfo.proSkuInfo.skuPrice).toFixed(2) : '';
                    this.inquiryVisible = true;
                    this.$http({
                        method: 'post',
                        url: '/xe-route/xe-app/mobile/address/queryAddressList',
                        data: {}
                    }).then(res => {
                        console.log(res);
                        this.adrDatas = res.data.addressResDto.addressList;
                        // 选择地址逻辑
                        let result = null;
                        let flag = false;
                        this.adrDatas.some(adritem => {
                            if (adritem.defAddr === 1) {
                                // 地址列表没有这个地址
                                result = adritem;
                                flag = true;
                                return true;
                            }
                        });

                        if (this.proSpuInfo.deliveryType === 1) {
                            this.inquiryParams.inquiryType = 1;
                        } else if (this.proSpuInfo.deliveryType === 2) {
                            this.inquiryParams.inquiryType = 0;
                        } else if (this.proSpuInfo.deliveryType === 3) {
                            if (this.proSpuInfo.inquiryType === null) {
                                this.inquiryParams.inquiryType = 1;
                            }
                        }
                        if (flag && this.adrDatas.length) {
                            let item = {};
                            item.caProvince = result.caProvince;
                            item.caProvName = result.caProvName;
                            item.caCity = result.caCity;
                            item.caCityName = result.caCityName;
                            item.caArea = result.caArea;
                            item.caAreaName = result.caAreaName;
                            item.caStreet = result.caStreet;
                            item.caPhone = result.caPhone;
                            item.caConsignee = result.caConsignee;
                            item.caId = result.caId;
                            this.inquiryParams.caId = result.caId;
                            this.proDetAdritem = item;
                        }
                        if (!flag && this.adrDatas.length) {
                            let item = {};
                            item.caProvince = this.adrDatas[0].caProvince;
                            item.caProvName = this.adrDatas[0].caProvName;
                            item.caCity = this.adrDatas[0].caCity;
                            item.caCityName = this.adrDatas[0].caCityName;
                            item.caArea = this.adrDatas[0].caArea;
                            item.caAreaName = this.adrDatas[0].caAreaName;
                            item.caStreet = this.adrDatas[0].caStreet;
                            item.caPhone = this.adrDatas[0].caPhone;
                            item.caConsignee = this.adrDatas[0].caConsignee;
                            item.caId = this.adrDatas[0].caId;
                            this.inquiryParams.caId = this.adrDatas[0].caId;
                            this.proDetAdritem = item;
                        }
                    }).catch(error => {
                        console.log(error);
                    });
                } else {
                    this.$xeMessageBox({
                        message: '您还未登录~',
                        showCancelButton: true,
                        confirmButtonText: '立即登录'
                    }).then(action => {
                        if (action === 'confirm') {
                            this.$router.push({
                                name: 'Login',
                                query: {
                                    redirect: this.$route.fullPath
                                }
                            });
                        }
                    }).catch(() => {});
                }
            },
            adrChangeFn(item) {
                console.log(item);
                this.proDetAdritem = item;
                this.inquiryParams.caId = item.caId;
                this.adrVisible = false;
            },
            toAddFn() {
                this.$router.push({
                    name: 'AddNewAdr',
                    query: {
                        redirect: this.$route.fullPath
                    }
                });
            },
            realTimeInquiry(sku) {
                console.log(this.inquiryParams.proPrice);
                if (this.proSpuInfo.priceMethod === 1 && (!this.inquiryParams.proPrice || this.inquiryParams.proPrice === 'NAN')) {
                    this.$toast({
                        message: '请输入询价价格',
                        duration: 1500
                    });
                    return;
                }
                if (this.proSpuInfo.priceMethod === 3 && (!this.inquiryParams.myprice || this.inquiryParams.myprice === 'NAN')) {
                    this.$toast({
                        message: '请输入询价价格',
                        duration: 1500
                    });
                    return;
                }
                if (!this.inquiryParams.caId) {
                    this.$toast({
                        message: '请选择地址',
                        duration: 1500
                    });
                    return;
                }
                if (this.inquiryText === '加载中...') {
                    return;
                }
                this.inquiryText = '加载中...';
                this.$http({
                    method: 'post',
                    url: '/xe-route/xe-app/mobile/inquiry/realTimeInquiry',
                    data: {
                        'productSku': sku,
                        'inquiryType': this.inquiryParams.inquiryType, // 询价类型（0 自提价 1 配送价）
                        'proPrice': this.proSpuInfo.priceMethod === 3 ? this.inquiryParams.myprice : this.inquiryParams.proPrice, // 询价价格
                        'productCount': this.inquiryParams.productCount, // 询价数量
                        'caId': this.inquiryParams.caId, // 收货地址id
                        'quirySource': 3  // 询价单来源   1：android,2：ios,3：微信,4:pc,5：代客下单,6：其它
                    }
                }).then(res => {
                    if (res.data.responseDto.status === '2000') {
                        this.inquiryVisible = false;
                        this.$toast({
                            message: res.data.responseDto.msg,
                            duration: 1500
                        });
                        this.inquiryText = '立即询价';
                    } else {
                        this.$toast({
                            message: res.data.responseDto.msg,
                            duration: 1500
                        });
                        this.inquiryText = '立即询价';
                    }
                }).catch(error => {
                    console.log(error);
                    this.inquiryText = '立即询价';
                });
            },
            buyNowFn() {
                if (this.$getLocalStorage('LOGINSTATUS')) {
                    // 检查商品状态
                    this.$http({
                        method: 'post',
                        url: '/xe-route/xe-app/mobileApp/proInfo/checkProductInfoState',
                        data: {
                            proSpu: this.$route.params.prospu,
//                            proSku: this.currentSku,
                            proSku: this.proSpuInfo.preSaleFlag === 1 ? this.proSpuInfo.proSkuInfo.proSku : this.currentSku, // 判断是否是预售商品（（未刷新页面的情况下）防止商品点进去还是预售过几分钟之后已经不是预售商品，需要把详情中返回的的spu带过去）
                            areaId: this.areaId
                        }
                    }).then(res => {
                        console.log(res);
                        if (res.data.proInfoState === 1) {
                            this.$router.push({
                                name: 'ConfirmOrder',
                                params: {
                                    orderSource: 2,
                                    orderPlat: 3
                                },
                                query: {
                                    buyNum: this.proSkuCountNum,
//                                    proSkus: this.currentSku
                                    proSkus: this.proSpuInfo.preSaleFlag === 1 ? this.proSpuInfo.proSkuInfo.proSku : this.currentSku
                                }
                            });
                        } else {
                            let tips = '商品不存在';
                            if (res.data.proInfoState === 4 || res.data.proInfoState === 5) {
                                tips = '该商品规格已下架'
                            } else if (res.data.proInfoState === 6 || res.data.proInfoState === 7) {
                                tips = '该区域商品已下架';
                            }
                            this.$toast({
                                message: tips,
                                duration: 1500
                            });
                        }
                    }).catch(error => {
                        console.log(error);
                    });
                } else {
                    this.$xeMessageBox({
                        message: '您还未登录~',
                        showCancelButton: true,
                        confirmButtonText: '立即登录'
                    }).then(action => {
                        if (action === 'confirm') {
                            this.$router.push({
                                name: 'Login',
                                query: {
                                    redirect: this.$route.fullPath
                                }
                            });
                        }
                    }).catch(() => {});
                }
            },
            navToAddNewAdr() {
                this.$router.push({
                    name: 'AddNewAdr',
                    query: {
                        redirect: this.$route.fullPath
                    }
                });
            }
        },
        computed: {
            skuTotalPrice() {
                if (this.proSpuInfo.proSkuInfo.proArea === null) {
                    return 0;
                } else {
                    if (this.proSpuInfo.proSkuInfo.proArea.stepFlag === 1) {
                        // 判断是否有促销
                        if (this.proSpuInfo.proSkuInfo.proArea.venDisLimitPro) {
                            // 阶梯价
                            // ==有秒杀促销
                            let venDisLimitPro = this.proSpuInfo.proSkuInfo.proArea.venDisLimitPro;
                            let limitQuantity = venDisLimitPro.limitQuantity; // 促销可售库存
                            let limitPrice = venDisLimitPro.limitPrice; // 促销价
                            if (this.proSkuCountNum > limitQuantity) {
                                // 购买数量超过了促销库存
                                let resultNum1 = this.proSkuCountNum - limitQuantity; // 按阶梯价计算的商品数量
                                let lengths = this.proSpuInfo.proSkuInfo.proArea.areaStepList.length - 1;
                                let stepPrice = 0;
                                for (let i = lengths; i >= 0; i--) {
                                    let obj = this.proSpuInfo.proSkuInfo.proArea.areaStepList[i];
                                    let startNum = obj.startNum;
                                    if (resultNum1 >= startNum) {
                                        stepPrice = obj.stepPrice;
                                        break;
                                    }
                                }
                                return (stepPrice * resultNum1) + (limitPrice * limitQuantity)
                            } else {
                                // 销量库存足够时 促销价 * 购买数量
                                return limitPrice * this.proSkuCountNum
                            }
                        } else if (this.proSpuInfo.proSkuInfo.proArea.preSalePro) {
                            // 有预售
                            let preSalePro = this.proSpuInfo.proSkuInfo.proArea.preSalePro;
                            return preSalePro.currentPreSalePrice * this.proSkuCountNum;
                        } else {
                            // ==无促销时
                            let lengths = this.proSpuInfo.proSkuInfo.proArea.areaStepList.length - 1;
                            let stepPrice = 0;
                            for (let i = lengths; i >= 0; i--) {
                                let obj = this.proSpuInfo.proSkuInfo.proArea.areaStepList[i];
                                let startNum = obj.startNum;
                                if (this.proSkuCountNum >= startNum) {
                                    stepPrice = obj.stepPrice;
                                    break;
                                }
                            }
                            console.log(stepPrice * this.proSkuCountNum);
                            return stepPrice * this.proSkuCountNum
                        }
                    } else {
                        // 判断是否有促销
                        if (this.proSpuInfo.proSkuInfo.proArea.venDisLimitPro) {
                            // ==有秒杀促销
                            let venDisLimitPro = this.proSpuInfo.proSkuInfo.proArea.venDisLimitPro;
                            let limitQuantity = venDisLimitPro.limitQuantity; // 促销可售库存
                            let limitPrice = venDisLimitPro.limitPrice; // 促销价
                            if (this.proSkuCountNum > limitQuantity) {
                                // 购买数量超过了促销库存
                                let resultNum1 = this.proSkuCountNum - limitQuantity; // 按原价计算的商品数量
                                return ((resultNum1 * this.proSpuInfo.proSkuInfo.proArea.areaPrice) + (limitQuantity * limitPrice)).toFixed(2);
                            } else {
                                // 销量库存足够时 促销价 * 购买数量
                                return limitPrice * this.proSkuCountNum
                            }
                        } else if(this.proSpuInfo.proSkuInfo.proArea.preSalePro) {
                            // 有预售
                            let preSalePro = this.proSpuInfo.proSkuInfo.proArea.preSalePro;
                            return preSalePro.currentPreSalePrice * this.proSkuCountNum;
                        } else {
                            // ==无促销时
                            return this.proSpuInfo.proSkuInfo.proArea.areaPrice * this.proSkuCountNum;
                        }
                    }
                }
            },
            inquiryPri() {
                if (!this.inquiryParams.proPrice || this.inquiryParams.proPrice === 'NaN') {
                    return 0;
                };
                if (this.proSpuInfo.priceMethod !== 3) {
                    return (this.inquiryParams.productCount * (this.inquiryParams.proPrice ? this.inquiryParams.proPrice : 0)).toFixed(2);
                } else {
                    return (this.inquiryParams.productCount * (this.inquiryParams.myprice ? this.inquiryParams.myprice : 0)).toFixed(2);
                }
            },
            specValue() {
                let result = [];
                let proSkuSpecList = null;
                this.proSpuInfo.skuList.some(item => {
                    if (item.proSku === this.currentSku) {
                        proSkuSpecList = item.proSkuSpecList;
                        return true;
                    }
                });
                if (!proSkuSpecList) {
                    return '无规格';
                } else {
                    proSkuSpecList.forEach(item => {
                        result.push(item.specValue);
                    });
                    return result.join('_');
                }
            },
            sliderImgList() {
                let result = [];
                if (this.proSpuInfo.imgList.length) {
                    result.push(...this.proSpuInfo.imgList);
                }
                result.unshift({proImg: this.proSpuInfo.proSkuInfo.proMainImg});
                return result;
            },
            skuDelPrice() {
                if (this.proSpuInfo.proSkuInfo.proArea === null) {
                    return this.proSpuInfo.proSkuInfo.skuPrice.toFixed(2);
                } else {
                    if (this.proSpuInfo.proSkuInfo.proArea.stepFlag === 1) {
                        // 阶梯价
                        let lengths = this.proSpuInfo.proSkuInfo.proArea.areaStepList.length - 1;
                        return this.proSpuInfo.proSkuInfo.proArea.areaStepList[lengths].stepPrice.toFixed(2);
                    } else {
                        return this.proSpuInfo.proSkuInfo.proArea.areaPrice.toFixed(2);
                    }
                }
            },
            preSalePriceId() {
                if (this.proSpuInfo.preSaleFlag === 1 && this.proSpuInfo.proSkuInfo.proArea.preSalePro && this.proSpuInfo.proSkuInfo.proArea.preSalePro.preSalePriceList.length) {
                    let nowtime = new Date().getTime();
                    let list = this.proSpuInfo.proSkuInfo.proArea.preSalePro.preSalePriceList;
                    let index = list.findIndex(item => {
                        let start = item.startDateTimeStamp;
                        let end = item.endDateTimeStamp;
                        return nowtime >= start && nowtime <= end;
                    });
                    return list[index].preSalePriceId;
                } else {
                    return null;
                }
            }
        },
        filters: {
            skuNameFilter(val) {
                let result = [];
                if (!val) {
                    return '无规格';
                } else {
                    val.forEach(item => {
                        result.push(item.specValue);
                    });
                    return result.join(', ');
                }
            }
        },
        components: {
            CitySelect,
            [Popup.name]: Popup,
            proItem,
            [Radio.name]: Radio,
            [RadioGroup.name]: RadioGroup,
            [CouponItem.name]: CouponItem,
            ChooseAdrItem,
            InputNumber,
            [CountDown.name]: CountDown,
            YsTimes
        }
    };
</script>
<style rel="stylesheet/scss" lang="scss">
    @import '../../static/styles/rules.scss';
    .m-page-details {
        .scrollview {
            -webkit-transform: translateZ(1/$ppr);
        }
        .m-popup.m-popup-right .content {
            z-index: 500;
        }
    }
    /*详情页加入询价单*/
    .det-inquiry-box {
        height: 100%;
        display: flex;
        flex-direction: column;
        .det-inquiry-con {
            flex: 1;
            overflow: auto;
            .adr-none {
                min-height: 120/$ppr;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .m-product-item {
                .msg {
                    border-bottom: none;
                    padding-bottom: 0;
                    min-height: 160/$ppr;
                }
            }
        }
        .det-inquiry-item {
            background: #fff;
            overflow: hidden;
            margin: 20/$ppr 0;
            padding: 0/$ppr 20/$ppr;
            overflow: hidden;
            &.det-inquiry-itemadr {
                padding: 15/$ppr 20/$ppr;
                .item {
                    min-height: 66/$ppr;
                    margin: 0;
                }
            }
            .item {
                display: flex;
                min-height: 66/$ppr;
                margin: 20/$ppr 0;
            }
            .item-left {
                width: 150/$ppr;
                flex: 0 0 150/$ppr;
                font-size: 28/$ppr;
                line-height: 66/$ppr;
            }
            .item-right {
                flex: 1;
                font-size: 28/$ppr;
                line-height: 66/$ppr;
            }
            .num-con {
                width: 250/$ppr;
                height: 66/$ppr;
            }
            .inquiry-input {
                width: 300/$ppr;
                height: 66/$ppr;
                padding: 15/$ppr 10/$ppr;
                line-height: 36/$ppr;
                border: 1/$ppr solid #ccc;
                margin-right: 10/$ppr;
            }
            .radio-item {
                margin: 15/$ppr 20/$ppr 0 0;
            }
            .item-right-adr {
                padding: 12/$ppr 0;
                line-height: 42/$ppr;
            }
        }
        .det-btns {
            height: 98/$ppr;
            .m-details-btns {
                position: static;
                .det-pri {
                    max-width: 65%;
                    min-width: 65%;
                }
            }
        }
    }

    .m-details-slider {
        height: 750/$ppr;
        position: relative;
    }
    .m-details-cz {
        width: 750/$ppr;
        height: 50/$ppr;
        position: absolute;
        left: 50%;
        margin-left: -375/$ppr;
        top: 20/$ppr;
        padding: 0 20/$ppr;
        z-index: 222;
        text-align: right;
        font-size: 0;
        -webkit-transform: translateZ(0px);
        span, a {
            width: 50/$ppr;
            height: 50/$ppr;
            background: rgba(0, 0, 0, .5);
            display: inline-block;
            margin-left: 20/$ppr;
            border-radius: 50/$ppr;
            color: #fff;
            font-size: 32/$ppr;
            text-align: center;
            line-height: 50/$ppr;
        }
    }
    .m-details-btns {
        display: flex;
        /*position: fixed;*/
        /*bottom: 0;*/
        /*left: 0;*/
        width: 100%;
        max-width: 750/$ppr;
        margin: 0 auto;
        height: 98/$ppr;
        z-index: 333;
        background: #fff;
        .det-pri {
            flex: 1;
            max-width: 44%;
            padding: 20/$ppr;
            font-size: 32/$ppr;
            color: $main-color;
            height: 97/$ppr;
            border-top: 1/$ppr solid $border-color-e8e;
            line-height: 57/$ppr;
            font-family: "Microsoft YaHei", Arial, Helvetica, sans-serif;
            span {
                color: $text-333;
                font-size: 28/$ppr;
            }
        }
        .det-btns {
            display: flex;
            flex: 1;
            > view {
                flex:1;
                font-size: 34/$ppr;
                text-align: center;
                line-height: 98/$ppr;
                color: #fff;
            }
            .det-tocart {
                background: $com-color;
            }
            .det-tobuy {
                /*background: $main-color;*/
            }
        }
        .det-btn-tips {
            flex:1;
            height: 100%;
            background: #c9c9c9;
            color: #fff;
            text-align: center;
            font-size: 34/$ppr;
            line-height: 98/$ppr;
        }
    }
    .m-details-item {
        max-width: 750/$ppr;
        margin: 10/$ppr auto;
        padding: 0 20/$ppr;
        overflow: hidden;
        background: #fff;
        .prouctname {
            font-size: 32/$ppr;
            line-height: 1.3;
            margin: 15/$ppr 0;
            font-weight: bold;
        }
        .productdes {
            color: $main-color;
            font-size: 26/$ppr;
            line-height: 1.3;
            margin: 15/$ppr 0;
            word-wrap: break-word;
        }
        .productpri {
            margin: 20/$ppr 0;
            color: $main-color;
            display: flex;
            > view {
                margin-right: 20/$ppr;
                flex: 1;
                &:last-child {
                    margin-right: 0;
                }
            }
            .pri01 {
                margin-bottom: 10/$ppr;
                font-size: 30/$ppr;
            }
            .pri02 {
                font-size: 24/$ppr;
            }
            .pri03 {
                color: #333;
                font-size: 24/$ppr;
                margin-bottom: 5/$ppr;
            }
            em {
                color: $text-666;
            }
        }
        .productmsg {
            display: flex;
            justify-content: space-between;
            margin: 15/$ppr 0;
            > view {
                font-size: 24/$ppr;
                color: $text-999;
            }
        }
        .productspec {
            display: flex;
            padding: 20/$ppr 0;
            border-top: 1/$ppr solid $border-color-e8e;
            .spec-tit {
                margin-right: 5/$ppr;
                font-size: 28/$ppr;
                white-space: nowrap;
                line-height: 48/$ppr;
            }
            .spec-con {
                flex: 1;
                .spec-con-ul {
                    overflow: hidden;
                    margin-bottom: -20/$ppr;
                    li {
                        height: 48/$ppr;
                        background: #f5f5f5;
                        color: $text-333;
                        padding:0 20/$ppr;
                        border-radius: 26/$ppr;
                        line-height: 46/$ppr;
                        margin-right: 20/$ppr;
                        float: left;
                        margin-bottom: 20/$ppr;
                        border: 1/$ppr solid #fff;
                        font-size:  24/$ppr;
                        &.current {
                            background: #fff;
                            color: $main-color;
                            border-color: $main-color;
                        }
                    }
                }
            }
        }
        .productnum {
            padding: 20/$ppr 0;
            border-top: 1/$ppr solid $border-color-e8e;
            display: flex;
            justify-content: space-between;
            align-items: center;
            .num-tit {
                margin-right: 5/$ppr;
                font-size: 28/$ppr;
                white-space: nowrap;
                line-height: 48/$ppr;
            }
            .num-con {
                flex: 1;
                display: flex;
                height: 54/$ppr;
                justify-content: space-between;
                .all-num {
                    font-size: 28/$ppr;
                    line-height: 54/$ppr;
                }
                .num-act {
                    width: 200/$ppr;
                    flex: 0 0 200/$ppr;
                }
            }
        }
        .productcoupon {
            padding: 20/$ppr 0;
            display: flex;
            .coupon-tit {
                margin-right: 5/$ppr;
                font-size: 28/$ppr;
                white-space: nowrap;
            }
            .coupon-con {
                flex: 1;
                .coupon-item {
                    font-size: 24/$ppr;
                    line-height: 30/$ppr;
                    margin-bottom: 10/$ppr;
                    display: flex;
                    align-items: center;
                    color: $text-666;
                    &:last-child {
                        margin-bottom: 0/$ppr;
                    }
                }
            }
        }
        .productadr {
            padding: 20/$ppr 0;
            display: flex;
            .adr-tit {
                margin-right: 5/$ppr;
                font-size: 28/$ppr;
                white-space: nowrap;
            }
            .adr-con {
                flex: 1;
            }
            .adr-cons {
                font-size: 28/$ppr;
                color: $text-333;
                span {
                    display: inline-block;
                    width: 30/$ppr;
                    height: 30/$ppr;
                    vertical-align: top;
                    font-size: 28/$ppr;
                    color: $main-color;
                    text-align: center;
                    line-height: 30/$ppr;
                }
            }
            .adr-des {
                margin-top: 12/$ppr;
                color: $text-666;
                font-size: 24/$ppr;
                span {
                    color: $main-color;
                }
            }
        }
        .productshop {
            padding: 20/$ppr 0;
            display: flex;
            align-items: center;
            .shop-pic {
                width: 80/$ppr;
                height: 80/$ppr;
                border-radius: 5/$ppr;
                border: 1/$ppr solid $border-color-e8e;
                overflow: hidden;
                margin-right: 20/$ppr;
                img {
                    width: 100%;
                    height: 100%;
                }
            }
            .shop-con {
                flex: 1;
                font-size: 28/$ppr;
            }
        }
    }
    .pop-det-coupoon {
        padding: 20/$ppr;
    }
    /*秒杀*/
    .m-details-seckill {
        min-height: 100/$ppr;
        width: 100%;
        background: #f61d4a;
        padding: 14/$ppr 20/$ppr;
        display: flex;
        justify-content: space-between;
        .seckill-pri {
            color: #fff;
            font-size: 24/$ppr;
            .n-pri {
                display: inline-block;
                em {
                    font-size: 50/$ppr;
                    line-height: 40/$ppr;
                    display: inline-block;
                    vertical-align: baseline;
                }
            }
            .d-pri {
                margin-left: 12/$ppr;
                color: #fe9898;
            }
            .s-price {
                line-height: 1;
                font-size: 24/$ppr;
                margin-top: 8/$ppr;
            }
        }
        .seckill-time {
            .time-count {
                margin-top: 6/$ppr;
                height: 24/$ppr;
                text-align: center;
            }
            .xe-icon-miaosha {
                width: 24/$ppr;
                height: 24/$ppr;
                background: #fff75a;
                display: inline-block;
                font-size: 20/$ppr;
                display: inline-flex;
                justify-content: center;
                align-items: center;
                color: #f51d4c;
                border-radius: 3/$ppr;
                margin-right: 10/$ppr;
                vertical-align: top;
            }
            .time-text {
                display: inline-flex;
                align-items: center;
                font-size: 24/$ppr;
                height: 24/$ppr;
                line-height: 24/$ppr;
                color: #fff959;
                vertical-align: top;
            }
            .time-progress {
                margin-top: 15/$ppr;
                text-align: center;
                p {
                    display: inline-block;
                    vertical-align: top;
                    width: 210/$ppr;
                    height: 24/$ppr;
                    background: #ffcf0d;
                    border-radius: 12/$ppr;
                    position: relative;
                    overflow: hidden;
                    text-align: left;
                    span {
                        display: inline-block;
                        height: 24/$ppr;
                        background: #fef85a;
                        border-radius: 12/$ppr;
                        z-index: 3;
                    }
                    em {
                        position: absolute;
                        left: 0;
                        top: 0;
                        bottom: 0;
                        right: 0;
                        text-align: center;
                        z-index: 4;
                        color: #f61c4e;
                        font-size: 20/$ppr;
                        line-height: 24/$ppr;
                    }
                }
            }
        }
        // 预售
        &.m-det-presale {
            padding-top: 10/$ppr;
            .pre-det-tips {
                margin-top: 5/$ppr;
                font-size: 24/$ppr;
                color: #fff;
                span {
                    font-size: 26/$ppr;
                }
            }
            .time-count {
                margin-top: 10/$ppr;
            }
            .currency-price {
                .small {
                    font-size: 24/$ppr;
                }
                .normal {
                    font-size: 50/$ppr;
                    line-height: 1;
                }
            }
        }
    }
    .det-tocart.add,.m-details-btns .det-btns .det-tocart{background: rgb(255,150,0)}
    .m-details-btns .det-btns .det-tobuy{background: rgb(255,45,19)}
    .m-details-item .productspec .spec-con .spec-con-ul li {    border: 0.02rem solid #fff;}
</style>
