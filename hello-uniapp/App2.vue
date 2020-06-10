<template>
    <div id="app">
        <keep-alive>
            <router-view v-if="$route.meta.keepAlive"></router-view>
        </keep-alive>
        <router-view v-if="!$route.meta.keepAlive"></router-view>
        <NavBar v-show="showBar"></NavBar>
    </div>
</template>

<script>
    import NavBar from 'components/NavBar/NavBar';
    export default {
        name: 'app',
        data() {
            return {
                showBar: false
            };
        },
        components: {
            NavBar
        },
        created () {
            var scriptTag = document.createElement('script');
            scriptTag.type = 'text/javascript';
            scriptTag.async = true;
            scriptTag.charset = 'utf-8';
            scriptTag.src = 'https://w.cnzz.com/c.php?id=1274931453&async=1';
            var roots = document.getElementsByTagName('script')[0];
            roots.parentNode.insertBefore(scriptTag, roots);

            var hm = document.createElement('script');
            hm.type = 'text/javascript';
            hm.async = true;
            hm.charset = 'utf-8';
            hm.src = 'https://hm.baidu.com/hm.js?19b147a723dd93353941c6afbc4334c4';
            var s = document.getElementsByTagName('script')[0];
            s.parentNode.insertBefore(hm, s);
        },
        mounted() {
            var data = {cityName: "北京市", areaName: "崇文区", cityId: 2, provinceName: "北京", areaId: 5, provinceId: 1}
            this.$setLocalStorage('REGIONMAP', JSON.stringify(data));
            let that = this;
            this.$nextTick(() => {
                document.addEventListener('message', function(ev) {
                    // alert(ev.data);
                    console.log('ev', ev);
                    var status = JSON.parse(ev.data);
                    if (status.type === 'special' && status.payload.goPage === 'imgUpload') {
                        that.$bus.$emit('imgUpload', {
                            imgUrl: status.payload.imgUrl,
                            picServer: status.payload.picServer,
                            imgType: status.payload.imgType
                        });
                    } else if (status.type === 'login') {
                        let goAutonPerson = {
                            status: JSON.stringify(status.payload.authStatus)
                        };
                        console.log('2-status======$$$$--', status);
                        that.goAutonPerson(goAutonPerson);
                        if (status.payload.loginStatus) {
                            let areaRegionMap = {
                                areaId: status.payload.areaId
                            };
                            that.$setLocalStorage('REGIONMAP', JSON.stringify(areaRegionMap));
                            that.$setLocalStorage('LOGINSTATUS', status.payload.loginStatus);
                        }
                    } else if (status.type === 'getParams') {
                        that.$bus.$emit('getParams', status.payload);
                        console.log('getPa========rams', status.payload);
                    } else if (status.type === 'appear') {
                        that.$bus.$emit('appear', status.payload);
                    }
                });
            });
        },
        watch: {
            '$route'(to) {
                if (!to.meta.noShowBar) {
                    this.showBar = true;
                } else {
                    this.showBar = false;
                }
            }
        }
    };
</script>

<style lang="scss">
    @import './static/styles/index.scss';
    /*.child-view {*/
        /*position: absolute;*/
        /*left: 0;*/
        /*top: 0;*/
        /*right: 0;*/
        /*bottom: 0;*/
        /*transition: all .4s cubic-bezier(.55,0,.1,1);*/
    /*}*/
    /*.slide-left-enter {*/
        /*opacity: 0;*/
        /*-webkit-transform: translate(30px, 0);*/
        /*transform: translate( 30px,0);*/
    /*}*/
    /*.slide-left-leave-to {*/
        /*opacity: 0;*/
        /*-webkit-transform: translate(-30px, 0);*/
        /*transform: translate(-30px, 0);*/
    /*}*/
</style>
