<template>
    <swiper :options="swiperOption" class="m-ystimes" ref="swiperControl">
        <swiper-slide v-for="(item, index) in itemdata" class="item" :key="index" :class="{'disable': getDisTime[index]}">
            <div class='time'>
                <p>开始时间</p>
                <div>
                    {{item.startdate.split(' ')[0]}}<br>
                    {{item.startdate.split(' ')[1]}}
                </div>
            </div>
            <div class='price'>
                <span v-html="splitPrice(item.prePrice)"></span><em class="unit">/{{priceUnit}}</em>
            </div>
            <div class='time'>
                <p>结束时间</p>
                <p>
                    {{item.enddate.split(' ')[0]}}<br>
                    {{item.enddate.split(' ')[1]}}
                </p>
            </div>
        </swiper-slide>
        <div class="swiper-button-next"  slot="button-prev">
            <span class="xe-iconfont xe-icon-double-arrow-right"></span>
        </div>
        <div class="swiper-button-prev"  slot="button-next">
            <span class="xe-iconfont xe-icon-double-arrow-right"></span>
        </div>
    </swiper>
</template>

<script>
    import {swiper, swiperSlide} from 'vue-awesome-swiper';
    export default {
        components: {
            swiper,
            swiperSlide
        },
        props: {
            timedata: {
                type: Array,
                default: []
            },
            priceUnit: {
                type: String,
                default: ''
            }
        },
        data() {
            return {
                itemdata: [],
                speed: 500,
                swiperOption: {
                    autoHeight: true,
                    navigation: {
                        nextEl: '.swiper-button-next',
                        prevEl: '.swiper-button-prev'
                    }
                }
            };
        },
        created() {
            this.itemdata = this.timedata;
            this.$nextTick(() => {
                this.sliderTo();
            });
        },
        mounted () {
            this.$bus.$on('yschange', () => {
                this.sliderTo();
            });
        },
        methods: {
            sliderTo() {
                this.$refs.swiperControl.swiper.slideTo(this.getNowTimeIndex >= 0 ? this.getNowTimeIndex : this.getNextTimeIndex, this.speed, false);
            }
        },
        computed: {
            getDisTime() {
                // 已结束的时间段
                let nowtime = new Date().getTime();
                let result = {};
                this.itemdata.forEach((item, index) => {
                    let start = new Date(item.startdate).getTime();
                    let end = new Date(item.enddate).getTime();
                    result[index] = start <= nowtime && end <= nowtime;
                });
                return result;
            },
            getNowTimeIndex() {
                // 正在进行的时间段index
                let nowtime = new Date().getTime();
                return this.itemdata.findIndex(item => {
                    let start = new Date(item.startdate).getTime();
                    let end = new Date(item.enddate).getTime();
                    return nowtime >= start && nowtime <= end;
                });
            },
            getNextTimeIndex() {
                // 根据getNowTimeIndex查即将要开始的时间index
                if (this.getNowTimeIndex === -1) {
                    let nowtime = new Date().getTime();
                    return this.itemdata.findIndex(item => {
                        let start = new Date(item.startdate).getTime();
                        return start > nowtime;
                    });
                } else {
                    return 0;
                }
            }
        },
        watch: {
            'timedata'(val) {
                this.itemdata = this.timedata;
                this.$nextTick(() => {
                    this.sliderTo();
                });
            }
        }
    };
</script>

<style lang="scss">
    @import '../../static/styles/rules.scss';
    .m-ystimes {
        padding: 25/$ppr 0;
        border-top: 1/$ppr solid $border-color-e8e;
        .item {
            display: flex;
            align-items: center;
            padding: 0 25/$ppr;
            > div {
                flex: 1;
                text-align: center;
                font-size: 24/$ppr;
            }
            .price {
                color: $main-color;
                line-height: 1.2;
                .normal {
                    font-size: 38/$ppr;
                }
            }
            .time {
                color: $text-999;
                p {
                    margin: 2/$ppr 0;
                    line-height: 1.2;
                }
            }
            &.disable {
                .price {
                    color: $text-999;
                }
            }
        }
        .swiper-button-next,
        .swiper-button-prev {
            width: 50/$ppr;
            height: 50/$ppr;
            line-height: 50/$ppr;
            margin-top: -25/$ppr;
            background: none;
            span {
                width: 100%;
                height: 100%;
                font-size: 30/$ppr;
                display: block;
            }
            // &.swiper-button-disabled {
            //     display: none;
            // }
        }
        .swiper-button-prev {
            left: 0/$ppr;
            text-align: left;
        }
        .swiper-button-next {
            right: 0/$ppr;
            text-align: left;
            span {
                transform: rotate(180deg);
            }
        }
    }
</style>
