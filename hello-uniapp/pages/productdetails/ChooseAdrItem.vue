<template>
    <view class="popup-adr-con" v-if="cAdrDatas.length">
        <view class="popup-adr-group">
            <view class="adr-group-item" v-for="item in cAdrDatas" :key="item.caId" @click.prevent="adrChange(item)">
                <view class="adr-group-check xe-iconfont" :class="{'checked': item.caId === result}"></view>
                <view class="shUser clearfix">
                    <span class="fl">{{item.caConsignee}}</span>
                    <span class="fr">{{item.caPhone}}</span>
                </view>
                <view class="shadr">
                    收货地址：{{item.caProvName}}{{item.caCityName}}{{item.caAreaName}}{{item.caStreet}}
                </view>
            </view>
        </view>
        <view class="adr-con-btns" @click.prevent="navToAddNewAdr">
            + 新建地址
        </view>
    </view>
</template>
<script type="text/ecmascript-6">
    export default {
        name: 'xe-popup-adrcon',
        props: {
            adrDatas: {
                type: Array,
                default: []
            },
            defaultCaId: {
                type: String,
                default: ''
            },
            lock: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                result: '',
                chooseItem: null
            };
        },
        methods: {
            adrChange(item) {
                this.chooseItem = item;
                this.result = item.caId;
                console.log(2222);
                console.log(item);
                console.log(2222);
                this.$emit('on-adr-change', item);
            },
            navToAddNewAdr() {
//                this.$router.push({
//                    name: 'AddNewAdr',
//                    query: {
//                        redirect: this.$route.fullPath,
//                        lockAdr: this.lock ? 1 : ''
//                    }
//                });
                this.$emit('on-click-toadd');
            }
        },
        computed: {
            cAdrDatas: {
                get() {
                    return this.adrDatas;
                },
                set(val) {
                    if (val.length) {
                        let defautCaId = null;
                        val.some((item, index) => {
                            if (index === 0) {
                                defautCaId = item.caId;
                                this.chooseItem = item;
                            }
                            if (item.defAddr === 1) {
                                defautCaId = item.caId;
                                this.chooseItem = item;
                                return true;
                            }
                            if (this.defaultCaId === item.caId) {
                                defautCaId = item.caId;
                                this.chooseItem = item;
                                return true;
                            }
                        });
                        this.result = defautCaId;
//                        this.$emit('on-adr-change', this.chooseItem);
                    }
                }
            }
        },
        watch: {
            adrDatas(val) {
                this.cAdrDatas = val;
            },
            defaultCaId(val) {
                this.result = val;
            }
        }
    };
</script>
<style rel="stylesheet/scss" lang="scss">
    @import '../../static/styles/rules.scss';
    .popup-adr-con {
        height: 100%;
        background: #fff;
        display: flex;
        flex-direction: column;
        .popup-adr-group {
            padding-left: 80/$ppr;
            flex:  1;
            overflow: auto;
            .adr-group-item {
                padding: 30/$ppr 20/$ppr 30/$ppr 0;
                border-top:1/$ppr solid $border-color-e8e;
                position: relative;
                &:first-child {
                     border-top:none;
                }
                .adr-group-check {
                    width: 30/$ppr;
                    height: 30/$ppr;
                    font-size: 30/$ppr;
                    line-height: 1;
                    position: absolute;
                    left: -46/$ppr;
                    top: 34/$ppr;
                    &:before {
                        content: '\e971';
                    }
                    &.checked {
                        color: $main-color-l;
                        &:before {
                            content: '\e988';
                        }
                    }
                }
            }
        }
        .shUser {
            font-size: 32/$ppr;
            > span {
              line-height: 1.2;
                &:nth-child(1) {
                    max-width: 60%;
                }
            }
        }
        .shadr {
            margin-top: 15/$ppr;
            font-size: 26/$ppr;
            color: $text-666;
        }
        .adr-con-btns {
            height: 80/$ppr;
            margin: 20/$ppr 30/$ppr;
            border: 1/$ppr dashed $text-999;
            border-radius: 5/$ppr;
            font-size: 34/$ppr;
            text-align: center;
            line-height: 80/$ppr;
            color: white;
            background-color: $main-color-l;
        }
    }
</style>
