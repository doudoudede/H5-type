<template>
    <xe-layout class="m-bg-dark m-flexlay">
        <div class="fillTheBidInfor">
            <div class="auction-endTimeshow">
                <span class="xe-iconfont xe-icon-jingpai"></span>
                &nbsp;正在竞价&nbsp;&nbsp;距结束 <xe-countdown timetype="second" :time="+this.$route.query.disEndTime">
                    <span><u>{%d}</u><i>天</i></span><span><u>{%h}</u><i>时</i></span><span><u>{%m}</u><i>分</i></span><span><u>{%s}</u><i>秒</i></span>
                </xe-countdown>
            </div>
            <div class="fillBidInfor-content">
                <ul>
                    <li>
                        <div class="labs-how">竞拍价格</div>
                        <div class="loab-con">
                            <input type="text" :maxlength="10" v-model="formData.bidPrice" @blur="inpuNumberFun($event)" placeholder="请输入">
                        </div>
                    </li>
                    <li  class="sty-padi">
                        <div class="labs-how"></div>
                        <div class="loab-con">
                            <xe-radio-group v-model="formData.currency" @change="currencyChange">
                                <xe-radio v-for="(item, index) in currencyList" :key="index" :label="item.id">{{item.name}}</xe-radio>
                            </xe-radio-group>
                        </div>
                    </li>
                    <li>
                        <div class="labs-how">竞拍数量</div>
                        <div class="loab-con">
                            <input type="tel" :maxlength="3" @blur="inpubidNumFun($event)"  v-model="formData.bidNum" :placeholder="bidNumplaceholder">
                        </div>
                    </li>
                    <li>
                        <div class="labs-how">提货港口</div>
                        <div class="loab-con">
                            <label for="portId">
                                <select v-model="formData.portId" placeholder="请选择" id="portId">
                                    <option value="" disabled>请选择</option>
                                    <option v-for="(item, index) in portList" :key="index" :value="item.id">{{item.name}}</option>
                                </select>
                                <div class="arrow-sp arrow-right-commons" for="portId"></div>
                            </label>
                        </div>
                    </li>
                    <li v-if="formData.portId === 7">
                        <div class="labs-how"></div>
                        <div class="loab-con">
                            <input type="text" :maxlength="20" v-model="formData.portInfo" placeholder="请备注提货港口">
                        </div>
                    </li>
                    <li v-if="shipmentList.length">
                        <div class="labs-how">选择船期</div>
                        <div class="loab-con">
                            <label for="shipment">
                                <select name="" v-model="formData.shipment" id="shipment">
                                    <option value="" disabled selected>请选择</option>
                                    <option v-for="(item, index) in shipmentList" :key="index" :value="item">{{item}}月</option>
                                </select>
                                <div class="arrow-sp arrow-right-commons"></div>
                            </label>
                        </div>
                    </li>
                </ul>
            </div>
            <div class="m-login-xy read-only">
                <xe-checkbox v-model="checkBox">
                    <div class="con">我已阅读并同意
                        <router-link :to="{name: 'bidRules'}">《如来云商招标投标活动管理规则》</router-link>
                        <router-link :to="{name: 'biddingAgreement'}">《招标服务协议》</router-link>
                        <router-link :to="{name: 'bidAgreement'}">《竞标服务协议》</router-link>
                    </div>
                </xe-checkbox>
            </div>
            <div class="auction-footer-btn">
                <mt-button class="xe-button-white" @click.prevent="goBackFn()">取消竞价</mt-button>
                <mt-button class="xe-button-primary xe-button-5230" :disabled='!checkBox' @click.prevent="formSubmit">确定竞价</mt-button>
            </div>
        </div>
    </xe-layout>
</template>
<script type="text/ecmascript-6">
    import {Radio, RadioGroup} from 'components/Radio';
    import {Checkbox, CheckboxGroup} from 'components/Checkbox';
    import {CountDown} from 'components/CountDown';
    import comFun from '@/filters/index';
    import device from 'utils/device';
    import {mapState, mapActions} from 'vuex';
    export default {
        data() {
            return {
                shipType: '',
                checkBox: true,
                currencyList: [
                    {
                        id: 2,
                        name: '美元'
                    },
                    {
                        id: 1,
                        name: '人民币'
                    }
                ],
                portList: [
                    {
                        id: 1,
                        name: '大连港'
                    },
                    {
                        id: 2,
                        name: '天津港'
                    },
                    {
                        id: 3,
                        name: '青岛港'
                    },
                    {
                        id: 4,
                        name: '郑州港'
                    },
                    {
                        id: 5,
                        name: '上海港'
                    },
                    {
                        id: 6,
                        name: '盐田港'
                    },
                    {
                        id: 7,
                        name: '其他'
                    }
                ],
                toastFlag: null,
                formData: {
                    bidId: '',                          // 竞拍编号
                    bidPrice: '',                       // 竞拍金额
                    currency: 2,                       // 货币种类：1、人民币；2、美元
                    bidNum: '',                         // 竞拍数量
                    portId: '',                         // 提货港口编号 1大连港、2天津港、3青岛港、4郑州港、5上海港、6盐田港、7其他
                    portName: '',                       // 提货港口名称
                    portInfo: '',                       // 港口备注
                    shipment: '',                       // 期望船期
                    proUnit: ''
                }
            };
        },
        created() {
            let xeBridgeTime = null;
            // 轮询查找app未加载到的方法 方法获取到定时关闭
            if (!device.isWeixin) {
                xeBridgeTime = setInterval(() => {
                    if (window.xeBridge) {
                        clearInterval(xeBridgeTime);
                        window.xeBridge.getParams();
                    }
                }, 300);
            }
            console.log('this.biddingProData.biddingObj', this.biddingProData.biddingObj);
            if (!this.biddingProData.biddingObj.bidId) {
                console.log('999');
                let biddingPro = JSON.parse(this.$getLocalStorage('biddingPro'));
                this.setBiddingPro(biddingPro);
            }
            console.log('进入竞拍编辑');
        },
        mounted() {
            // 与app交互获取数据
            this.$bus.$on('getParams', val => {
                this.setBiddingPro(val);
                this.$setLocalStorage('biddingPro', JSON.stringify(val));
            });
        },
        methods: {
            ...mapActions(['setBiddingPro']),
            inpuNumberFun(e) {
                let values = parseFloat(e.target.value);
                if (!Object.is(values, NaN)) {
                    switch (this.formData.currency) {
                        case 1:
                            // e.target.value = comFun.moneySkinToText(values, 'rmbs');
                            this.formData.bidPrice = comFun.moneySkinToText(values, 'rmbs');
                            break;
                        case 2:
                            // e.target.value = comFun.moneySkinToText(values, 'dollars');
                            this.formData.bidPrice = comFun.moneySkinToText(values, 'dollars');
                            break;
                        default:
                            this.formData.bidPrice = comFun.moneySkinToText(values, 'rmbs');
                    }
                } else {
                    e.target.value = '';
                    this.formData.bidPrice = '';
                    // this.$toast('请输入数字');
                }
            },
            inpubidNumFun(e) {
                let values = parseFloat(e.target.value);
                if (!Object.is(values, NaN)) {
                    this.formData.bidNum = values.toFixed(0);
                } else {
                    e.target.value = '';
                    this.formData.bidNum = '';
                    // this.$toast('请输入数字');
                }
            },
            currencyChange() {
                this.formData.bidPrice = '';
            },
            formSubmit() {
                let errObj = {
                    bidPrice: '请填写竞拍金额',                       // 竞拍金额
                    bidNum: '请填写竞拍数量',                         // 竞拍数量
                    portId: '请选择提货港口'
                };
                if (this.shipmentList.length) {
                    errObj.shipment = '请选择期望船期';
                }
                let flag = false;
                Object.keys(errObj).find(item => {
                    if (!this.formData[item]) {
                        flag = false;
                        this.$toast(errObj[item]);
                        return true;
                    }
                    if (item === 'bidPrice') {
                        console.log('+this.formData.bidPrice', +this.formData.bidPrice);
                        if (+this.formData.bidPrice <= 0) {
                            this.$toast('竞拍金额不能为小于0的数字');
                            flag = false;
                            return true;
                        } else {
                            switch (this.formData.currency) {
                                case 1:
                                    if (this.formData.bidPrice <= this.biddingProData.biddingObj.startPriceRmb) {
                                        this.formData.bidPrice = '';
                                        this.toastFlag = this.$toast(`竞拍价格要大于起拍价￥${this.biddingProData.biddingObj.startPriceRmb}`);
                                        flag = false;
                                        return true;
                                    }
                                    break;
                                case 2:
                                    if (this.formData.bidPrice <= this.biddingProData.biddingObj.startPriceDoller) {
                                        this.formData.bidPrice = '';
                                        this.toastFlag = this.$toast(`竞拍价格要大于起拍价$${this.biddingProData.biddingObj.startPriceDoller}`);
                                        flag = false;
                                        return true;
                                    }
                                    break;
                                default:
                                    if (this.formData.bidPrice <= this.biddingProData.biddingObj.startPriceRmb) {
                                        this.formData.bidPrice = '';
                                        this.toastFlag = this.$toast(`竞拍价格要大于起拍价￥${this.biddingProData.biddingObj.startPriceRmb}`);
                                    }
                            }
                        }
                        flag = true;
                    }
                    if (item === 'bidNum') {
                        if (+this.formData.bidNum <= 0) {
                            this.$toast('竞拍数量不能为小于0的数字');
                            flag = false;
                            return true;
                        } else {
                            if (this.formData.bidNum > this.biddingProData.biddingObj.bidQuantity) {
                                this.formData.bidNum = '';
                                this.toastFlag = this.$toast(`竞拍数量不能大于竞品库存${this.biddingProData.biddingObj.bidQuantity}`);
                                flag = false;
                                return true;
                            }
                        }
                        flag = true;
                    }
                    if (this.formData.portId === 7) {
                        if (this.formData.portInfo === '') {
                            this.$toast('请填写港口备注');
                            flag = false;
                            return true;
                        }
                        flag = true;
                    }
                    flag = true;
                });
                if (flag) {
                    this.addBidRecord();
                }
            },
            addBidRecord() {
                let params = {};
                let biddingObj = this.biddingProData.biddingObj;
                params = this.formData;
                params.bidId = biddingObj.bidId;
                params.proUnit = biddingObj.proUnit;
                params.shipment = this.formData.shipment.replace(/年/g, '-');
                this.portList.forEach(item => {
                    if (item.id === this.formData.portId) {
                        params.portName = item.name;
                    }
                });
                console.log('params', params);
                this.$indicator.open('信息提交中...');
                this.$http({
                    method: 'post',
                    url: '/xe-route/xe-app/mobileApp/biddingPro/addBidRecord',
                    data: params
                }).then(res => {
                    this.$indicator.close();
                    console.log(res);
                    this.$toast('您的竞价已提交成功');
                    setTimeout(() => {
                        this.goBackFn();
                    }, 300);
                }).catch(error => {
                    this.$indicator.close();
                    console.log(error);
                });
            }
        },
        computed: {
            ...mapState(['biddingProData']),
            bidNumplaceholder() {
                let str = '';
                str = '数量单位为' + (this.biddingProData.biddingObj.proUnit || '柜');
                return str;
            },
            shipmentList() {
                let arr = [];
                arr = this.biddingProData.biddingObj.bidShipment || [];
                this.formData.shipment = arr[0] || '';
                console.log('arr', arr);
                return arr;
            }
        },
        destroyed() {
            console.log('竞拍编辑结束');
            this.$bus.$off('getParams');
        },
        components: {
            [Radio.name]: Radio,
            [Checkbox.name]: Checkbox,
            [CheckboxGroup.name]: CheckboxGroup,
            [RadioGroup.name]: RadioGroup,
            [CountDown.name]: CountDown
        }
    };
</script>
<style rel="stylesheet/scss" lang="scss">
    @import '../../static/styles/rules.scss';
    .fillTheBidInfor {
        position: absolute;
        top: 0;
        left: 50%;
        margin-left: -375/$ppr;
        width: 750/$ppr;
        select:disabled {
            color: #666!important;
        }
        .auction-endTimeshow {
            font-size: 32/$ppr;
            line-height: 80/$ppr;
            padding: 0 20/$ppr;
            color: #fff;
            margin-bottom: 10/$ppr;
            background: #ae2111;
            .xe-iconfont {
                display: inline-block;
                width: 36/$ppr;
                text-align: center;
                line-height: 36/$ppr;
                font-size: 32/$ppr;
            }
        }
        .fillBidInfor-content {
            background: #fff;
            >ul {
                padding-left: 40/$ppr;
                li {
                    position: relative;
                    @include flexbox();
                    overflow: hidden;
                    font-size: 32/$ppr;
                    color: #333;
                    // padding: 26/$ppr 0;
                    line-height: 84/$ppr;
                    // padding-right: 30/$ppr;
                    &.sty-padi {
                        padding: 26/$ppr 0;
                    }
                    &:not(:last-child) {
                        @extend .border-1px-bot;
                    }
                    .labs-how {
                        width: 166/$ppr;
                    }
                    input {
                        // line-height: 54/$ppr;
                        padding: 16/$ppr 0;
                        width: 100%;
                    }
                    .arrow-sp {
                        position: absolute;
                        right: 20/$ppr;
                        top: 50%;
                        height: 32/$ppr;
                        width: 40/$ppr;
                        margin-top: -16/$ppr;
                    }
                    .loab-con {
                        @include flex(1);
                        select {
                            line-height: 84/$ppr;
                            width: 100%;
                            border: none;
                            outline: none;
                            background: #fff;
                            -moz-appearance:none;
                            -webkit-appearance:none;
                        }
                    }
                    .van-radio-group {
                        display: flex;
                        .van-radio__label {
                            font-size: 32/$ppr;
                        }
                        >div:first-child{
                            margin-right: 112/$ppr;
                        }
                    }
                }
            }
        }
        .auction-footer-btn {
            @include flexbox();
            padding: 40/$ppr 20/$ppr;
            >button {
                @include flex(1);
                &:not(:first-child) {
                    margin-left: 20/$ppr;
                }
            }
        }
        .m-login-xy {
            &.read-only {
                position: relative;
                margin: 30/$ppr 40/$ppr 0;

            }
            .van-checkbox__control {
                z-index: 555;
            }
            .van-checkbox__label {
                margin-left: 30/$ppr;
            }
        }
    }
</style>
