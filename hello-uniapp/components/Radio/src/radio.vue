<template>
    <view @click="handleRadioClick"
        class="van-radio"
        :class="{
            'van-radio--disabled': isDisabled
        }">
        <span class="van-radio__input">
            <input
                :value="label"
                v-model="currentValue"
                type="radio"
                class="van-radio__control"
                :disabled="isDisabled">
            <span class="xe-iconfont" :class="{
                'xe-icon-rfill2': currentValue === label,
                'xe-icon-iconfont-xuanze': currentValue !== label
            }">
            </span>
        </span>
        <span class="van-radio__label" @click="handleLabelClick">
            <slot></slot>
        </span>
    </view>
</template>
<script type="text/ecmascript-6">
    import findParent from '@/mixins/findParent';
    export default {
        name: 'xe-radio',
        mixins: [findParent],
        props: {
            disabled: Boolean,
            value: {},
            label: [String, Number]
        },
        computed: {
            isGroup() {
                return !!this.findParentByComponentName('xe-radio-group');
            },
            currentValue: {
                get() {
                    return this.isGroup && this.parentGroup ? this.parentGroup.value : this.value;
                },
                set(val) {
                    if (this.isGroup && this.parentGroup) {
                        this.parentGroup.$emit('input', val);
                    } else {
                        this.$emit('input', val);
                    }
                }
            },
            isDisabled() {
                return this.isGroup && this.parentGroup
                    ? this.parentGroup.disabled || this.disabled
                    : this.disabled;
            }
        },
        methods: {
            handleLabelClick() {
                if (this.isDisabled) {
                    return;
                }
                this.currentValue = this.label;
            },
            handleRadioClick() {
                this.$emit('click');
            }
        }
    };

</script>
<style rel="stylesheet/scss" lang="scss"></style>
