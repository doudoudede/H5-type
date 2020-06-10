<template>
    <div :class="classes">
        <transition name="fadein">
            <v-touch tag="div" v-show="showBox" class="m-mask-bg" @tap="close" @touchmove.prevent></v-touch>
        </transition>
        <transition :name="slideInType">
            <div class="content" v-show="showBox">
                <div class="popup-header">{{popupTit}}</div>
                <div class="popup-close xe-iconfont xe-icon-guanbi" @click.stop="close"></div>
                <div class="popup-box">
                    <slot></slot>
                </div>
            </div>
        </transition>
    </div>
</template>
<script type="text/ecmascript-6">
    export default {
        name: 'xe-popup',
        props: {
            popupTit: {
                type: String,
                required: true
            },
            show: {
                type: Boolean,
                default: false
            },
            size: {
                type: String,
                default: 'normal'
            },
            position: {
                type: String,
                default: 'bottom'
            }
        },
        data() {
            return {
                bodyScrollTop: null
            };
        },
        methods: {
            close() {
                this.$emit('update:show', false);
            }
        },
        computed: {
            showBox() {
                return this.show;
            },
            classes() {
                return [
                    'm-popup',
                    {
                        [`m-popup-${this.position}`]: !!this.position,
                        [`m-popup-${this.size}`]: !!this.size
                    }
                ];
            },
            slideInType() {
                let obj = {
                    'bottom': 'slideInDown',
                    'right': 'slideInRight'
                };
                return obj[this.position];
            }
        },
        watch: {
            showBox(val) {
                if (val) {
                    this.bodyScrollTop = document.body.scrollTop;
                    document.body.className = 'overflowHide';
                } else {
                    document.body.className = '';
                    window.scrollTo(0, this.bodyScrollTop);
                }
            }
        },
        beforeDestroy() {
            document.body.className = '';
        }
    };
</script>
<style rel="stylesheet/scss" lang="scss"></style>
