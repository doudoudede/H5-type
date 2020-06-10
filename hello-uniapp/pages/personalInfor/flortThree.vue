<template>
    <div>
        <!--基本信息-->
        <div class="content-flor">
            <div class="m-list-block">
                <ul>
                    <li class="item-content item-link" @click.prevent="showcust = true">
                        <div class="item-inner">
                            <div class="item-title">客户经理</div>
                            <div class="item-input3">&nbsp;&nbsp;{{userInfo.saleManNameAndPhone}}</div>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
        <div class="text-introduce">请选择一位客户经理。客户经理是您所在区域的负责人，将全面负责您的商品采购和售后。
        </div>
        <!--修改客户经理-->
        <!-- <xe-popup
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
        </xe-popup> -->
    </div>
</template>
<script type="text/ecmascript-6">
    import {Popup} from 'components/Popup';
    import debounce from 'throttle-debounce/debounce';
    export default {
        name: '',
        data() {
            return {
                showcust: false,
                mtel: [],
                mcustlist: null,
                userInfo: {
                    saleManId: '',
                    saleManNameAndPhone: '请选择客户经理'
                },
                userInfoData: {}
            };
        },
        created() {
            let userInfoData = this.$getLocalStorage('userInfoData');
            if (userInfoData) {
                this.userInfoData = JSON.parse(this.$getLocalStorage('userInfoData')).userInfo;
                Object.keys(this.userInfoData).find(item => {
                    Object.keys(this.userInfo).find(items => {
                        if (item === items) {
                            this.userInfo[items] = this.userInfoData[item];
                        }
                    });
                });
            }
        },
        methods: {
            mcustClick(item) {
                this.userInfo.saleManId = item.salesmanId;
                this.userInfo.saleManNameAndPhone = `${item.phone} ${item.salesmanName}`;
                this.showcust = false;
            },
            submitInfo() {
                let flag = false;
                // if (!this.userInfo.saleManId) {
                //     this.$toast({
                //         message: '请选择客户经理',
                //         duration: 2000
                //     });
                //     flag = false;
                //     return;
                // }
                flag = true;
                return {
                    flag: flag,
                    step: 3
                };
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
            })
        },
        watch: {
            showcust(n) {
                this.$bus.$emit('dailogshow', n);
            },
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
            [Popup.name]: Popup
        },
        destroyed() {
            this.$bus.$off('dailogshow');
        }
    };
</script>
<style rel="stylesheet/scss" lang="scss" scoped="">
    @import '../../static/styles/rules.scss';
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
    .text-introduce {
        padding: 0 36/$ppr;
        line-height: 34/$ppr;
        font-size: 26/$ppr;
        color: #999;
    }
</style>
