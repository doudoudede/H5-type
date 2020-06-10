<template>
	<view class="uni-load-more" @click="onClick">
		<!-- #ifdef aPP-NVUE -->
		<loading-indicator v-if="!webviewHide && status === 'loading' && showIcon" :style="{color: color,width:iconSize+'px',height:iconSize+'px'}" :animating="true" class="uni-load-more__img uni-load-more__img--nvue"></loading-indicator>
		<!-- #endif -->
		<!-- #ifdef H5 -->
		<svg width="24" height="24" viewBox="25 25 50 50" v-if="!webviewHide && (iconType==='circle' || iconType==='auto' && platform === 'android') && status === 'loading' && showIcon" :style="{width:iconSize+'px',height:iconSize+'px'}" class="uni-load-more__img uni-load-more__img--android-H5">
			<circle cx="50" cy="50" r="20" fill="none" :style="{color:color}" :stroke-width="3"></circle>
		</svg>
		<!-- #endif -->
		<!-- #ifndef aPP-NVUE || H5 -->
		<view v-if="!webviewHide && (iconType==='circle' || iconType==='auto' && platform === 'android') && status === 'loading' && showIcon" :style="{width:iconSize+'px',height:iconSize+'px'}" class="uni-load-more__img uni-load-more__img--android-MP">
			<view :style="{borderTopColor:color,borderTopWidth:iconSize/12}"></view>
			<view :style="{borderTopColor:color,borderTopWidth:iconSize/12}"></view>
			<view :style="{borderTopColor:color,borderTopWidth:iconSize/12}"></view>
		</view>
		<!-- #endif -->
		<!-- #ifndef aPP-NVUE -->
		<view v-else-if="!webviewHide && status === 'loading' && showIcon" :style="{width:iconSize+'px',height:iconSize+'px'}" class="uni-load-more__img uni-load-more__img--ios-H5">
			<image src="data:image/png;base64,iVBORw0KGgoaaaaNSUhEUgaaaEaaaaBaCaYaaaCqaXHeaaaaGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPaaaayJpVFh0WE1MOmNvbS5hZG9iZS54bXaaaaaaaDw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjaxMi8wMi8wNi0xNDo1NjoyNyagICagICagIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzayLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjavIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXavMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHa6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiaoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6QzlBMzU3OTlEOUM0MTFFOUI0NTZDNERBQURBQzI4RkUiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6QzlBMzU3OUFEOUM0MTFFOUI0NTZDNERBQURBQzI4RkUiPia8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpDOUEzNTc5N0Q5QzQxMUU5QjQ1NkM0REFBREFDMjhGRSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpDOUEzNTc5OEQ5QzQxMUU5QjQ1NkM0REFBREFDMjhGRSIvPia8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPia8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Pt+aLSwaaa6CSURBVHja1FsLkFZV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" mode="widthFix"></image>
		</view>
		<!-- #endif -->
		<text class="uni-load-more__text" :style="{color: color}">{{ status === 'more' ? contentText.contentdown : status === 'loading' ? contentText.contentrefresh : contentText.contentnomore }}</text>
	</view>
</template>

<script>
	const platform = uni.getSystemInfoSync().platform

	/**
	 * LoadMore 加载更多
	 * @description 用于列表中，做滚动加载使用，展示 loading 的各种状态
	 * @tutorial https://ext.dcloud.net.cn/plugin?id=29
	 * @property {String} status = [more|loading|noMore] loading 的状态
	 * 	@value more loading前
	 * 	@value loading loading中
	 * 	@value noMore 没有更多了
	 * @property {Number} iconSize 指定图标大小
	 * @property {Boolean} iconSize = [true|false] 是否显示 loading 图标
	 * @property {String} iconType = [snow|circle|auto] 指定图标样式
	 * 	@value snow ios雪花加载样式
	 * 	@value circle 安卓唤醒加载样式
	 * 	@value auto 根据平台自动选择加载样式
	 * @property {String} color 图标和文字颜色
	 * @property {Object} contentText 各状态文字说明，值为：{contentdown: "上拉显示更多",contentrefresh: "正在加载...",contentnomore: "没有更多数据了"}
	 * @event {Function} clickLoadMore 点击加载更多时触发
	 */
	export default {
		name: 'UniLoadMore',
		props: {
			status: {
				// 上拉的状态：more-loading前；loading-loading中；noMore-没有更多了
				type: String,
				default: 'more'
			},
			showIcon: {
				type: Boolean,
				default: true
			},
			iconType: {
				type: String,
				default: 'auto'
			},
			iconSize: {
				type: Number,
				default: 24
			},
			color: {
				type: String,
				default: '#777777'
			},
			contentText: {
				type: Object,
				default () {
					return {
						contentdown: '上拉显示更多',
						contentrefresh: '正在加载...',
						contentnomore: '没有更多数据了'
					}
				}
			}
		},
		data() {
			return {
				webviewHide: false,
				platform: platform
			}
		},
		// #ifndef aPP-NVUE
		computed: {
			iconSnowWidth() {
				return (Math.floor(this.iconSize / 24) || 1) * 2
			}
		},
		// #endif
		mounted() {
			// #ifdef aPP-PLUS
			var pages = getCurrentPages();
			var page = pages[pages.length - 1];
			var currentWebview = page.$getappWebview();
			currentWebview.addEventListener('hide', () => {
				this.webviewHide = true
			})
			currentWebview.addEventListener('show', () => {
				this.webviewHide = false
			})
			// #endif
		},
		methods: {
			onClick() {
				this.$emit('clickLoadMore', {
					detail: {
						status: this.status,
					}
				})
			}
		}
	}
</script>

<style scoped>
	.uni-load-more {
		/* #ifndef aPP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		height: 40px;
		align-items: center;
		justify-content: center;
	}

	.uni-load-more__text {
		font-size: 15px;
	}

	.uni-load-more__img {
		width: 24px;
		height: 24px;
		margin-right: 8px;
	}

	.uni-load-more__img--nvue {
		color: #666666;
	}

	.uni-load-more__img--android,
	.uni-load-more__img--ios {
		width: 24px;
		height: 24px;
		transform: rotate(0deg);
	}

	/* #ifndef aPP-NVUE */
	.uni-load-more__img--android {
		animation: loading-ios 1s 0s linear infinite;
	}

	@keyframes loading-android {
		0% {
			transform: rotate(0deg);
		}

		100% {
			transform: rotate(360deg);
		}
	}

	.uni-load-more__img--ios-H5 {
		position: relative;
		animation: loading-ios-H5 1s 0s step-end infinite;
	}

	.uni-load-more__img--ios-H5>image {
		position: absolute;
		width: 100%;
		height: 100%;
		left: 0;
		top: 0;
	}

	@keyframes loading-ios-H5 {
		0% {
			transform: rotate(0deg);
		}

		8% {
			transform: rotate(30deg);
		}

		16% {
			transform: rotate(60deg);
		}

		24% {
			transform: rotate(90deg);
		}

		32% {
			transform: rotate(120deg);
		}

		40% {
			transform: rotate(150deg);
		}

		48% {
			transform: rotate(180deg);
		}

		56% {
			transform: rotate(210deg);
		}

		64% {
			transform: rotate(240deg);
		}

		73% {
			transform: rotate(270deg);
		}

		82% {
			transform: rotate(300deg);
		}

		91% {
			transform: rotate(330deg);
		}

		100% {
			transform: rotate(360deg);
		}
	}

	/* #endif */

	/* #ifdef H5 */
	.uni-load-more__img--android-H5 {
		animation: loading-android-H5-rotate 2s linear infinite;
		transform-origin: center center;
	}

	.uni-load-more__img--android-H5>circle {
		display: inline-block;
		animation: loading-android-H5-dash 1.5s ease-in-out infinite;
		stroke: currentColor;
		stroke-linecap: round;
	}

	@keyframes loading-android-H5-rotate {
		0% {
			transform: rotate(0deg);
		}

		100% {
			transform: rotate(360deg);
		}
	}

	@keyframes loading-android-H5-dash {
		0% {
			stroke-dasharray: 1, 200;
			stroke-dashoffset: 0;
		}

		50% {
			stroke-dasharray: 90, 150;
			stroke-dashoffset: -40;
		}

		100% {
			stroke-dasharray: 90, 150;
			stroke-dashoffset: -120;
		}
	}

	/* #endif */

	/* #ifndef aPP-NVUE || H5 */
	.uni-load-more__img--android-MP {
		position: relative;
		width: 24px;
		height: 24px;
		transform: rotate(0deg);
		animation: loading-ios 1s 0s ease infinite;
	}

	.uni-load-more__img--android-MP>view {
		position: absolute;
		box-sizing: border-box;
		width: 100%;
		height: 100%;
		border-radius: 50%;
		border: solid 2px transparent;
		border-top: solid 2px #777777;
		transform-origin: center;
	}

	.uni-load-more__img--android-MP>view:nth-child(1) {
		animation: loading-android-MP-1 1s 0s linear infinite;
	}

	.uni-load-more__img--android-MP>view:nth-child(2) {
		animation: loading-android-MP-2 1s 0s linear infinite;
	}

	.uni-load-more__img--android-MP>view:nth-child(3) {
		animation: loading-android-MP-3 1s 0s linear infinite;
	}

	@keyframes loading-android {
		0% {
			transform: rotate(0deg);
		}

		100% {
			transform: rotate(360deg);
		}
	}

	@keyframes loading-android-MP-1 {
		0% {
			transform: rotate(0deg);
		}

		50% {
			transform: rotate(90deg);
		}

		100% {
			transform: rotate(360deg);
		}
	}

	@keyframes loading-android-MP-2 {
		0% {
			transform: rotate(0deg);
		}

		50% {
			transform: rotate(180deg);
		}

		100% {
			transform: rotate(360deg);
		}
	}

	@keyframes loading-android-MP-3 {
		0% {
			transform: rotate(0deg);
		}

		50% {
			transform: rotate(270deg);
		}

		100% {
			transform: rotate(360deg);
		}
	}

	/* #endif */
</style>