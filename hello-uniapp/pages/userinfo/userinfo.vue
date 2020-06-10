<template>
    <xe-layout class="m-bg-dark">
        <div class="p-userinfo-item">
            <div class="m-list-block">
                <ul>
                    <li class="item-content align-right">
                        <div class="item-inner">
                            <div class="item-title">头像</div>
                            <div class="item-after">
                                <div class="pic">
                                    <img src="../../static/images/u-headportrait.png" alt="">
                                </div>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
        <div class="p-userinfo-item">
            <div class="m-list-block">
                <ul>
                    <li class="item-content align-right item-link" @click.prevent="navToEditorPhone">
                        <div class="item-inner">
                            <div class="item-title">绑定手机</div>
                            <div class="item-after c333">
                                {{userInfo.mobile}}
                            </div>
                        </div>
                    </li>
                    <li class="item-content item-link">
                        <div class="item-inner">
                            <div class="item-title">店铺名称</div>
                            <div class="item-input">
                                <input type="text" style="text-align: right;" placeholder="请输入店铺名" v-model="userInfo.shopName">
                            </div>
                        </div>
                    </li>
                    <li class="item-content item-link">
                        <div class="item-inner">
                            <div class="item-title">联系人</div>
                            <div class="item-input">
                                <input type="text" style="text-align: right;" placeholder="请输入联系人" v-model="userInfo.userName">
                            </div>
                        </div>
                    </li>
                    <li class="item-content align-right item-link" @click.prevent="showadr = true">
                        <div class="item-inner">
                            <div class="item-title">店铺地址</div>
                            <div class="item-after c333">
                                {{userInfo.adrShop ? userInfo.adrShop : '请选择店铺地址'}}
                            </div>
                        </div>
                    </li>
                    <li class="item-content">
                        <div class="item-inner">
                            <div class="item-text">
                                <textarea style="width: 100%;" v-model="userInfo.address">{{userInfo.address}}</textarea>
                            </div>
                        </div>
                    </li>
                    <li class="item-content align-right item-link" @click.prevent="showcust = true">
                        <div class="item-inner">
                            <div class="item-title">客户经理</div>
                            <div class="item-after c333">{{userInfo.saleManNameAndPhone ? userInfo.saleManNameAndPhone : '请选择客户经理'}}</div>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
        <div class="p-userinfo-btn">
            <mt-button type='primary' :disabled="disabled" class="xe-button-primary" style="width: 100%;" @click.prevent="updateMyInfo">保 存</mt-button>
        </div>
        <!--地址插件-->
        <xe-popup
            slot="outer"
            :show.sync="showadr"
            popupTit="店铺地址"
            position="bottom">
            <CitySelect
                v-model="defaultAdrs"
                :show.sync="showadr"
                @on-adr-change="adrChange"
            ></CitySelect>
        </xe-popup>

        <!--修改客户经理-->
        <xe-popup
            slot="outer"
            :show.sync="showcust"
            popupTit="客户经理"
            position="bottom">
            <div class="user-custon">
                <div class="user-search">
                    <input v-model='mtel' :maxlength="11" type="tel" placeholder="请输入客户经理手机号">
                    <span v-show="mtel.length" @click="mtel = ''" class="xe-iconfont xe-icon-cuowu"></span>
                </div>
                <div class="user-content">
                    <ul v-if="mcustlist && mcustlist.length">
                        <li v-for="item in mcustlist" :key="item.salesmanId" @click.prevent="mcustClick(item)">{{item.phone}} {{item.salesmanName}}</li>
                    </ul>
                    <div v-show="mcustlist && mcustlist.length === 0" class="m-cart-none">
                        <div class="pic">
                            <img src="../../static/images/cart-n1.png" alt="">
                        </div>
                        <div class="des">
                            <p class="f32">没有找到相关的客户经理~</p>
                        </div>
                    </div>
                </div>
            </div>
        </xe-popup>
    </xe-layout>
</template>
<script type="text/ecmascript-6">
    import {CitySelect} from 'components/CitySelect/';
    import {Popup} from 'components/Popup';
    import debounce from 'throttle-debounce/debounce';
    export default {
        name: 'xe-page-userinfo',
        data() {
            return {
                showadr: false,
                showcust: false,
                defaultAdrs: [],
                disabled: true,
                userInfo: {
                    mobile: '', // 绑定手机
                    shopName: '', // 店铺名称
                    userName: '', // 联系人
                    adrShop: '',
                    address: '',
                    saleManId: '',
                    saleManNameAndPhone: ''
                },
                mtel: [],
                mcustlist: null
            };
        },
        created() {
            this.queryMyInfo();
        },
        methods: {
            queryMyInfo() {
                this.$http({
                    method: 'post',
                    url: '/xe-route/xe-app/mobile/myIndex/queryMyInfo',
                    data: {}
                }).then(res => {
                    let datas = res.data.userInfo.xeUserInfoDTO;
                    this.userInfo.mobile = datas.mobile;
                    this.userInfo.shopName = datas.shopName;
                    this.userInfo.userName = datas.userName;
                    if (!datas.provinceName) {
                        this.userInfo.adrShop = '';
                    } else {
                        this.defaultAdrs = [datas.provinceId, datas.cityId, datas.areaId];
                        this.userInfo.adrShop = [datas.provinceName, datas.cityName, datas.areaName].join('-');
                    }
                    this.userInfo.address = datas.address;
                    this.userInfo.saleManNameAndPhone = datas.saleManNameAndPhone;
                    this.userInfo.saleManId = datas.saleManId;
                    this.disabled = false;
                }).catch(error => {
                    console.log(error);
                });
            },
            updateMyInfo() {
                this.disabled = true;
                this.$http({
                    method: 'post',
                    url: '/xe-route/xe-app/mobile/myIndex/updateMyInfo',
                    data: {
                        shopName: this.userInfo.shopName,
                        provinceId: this.defaultAdrs[0], // 省id
                        cityId: this.defaultAdrs[1], // 市id
                        areaId: this.defaultAdrs[2], // 区id
                        address: this.userInfo.address, // 店铺地址
                        userName: this.userInfo.userName, // 联系人
                        saleManId: this.userInfo.saleManId // 客户经理id
                    }
                }).then(res => {
                    this.disabled = false;
                    this.$toast({
                        message: '信息修改成功',
                        duration: 1000
                    });
                    this.$router.push({name: 'My'});
                }).catch(error => {
                    this.disabled = false;
                    console.log(error);
                });
            },
            searchSeller: debounce(300, function() {
                this.$http({
                    method: 'post',
                    url: '/xe-route/xe-app/mobile/myIndex/searchSeller',
                    data: {
                        phone: this.mtel
                    }
                }).then(res => {
                    console.log(res);
                    this.mcustlist = res.data.list.sellerList;
                }).catch(error => {
                    console.log(error);
                });
            }),
            mcustClick(item) {
                this.userInfo.saleManId = item.salesmanId;
                this.userInfo.saleManNameAndPhone = `${item.phone} ${item.salesmanName}`;
                this.showcust = false;
            },
            adrChange(item) {
                this.defaultAdrs = [item[0].areaId, item[1].areaId, item[2].areaId];
                this.userInfo.adrShop = [item[0].areaName, item[1].areaName, item[2].areaName].join('-');
            },
            navToEditorPhone() {
                this.$router.push({
                    name: 'EditorPhone',
                    query: {
                        phone: this.userInfo.mobile
                    }
                });
            }
        },
        watch: {
            mtel(newVal) {
                if (!newVal) {
                    // 数据为空时
                    this.mcustlist = null;
                } else {
                    this.searchSeller();
                }
            }
        },
        components: {
            CitySelect,
            [Popup.name]: Popup
        }
    };
</script>
<style rel="stylesheet/scss" lang="scss">
    @import '../../static/styles/rules.scss';
    .p-userinfo-item {
        background: #fff;
        width: 750/$ppr;
        margin: 20/$ppr auto;
        .pic {
            width: 80/$ppr;
            height: 80/$ppr;
            background: #f5f5f5;
            border-radius: 50%;
            img {
                width: 100%;
                height: 100%;
            }
        }
    }
    .p-userinfo-btn {
        width: 750/$ppr;
        padding: 0 20/$ppr;
        margin: 30/$ppr auto;
    }
    .user-custon {
        display: flex;
        flex-direction: column;
        padding: 20/$ppr;
        height: 100%;
        background: #fff;
        .user-search {
            height:70/$ppr;
            position: relative;
            input {
                width: 100%;
                height: 70/$ppr;
                background: #faf9f9;
                border: 1/$ppr solid $border-color-e8e;
                border-radius: 5/$ppr;
                padding: 15/$ppr;
                font-size: 28/$ppr;
            }
            .xe-iconfont {
                width: 70/$ppr;
                height: 70/$ppr;
                position: absolute;
                right: 0;
                top: 0;
                font-size: 30/$ppr;
                text-align: center;
                line-height: 70/$ppr;
                color: $text-ccc;
            }
        }
        .user-content {
            flex: 1;
            overflow: auto;
            -webkit-overflow-scrolling: touch;
            ul {}
            li {
                min-height: 88/$ppr;
                padding: 24/$ppr;
                line-height: 40/$ppr;
                border-top: 1/$ppr solid $border-color-e8e;
                font-size: 28/$ppr;
            }
        }
    }
</style>
