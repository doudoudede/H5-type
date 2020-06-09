/**
 * Created by zhangwen on 2017/8/23.
 */
let NODE_ENVS = process.env.NODE_ENV;
/*
    REGIONMAP 区域信息
    LOGINSTATUS 登录状态
 */
export function setLocalStorage(key, value) {
    switch (NODE_ENVS) {
        case 'production':
            window.localStorage.setItem(`${key}`, value);
            break;
        case 'qa':
            window.localStorage.setItem(`${key}_QA`, value);
            break;
        default :
            window.localStorage.setItem(`${key}_DEV`, value);
    }
}
export function getLocalStorage(key) {
    let result = null;
    switch (NODE_ENVS) {
        case 'production':
            result = window.localStorage.getItem(`${key}`);
            break;
        case 'qa':
            result = window.localStorage.getItem(`${key}_QA`);
            break;
        default :
            result = window.localStorage.getItem(`${key}_DEV`);
    }
    return result;
}
export function removeLocalStorage(key) {
    switch (NODE_ENVS) {
        case 'production':
            window.localStorage.removeItem(`${key}`);
            break;
        case 'qa':
            window.localStorage.removeItem(`${key}_QA`);
            break;
        default :
            window.localStorage.removeItem(`${key}_DEV`);
    }
}
