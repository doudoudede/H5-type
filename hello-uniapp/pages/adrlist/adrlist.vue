<template>
    <xe-layout class="m-bg-dark m-flexlay">
        <template v-if="adrListData.length">
            <div class="m-adr-item" v-for="(item, index) in adrListData" :key="item.caId">
                <div class="m-adr-user">
                    <div class="name">{{item.caConsignee}}</div>
                    <div class="tel">{{item.caPhone}}</div>
                </div>
                <div class="m-adr-text">
                    收货地址：{{item.caProvName}}{{item.caCityName}}{{item.caAreaName}}{{item.caStreet}}
                </div>
                <div class="m-adr-action">
                    <div>
                        <xe-checkbox v-model="item.checkflag" @input="defaultValueFn(item)">设为默认地址</xe-checkbox>
                    </div>
                    <div class="action-btns">
                        <span @click.prevent="editorAdrBtn(item.caId)"><em class="xe-iconfont xe-icon-bianji"></em>编辑</span>
                        <span @click.prevent="delAdrBtn(item.caId, index)"><em class="xe-iconfont xe-icon-shanchu"></em>删除</span>
                    </div>
                </div>
            </div>
        </template>
        <div class="m-cart-none" v-else>
            <div class="pic">
                <img src="../../static/images/cart-n1.png" alt="">
            </div>
            <div class="des">
                <p class="f32">暂无地址信息~</p>
            </div>
            <!--<div class="btn">-->
            <!--<mt-button class="xe-button-default" size="small" plain @click.prevent="toCategory">去购买~</mt-button>-->
            <!--</div>-->
        </div>
        <div slot="footer" class="m-adr-add">
            <mt-button class="xe-button-primary" type="primary" style="width: 100%;" @click.prevent="addNew">+ 新建地址</mt-button>
        </div>
    </xe-layout>
</template>
<script type="text/ecmascript-6">
    import {Checkbox, CheckboxGroup} from 'components/Checkbox';
    export default {
        name: 'xe-page-adritem',
        data() {
            return {
                adrListData: []
            };
        },
        created() {
            this.queryAddressList();
        },
        methods: {
            defaultValueFn(item) {
                console.log(item);
                this.$indicator.open();
                this.$http({
                    method: 'post',
                    url: '/xe-route/xe-app/mobile/address/setDefAddr',
                    data: {
                        caId: item.caId,
                        defAddr: item.checkflag ? 1 : 2
                    }
                }).then(res => {
                    console.log(res);
                    if (item.checkflag) {
                        // 设置默认
                        this.adrListData.some(ditem => {
                            if (ditem.caId === item.caId) {
                                ditem.checkflag = true;
                            } else {
                                ditem.checkflag = false;
                            }
                        });
                    } else {
                        // 取消默认
                        this.adrListData.forEach(ditem => {
                            ditem.checkflag = false;
                        });
                    }
                    this.$indicator.close();
                }).catch(error => {
                    console.log(error);
                    this.$indicator.close();
                    item.checkflag = !item.checkflag;
                });
            },
            queryAddressList() {
                this.$indicator.open('加载地址中...');
                this.$http({
                    method: 'post',
                    url: '/xe-route/xe-app/mobile/address/queryAddressList',
                    data: {}
                }).then(res => {
                    this.$indicator.close();
                    console.log(res);
                    this.adrListData = res.data.addressResDto.addressList;
                    if (this.adrListData.length) {
                        this.adrListData.some(item => {
                            if (item.defAddr === 1) {
                                this.$set(item, 'checkflag', true);
                            } else {
                                this.$set(item, 'checkflag', false);
                            }
                        });
                    }
                }).catch(error => {
                    this.$indicator.close();
                    console.log(error);
                });
            },
            delAdrBtn(caId, index) {
                this.$xeMessageBox.confirm('确定删除此地址信息？').then(() => {
                    this.$http({
                        method: 'post',
                        url: '/xe-route/xe-app/mobile/address/delAddressById',
                        data: {
                            caId: caId
                        }
                    }).then(res => {
                        console.log(res);
                        this.adrListData.splice(index, 1);
                    }).catch(error => {
                        console.log(error);
                    });
                }).catch(error => {
                    console.log(error);
                });
            },
            editorAdrBtn(caId) {
                this.$router.push({
                    name: 'AddNewAdr',
                    query: {
                        caId: caId
                    }
                });
            },
            addNew() {
                this.$router.push({
                    name: 'AddNewAdr'
                });
            }
        },
        computed: {
        },
        components: {
            [Checkbox.name]: Checkbox,
            [CheckboxGroup.name]: CheckboxGroup
        }
    };
</script>
<style rel="stylesheet/scss" lang="scss">
    @import '../../static/styles/rules.scss';
    .m-adr-item {
        background: #fff;
        margin: 20/$ppr 0;
        padding-left: 40/$ppr;
        overflow: hidden;
        .m-adr-user {
            margin: 25/$ppr 0;
            display: flex;
            justify-content: space-between;
            font-size: 32/$ppr;
            padding-right: 20/$ppr;
            line-height: 1.3;
            .name {
                font-weight: 500;
            }
            .tel {
                white-space: nowrap;
                margin-left: 20/$ppr;
            }
        }
        .m-adr-text {
            line-height: 1.4;
            font-size: 24/$ppr;
            color: $text-666;
            margin: 25/$ppr 0;
            padding-right: 20/$ppr;
        }
        .m-adr-action {
            padding: 25/$ppr 20/$ppr 25/$ppr 0;
            min-height: 88/$ppr;
            border-top: 1/$ppr solid $border-color-e8e;
            display: flex;
            justify-content: space-between;
            .action-btns {
                line-height: 34/$ppr;
                color: $text-666;
                vertical-align: top;
                span {
                    margin-left: 30/$ppr;
                    font-size: 24/$ppr;
                    display: inline-block;
                    vertical-align: top;
                    em {
                        margin-right: 5/$ppr;
                        font-size: 24/$ppr;
                        display: inline-block;
                        vertical-align: top;
                        width: 34/$ppr;
                        height: 34/$ppr;
                        text-align: center;
                    }
                }
            }
        }
    }
    .m-adr-add {
        .mint-button.xe-button-primary {
            border-radius: 0;
        }
    }
</style>
