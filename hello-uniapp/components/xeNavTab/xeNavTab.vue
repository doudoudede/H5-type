<template>
    <view class="xe-navtab-contanier">
        <swiper :options="swiperOption" class="xe-navtab-con" :class="{'showarrow': showArrow}" ref="swiperControl">
            <swiper-slide
                :class="{'current': activeIndex === index}"
                v-for="(item, index) in itemData"
                :key="item.id"
            >
                <span>{{item.name}}</span>
            </swiper-slide>
        </swiper>
        <view v-if="showArrow" class="xe-navtab-arrow xe-iconfont xe-icon-unfold"></view>
    </view>
</template>
<script type="text/ecmascript-6">
    import { swiper, swiperSlide } from 'vue-awesome-swiper';
    export default {
        name: 'xe-navtab-con',
        props: {
            itemData: {
                type: Array,
                default() {
                    return [];
                }
            },
            showArrow: {
                type: Boolean,
                default: false
            }
        },
        data() {
            let _this = this;
            return {
                swiperOption: {
                    notNextTick: true,
                    visibleSlides: 'auto',
                    setWrapperSize: true,
                    freeMode: true,
                    freeModeMomentum: true,
                    autoPlay: false,
                    loop: false,
                    slidesPerView: 'auto',
                    on: {
                        tap: function(event) {
                            event.stopPropagation();
                            let index = this.clickedIndex;
                            let domSlider = this.clickedSlide;
                            if (index === undefined || domSlider === undefined) {
                                // 判断是否点击的是SLIDER
                                return;
                            }
                            _this.activeIndex = index;
                            this.slideTo(index - 1);
                            if (domSlider.className.indexOf('current') < 0) {
                                _this.$emit('swiperItemClick', _this.itemData[index]);
                            }
                        }
                    }
                },
                activeIndex: 0
            };
        },
        methods: {
            setDefault(type) {
                // type
                let index = this.getIndexByType(type);
                if (index === null) {
                    this.swiper.slideTo(0, 500, false); // 切换到指定slide，速度为1秒
                    this.activeIndex = 0;
                } else {
                    this.swiper.slideTo(index - 1, 500, false); // 切换到指定slide，速度为1秒
                    this.activeIndex = index;
                }
            },
            getIndexByType(type) {
                let result = null;
                this.itemData.some((item, index) => {
                    if (item.id === type) {
                        result = index;
                        return true;
                    }
                });
                return result;
            }
        },
        computed: {
            swiper() {
                return this.$refs.swiperControl.swiper;
            }
        },
        components: {
            swiper,
            swiperSlide
        }
    };
</script>
