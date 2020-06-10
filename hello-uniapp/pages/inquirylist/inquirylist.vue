<template>
    <xe-layout class="m-bg-dark m-flexlay">
        <div class="inquirylist-nav m-content-div" slot='header'>
            <xe-navtab-con ref="navTab" :itemData="navListData" @swiperItemClick="swiperItemClick"></xe-navtab-con>
        </div>
        <div class="m-content-div">
            <template v-if="inquiryType === 0">
                <xe-checkbox-group v-model="checkedPros">
                    <div class="m-inquiry-item" v-for="(item, index) in inquirysheetList" :key="item.inquirysheetCode">
                    <div class="m-inquiry-tit">
                        <div class="left">
                            <xe-checkbox :label="item.inquirysheetCode">编号: {{item.inquirysheetCode}}</xe-checkbox>
                        </div>
                        <!--<div class="right">人顶起人顶起</div>-->
                    </div>
                    <div class="m-inquiry-pro">
                        <router-link :to="{name: 'ProductDetails', params: {prospu: item.proSpu}, query: {prosku: item.productSku}}" class="m-product-item">
                            <div class="pic">
                                <img v-lazy="picServer + item.proMainImg" alt="">
                            </div>
                            <div class="msg">
                                <div class="msg-con">
                                    <div class="name">
                                        <p v-html="item.productName"></p>
                                    </div>
                                    <div class="vendor">
                                        {{item.shopName ? item.shopName : item.venName}}
                                    </div>
                                    <div class="msg-scon">
                                        <div class="qutaliy">{{item.minQuantity}}{{item.proUnit}}起订 ({{item.productSpecifications}})</div>
                                        <!--<div class="marketPri">-->
                                            <!--&yen;{{item.unitPrice}}/{{item.proUnit}}-->
                                        <!--</div>-->
                                        <div class="price" v-if="item.priceMethod !== 3">
                                            &yen;<span class="big-price">{{item.skuPrice | toFixed2}}</span><span class="unit">/{{item.proUnit}}</span>
                                        </div>
                                        <div class="price" v-else>
                                            面议
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </router-link>
                    </div>
                    <div class="det-inquiry-item">
                        <div class="item">
                            <div class="item-left">采购数量</div>
                            <div class="item-right">
                                <div class="num-con">
                                    <InputNumber
                                        v-model="item.productCount"
                                        :min="item.minQuantity"
                                        :max="item.saleQuantity"
                                    ></InputNumber>
                                </div>
                            </div>
                        </div>
                        <div class="item">
                            <div class="item-left">采购询价</div>
                            <div class="item-right">
                                <template v-if="item.priceMethod !== 3">
                                    <input maxlength="8" type="number" v-model.number="item.proPrice" @blur="item.proPrice = Number(Math.abs(parseFloat(item.proPrice)).toFixed(2))" placeholder="请输入价格" class="inquiry-input"><span>元/{{item.proUnit}}</span>
                                </template>
                                <template v-else>
                                    <input maxlength="8" type="number" v-model.number="item.myprice" @blur="item.myprice = Number(Math.abs(parseFloat(item.myprice)).toFixed(2))" placeholder="请输入价格" class="inquiry-input"><span>元/{{item.proUnit}}</span>
                                </template>
                            </div>
                        </div>
                        <div class="item">
                            <div class="item-left">询价类型</div>
                            <div class="item-right">
                                <xe-radio-group v-model="item.inquiryType">
                                    <div class="clearfix" v-if="item.deliveryType === 1">
                                        <div class="fl radio-item"><xe-radio :label="1">配送价</xe-radio></div>
                                    </div>
                                    <div class="clearfix" v-else-if="item.deliveryType === 2">
                                        <div class="fl radio-item"><xe-radio :label="0">自提价</xe-radio></div>
                                    </div>
                                    <div class="clearfix" v-else>
                                        <div class="fl radio-item"><xe-radio :label="1">配送价</xe-radio></div>
                                        <div class="fl radio-item"><xe-radio :label="0">自提价</xe-radio></div>
                                    </div>
                                </xe-radio-group>
                            </div>
                        </div>
                    </div>
                    <v-touch v-if="adrDatas.length" class="det-inquiry-item det-inquiry-itemadr" tag="div" @tap="adrVisibleFn(item)">
                        <div class="arrow-right-commons">
                            <div class="item">
                                <div class="item-left">收货人</div>
                                <div class="item-right">{{item.conName}} {{item.conPhone}}</div>
                            </div>
                            <div class="item">
                                <div class="item-left">收货地址</div>
                                <div class="item-right">
                                    <div class="item-right-adr">{{item.deliveryAddress}}</div>
                                </div>
                            </div>
                        </div>
                    </v-touch>
                    <div class="m-inquiry-add" v-else>
                        <mt-button type="primary" size="small" class="xe-button-primary is-radius" plain @click.prevent="navToAddNewAdr">+ 新增地址</mt-button>
                    </div>
                </div>
                </xe-checkbox-group>
            </template>
            <template v-else>
                <xe-checkbox-group v-if="inquirysheetList.length" v-model="checkedPros" @change="checkedProsFn">
                    <div class="m-inquiry-item" v-for="(item, index) in inquirysheetList" :key="item.inquirysheetCode">
                        <div class="m-inquiry-tit">
                            <div class="left">
                                <xe-checkbox :label="item.inquirysheetCode">编号: {{item.inquirysheetCode}}</xe-checkbox>
                            </div>
                            <div class="right countime" v-if="inquiryType === 1">
                                <p><em class="xe-iconfont xe-icon-tc"></em><xe-countdown :time="item.residueTime" timetype="second" format="{%h}时{%m}分{%s}秒"></xe-countdown></p>
                            </div>
                            <div class="right" v-else><span class="red">{{item.inquiryStatus | inquiryStatusToText}}</span></div>
                        </div>
                        <div class="m-inquiry-pro">
                            <router-link :to="{name: 'ProductDetails', params: {prospu: item.proSpu}, query: {prosku: item.productSku}}" class="m-product-item">
                                <div class="pic">
                                    <img v-lazy="picServer + item.proMainImg" alt="">
                                </div>
                                <div class="msg">
                                    <div class="msg-con">
                                        <div class="name">
                                            <p v-html="item.productName"></p>
                                        </div>
                                        <div class="vendor">
                                            {{item.shopName ? item.shopName : item.venName}}
                                        </div>
                                        <div class="msg-scon" v-if="inquiryType === 1 || inquiryType === 4 || item.inquiryStatus === 6">
                                            <div class="qutaliy">采购数量：{{item.productCount}}{{item.proUnit}}</div>
                                            <div class="price">
                                                商家报价：&yen;<span class="big-price">{{item.agreePrice | toFixed2}}</span><span class="unit">/{{item.proUnit}}</span>
                                            </div>
                                        </div>
                                        <div class="msg-scon" v-else>
                                            <div class="qutaliy">{{item.minQuantity}}{{item.proUnit}}起订 ({{item.productSpecifications}})</div>
                                            <!--<div class="marketPri">-->
                                            <!--&yen;{{item.unitPrice}}/{{item.proUnit}}-->
                                            <!--</div>-->
                                            <div class="price" v-if="item.priceMethod !== 3">
                                                &yen;<span class="big-price">{{item.skuPrice | toFixed2}}</span><span class="unit">/{{item.proUnit}}</span>
                                            </div>
                                            <div class="price" v-else>
                                                面议
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </router-link>
                        </div>
                        <CollapseTransition>
                            <div v-show="item.showFlag">
                                <div class="m-inquiry-msg">
                                    <template v-if="item.inquiryStatus !== 5 && item.inquiryStatus !== 3 && item.inquiryStatus !== 7">
                                        <div>
                                            <div>商品规格</div>
                                            <div>{{item.productSpecifications}}</div>
                                        </div>
                                        <div>
                                            <div>起订量</div>
                                            <div>{{item.minQuantity}}{{item.proUnit}}</div>
                                        </div>
                                    </template>
                                    <template v-if="item.inquiryStatus === 5 || item.inquiryStatus === 3 || item.inquiryStatus === 7">
                                        <div>
                                            <div>采购数量</div>
                                            <div>{{item.productCount}}{{item.proUnit}}</div>
                                        </div>
                                    </template>
                                    <div v-else>
                                        <div>参考价</div>
                                        <div v-if="item.priceMethod !== 3">&yen;{{item.skuPrice | toFixed2}}/{{item.proUnit}}</div>
                                        <div v-else>面议</div>
                                    </div>
                                    <div>
                                        <div>采购询价</div>
                                        <div>&yen;{{item.proPrice | toFixed2}}/{{item.proUnit}}</div>
                                    </div>
                                    <div>
                                        <div>询价类型</div>
                                        <div>{{item.inquiryType | inquiryTypeToText}}</div>
                                    </div>
                                </div>
                                <div class="m-inquiry-msg border" v-if="item.inquiryStatus === 7">
                                    <div>
                                        <div style="white-space: nowrap;line-height: 1.4">驳回原因:</div>
                                        <div style="line-height: 1.4">{{item.rejectReason ? item.rejectReason : '无'}}</div>
                                    </div>
                                </div>
                                <div class="det-inquiry-item det-inquiry-itemadr">
                                    <div>
                                        <div class="item">
                                            <div class="item-left">收货人</div>
                                            <div class="item-right">{{item.conName}} {{item.conPhone}}</div>
                                        </div>
                                        <div class="item">
                                            <div class="item-left">收货地址</div>
                                            <div class="item-right">
                                                <div class="item-right-adr">{{item.deliveryAddress}}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CollapseTransition>
                        <div class="m-inquiry-zk" :class="{'active': item.showFlag}" @click.prevent="zkfn(item)">
                            {{item.showFlag ? '收起' : '展开'}} <span class="xe-iconfont xe-icon-unfold"></span>
                        </div>
                    </div>
                </xe-checkbox-group>
            </template>
        </div>
        <infinite-loading :on-infinite="onInfinite" ref="infiniteLoading" class="infinite-contanier">
            <span slot="no-more" class="infinite-no-more">
                暂无更多数据~
            </span>
            <div slot="no-results" class="m-cart-none">
                <div class="pic">
                    <img src="../../static/images/cart-n1.png" alt="">
                </div>
                <div class="des">
                    <p class="f32">暂无询价单信息</p>
                </div>
                <div class="btn">
                    <mt-button class="xe-button-default" size="small" plain @click.prevent="toCategory">开始选购</mt-button>
                </div>
            </div>
        </infinite-loading>
        <template v-if="inquiryType === 0 && inquirysheetList.length">
            <!--待询价-->
            <div class="m-inquiry-btns" slot="footer">
                <div class="det-pri">
                    <span>合计：</span>&yen;{{totalPrice}}
                </div>
                <div class="det-btns">
                    <div class="det-tocart" @click.prevent="delInquiryList">删除</div>
                    <div class="det-tobuy xe-gradient-color" @click.prevent="sendInquiry">询价<span v-show="checkedPros.length">({{checkedPros.length}})</span></div>
                </div>
                <!--<div class="det-btn-tips">-->
                <!--当前区域暂不支持配送-->
                <!--</div>-->
            </div>
        </template>
        <template v-if="inquiryType === 1 && inquirysheetList.length">
            <!--待询价-->
            <div class="m-inquiry-btns" slot="footer">
                <div class="det-pri">
                    <span>合计：</span>&yen;{{totalPrice}}
                </div>
                <div class="det-btns">
                    <div class="det-tocart" @click.prevent="delInquiryList">删除</div>
                    <div class="det-tobuy xe-gradient-color" @click.prevent="inquiryCheckOrder">去下单<span v-show="checkedPros.length">({{checkedPros.length}})</span></div>
                </div>
            </div>
        </template>
        <template v-if="(inquiryType === 2 || inquiryType === 4) && inquirysheetList.length">
            <!--已失效 已完成-->
            <div class="m-inquiry-btns" slot="footer">
                <div class="m-all-check">
                    <xe-checkbox size="large" v-model="checkedAll" @input="checkedAllFn">全选</xe-checkbox>
                </div>
                <div class="det-btns">
                    <div class="det-tocart" @click.prevent="delInquiryList">删除</div>
                    <div class="det-tobuy xe-gradient-color" @click.prevent="aginInquiry">再次询价</div>
                </div>
            </div>
        </template>
        <template v-if="inquiryType === 3 && inquirysheetList.length">
            <!--询价中-->
            <div class="m-inquiry-btns align-right" slot="footer">
                <div class="m-all-check">
                    <xe-checkbox size="large" v-model="checkedAll" @input="checkedAllFn">全选</xe-checkbox>
                </div>
                <div class="det-btns det-btns-3">
                    <div class="det-tocart" @click.prevent="delInquiryList">取消</div>
                </div>
            </div>
        </template>
        <!--选择地址-->
        <xe-popup
            slot="outer"
            ref="adrInstance"
            :show.sync="adrVisible"
            popupTit="选择地址"
            position="bottom">
            <ChooseAdrItem :adrDatas="adrDatas" @on-adr-change="adrChangeFn" @on-click-toadd="toAddFn" :defaultCaId="defaultCaId"></ChooseAdrItem>
        </xe-popup>
        <xe-popup
            slot="outer"
            ref="refAddnewadrIns"
            :show.sync="adrshowflag"
            popupTit="新建地址"
            size="large"
            position="bottom">
            <addnewadr ref="refAddnewadr"></addnewadr>
        </xe-popup>
    </xe-layout>
</template>
<script type="text/ecmascript-6">
    import InfiniteLoading from 'vue-infinite-loading';
    import CollapseTransition from 'utils/collapse-transition';
    import {xeNavTabCon} from 'components/xeNavTab';
    import {Radio, RadioGroup} from 'components/Radio/';
    import {Checkbox, CheckboxGroup} from 'components/Checkbox';
    import proItem from 'components/ProItem/ProItem';
    import ChooseAdrItem from 'pages/productdetails/ChooseAdrItem';
    import InputNumber from 'components/InputNumber/InputNumber';
    import {Popup} from 'components/Popup';
    import {CountDown} from 'components/CountDown';
    import addnewadr from 'pages/addnewadr/addnewadr';
    import axios from 'axios';
    export default {
        beforeRouteEnter(to, from, next) {
            next(vm => {
                let type = to.query.type || parseInt(to.query.type) === 0 ? parseInt(to.query.type) : 0;
                vm.inquiryType = type;
                vm.$refs.navTab.setDefault(type);
            });
        },
        data() {
            return {
                radio2: 2,
                checked1: false,
                checkedInquirys: [],
                adrVisible: false,
                picServer: '',
                adrDatas: [],
                navListData: [
                    {
                        name: '待询价',
                        id: 0
                    },
                    {
                        name: '询价中',
                        id: 3
                    },
                    {
                        name: '已报价',
                        id: 1
                    },
                    {
                        name: '已完成',
                        id: 4
                    },
                    {
                        name: '已失效',
                        id: 2
                    }
                ],
                inquiryType: 1,
                pageNum: 1,
                cancel: '',
                defaultCaId: '',
                closeFlag: false,
                checkedPros: [],
                tempItem: null,
                checkedAll: false,
                inquirysheetList: [],
                adrshowflag: false
            };
        },
        created() {
            console.log('resetsss');
        },
        activated() {
            console.log('activated');
//            let nowRegionMap = JSON.parse(this.$getLocalStorage('REGIONMAP'));
//            this.cityName = nowRegionMap.cityName;
//            this.cityId = nowRegionMap.areaId;
            this.pageNum = 1;
            this.checkedPros = [];
            this.adrDatas = [];
            this.checkedAll = false;
            this.inquirysheetList = [];
            this.$nextTick(() => {
                this.$refs.infiniteLoading.$emit('$InfiniteLoading:reset');
            });
        },
        deactivated() {
            console.log('deactivated');
        },
        methods: {
            adrVisibleFn(item) {
                this.tempItem = item;
                this.defaultCaId = item.caId;
                this.adrVisible = true;
            },
            toAddFn() {
                this.adrVisible = false;
                this.adrshowflag = true;
                console.log(this.tempItem);
                this.$refs.refAddnewadr.insertAddress((data) => {
                    this.tempItem.caProvince = data.caProvName;
                    this.tempItem.caCity = data.caCityName;
                    this.tempItem.caArea = data.caAreaName;
                    this.tempItem.caId = data.caId;
                    this.tempItem.caStreet = data.caStreet;
                    this.tempItem.conName = data.caConsignee;
                    this.tempItem.conPhone = data.caPhone;
                    this.adrshowflag = false;
                    this.adrDatas.unshift({
                        caArea: data.caArea,
                        caAreaName: data.caAreaName,
                        caCity: data.caCity,
                        caCityName: data.caCityName,
                        caConsignee: data.caConsignee,
                        caId: data.caId,
                        caPhone: data.caPhone,
                        caProvName: data.caProvName,
                        caProvince: data.caProvince,
                        caStreet: data.caStreet,
                        defAddr: data.defAddr,
                        shopName: data.shopName
                    });
                });
            },
            swiperItemClick(item) {
                console.log(item);
                if (this.cancel) {
                    // 取消未完成的ajax请求
                    this.cancel();
                };
                this.$router.replace({name: 'InquiryList', query: {'type': item.id}});
                this.inquiryType = item.id;
                this.pageNum = 1;
                this.inquirysheetList = [];
                this.checkedAll = false;
                this.checkedPros = []; // 清空选中
                this.$nextTick(() => {
                    this.$refs.infiniteLoading.$emit('$InfiniteLoading:reset');
                });
            },
            onInfinite() {
                this.queryInquiryList();
            },
            queryInquiryList() {
                let _this = this;
                let CancelToken = axios.CancelToken;
                this.$http({
                    cancelToken: new CancelToken(function executor(c) {
                        // An executor function receives a cancel function as a parameter
                        _this.cancel = c;
                    }),
                    method: 'post',
                    url: '/xe-route/xe-app/mobile/inquiry/queryInquiryList',
                    data: {
                        'quirySource': 3, // 询价单来源 1：android,2：ios,3：微信,4:pc,5：代客下单,6：其它
                        'pageNum': this.pageNum, // 当前页数
                        'inquiryStatus': this.inquiryType, // 询价状态 0、待报价 1、已报价（默认展示已报价） 2 、已驳回 3、已过期 4、已取消
                        'pageSize': 10 // 一页显示数据大小
                    }
                }).then(res => {
                    console.log(res);
                    if (!this.picServer) {
                        this.picServer = res.data.picServer;
                    }
                    if (res.data.addressList && res.data.addressList.length) {
                        this.adrDatas = res.data.addressList;
                    }
                    if (res.data.pageInfo.total === 0) {
                        // 无商品时
                        this.$refs.infiniteLoading.$emit('$InfiniteLoading:complete');
                    } else {
                        if (res.data.inquirysheetList.length > 0) {
                            let datas = res.data.inquirysheetList;
                            if (this.inquiryType === 0) {
                                datas.forEach(item => {
                                    if (item.deliveryType === 1) {
                                        item.inquiryType = 1;
                                    } else if (item.deliveryType === 2) {
                                        item.inquiryType = 0;
                                    } else if (item.deliveryType === 3) {
                                        if (item.inquiryType === null) {
                                            item.inquiryType = 1;
                                        }
                                    }
                                    if (item.priceMethod === 3) {
                                        item.myprice = '';
                                    }
                                    // 选择地址逻辑
                                    let flag = true;
                                    this.adrDatas.some(adritem => {
                                        if (item.caId === adritem.caId) {
                                            // 地址列表没有这个地址
                                            flag = false;
                                            return true;
                                        }
                                    });
                                    if (flag && this.adrDatas.length) {
                                        item.deliveryAddress = `${this.adrDatas[0].caProvName}${this.adrDatas[0].caCityName}${this.adrDatas[0].caAreaName}${this.adrDatas[0].caStreet}`;
                                        item.conPhone = this.adrDatas[0].caPhone;
                                        item.conName = this.adrDatas[0].caConsignee;
                                        item.caId = this.adrDatas[0].caId;
                                    }
                                });
                            }
                            this.inquirysheetList.push(...datas);
                            this.pageNum++;
                            this.$refs.infiniteLoading.$emit('$InfiniteLoading:loaded');
                        } else {
                            // 所有商品都加载完时
                            this.$refs.infiniteLoading.$emit('$InfiniteLoading:complete');
                        }
                    }
                }).catch(error => {
                    console.log(error);
                    if (error.status === 'cancel') {
                        this.$refs.infiniteLoading.$emit('$InfiniteLoading:reset');
                        return;
                    }
                    this.$refs.infiniteLoading.$emit('$InfiniteLoading:complete');
                });
            },
            adrChangeFn(item) {
                console.log(123123123123);
                console.log(item);
                console.log(123123123123);
                this.tempItem.caId = item.caId;
                this.tempItem.deliveryAddress = item.caProvName + item.caCityName + item.caAreaName + item.caStreet;
                this.tempItem.conName = item.caConsignee;
                this.tempItem.conPhone = item.caPhone;
                this.adrVisible = false;
            },
            zkfn(item) {
                this.$set(item, 'showFlag', !item.showFlag);
            },
            sendInquiry() {
                if (!this.checkedPros.length) {
                    this.$toast({
                        message: `请选择要询价的商品`,
                        duration: 1500
                    });
                    return;
                }
                let flagarr = [];
                this.getCheckedProsItem.forEach(item => {
                    if (item.priceMethod === 3 && !item.myprice) {
                        flagarr.push(item.inquirysheetCode);
                    }
                    if (!item.proPrice) {
                        flagarr.push(item.inquirysheetCode);
                    }
                });
                if (flagarr.length) {
                    this.$toast({
                        message: `请填写采购询价`,
                        duration: 1500
                    });
                    return;
                }
                this.$xeMessageBox.confirm(`确认询价选中的商品？`).then(() => {
                    console.log(this.getCheckedProsItem);
                    this.$indicator.open(`发送询价中...`);
                    let result = [];
                    this.getCheckedProsItem.forEach(item => {
                        let obj = {
                            'inqCode': item.inquirysheetCode, // 询价单编号
                            'caId': item.caId, // 地址id
                            'caIdNew': item.caId, // 新的地址id
                            'productSku': item.productSku, // sku
                            'inquiryType': item.inquiryType, // 询价类型（0 自提价 1 到岸价 ）
                            'quirySource': 3, // 询价单来源 1：android,2：ios,3：微信,4:pc,5：代客下单,6：其它
                            'proPrice': item.priceMethod === 3 ? item.myprice : item.proPrice, // 商品询价价格
                            'productCount': item.productCount  // 商品询价数量
                        };
                        result.push(obj);
                    });
                    this.$http({
                        method: 'post',
                        url: '/xe-route/xe-app/mobile/inquiry/sendInquiry',
                        data: {
                            pros: result
                        }
                    }).then(res => {
                        console.log(res);
                        this.delInquiryByCode(this.checkedPros);
                        this.$indicator.close();
                    }).catch(error => {
                        console.log(error);
                        this.$indicator.close();
                    });
                }).catch(error => {
                    console.log(error);
                });
            },
            inquiryCheckOrder() {
                if (!this.checkedPros.length) {
                    this.$toast({
                        message: `请选择商品`,
                        duration: 1500
                    });
                    return;
                }
                this.$xeMessageBox.confirm(`确认购买选中的商品？`).then(() => {
                    console.log(this.getCheckedProsItem);
                    this.$router.push({name: 'ConfirmInqOrder', query: {inquirysheetCodes: this.checkedPros.join(',')}});
                }).catch(error => {
                    console.log(error);
                });
            },
            aginInquiry() {
                if (!this.checkedPros.length) {
                    this.$toast({
                        message: `请选择商品`,
                        duration: 1500
                    });
                    return;
                }
                this.$xeMessageBox.confirm(`确认再次询价已选中的商品吗?`).then(() => {
                    this.$indicator.open(`生成询价单中...`);
                    this.$http({
                        method: 'post',
                        url: '/xe-route/xe-app/mobile/inquiry/aginInquiry',
                        data: {
                            inquirysheetCode: this.checkedPros.join(','),
                            quirySource: 3
                        }
                    }).then(res => {
                        this.$indicator.close();
                        this.$toast({
                            message: '再次询价成功',
                            duration: 1500
                        });
                        this.checkedAll = false;
                        this.checkedPros = []; // 清空选中
//                        this.delInquiryByCode(this.checkedPros);
                    }).catch(error => {
                        console.log(error);
                        this.$indicator.close();
                    });
                }).catch(error => {
                    console.log(error);
                });
            },
            delInquiryList() {
                if (!this.checkedPros.length) {
                    this.$toast({
                        message: `请选择要${this.inquiryType === 3 ? '取消' : '删除'}的询价单`,
                        duration: 1500
                    });
                    return;
                }
                this.$xeMessageBox.confirm(`确认${this.inquiryType === 3 ? '取消' : '删除'}选中的询价单？`).then(() => {
                    this.$indicator.open(`${this.inquiryType === 3 ? '取消' : '删除'}询价中...`);
                    this.$http({
                        method: 'post',
                        url: '/xe-route/xe-app/mobile/inquiry/cancelInquiry',
                        data: {
                            inquirysheetCode: this.checkedPros.join(','),
                            quirySource: 3,
                            inquiryStatus: this.inquiryType
                        }
                    }).then(res => {
                        console.log(res);
                        this.delInquiryByCode(this.checkedPros);
                        this.checkedPros = [];
                        this.$indicator.close();
                    }).catch(error => {
                        console.log(error);
                        this.$indicator.close();
                    });
                }).catch(error => {
                    console.log(error);
                });
            },
            delInquiryByCode(codeArr) {
                let result = [];
                this.inquirysheetList.forEach((item, index) => {
                    if (codeArr.indexOf(item.inquirysheetCode) < 0) {
                        result.push(item);
                    }
                });
                this.inquirysheetList = result;
                if (!this.inquirysheetList.length) {
                    this.$refs.infiniteLoading.$emit('$InfiniteLoading:reset');
                }
            },
            toCategory() {
                this.$router.push({
                    name: 'Category'
                });
            },
            navToAddNewAdr() {
                this.$router.push({
                    name: 'AddNewAdr',
                    query: {
                        redirectType: 1
                    }
                });
            },
            checkedProsFn(value) {
                let checkConunt = value.length;
                this.checkedAll = checkConunt === this.inquirysheetList.length;
            },
            checkedAllFn() {
                if (this.checkedAll) {
                    console.log('先中');
                    let result = [];
                    this.inquirysheetList.forEach(item => {
                        result.push(item.inquirysheetCode);
                    });
                    this.checkedPros = result;
                } else {
                    console.log('没有选中');
                    this.checkedPros = [];
                }
            }
        },
        computed: {
            getCheckedProsItem() {
                let result = [];
                if (this.checkedPros.length) {
                    this.inquirysheetList.forEach(item => {
                        if (this.checkedPros.indexOf(item.inquirysheetCode) >= 0) {
                            result.push(item);
                        }
                    });
                } else {
                    result = [];
                }
                return result;
            },
            totalPrice() {
                let result = 0;
                if (this.getCheckedProsItem.length > 0) {
                    if (this.inquiryType === 1) {
                        this.getCheckedProsItem.forEach(item => {
                            result += (item.agreePrice * item.productCount);
                        });
                    } else {
                        this.getCheckedProsItem.forEach(item => {
                            if (item.priceMethod === 3) {
                                console.log(item.myprice);
                                result += ((item.myprice ? item.myprice : 0) * item.productCount);
                            } else {
                                result += ((item.proPrice ? item.proPrice : 0) * item.productCount);
                            }
                        });
                    }
                    return parseFloat(result).toFixed(2);
                } else {
                    result = 0;
                }
                return 0;
            }
        },
        watch: {
//            checkedAll(val) {
//                if (val) {
//                    console.log('先中');
//                    let result = [];
//                    this.inquirysheetList.forEach(item => {
//                        result.push(item.inquirysheetCode);
//                    });
//                    this.checkedPros = result;
//                } else {
//                    console.log('没有选中');
//                    this.checkedPros = [];
//                }
//            }
        },
        components: {
            [xeNavTabCon.name]: xeNavTabCon,
            [Popup.name]: Popup,
            [Radio.name]: Radio,
            [RadioGroup.name]: RadioGroup,
            proItem,
            [Checkbox.name]: Checkbox,
            [CheckboxGroup.name]: CheckboxGroup,
            ChooseAdrItem,
            InputNumber,
            InfiniteLoading,
            CollapseTransition,
            [CountDown.name]: CountDown,
            addnewadr
        }
    };
</script>
<style rel="stylesheet/scss" lang="scss">
    @import '../../static/styles/rules.scss';
    .inquirylist-nav {
        height: 88/$ppr;
        background: #fff;
        .xe-navtab-con .swiper-slide {
            height: 88/$ppr;
            line-height: 88/$ppr;
            padding: 0 33/$ppr;
        }
    }
    .m-inquiry-item {
        margin: 20/$ppr 0;
        background: #fff;
        padding-left: 20/$ppr;
        &:last-child {
            margin-bottom: 0;
        }
        .m-inquiry-tit {
            min-height: 70/$ppr;
            padding: 20/$ppr 20/$ppr 20/$ppr 0;
            border-bottom: 1/$ppr solid $border-color-e8e;
            display: flex;
            align-items: center;
            justify-content: space-between;
            .left {
                font-size: 28/$ppr;
                color: $text-666;
                .van-checkbox__label {
                    font-size: 28/$ppr;
                    color: $text-333;
                }
            }
            .right {
                padding-left: 10/$ppr;
                font-size: 24/$ppr;
                white-space: nowrap;
            }
            .countime {
                color: $main-color;
                p {
                    font-size: 24/$ppr;
                    .xe-iconfont {
                        margin-right: 5/$ppr;
                        display: inline-block;
                        vertical-align: top;
                        font-size: 24/$ppr;
                    }
                }
            }
        }
        .m-inquiry-pro {
            margin-left: -20/$ppr;
            background: $bg-color-f5f;
            overflow: hidden;
        }
        .m-inquiry-msg {
            padding: 10/$ppr 20/$ppr 10/$ppr 0;
            &.border {
                 border-top: 1/$ppr solid $border-color-e8e;
             }
            > div {
                margin: 15/$ppr 0;
                display: flex;
                font-size: 28/$ppr;
                div {
                    &:nth-child(1) {
                         margin-right: 25/$ppr;
                    }
                }
            }
        }
        .m-inquiry-zk {
            height: 60/$ppr;
            line-height: 60/$ppr;
            font-size: 26/$ppr;
            color: $text-999;
            text-align: center;
            border-top: 1/$ppr solid $border-color-e8e;
            .xe-iconfont {
                width: 24/$ppr;
                height: 24/$ppr;
                display: inline-block;
                font-size: 24/$ppr;
                line-height: 1;
                vertical-align: top;
                margin-top: 18/$ppr;
                transition: all .3s ease;
            }
            &.active {
                .xe-iconfont {
                    transform: rotate(180deg);
                }
            }
        }
        .det-inquiry-item {
            background: #fff;
            overflow: hidden;
            margin: 0;
            padding-right: 20/$ppr;
            overflow: hidden;
            &.det-inquiry-itemadr {
                 padding: 15/$ppr 20/$ppr 15/$ppr 0;
                border-top: 1/$ppr solid $border-color-e8e;
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
        .m-inquiry-add {
            padding: 20/$ppr 0;
            text-align: center;
            border-top: 1/$ppr solid $border-color-e8e;
        }
        .red {
            color: $main-color;
        }
    }
    .m-inquiry-btns {
        display: flex;
        width: 100%;
        max-width: 750/$ppr;
        margin: 0 auto;
        height: 98/$ppr;
        z-index: 333;
        background: #fff;
        align-items: center;
        &.align-right {
            justify-content: space-between;
        }
        .m-all-check {
            flex: 1;
            max-width: 52%;
            padding:20/$ppr;
            .van-checkbox__label {
                font-size: 28/$ppr;
                margin-left: 50/$ppr;
            }
        }
        .det-pri {
            flex: 1;
            max-width: 52%;
            padding: 20/$ppr;
            font-size: 32/$ppr;
            color: $main-color;
            height: 97/$ppr;
            border-top: 1/$ppr solid $border-color-e8e;
            line-height: 57/$ppr;
            span {
                color: $text-333;
                font-size: 28/$ppr;
            }
        }
        .det-btns {
            display: flex;
            flex: 1;
            &.det-btns-3 {
                flex: 0 0 210/$ppr;
                .det-tocart {
                    background: #fff;
                    border-left: 1/$ppr solid $border-color-e8e;
                    color: $text-333;
                }
            }
            > div {
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
    .m-addnewAdr {
        position: absolute;
        left: 0;
        top:0;
        bottom:0;
        right:0;
        z-index: 444;
    }
</style>
