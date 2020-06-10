<template>
    <div class="m-delivery-con">
        <div class="delivery-item">
            <div class="m-list-block">
                <ul>
                    <li class="item-content" v-if="itemData.shipTypeList.length > 0">
                        <div class="item-inner">
                            <div class="item-title">
                                配送方式
                            </div>
                            <div class="item-after">
                                    <div class="delivery-item-cons">
                                        <xe-radio-group v-model="shipType">
                                            <div v-for="(item, index) in itemData.shipTypeList" :key="index">
                                                <xe-radio :label="item">{{parseInt(item) | shipTypeToText}}</xe-radio>
                                            </div>
                                        </xe-radio-group>
                                    </div>
                            </div>
                        </div>
                    </li>
                    <li class="item-content" v-show="(shipType === '1' && itemData.appointCarFlag === 1) || shipType === '2'" style="position: relative;">
                        <div class="item-inner">
                            <div class="item-title">
                                指定车辆
                            </div>
                            <div class="item-input">
                                <input type="text" v-model="telNum" placeholder="请输入车牌号、联系电话">
                            </div>
                        </div>
                        <transition name="slide-in">
                            <div class="autocombox" v-show="telNumArr && telNumArr.length">
                                <ul>
                                    <li v-for="item in telNumArr" :key="item.carId" @click.prevent="chooseCar(item)">
                                        {{item.carPlateNum}} ({{item.contactPerson}} {{item.mobilePhone}})
                                    </li>
                                </ul>
                            </div>
                        </transition>
                    </li>
                </ul>
            </div>
        </div>
        <div class="deliver-btns">
            <mt-button type="primary" style="width: 100%;" class="xe-button-primary" @click.prevent="setDeliveryFn">确定</mt-button>
        </div>
    </div>
</template>
<script type="text/ecmascript-6">
    import debounce from 'throttle-debounce/debounce';
    import {Radio, RadioGroup} from 'components/Radio';
    export default {
        name: 'xe-delivery',
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
                shipType: '',
                cancel: '',
                telNumArr: [],
                telNum: '',
                telTem: null
            };
        },
        created() {
            this.shipType = this.itemData.shipTyped;
            this.telTem = this.itemData.shipCarId ? {carId: this.itemData.shipCarId} : null;
            this.telNum = this.itemData.shipCarDes ? this.itemData.shipCarDes : '';
        },
        methods: {
            setDeliveryFn() {
                this.itemData.shipTyped = this.shipType;
                this.itemData.shipCarId = this.telTem ? this.telTem.carId : '';
                this.itemData.shipCarDes = this.telNum;
                console.log('====运费Item====');
                console.log(this.itemData);
                console.log('====运费Item====');
//                if (this.shipType === '2') {
//                    // 选择委托自提时必填指定车辆
//                    if (!this.telNum) {
//                        this.$toast({
//                            message: '委托自提必须指定车辆',
//                            duration: 1500
//                        });
//                        return;
//                    }
//                }
                this.$parent.$emit('update:show', false);
            },
            queystLogisticsCar: debounce(300, function() {
                this.$http({
                    method: 'post',
                    url: '/xe-route/xe-app/mobile/checkOrder/queystLogisticsCar',
                    data: {
                        paramStr: this.telNum
                    }
                }).then(res => {
                    console.log(res);
                    this.telNumArr = res.data.carDtoList;
                }).catch(error => {
                    console.log(error);
                });
            }),
            chooseCar(item) {
                this.telTem = item;
                this.telNum = `${item.carPlateNum} (${item.contactPerson} ${item.mobilePhone})`;
            }
        },
        watch: {
            telNum(val) {
                this.queystLogisticsCar();
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
    .delivery-item {
        background: #fff;
        .autocombox {
            position: absolute;
            left: 0;
            right: 0;
            top: 92/$ppr;
            padding: 0 20/$ppr;
            z-index: 33;
            background: #fff;
            min-height: 90/$ppr;
            max-height: 535/$ppr;
            overflow: auto;
            ul {}
            li {
                min-height: 88/$ppr;
                padding: 24/$ppr;
                line-height: 40/$ppr;
                border-bottom: 1/$ppr solid $border-color-e8e;
                font-size: 28/$ppr;
            }
        }
    }
    .delivery-item-cons {
        width: 100%;
        display: flex;
        align-items: center;
        .van-radio-group {
            flex: 1;
            display: flex;
            align-items: center;
            flex-wrap: wrap;
            > div {
                margin: 0 10/$ppr;
            }
        }
    }
    .deliver-btns {
        margin: 30/$ppr 20/$ppr;
    }
</style>
