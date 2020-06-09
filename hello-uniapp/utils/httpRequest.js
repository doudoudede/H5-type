import axios from 'axios';
import { getLocalStorage } from 'utils/commonBase';
import router from '@/router';
import { MessageBox, Toast } from 'mint-ui';

let httpRequest = axios.create({
    timeout: 50000,
    baseURL: ''
});
httpRequest.interceptors.request.use((config) => {
    let loginStatustr = getLocalStorage('LOGINSTATUS');
    config.headers.uuid = getLocalStorage('UUID');
    config.headers['app-source'] = 3;
    if (loginStatustr) {
        config.headers.loginStatus = loginStatustr;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});
// code状态码200判断
httpRequest.interceptors.response.use((res) => {
    if (res.data.status === '0000') {
        return res.data;
    } else if (res.data.status === '0004') {
        if (router.currentRoute.name === 'Cart') {
            router.replace({ name: 'Login', query: { redirect: router.currentRoute.fullPath } });
        } else {
            MessageBox.close();
            MessageBox({
                message: res.data.msg,
                showCancelButton: true,
                confirmButtonText: '立即登录',
                closeOnClickModal: false
            }).then(action => {
                if (action === 'confirm') {
                    router.push({ name: 'Login', query: { redirect: router.currentRoute.fullPath } });
                }
            });
        };
        return Promise.reject(res);
    } else if (res.data.status === '0006') {
        // 针对详情页加入购物车全局抛错（点确定）不能刷新页面的解决方法
        Toast({
            message: '该商品预售活动已结束',
            duration: 1000
        });
        window.location.reload();
        return Promise.reject(res);
    } else if (res.data.status === '0001') {
        MessageBox({
            message: res.data.msg,
            showCancelButton: false,
            confirmButtonText: '确定',
            closeOnClickModal: false
        }).then(action => {
            if (action === 'confirm') {
                router.push({ name: 'Login', query: { redirect: router.currentRoute.fullPath } });
            }
        });
    } else {
        MessageBox.close();
        MessageBox.alert(res.data.msg);
        return Promise.reject(res);
    }
}, (error) => {
    if (axios.isCancel(error)) {
        // console.log('Request canceled', error.message);
        return Promise.reject({ status: 'cancel' });
    } else {
        // handle error
        MessageBox.close();
        MessageBox.alert('网络不稳定,请刷新重试~');
        /* eslint-disable prefer-promise-reject-errors */
        return Promise.reject({ status: 'xe404' });
    }
});
export default httpRequest;