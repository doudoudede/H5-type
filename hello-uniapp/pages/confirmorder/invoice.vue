<template>
    <view class="m-invoice-con">
        <view class="m-invoice-content">
            <view class="invoice-item">
                <view class="title">发票类型</view>
                <xe-radio-group v-model="taxInfoDto.taxType">
                <view class="con">
                    <view>
                        <xe-radio :label="1">普通发票</xe-radio>
                    </view>
                </view>
                </xe-radio-group>
            </view>
            <view class="invoice-item">
                <view class="title">发票抬头</view>
                <xe-radio-group v-model="taxInfoDto.taxTitle">
                    <view class="con">
                        <view>
                            <xe-radio :label="2">个人</xe-radio>
                        </view>
                        <view>
                            <xe-radio :label="1">公司</xe-radio>
                        </view>
                    </view>
                </xe-radio-group>
                <view class="company-content" v-show='taxInfoDto.taxTitle === 1'>
                    <view class="m-list-block">
                        <ul>
                            <li class="item-content">
                                <view class="item-inner">
                                    <view class="item-title">
                                        <span style="color: red;">*</span>公司名称
                                    </view>
                                    <view class="item-input">
                                        <input type="text" maxlength="50" v-model='taxInfoDto.taxCompany' placeholder="请输入公司名称">
                                    </view>
                                </view>
                            </li>
                            <li class="item-content">
                                <view class="item-inner">
                                    <view class="item-title">
                                        <span style="color: red;">*</span>税号
                                    </view>
                                    <view class="item-input">
                                        <input type="number" v-model='taxInfoDto.taxNum' maxlength="20" placeholder="请输入税号">
                                    </view>
                                </view>
                            </li>
                            <li class="item-content">
                                <view class="item-inner">
                                    <view class="item-title">
                                        开户银行
                                    </view>
                                    <view class="item-input">
                                        <input type="text" v-model='taxInfoDto.taxBankName' maxlength="20" placeholder="请输入开户银行">
                                    </view>
                                </view>
                            </li>
                            <li class="item-content">
                                <view class="item-inner">
                                    <view class="item-title">
                                        银行账号
                                    </view>
                                    <view class="item-input">
                                        <input type="number" v-model='taxInfoDto.taxBankCardNum' maxlength="20" placeholder="请输入开户银行账号">
                                    </view>
                                </view>
                            </li>
                            <li class="item-content">
                                <view class="item-inner">
                                    <view class="item-title">
                                        公司地址
                                    </view>
                                    <view class="item-input">
                                        <input maxlength="40" type="text" v-model='taxInfoDto.taxComAddr' placeholder="请输入公司地址">
                                    </view>
                                </view>
                            </li>
                            <li class="item-content">
                                <view class="item-inner">
                                    <view class="item-title">
                                        公司电话
                                    </view>
                                    <view class="item-input">
                                        <input maxlength="20" type="tel" v-model='taxInfoDto.taxComPhone' placeholder="请输入公司电话">
                                    </view>
                                </view>
                            </li>
                        </ul>
                    </view>
                </view>
            </view>
            <view class="invoice-item">
                <view class="title">发票内容</view>
                <xe-radio-group v-model="taxInfoDto.taxContent">
                    <view class="con">
                        <view>
                            <xe-radio :label="1">明细</xe-radio>
                        </view>
                        <view>
                            <xe-radio :label="2">食品</xe-radio>
                        </view>
                    </view>
                </xe-radio-group>
            </view>
        </view>
        <view class="m-invoice-btns">
            <a href="#" class="no" @click.prevent="noFn">不需要发票</a>
            <a href="#" class="sure" @click.prevent="sureFn">保存</a>
        </view>
    </view>
</template>
<script type="text/ecmascript-6">
    import {Radio, RadioGroup} from 'components/Radio';
    export default {
        name: 'xe-invoice',
        props: {
            itemData: {
                type: Object,
                default() {
                    return {};
                }
            }
        },
        data() {
            return {
                taxInfoDto: {
                    taxFlag: 2, // 是否有发票信息 1 有 2 没有
                    taxType: this.itemData.taxInfoDto.taxType ? this.itemData.taxInfoDto.taxType : 1, // 发票类型 1:普通发票   2:增值税发票 必传
                    taxTitle: this.itemData.taxInfoDto.taxTitle ? this.itemData.taxInfoDto.taxTitle : 2, // 发票抬头 1 公司 2 个人 必传
                    taxContent: this.itemData.taxInfoDto.taxContent ? this.itemData.taxInfoDto.taxContent : 1, // 发票内容 1明细 2 生鲜食品  必传
                    taxCompany: this.itemData.taxInfoDto.taxCompany ? this.itemData.taxInfoDto.taxCompany : '', // 公司名称 taxTitle = 1 必传
                    taxNum: this.itemData.taxInfoDto.taxNum ? this.itemData.taxInfoDto.taxNum : '', // 发票公司税号 taxTitle = 1 必传
                    taxBankName: this.itemData.taxInfoDto.taxBankName ? this.itemData.taxInfoDto.taxBankName : '', // 开户银行
                    taxBankCardNum: this.itemData.taxInfoDto.taxBankCardNum ? this.itemData.taxInfoDto.taxBankCardNum : '', // 开户银行账号
                    taxComAddr: this.itemData.taxInfoDto.taxComAddr ? this.itemData.taxInfoDto.taxComAddr : '', // 发票公司地址
                    taxComPhone: this.itemData.taxInfoDto.taxComPhone ? this.itemData.taxInfoDto.taxComPhone : '' // 发票公司电话
                }
            };
        },
        methods: {
            sureFn() {
                if (this.taxInfoDto.taxTitle === 1 && !this.taxInfoDto.taxCompany && !this.taxInfoDto.taxNum) {
                    this.$toast({
                        message: '请填写公司名称和公司税号'
                    });
                    return;
                };
                this.$http({
                    method: 'post',
                    url: '/xe-route/xe-app/mobile/checkOrder/saveOrderTaxInfo',
                    data: Object.assign(this.taxInfoDto, {checkOrderUUID: this.itemData.checkOrderUUID})
                }).then(res => {
                    console.log(res);
                    this.$toast({
                        message: '发票信息保存成功'
                    });
                    this.taxInfoDto.taxFlag = 1;
                    this.itemData.taxInfoDto = this.taxInfoDto;
                    this.$parent.$emit('update:show', false);
                    console.log('===发票保存====');
                    console.log(this.itemData.taxInfoDto);
                    console.log('===发票保存====');
                }).catch(error => {
                    console.log(error);
                });
            },
            noFn() {
                this.taxInfoDto.taxFlag = 2;
                this.itemData.taxInfoDto = this.taxInfoDto;
                this.$parent.$emit('update:show', false);
            }
        },
        components: {
            [Radio.name]: Radio,
            [RadioGroup.name]: RadioGroup
        }
    };
</script>
<style rel="stylesheet/scss" lang="scss">
    @import '../../static/styles/rules.scss';
    .m-invoice-con {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
    }
    .m-invoice-content {
        flex: 1;
        width: 100%;
        height: 100%;
        overflow: auto;
        -webkit-overflow-scrolling: touch;
        .invoice-item {
            padding-left: 20/$ppr;
            margin:20/$ppr 0;
            background: #fff;
            .title {
                font-size: 32/$ppr;
                padding: 20/$ppr 0;
            }
            .con {
                display: flex;
                border-top: 1/$ppr solid $border-color-e8e;
                > view {
                    flex: 1;
                    padding: 25/$ppr 0;
                }
            }
            &:first-child {
                 margin-top: 0;
            }
        }
    }
    .company-content {
        border-top:1/$ppr solid $border-color-e8e;
    }
    .m-invoice-btns {
        height: 88/$ppr;
        background-color: #fff;
        display: flex;
        a {
            flex: 1;
            height: 100%;
            line-height: 88/$ppr;
            text-align: center;
            font-size: 32/$ppr;
            &.no {
                border-top: 1/$ppr solid $border-color-e8e;
            }
            &.sure {
                background: #f53226;
                color: #fff;
            }
        }
    }
</style>
