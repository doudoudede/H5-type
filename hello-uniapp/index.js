import Vue from 'vue';
import VueRouter from 'vue-router';
import routes from './routes';
import { getLocalStorage, setLocalStorage, removeLocalStorage } from 'utils/commonBase';
// import Cookies from 'js-cookie';
Vue.use(VueRouter);

const router = new VueRouter({
    // mode: 'history',
    // scrollBehavior,
    routes
});

// router.beforeEach((to, from, next) => {
//     document.title = to.meta.name;
//     let areaRegionMap = getLocalStorage('REGIONMAP');
//     let loginStatus = getLocalStorage('LOGINSTATUS');
//     if (loginStatus === 'undefined') {
//         removeLocalStorage('LOGINSTATUS');
//     }
//     if (to.meta.noAuthArea) {
//         // 不需要验证是否有区域信息
//         next();
//     } else {
//         if ((to.name === 'PersonalInfor' || to.name === 'AuFailure' || to.name === 'IdentityAuthentication' || to.name === 'AuctionArea' || to.name === 'MyAuction') && to.query.loginStatus && to.query.areaId) {
//             // 实名认证且是在APP下打开
//             setLocalStorage('REGIONMAP', JSON.stringify({
//                 areaId: decodeURI(to.query.areaId),
//                 areaName: decodeURI(to.query.areaName),
//                 cityId: decodeURI(to.query.cityId),
//                 cityName: decodeURI(to.query.cityName),
//                 provinceId: decodeURI(to.query.provinceId),
//                 provinceName: decodeURI(to.query.provinceName)
//             }));
//             setLocalStorage('LOGINSTATUS', to.query.loginStatus);
//             next();
//         } else {
//             if (!areaRegionMap) {
//                 // 无区域信息
//                 next({
//                     name: 'Location',
//                     query: {
//                         redirect: to.path
//                     }
//                 });
//                 next();
//             } else if (to.meta.auth) {
//                 if (!loginStatus) {
//                     next({
//                         name: 'Login',
//                         query: {
//                             redirect: to.fullPath
//                         }
//                     });
//                 } else {
//                     next();
//                 }
//             } else {
//                 next();
//             }
//         }
//     };
// });
export default router;