<script>
export default {
	onLaunch: function() {
		console.log('app Launch');
	},
	onShow: function() {
		console.log('app Show');
	},
	onHide: function() {
		console.log('app Hide');
	}
};
</script>

<style>
/* 解决头条小程序组件内引入字体不生效的问题 */
/* #ifdef MP-TOUTIaO */
@font-face {
	font-family: uniicons;
	src: url('/static/uni.ttf');
}
/* #endif */
</style>
