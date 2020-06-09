<template>
    <view class="van-checkbox"
    :class="{
        'van-checkbox--disabled': isDisabled,
        'van-checkbox--large': !!size,
        'van-checkbox--small': !size
    }">
        <span class="van-checkbox__input">
            <input
            v-model="currentValue"
            type="checkbox"
            class="van-checkbox__control"
            :disabled="isDisabled">
            <span class="xe-iconfont" :class="{
            'xe-icon-rfill2': isChecked,
            'xe-icon-iconfont-xuanze': !isChecked
            }">
            </span>
        </span>
        <span class="van-checkbox__label" @click="handleLabelClick">
            <slot></slot>
        </span>
    </view>
</template>

<script>
    import findParent from '@/mixins/findParent';
    export default {
        name: 'xe-checkbox',
        mixins: [findParent],
        props: {
            disabled: Boolean,
            value: {},
            label: [String, Number],
            size: [String]
        },
        computed: {
            /**
             * `checkbox`是否在`van-checkbox-group`中
             */
            isGroup() {
                return !!this.findParentByComponentName('xe-checkbox-group');
            },
            /**
             * `checkbox`当前值
             */
            currentValue: {
                get() {
                    return this.isGroup && this.parentGroup ? this.parentGroup.value.indexOf(this.label) !== -1 : this.value;
                },
                set(val) {
                    if (this.isGroup && this.parentGroup) {
                        const parentValue = this.parentGroup.value.slice();
                        if (val) {
                            /* istanbul ignore else */
                            if (parentValue.indexOf(this.label) === -1) {
                                parentValue.push(this.label);
                                this.parentGroup.$emit('input', parentValue);
                            }
                        } else {
                            const index = parentValue.indexOf(this.label);
                            /* istanbul ignore else */
                            if (index !== -1) {
                                parentValue.splice(index, 1);
                                this.parentGroup.$emit('input', parentValue);
                            }
                        }
                    } else {
                        this.$emit('input', val);
                    }
                }
            },
            /**
             * `checkbox`是否被选中
             */
            isChecked() {
                const currentValue = this.currentValue;
                if ({}.toString.call(currentValue) === '[object Boolean]') {
                    return currentValue;
                } else if (currentValue !== null && currentValue !== undefined) {
                    return currentValue === this.label;
                }
            },
            /**
             * `checkbox`是否被禁用
             */
            isDisabled() {
                return this.isGroup && this.parentGroup
                    ? this.parentGroup.disabled
                    : this.disabled;
            }
        },

        methods: {
            handleLabelClick() {
                if (this.isDisabled) {
                    return;
                }
                this.currentValue = !this.currentValue;
            }
        }
    };
</script>
