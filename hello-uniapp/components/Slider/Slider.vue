<template>
    <swiper :options="swiperOption" class="swiper-box" ref="swiperControl">
        <swiper-slide class="swiper-item" v-for="(item, index) in sliderData" :key="index" style="position:relative">
            <a href="#" @click.prevent="itemClickFn(item)">
                <img :data-src="picServer + urlPath + item[keyProps.keyName]" class="swiper-lazy" @click="goStore(item)">
            </a>
            <div class="swiper-lazy-preloader"></div>
            <div class="pro-itemPicbox" v-if="vendorPicFlag && item.proSpuInfo.length">
                <router-link tag="div"  class="pic-con"  v-for="(items, indexs) in item.proSpuInfo" :key="items.proSpu" v-if="indexs <= 2" :to="{name: 'ProductDetails', params: {prospu: items.proSpu}}">
                    <img :src="picServerPro + items.proMainImg" alt="">
                </router-link>
            </div>
        </swiper-slide>
        <div class="swiper-pagination" v-if="!defautlOption" slot="pagination"></div>
    </swiper>
</template>
<script type="text/ecmascript-6">
    import {Swiper, swiper, swiperSlide} from 'vue-awesome-swiper';
    import {getXeUrl} from 'utils';
    export default {
        name: 'xe-slider',
        props: {
            picServer: {
                type: String,
                default: ''
            },
            picServerPro: {
                // 需要多个server的时候用到这个
                type: String,
                default: ''
            },
            keyProps: {
                type: Object,
                default() {
                    return {
                        keyName: 'imgUrl'
                    };
                }
            },
            urlPath: {
                type: String,
                default: ''
            },
            sliderData: {
                type: Array,
                default: []
            },
            autoPlay: {
                // 是否自动播放
                type: Boolean,
                default: false
            },
            vendorPicFlag: {
                // 优质商户页面录播中显示的小图默认不展示
                type: Boolean,
                default: false
            },
            autoPlayOptions: {
                type: Object,
                default() {
                    return {
                        delay: 5000,
                        disableOnInteraction: false
                    };
                }
            },
            defautlOption: {
                // 首页中的轮播样式展示默认为不展示当为true的时候才展示
                type: Boolean,
                default: false
            },
            loop: {
                type: Boolean,
                default: false
            },
            lazyLoading: {
                type: Boolean,
                default: true
            }
        },
        data() {
            return {
            };
        },
        mounted () {
            window.addEventListener('orientationchange', this.orient, false);
        },
        methods: {
            itemClickFn(item) {
                getXeUrl(item, this.$router);
            },
            goStore(item) {
                console.log('item', item);
                if (this.vendorPicFlag) {
                    this.$router.push({
                        name: 'Store',
                        query: {userCode: item.userCode}
                    });
                }
            },
            orient() {
                if (this.$refs.swiperControl.swiper) {
                    setTimeout(() => {
                        this.$refs.swiperControl.swiper.update(true);
                    }, 500);
                }
            }
        },
        watch: {
            sliderData(val) {
                if (this.$refs.swiperControl.swiper) {
                    this.$refs.swiperControl.swiper.destroy && this.$refs.swiperControl.swiper.destroy();
                    this.$nextTick(() => {
                        /* eslint-disable no-new */
                        this.$refs.swiperControl.swiper = new Swiper(this.$refs.swiperControl.$el, this.swiperOption);
                    });
                }
            }
        },
        computed: {
            swiperOption() {
                let obj = {
                    notNextTick: true,
                    loop: this.loop,
                    autoplay: this.autoPlay ? this.autoPlayOptions : false,
                    pagination: {
                        el: '.swiper-pagination',
                        dynamicBullets: true,
                        clickable: true
                    },
                    lazy: {
                        loadPrevNext: this.lazyLoading
                    }
                };
                let newOpt = {
                    roundLengths: true,
                    initialSlide: 2,
                    slidesPerView: 'auto',
                    centeredSlides: true,
                    followFinger: false
                };
                if (this.defautlOption) {
                    obj = Object.assign({}, obj, newOpt);
                }
                return obj;
            }
        },
        components: {
            swiper,
            swiperSlide
        },
        beforeDestroy () {
            window.removeEventListener('orientationchange', this.orient, false);
        }
    };
</script>
<style rel="stylesheet/scss" lang="scss"></style>
