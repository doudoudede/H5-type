/**
 * Created by zhangwen on 2017/8/18.
 */
import {getLocalStorage} from 'utils/commonBase';
export function getXeUrl(item, routerFn, $route) {
    if (item.contentType === 1) {
        // 商品详情页
        routerFn.push({name: 'ProductDetails', params: {prospu: item.proSpu}, query: {prosku: item.proSku ? item.proSku : ''}});
    } else if (item.contentType === 2) {
        // 分类页
        routerFn.push({name: 'Category', query: {orgcode: item.orgCode ? item.orgCode.slice(1, item.orgCode.length - 1) : ''}});
    } else if (item.contentType === 3) {
        // 商户页
        routerFn.push({name: 'Store', query: {userCode: item.venUserCode}});
    } else if (item.contentType === 4) {
        window.location.href = item.contentUrl;
    } else if (item.contentType === 5) {
        // 频道页
        if (item.contentUrl === 'SeckillList' || item.contentUrl === 'PreSell') {
            // 判断是不是预售频道页或秒杀频道页
            let areaRegionMap = JSON.parse(getLocalStorage('REGIONMAP'));
            routerFn.push({name: item.contentUrl, params: {areaId: areaRegionMap.areaId}});
        } else {
            routerFn.push({name: item.contentUrl});
        }
    }
};

// export function isArray(arr) {
//     return Object.prototype.toString.call(arr) === '[object Array]';
// };

// 检测对象是否是空对象(不包含任何可读属性)。
// 方法只检测对象本身的属性，不检测从原型继承的属性。
export function isOwnEmpty(obj) {
    for (var name in obj) {
        if (obj.hasOwnProperty(name)) {
            return false; // 返回false，不为空对象
        }
    }
    return true; // 返回true，为空对象
};

// 检测对象内是否有某属性
const hasOwnProperty = Object.prototype.hasOwnProperty;
export function hasOwn(obj, key) {
    return hasOwnProperty.call(obj, key);
};

function extend(to, _from) {
    for (let key in _from) {
        to[key] = _from[key];
    }
    return to;
};
// 对象合并
export function toObject(arr) {
    var res = {};
    for (let i = 0; i < arr.length; i++) {
        if (arr[i]) {
            extend(res, arr[i]);
        }
    }
    return res;
};

function typeOf(obj) {
    const toString = Object.prototype.toString;
    const map = {
        '[object Boolean]': 'boolean',
        '[object Number]': 'number',
        '[object String]': 'string',
        '[object Function]': 'function',
        '[object Array]': 'array',
        '[object Date]': 'date',
        '[object RegExp]': 'regExp',
        '[object Undefined]': 'undefined',
        '[object Null]': 'null',
        '[object Object]': 'object'
    };
    return map[toString.call(obj)];
};
// deepCopy
function deepCopy(data) {
    const t = typeOf(data);
    let o;
    if (t === 'array') {
        o = [];
    } else if (t === 'object') {
        o = {};
    } else {
        return data;
    }
    if (t === 'array') {
        for (let i = 0; i < data.length; i++) {
            o.push(deepCopy(data[i]));
        }
    } else if (t === 'object') {
        for (let i in data) {
            o[i] = deepCopy(data[i]);
        }
    }
    return o;
}
// 判断是不是数字
function isNumber(value) {
    var patrn = /^(-)?\d+(\.\d+)?$/;
    let flag = false;
    if (patrn.exec(value) === null || value === '') {
        flag = false;
    } else {
        flag = true;
    }
    return flag;
}
//  预售的商品根据预售时间显示的对应价格（首页常购清单、搜索页面预售商品、store列表预售商品、分类页面预售商品）公共方法
function yushowCompro(data) {
    let nowTime = new Date().getTime();
    let productData = data;
    productData.forEach(item => {
        if (item.preSaleStatus === 1) {
            // 等于1为预售的商品
            item.skuList.forEach(items => {
                let dataList = items.datePrice;
                for (let j = 0; j < dataList.length; j++) {
                    let startsTime = new Date(dataList[j].split('~')[0]).getTime();
                    let endsTime = new Date(dataList[j].split('~')[1]).getTime();
                    let skuPrices = dataList[j].split('~')[2];
                    if (startsTime <= nowTime && nowTime <= endsTime) {
                        items.skuPrice = skuPrices;
                        break;
                    } else {
                        let datePrice = [];
                        datePrice.push(startsTime);
                        datePrice.sort((a, b) => {
                            return a - b;
                        });
                        for (var i = 0; i < datePrice.length; i++) {
                            if (datePrice[i] > nowTime) {
                                let lastTime = datePrice[i];
                                if (startsTime === lastTime) {
                                    items.skuPrice = skuPrices;
                                }
                                break;
                            }
                        }
                    }
                }
            });
        }
    });
    return productData;
}
export {deepCopy, typeOf, yushowCompro, isNumber};

