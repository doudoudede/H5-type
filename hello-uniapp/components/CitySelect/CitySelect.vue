<template>
    <view class="m-cityselect" :class="{'m-cityselect-active': showBox, 'm-cityselect-next': isNext}">
            <view class="cityselect-header">
                <!--<view class="c-header-title">-->
                    <!--{{title}}-->
                <!--</view>-->
                <view class="c-header-nav">
                    <template v-if="currentIndex">
                        <a href="#" :class="{'current': currentIndex === (index + 1)}" v-for="(item, index) in selectedAdr" v-show="item.areaId" @click.prevent="adrTopclick(item, index)">
                            {{item.areaName}}
                        </a>
                    </template>
                    <a v-else href="#" class="current" @click.prevent>
                        请选择
                    </a>
                </view>
            </view>
            <ul class="cityselect-content">
                <li class="cityselect-item" ref="elProvince">
                    <view class="cityselect-item-box">
                        <a v-for="(item, index) in columns.columnItems1" :class="{'cityselect-item-active': proviceSelected.areaId === item.areaId}" href="#" @click.prevent="provinceClick(item)">
                            <span>{{item.areaName}}</span>
                        </a>
                    </view>
                </li>
                <li class="cityselect-item" ref="elCity">
                    <view class="cityselect-item-box">
                        <a v-for="(item, index) in columns.columnItems2" :class="{'cityselect-item-active': citySelected.areaId === item.areaId}" href="#" @click.prevent="cityClick(item)">
                            <span>{{item.areaName}}</span>
                        </a>
                    </view>
                </li>
                <li class="cityselect-item" ref="elArea">
                    <view class="cityselect-item-box">
                        <a v-for="(item, index) in columns.columnItems3" :class="{'cityselect-item-active': areaSelected.areaId === item.areaId}" href="#" @click.prevent="areaClick(item)">
                            <span>{{item.areaName}}</span>
                        </a>
                    </view>
                </li>
            </ul>
        </view>
</template>
<script type="text/ecmascript-6">
    export default {
        name: 'xe-cityselect',
        props: {
            show: {
                type: Boolean,
                default: false
            },
            title: {
                type: String,
                default: '所在地址'
            },
            value: {
                type: Array,
                defalut: []
            },
            lock: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                isNext: false,
                items: [],
                currentIndex: 0,
                columns: {
                    columnItems1: [],
                    columnItems2: [],
                    columnItems3: []
                },
                proviceSelected: {},
                citySelected: {},
                areaSelected: {}
            };
        },
//        created() {
//            console.log(this.value);
//        },
        methods: {
            setDefaultValue(val) {
                console.log(val);
                this.$indicator.open();
                let province = val[0];
                let city = val[1];
                let area = val[2];
                let proDom = this.$refs.elProvince;
                let cityDom = this.$refs.elCity;
                let areaDom = this.$refs.elArea;
                let singleItem = '';
                let p1 = new Promise((resolve, reject) => {
                    this.queryAreaListByParent(0, data => {
                        this.columns.columnItems1 = data;
                        this.columns.columnItems1.some((item, index) => {
                            if (item.areaId === province) {
                                this.proviceSelected = item;
                                this.$nextTick(() => {
                                    singleItem = proDom.querySelector('.cityselect-item-box a');
                                    proDom.scrollTop = index * singleItem.offsetHeight - proDom.offsetHeight / 3;
                                });
                                return true;
                            }
                        });
                        resolve();
                    });
                });
                let p2 = new Promise((resolve, reject) => {
                    this.queryAreaListByParent(province, data => {
                        this.columns.columnItems2 = data;
                        this.columns.columnItems2.some((item, index) => {
                            if (item.areaId === city) {
                                this.citySelected = item;
                                this.$nextTick(() => {
                                    singleItem = cityDom.querySelector('.cityselect-item-box a');
                                    cityDom.scrollTop = index * singleItem.offsetHeight - cityDom.offsetHeight / 3;
                                });
                                return true;
                            }
                        });
                        resolve();
                    });
                });
                let p3 = new Promise((resolve, reject) => {
                    this.queryAreaListByParent(city, data => {
                        this.columns.columnItems3 = data;
                        this.columns.columnItems3.some((item, index) => {
                            if (item.areaId === area) {
                                this.areaSelected = item;
                                this.$nextTick(() => {
                                    singleItem = areaDom.querySelector('.cityselect-item-box a');
                                    areaDom.scrollTop = index * singleItem.offsetHeight - areaDom.offsetHeight / 3;
                                });
                                return true;
                            }
                        });
                        resolve();
                    });
                });
                p1.then(pdata => {
                    return p2;
                }).then(cdata => {
                    return p3;
                }).then(adata => {
                    this.isNext = true;
                    this.lock ? this.currentIndex = 2 : this.currentIndex = 3;
                    this.$indicator.close();
                }).catch(error => {
                    console.log(error);
                    this.$indicator.close();
                });
            },
            init() {
                this.queryAreaListByParent(0, data => {
                    this.columns.columnItems1 = data;
                });
            },
            queryAreaListByParent(id, fn) {
                this.$indicator.open();
                this.$http({
                    method: 'post',
                    url: '/xe-route/xe-app/mobile/cart/queryAreaListByParent',
                    data: {
                        areaId: id
                    }
                }).then(res => {
                    this.$indicator.close();
                    fn && fn(res.data.areaList);
                }).catch(error => {
                    console.log(error);
                    this.close();
                    this.$indicator.close();
                });
            },
            adrTopclick(item, index) {
                if (this.lock) return;
                if (index === 0 || index === 1) {
                    this.isNext = false;
                }
                if (index === 2) {
                    this.isNext = true;
                }
                this.currentIndex = (index + 1);
            },
            provinceClick(item) {
                this.proviceSelected = {
                    areaId: item.areaId,
                    areaName: item.areaName
                };
                this.currentIndex = 1;
                this.citySelected = {};
                this.areaSelected = {};
                if (item.areaList && item.areaList.length) {
                    this.columns.columnItems2 = item.areaList;
                } else {
                    this.queryAreaListByParent(item.areaId, data => {
                        this.columns.columnItems2 = data;
                        this.$set(item, 'areaList', data);
                    });
                }
            },
            cityClick(item) {
                if (this.lock) {
                    return;
                };
                this.citySelected = {
                    areaId: item.areaId,
                    areaName: item.areaName
                };
                this.currentIndex = 2;
                this.areaSelected = {};
                if (item.areaList && item.areaList.length) {
                    this.columns.columnItems3 = item.areaList;
                    this.isNext = true;
                } else {
                    this.queryAreaListByParent(item.areaId, data => {
                        this.isNext = true;
                        this.columns.columnItems3 = data;
                        this.$set(item, 'areaList', data);
                    });
                };
            },
            areaClick(item) {
                this.areaSelected = {
                    areaId: item.areaId,
                    areaName: item.areaName
                };
                this.currentIndex = 3;
                this.close();
                this.$emit('on-adr-change', this.selectedAdr);
            },
            close() {
                this.$emit('update:show', false);
            }
        },
        computed: {
            showBox() {
                return this.show;
            },
            selectedAdr() {
                return [this.proviceSelected, this.citySelected, this.areaSelected];
            }
        },
        watch: {
            'show'(val) {
                if (val && !this.columns.columnItems1.length) {
                    if (this.lock) {
//                        {"provinceId":1,"provinceName":"北京","cityId":2,"cityName":"北京市","areaId":3,"areaName":"东城区"}
                        let regionMap = JSON.parse(this.$getLocalStorage('REGIONMAP'));
                        this.proviceSelected = {
                            areaId: regionMap.provinceId,
                            areaName: regionMap.provinceName
                        };
                        this.citySelected = {
                            areaId: regionMap.cityId,
                            areaName: regionMap.cityName
                        };
                        this.setDefaultValue([this.proviceSelected.areaId, this.citySelected.areaId, '']);
                    } else {
                        if (this.value && this.value.length === 3) {
                            this.setDefaultValue(this.value);
                        } else {
                            this.init();
                        }
                    }
                }
            }
        },
        destroyed() {
            this.close();
        }
    };
</script>
<style rel="stylesheet/scss" lang="scss">
    @import '../../static/styles/components/cityselect.scss';
</style>
