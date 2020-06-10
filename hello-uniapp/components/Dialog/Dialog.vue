<template>
    <div class="m-dialog">
        <transition name="fadein">
            <div v-show="showBox" class="m-mask-bg" @click.stop="close" @touchmove.prevent></div>
        </transition>
        <transition name="slideMoveIn">
            <div v-show="showBox" class="m-dialog-box">
                <div class="m-dialog-close" v-show='showClose' @click.prevent="close"><span class="xe-iconfont xe-icon-guanbi"></span></div>
                <div class="m-dialog-content">
                    <slot></slot>
                </div>
                <div class="m-dialog-footer" v-if="$slots.footer">
                    <slot name="footer"></slot>
                </div>
            </div>
        </transition>
    </div>
</template>
<script type="text/ecmascript-6">
    export default {
        name: 'xe-dialog',
        props: {
            show: {
                type: Boolean,
                default: false
            },
            showClose: {
                type: Boolean,
                default: false
            }
        },
        methods: {
            close() {
                this.$emit('update:show', false);
            }
        },
        computed: {
            showBox() {
                return this.show;
            }
        }
    };
</script>
<style rel="stylesheet/scss" lang="scss">
    @import '../../static/styles/components/dialog.scss';
</style>
