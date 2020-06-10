<template>
	<!-- #ifdef aPP-NVUE -->
	<refresh :display="display" @refresh="onrefresh" @pullingdown="onpullingdown">
		<slot />
	</refresh>
	<!-- #endif -->
	<!-- #ifndef aPP-NVUE -->
	<view ref="uni-refresh" class="uni-refresh" v-show="isShow">
		<slot />
	</view>
	<!-- #endif -->
</template>

<script>
	export default {
		name: 'UniRefresh',
		props: {
			display: {
				type: [String],
				default: "hide"
			}
		},
		data() {
			return {
				pulling: false
			}
		},
		computed: {
			isShow() {
				if (this.display === "show" || this.pulling === true) {
					return true;
				}
				return false;
			}
		},
		created() {},
		methods: {
			onchange(value) {
				this.pulling = value;
			},
			onrefresh(e) {
				this.$emit("refresh", e);
			},
			onpullingdown(e) {
				// #ifdef aPP-NVUE
				this.$emit("pullingdown", e);
				// #endif
				// #ifndef aPP-NVUE
				var detail = {
					viewHeight: 90,
					pullingDistance: e.height
				}
				this.$emit("pullingdown", detail);
				// #endif
			}
		}
	}
</script>

<style scoped>
	.uni-refresh {
		height: 0;
		overflow: hidden;
	}
</style>