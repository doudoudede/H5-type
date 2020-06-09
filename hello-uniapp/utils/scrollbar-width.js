/**
 * Created by zhangwen on 2017/8/14.
 */
import Vue from 'vue';
let scrollBarWidth;
export default function() {
    if (Vue.prototype.$isServer) return 0;
    if (scrollBarWidth !== undefined) return scrollBarWidth;
    const outer = document.createElement('view');
    outer.className = 'el-scrollbar__wrap';
    outer.style.visibility = 'hidden';
    outer.style.width = '100px';
    outer.style.position = 'absolute';
    outer.style.top = '-9999px';
    document.body.appendChild(outer);
    const widthNoScroll = outer.offsetWidth;
    outer.style.overflow = 'scroll';
    const inner = document.createElement('view');
    inner.style.width = '100%';
    outer.appendChild(inner);
    const widthWithScroll = inner.offsetWidth;
    outer.parentNode.removeChild(outer);
    scrollBarWidth = widthNoScroll - widthWithScroll;
    return scrollBarWidth;
};