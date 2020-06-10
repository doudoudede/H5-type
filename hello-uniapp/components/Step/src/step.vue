<template>
    <div class="xe-step">
        <ul class="xe-step-content">
            <slot></slot>
        </ul>
    </div>
</template>
<script>
    export default {
        name: 'xe-step',
        props: {
            current: {
                validator(val) {
                    return /^\d*$/.test(val);
                },
                default: 0
            }
        },
        methods: {
            updateChild() {
                let childrens = this.$children.filter(item => item.$options.name === 'xe-step-item');
                childrens.forEach((item, index) => {
                    item.stepNumber = index + 1;
                    item.current = this.current;
                });
            }
        },
        watch: {
            current() {
                this.$nextTick(() => {
                    this.updateChild();
                });
            }
        }
    };
</script>
<style lang="scss">
    @import '../../../static/styles/components/step.scss';
</style>
