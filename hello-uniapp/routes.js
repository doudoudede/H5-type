const appRouter = [{
        path: '/',
        redirect: {
            name: 'Index'
        }
    },
    {
        path: '/index',
        name: 'Index',
        meta: {
            name: '如来云商-线上采购 送药到家'
        },
        component: resolve => require(['pages/index/index'], resolve)
    },
    {
        path: '/location',
        name: 'Location',
        meta: {
            name: '定位',
            scrollToTop: true,
            noShowBar: true,
            noAuthArea: true // 不验证是否有区域信息
        },
        component: resolve => require(['pages/location/location'], resolve)
    },
    {
        path: '/login',
        name: 'Login',
        meta: {
            name: '登录',
            scrollToTop: true,
            noShowBar: true
        },
        component: resolve => require(['pages/login/login'], resolve)
    },
    {
        path: '/reg',
        name: 'Reg',
        meta: {
            name: '注册',
            scrollToTop: true,
            noShowBar: true
        },
        component: resolve => require(['pages/reg/reg'], resolve)
    },
    {
        path: '/retakepassword',
        name: 'RetakePassword',
        meta: {
            name: '找回密码',
            scrollToTop: true,
            noShowBar: true
        },
        component: resolve => require(['pages/retakepassword/retakepassword'], resolve)
    },
    {
        path: '/search',
        name: 'Search',
        meta: {
            name: '搜索',
            scrollToTop: true,
            keepAlive: true,
            noShowBar: true
        },
        component: resolve => require(['pages/search/search'], resolve)
    },
    {
        path: '/searchresult',
        name: 'SearchResult',
        meta: {
            name: '商品列表',
            noShowBar: true,
            keepAlive: true
        },
        component: resolve => require(['pages/searchresult/searchresult'], resolve)
    },
    {
        path: '/alwaysbuy',
        name: 'AlwaysBuy',
        meta: {
            name: '常购清单',
            scrollToTop: true,
            noShowBar: true
        },
        component: resolve => require(['pages/alwaysbuy/alwaysbuy'], resolve)
    },
    {
        path: '/seckilllist/:areaId',
        name: 'SeckillList',
        meta: {
            name: '秒杀专区',
            scrollToTop: true,
            noShowBar: true,
            noAuthArea: true // 不验证是否有区域信息
        },
        component: resolve => require(['pages/seckillList/seckillList'], resolve)
    },
    {
        path: '/presell/:areaId',
        name: 'PreSell',
        meta: {
            name: '预售专区',
            scrollToTop: true,
            noShowBar: true,
            noAuthArea: true // 不验证是否有区域信息
        },
        component: resolve => require(['pages/presell/preSell'], resolve)
    },
    {
        path: '/hotproduct',
        name: 'HotProduct',
        meta: {
            name: '热销商品',
            scrollToTop: true,
            noShowBar: true
        },
        component: resolve => require(['pages/hotproduct/hotproduct'], resolve)
    },
    {
        path: '/bestvendor',
        name: 'BestVendor',
        meta: {
            name: '优质商户',
            scrollToTop: true,
            noShowBar: true
        },
        component: resolve => require(['pages/bestvendor/index'], resolve),
        redirect: {
            name: 'BestVendorIndex'
        },
        children: [{
                path: 'index',
                name: 'BestVendorIndex',
                meta: {
                    name: '优质商户',
                    scrollToTop: true,
                    noShowBar: true
                },
                component: resolve => require(['pages/bestvendor/bestvendor'], resolve)
            },
            {
                path: 'bestvendorsearch',
                name: 'BestVendorSearch',
                meta: {
                    name: '商户搜索',
                    scrollToTop: true,
                    noShowBar: true
                },
                component: resolve => require(['pages/bestvendor/bestvendorsearch'], resolve)
            }
        ]
    },
    {
        path: '/list',
        name: 'List',
        meta: {
            name: '列表',
            keepAlive: true
        },
        component: resolve => require(['pages/list/list'], resolve)
    },
    {
        path: '/productdetails/:prospu',
        name: 'ProductDetails',
        meta: {
            name: '详情页',
            // scrollToTop: true,
            // noShowBar: true
        },
        component: resolve => require(['pages/productdetails/productdetails'], resolve)
    },
    {
        path: '/category',
        name: 'Category',
        meta: {
            name: '分类',
            keepAlive: true
        },
        component: resolve => require(['pages/category/category'], resolve)
    },
    {
        path: '/categoryDetails',
        name: 'CategoryDetails',
        meta: {
            noShowBar: true,
            name: '分类',
            keepAlive: true
        },
        component: resolve => require(['pages/category/categoryDetails'], resolve)
    },
    {
        path: '/store',
        name: 'Store',
        meta: {
            name: '店铺详情',
            noShowBar: true
        },
        component: resolve => require(['pages/store/index'], resolve),
        redirect: {
            name: 'StoreDetIndex'
        },
        children: [{
                path: 'index',
                name: 'StoreDetIndex',
                meta: {
                    name: '店铺信息',
                    noShowBar: true
                },
                component: resolve => require(['pages/store/store'], resolve)
            },
            {
                path: 'storedet',
                name: 'StoreDet',
                meta: {
                    name: '店铺信息',
                    noShowBar: true
                },
                component: resolve => require(['pages/store/storedet'], resolve)
            },
            {
                path: 'stcoupondet/:couTempId',
                name: 'StCouponDet',
                meta: {
                    name: '优惠券详情',
                    noShowBar: true
                },
                component: resolve => require(['pages/store/storecoupon'], resolve)
            },
            {
                path: 'storesearch',
                name: 'StoreSearch',
                meta: {
                    name: '店铺搜索',
                    noShowBar: true,
                    keepAlive: true
                },
                component: resolve => require(['pages/store/storesearch'], resolve)
            }
        ]
    },
    {
        path: '/orderlist',
        name: 'OrderList',
        meta: {
            name: '订单列表',
            keepAlive: true,
            auth: true,
            noShowBar: true
        },
        component: resolve => require(['pages/orderlist/orderlist'], resolve),
        children: [{
                path: 'orderdet/:mid/:oid',
                name: 'OrderDet',
                meta: {
                    name: '订单详情',
                    auth: true,
                    keepAlive: true,
                    noShowBar: true
                },
                component: resolve => require(['pages/orderlist/orderdet'], resolve)
            },
            {
                path: 'ordertracking/:oid',
                name: 'OrderTracking',
                meta: {
                    name: '订单跟踪',
                    auth: true,
                    keepAlive: true,
                    noShowBar: true
                },
                component: resolve => require(['pages/orderlist/ordertracking'], resolve)
            }
            // {     path: ':id',     name: 'AfterSale',     meta: {         name: '售后详情',
            //     auth: true,         keepAlive: true,         noShowBar: true     },
            // component: resolve => require(['pages/orderlist/aftersale'], resolve) }
        ]
    },
    {
        path: '/inquirylist',
        name: 'InquiryList',
        meta: {
            name: '询价单',
            keepAlive: true,
            auth: true,
            noShowBar: true
        },
        component: resolve => require(['pages/inquirylist/inquirylist'], resolve)
    },
    {
        path: '/cart',
        name: 'Cart',
        meta: {
            name: '购物车'
        },
        component: resolve => require(['pages/cart/cart'], resolve)
    },
    {
        path: '/confirmorder/:orderSource/:orderPlat',
        name: 'ConfirmOrder',
        meta: { // 常规订单
            name: '确认订单',
            auth: true,
            noShowBar: true
        },
        component: resolve => require(['pages/confirmorder/confirmorder'], resolve)
    },
    {
        path: '/confirmorderInten/:orderSource/:orderPlat',
        name: 'ConfirmorderInten',
        meta: { // 意向单
            name: '确认订单',
            auth: true,
            noShowBar: true
        },
        component: resolve => require(['pages/confirmorder/confirmorderInten'], resolve)
    },
    {
        path: '/confirminqorder',
        name: 'ConfirmInqOrder',
        meta: { // 常规订单
            name: '确认订单',
            auth: true,
            noShowBar: true
        },
        component: resolve => require(['pages/confirminqorder/confirminqorder'], resolve)
    },
    {
        path: '/deliveryorder/:mid/:payamount',
        name: 'DeliverySucc',
        meta: {
            name: '提交订单',
            auth: true,
            noShowBar: true
        },
        component: resolve => require(['pages/confirmorder/deliverysucc'], resolve)
    },
    {
        path: '/wxresult/:code/:mid/:payamount',
        name: 'wxResult',
        meta: {
            name: '支付结果页',
            auth: true,
            noShowBar: true
        },
        component: resolve => require(['pages/wxresult/wxresult'], resolve)
    },
    {
        path: '/my',
        name: 'My',
        meta: {
            name: '我的'
        },
        component: resolve => require(['pages/my/my'], resolve)
    },
    {
        path: '/userinfo',
        name: 'UserInfo',
        meta: {
            name: '个人信息',
            noShowBar: true
        },
        component: resolve => require(['pages/userinfo/userinfo'], resolve)
    },
    {
        path: '/setting',
        name: 'Setting',
        meta: {
            name: '设置',
            noShowBar: true
        },
        component: resolve => require(['pages/setting/setting'], resolve)
    },
    {
        path: '/couponlist',
        name: 'CouponList',
        meta: {
            name: '优惠券',
            noShowBar: true
        },
        component: resolve => require(['pages/couponlist/couponlist'], resolve),
        children: [{
                path: 'cocoupondet/:couTempId',
                name: 'CoCouponDet',
                meta: {
                    name: '优惠券详情',
                    noShowBar: true
                },
                component: resolve => require(['pages/store/storecoupon'], resolve)
            },
            {
                path: 'storecouponNew/:couTempId',
                name: 'StorecouponNew',
                meta: {
                    // 此优惠券详情为领券
                    name: '优惠券详情',
                    noShowBar: true
                },
                component: resolve => require(['pages/store/storecouponNew'], resolve)
            },
            {
                path: 'useconponpro',
                name: 'UseConponPro',
                meta: {
                    name: '商品列表',
                    noShowBar: true
                        // keepAlive: true
                },
                component: resolve => require(['pages/couponlist/usecouponpro'], resolve)
            }
        ]
    },
    {
        path: '/support',
        name: 'Support',
        meta: {
            name: '帮助中心',
            noShowBar: true,
            noAuthArea: true // 不验证是否有区域信息
        },
        component: resolve => require(['pages/support/support'], resolve)
    },
    {
        path: '/infringement',
        name: 'infringement',
        meta: {
            name: '如来云商侵权投诉与申诉规则',
            noShowBar: true,
            noAuthArea: true // 不验证是否有区域信息
        },
        component: resolve => require(['pages/support/infringement'], resolve)
    },
    {
        path: '/biddingAgreement',
        name: 'biddingAgreement',
        meta: {
            name: '招标服务协议',
            noShowBar: true,
            noAuthArea: true // 不验证是否有区域信息
        },
        component: resolve => require(['pages/support/biddingAgreement'], resolve)
    },
    {
        path: '/bidAgreement',
        name: 'bidAgreement',
        meta: {
            name: '竞标服务协议',
            noShowBar: true,
            noAuthArea: true // 不验证是否有区域信息
        },
        component: resolve => require(['pages/support/bidAgreement'], resolve)
    },
    {
        path: '/bidRules',
        name: 'bidRules',
        meta: {
            name: '如来云商招标投标活动管理规则',
            noShowBar: true,
            noAuthArea: true // 不验证是否有区域信息
        },
        component: resolve => require(['pages/support/bidRules'], resolve)
    },
    {
        path: '/paymentAgreement',
        name: 'PaymentAgreement',
        meta: {
            name: '支付协议',
            noShowBar: true,
            noAuthArea: true // 不验证是否有区域信息
        },
        component: resolve => require(['pages/support/paymentAgreement'], resolve)
    },
    {
        path: '/supportTwo',
        name: 'SupportTwo',
        meta: {
            name: '帮助中心',
            noShowBar: true,
            noAuthArea: true // 不验证是否有区域信息
        },
        component: resolve => require(['pages/supportTwo/supportTwo'], resolve)
    },
    {
        path: '/aboutus',
        name: 'AboutUs',
        meta: {
            name: '关于我们',
            noShowBar: true
        },
        component: resolve => require(['pages/aboutus/aboutus'], resolve)
    },
    {
        path: '/adrlist',
        name: 'AdrList',
        meta: {
            name: '收货地址',
            noShowBar: true
        },
        component: resolve => require(['pages/adrlist/adrlist'], resolve)
    },
    {
        path: '/addnewadr',
        name: 'AddNewAdr',
        meta: {
            name: '新增地址',
            noShowBar: true
        },
        component: resolve => require(['pages/addnewadr/addnewadr'], resolve)
    },
    {
        path: '/editorpwd',
        name: 'EditorPwd',
        meta: {
            name: '修改密码',
            noShowBar: true
        },
        component: resolve => require(['pages/editorpwd/editorpwd'], resolve)
    },
    {
        path: '/editorphone',
        name: 'EditorPhone',
        meta: {
            name: '修改绑定手机',
            noShowBar: true
        },
        component: resolve => require(['pages/editorphone/editorphone'], resolve)
    },
    {
        path: '/editorphone2',
        name: 'EditorPhone2',
        meta: {
            name: '修改绑定手机',
            noShowBar: true
        },
        component: resolve => require(['pages/editorphone/editorphone2'], resolve)
    },
    {
        path: '/cutility',
        name: 'Cutility',
        meta: {
            name: '售后政策',
            noShowBar: true,
            noAuthArea: true // 不验证是否有区域信息
        },
        component: resolve => require(['pages/cutility/cutility'], resolve)
    },
    {
        path: '/feedback',
        name: 'FeedBack',
        meta: {
            name: '意见反馈',
            noShowBar: true,
            noAuthArea: true // 不验证是否有区域信息
        },
        component: resolve => require(['pages/feedback/feedback'], resolve)
    },
    {
        path: '/message',
        name: 'Message',
        meta: {
            name: '消息',
            noShowBar: true
        },
        component: resolve => require(['pages/message/message'], resolve)
    },
    {
        path: '/messagelist',
        name: 'MessageList',
        meta: {
            name: '系统消息',
            noShowBar: true
        },
        component: resolve => require(['pages/messagelist/messagelist'], resolve)
    },
    {
        path: '/personalInfor',
        name: 'PersonalInfor',
        meta: {
            name: '身份认证',
            auth: true,
            noShowBar: true
        },
        component: resolve => require(['pages/personalInfor/index'], resolve)
    },
    {
        path: '/auFailure', // 身份认证状态回馈页
        name: 'AuFailure',
        meta: {
            name: '身份认证',
            auth: true,
            noShowBar: true
        },
        component: resolve => require(['pages/personalInfor/auFailure'], resolve)
    },
    {
        path: '/intentionList',
        name: 'IntentionList',
        meta: {
            name: '意向单',
            auth: true,
            noShowBar: true
        },
        component: resolve => require(['pages/intentionList/intentionList'], resolve)
    },
    {
        path: '/intentionListDetails',
        name: 'IntentionListDetails',
        meta: {
            name: '意向单详情',
            auth: true,
            noShowBar: true
        },
        component: resolve => require(['pages/intentionList/intentionListDetails'], resolve)
    },
    {
        path: '/certificationDetails', // 身份认证详情页
        name: 'CertificationDetails',
        meta: {
            name: '身份认证',
            auth: true,
            noShowBar: true
        },
        component: resolve => require(['pages/personalInfor/certificationDetails'], resolve)
    },
    {
        path: '/identityAuthentication', // 身份认证起始页
        name: 'IdentityAuthentication',
        meta: {
            name: '身份认证',
            auth: true,
            noShowBar: true
        },
        component: resolve => require(['pages/personalInfor/identityAuthentication'], resolve)
    },
    {
        path: '/authSupport', // 身份认证服务协议
        name: 'AuthSupport',
        meta: {
            name: '身份认证服务协议',
            auth: true,
            noShowBar: true
        },
        component: resolve => require(['pages/personalInfor/authSupport'], resolve)
    },
    {
        path: '/helan61',
        name: 'HeLan61',
        meta: {
            name: '荷兰61厂介绍',
            noShowBar: true
        },
        component: resolve => require(['pages/contactads/helan61'], resolve)
    },
    {
        path: '/myAuction',
        name: 'MyAuction',
        meta: {
            name: '我的竞拍',
            noShowBar: true
        },
        component: resolve => require(['pages/auction/myAuction'], resolve)
    },
    {
        path: '/auctionDetails',
        name: 'AuctionDetails',
        meta: {
            name: '竞拍详情',
            noShowBar: true
        },
        component: resolve => require(['pages/auction/auctionDetails'], resolve)
    },
    {
        path: '/auctionProDetails',
        name: 'AuctionProDetails',
        meta: {
            name: '竞拍商品',
            noShowBar: true
        },
        component: resolve => require(['pages/auction/auctionProDetails'], resolve)
    },
    {
        path: '/auctionArea',
        name: 'AuctionArea',
        meta: {
            name: '竞拍专区',
            noShowBar: true
        },
        component: resolve => require(['pages/auction/auctionArea'], resolve)
    },
    {
        path: '/filltheBidInfor',
        name: 'FilltheBidInfor',
        meta: {
            name: '填写竞价信息',
            noShowBar: true
        },
        component: resolve => require(['pages/auction/filltheBidInfor'], resolve)
    },
    {
        path: '/editInfo',
        name: 'editInfo',
        meta: {
            name: '完善个人信息',
            noShowBar: true,
        },
        component: resolve => require(['pages/editinfo/EditInfo'], resolve)
    },
    {
        path: '/chooseShop',
        name: 'ChooseShop',
        meta: {
            name: '选择商城',
            noShowBar: true,
        },
        component: resolve => require(['pages/chooseShop/ChooseShop'], resolve)
    },
    {
        path: '/audit',
        name: 'AuDit',
        meta: {
            name: '审核结果',
            noShowBar: true,
        },
        component: resolve => require(['pages/audit/AuDit'], resolve)
    },
    // {
    //     path: '/audit',
    //     name: 'AuDit',
    //     meta: {
    //         name: '审核结果',
    //         noShowBar: true,
    //     },
    //     component: resolve => require(['pages/audit/AuDit'], resolve)
    // },
    {
        path: '/shopDetial',
        name: 'shopDetial',
        meta: {
            name: '商城详情',
            noShowBar: true
        },
        component: resolve => require(['pages/shopDetial/shopDetial'], resolve)
    },
    {
        path: '/extension',
        name: 'extension',
        meta: {
            name: '我要推广',
            noShowBar: true
        },
        component: resolve => require(['pages/extension/extension'], resolve)
    },
    {
        path: '*',
        redirect: {
            name: 'Index'
        }
    },
];

export default [...appRouter];
