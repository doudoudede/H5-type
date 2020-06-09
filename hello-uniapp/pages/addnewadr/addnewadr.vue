<template>
    <xe-layout class="m-bg-dark">
        <view class="m-addnewadr">
            <view class="m-list-block">
                <ul>
                    <li class="item-content">
                        <view class="item-inner">
                            <view class="item-title">店铺名称</view>
                            <view class="item-input">
                                <input type="text" v-model="shopName" placeholder="店铺名称">
                            </view>
                        </view>
                    </li>
                    <li class="item-content">
                        <view class="item-inner">
                            <view class="item-title">收货人</view>
                            <view class="item-input">
                                <input type="text" v-model="caConsignee" placeholder="收货人">
                            </view>
                        </view>
                    </li>
                    <li class="item-content">
                        <view class="item-inner">
                            <view class="item-title">手机号</view>
                            <view class="item-input">
                                <input type="tel" v-model="caPhone" maxlength="11" placeholder="手机号">
                            </view>
                        </view>
                    </li>
                    <li class="item-content item-link">
                        <view class="item-inner" @click.prevent="showadr = true">
                            <view class="item-title">店铺地址</view>
                            <view class="item-after">
                                {{adrText}}
                            </view>
                        </view>
                    </li>
                    <li class="item-content">
                        <view class="item-inner">
                            <view class="item-text">
                                <textarea style="width: 100%;" v-model="caStreet" placeholder="请输入详细地址"></textarea>
                            </view>
                        </view>
                    </li>
                </ul>
            </view>
        </view>
        <view class="m-addadr-default">
            <xe-checkbox v-model="defaultFlag">设为默认地址</xe-checkbox>
        </view>
        <view class="m-addadr-btn">
            <mt-button type="primary" :disabled="disabledBtn" class="xe-button-primary" style="width: 100%;" @click.prevent="insertAddress">确 定</mt-button>
        </view>
        <!--地址插件-->
        <xe-popup
            slot="outer"
            :show.sync="showadr"
            popupTit="配送至"
            position="bottom">
            <CitySelect v-model="defaultAdr" :lock="parseInt($route.query.lockAdr) === 1" :show.sync="showadr" @on-adr-change="adrChange"></CitySelect>
        </xe-popup>
    </xe-layout>
</template>
<script type="text/ecmascript-6">
    import {Checkbox} from 'components/Checkbox';
    import {CitySelect} from 'components/CitySelect/';
    import {Popup} from 'components/Popup';
    import {typeOf} from 'utils';
    export default {
        name: 'xe-page-addnewadr',
        data() {
            return {
                defaultFlag: false,
                showadr: false,
                defaultAdr: [],
                shopName: '', // 店铺名
                caConsignee: '', // 收货人
                caPhone: '', // 收货人手机号码
                caProvince: '', // 省
                caCity: '', // 市
                caArea: '', // 区
                caStreet: '', // 详细地址
                adrText: '请选择省市区',
                adrIds: null
            };
        },
        created() {
            if (this.$route.query.caId) {
                this.editAddress();
            }
            if (this.$route.query.adrInfo) {
                let adrObj = JSON.parse(this.$route.query.adrInfo);
                this.shopName = adrObj.shopName;
                this.caPhone = adrObj.caPhone;
                this.caConsignee = adrObj.caConsignee;
            }
        },
        methods: {
            adrChange(value) {
                this.cAdrText = value;
            },
            insertAddress(fn) {
                if (typeOf(fn) === 'function') {
                    this.callback = fn;
                    return;
                }
                if (!(/^1(3|4|5|6|7|8|9)\d{9}$/.test(this.caPhone))) {
                    this.$toast({
                        message: '请输入正确的手机号',
                        duration: 1500
                    });
                    return;
                }
                this.$indicator.open();
                if (this.$route.query.caId) {
                    this.$http({
                        method: 'post',
                        url: '/xe-route/xe-app/mobile/address/updateAddress',
                        data: {
                            caId: this.$route.query.caId,
                            shopName: this.shopName,
                            caConsignee: this.caConsignee,
                            caPhone: this.caPhone,
                            caStreet: this.caStreet,
                            caProvince: this.adrIds[0],
                            caCity: this.adrIds[1],
                            caArea: this.adrIds[2],
                            defAddr: this.defaultFlag ? 1 : 2
                        }
                    }).then(res => {
                        console.log(res);
                        this.$toast({
                            message: '地址编辑成功',
                            duration: 1500
                        });
                        this.$indicator.close();
                        this.$router.replace({
                            name: 'AdrList'
                        });
                    }).catch(error => {
                        console.log(error);
                        this.$indicator.close();
                    });
                } else {
                    this.$http({
                        method: 'post',
                        url: '/xe-route/xe-app/mobile/address/insertAddress',
                        data: {
                            shopName: this.shopName,
                            caConsignee: this.caConsignee,
                            caPhone: this.caPhone,
                            caStreet: this.caStreet,
                            caProvince: this.adrIds[0],
                            caCity: this.adrIds[1],
                            caArea: this.adrIds[2],
                            defAddr: this.defaultFlag ? 1 : 2
                        }
                    }).then(res => {
                        console.log(res);
                        this.$toast({
                            message: '地址新增成功',
                            duration: 1500
                        });
                        this.$indicator.close();
                        if (typeOf(this.callback) === 'function') {
                            let adrText = this.adrText.split(' ');
                            this.callback({
                                caProvName: adrText[0],
                                caCityName: adrText[1],
                                caAreaName: adrText[2],
                                caProvince: this.adrIds[0],
                                caCity: this.adrIds[1],
                                caArea: this.adrIds[2],
                                shopName: this.shopName,
                                caConsignee: this.caConsignee,
                                caPhone: this.caPhone,
                                caId: res.data.caId,
                                caStreet: this.caStreet,
                                defAddr: this.defaultFlag ? 1 : 2
                            });
                        } else {
                            if (this.$route.query.redirect) {
                                this.$router.replace({
                                    path: this.$route.query.redirect,
                                    query: {
                                        areaId: this.adrIds[2],
                                        caId: res.data.caId
                                    }
                                });
                            } else if (parseInt(this.$route.query.redirectType) === 1) {
                                this.$router.go(-1);
                            } else {
                                this.$router.replace({
                                    name: 'AdrList'
                                });
                            }
                        }
                    }).catch(error => {
                        console.log(error);
                        this.$indicator.close();
                    });
                }
            },
            editAddress() {
                this.$http({
                    method: 'post',
                    url: '/xe-route/xe-app/mobile/address/editAddress',
                    data: {
                        caId: this.$route.query.caId
                    }
                }).then(res => {
                    console.log(res);
                    let datas = res.data.addressDetail.addressInfo;
                    this.shopName = datas.shopName;
                    this.caConsignee = datas.caConsignee;
                    this.caPhone = datas.caPhone;
                    this.adrText = [datas.caProvName, datas.caCityName, datas.caAreaName].join(' ');
                    this.adrIds = [datas.caProvince, datas.caCity, datas.caArea];
                    this.defaultAdr = [datas.caProvince, datas.caCity, datas.caArea];
                    this.caStreet = datas.caStreet;
                    datas.defAddr === 1 ? this.defaultFlag = true : this.defaultFlag = false;
                }).catch(error => {
                    console.log(error);
                });
            }
        },
        computed: {
            cAdrText: {
                get() {
                    return null;
                },
                set(val) {
                    if (val.length) {
                        let textstr = [];
                        let textIds = [];
                        val.forEach(item => {
                            textstr.push(item.areaName);
                            textIds.push(item.areaId);
                        });
                        this.adrText = textstr.join(' ');
                        this.adrIds = textIds;
                    }
                }
            },
            disabledBtn() {
                return !(this.shopName && this.caConsignee && this.caPhone && this.caPhone.length === 11 && this.adrIds && this.caStreet);
            }
        },
        components: {
            [Checkbox.name]: Checkbox,
            [Popup.name]: Popup,
            CitySelect
        }
    };
</script>
<style rel="stylesheet/scss" lang="scss">
    @import "../../static/styles/rules.scss";
    .m-addnewadr {
        .m-list-block {
            background: #fff;
            margin: 20/$ppr 0;
            .item-content {
                .item-title {
                    width: 140/$ppr;
                    font-size: 30/$ppr;
                }
            }
        }
    }
    .m-addadr-default {
        margin: 40/$ppr;
    }
    .m-addadr-btn {
        margin: 40/$ppr 20/$ppr;
    }
</style>
