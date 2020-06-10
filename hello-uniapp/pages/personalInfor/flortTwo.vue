<template>
    <div>
        <!--基本信息-->
        <div class="content-flor">
            <div class="m-list-block">
                <ul>
                    <li class="item-content item-link" @click.prevent="userTypeSelec('1')">
                        <div class="item-inner">
                            <div class="item-title">用户性质</div>
                            <div class="item-input3">
                                &nbsp;&nbsp;{{userProp}}
                            </div>
                        </div>
                    </li>
                    <li class="item-content item-link" @click.prevent="userTypeSelec('2')">
                        <div class="item-inner">
                            <div class="item-title">用户类型</div>
                            <div class="item-input3" v-if="userType">
                                {{userType}}
                            </div>
                        </div>
                    </li>
                    <li class="item-content item-link" @click.prevent="userTypeSelec('3')">
                        <div class="item-inner">
                            <div class="item-title">主营品类</div>
                            <div class="item-input3">
                                <div class="textOverflows">
                                    &nbsp;&nbsp;{{mainCategory ? mainCategory.slice(0, mainCategory.length - 1) : ''}}
                                </div>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
        <!--身份证上传-->
        <div class="content-flor"   v-show="formDatas.userProperties !== ''">
            <div class="infor-pic-upload">
                <div class="pic-upload-tit">
                    <!--<span class="other-type">(选填)</span>-->
                    身&nbsp;份&nbsp;证&nbsp;&nbsp;&nbsp;<input class='inputcart' type="text" v-model="formDatas.userIdNumber"   maxlength="18" placeholder="请填写身份证号">
                </div>
                <div class="item-uploadImg_box clearfix">
                    <xeImgUpload uploadText="正面" :oldUploadImgComputed="oldUploadImgComputed1" class="fl" @imgUpload="imgUpload1"></xeImgUpload>
                    <xeImgUpload uploadText="反面" :oldUploadImgComputed="oldUploadImgComputed2" class="fl" @imgUpload="imgUpload2"></xeImgUpload>
                </div>
            </div>
        </div>

        <!--营业执照上传-->
        <div class="content-flor" v-show="formDatas.userProperties !== '' && formDatas.userProperties !== 1">
            <div class="infor-pic-upload">
                <div class="pic-upload-tit">
                    <!--<span class="other-type">(选填)</span>-->
                    营业执照&nbsp;&nbsp;
                </div>
                <div class="item-uploadImg_box clearfix">
                    <xeImgUpload  :oldUploadImgComputed="oldUploadImgComputed3" :maxLen="3" @imgUpload="imgUpload3"></xeImgUpload>
                </div>
            </div>
        </div>

        <!--食品流通许可证上传-->
        <!-- <div class="content-flor"  v-show="formDatas.userProperties !== '' && formDatas.userProperties !== 1">
            <div class="infor-pic-upload">
                <div class="pic-upload-tit">
                    食品流通许可证&nbsp;&nbsp;<span class="other-type">(选填)</span>
                </div>
                <div class="item-uploadImg_box clearfix">
                    <xeImgUpload :oldUploadImgComputed="oldUploadImgComputed4" @imgUpload="imgUpload4"></xeImgUpload>
                </div>
            </div>
        </div> -->

        <!--CS认证上传-->
        <!-- <div class="content-flor"  v-show="formDatas.userProperties !== '' && formDatas.userProperties !== 1">
            <div class="infor-pic-upload">
                <div class="pic-upload-tit">
                    CS&nbsp;认&nbsp;证&nbsp;&nbsp;<span class="other-type">(选填)</span>
                </div>
                <div class="item-uploadImg_box clearfix">
                    <xeImgUpload :oldUploadImgComputed="oldUploadImgComputed5" @imgUpload="imgUpload5"></xeImgUpload>
                </div>
            </div>
        </div> -->

        <!--门头照上传-->
        <div class="content-flor"  v-show="formDatas.userProperties !== ''">
            <div class="infor-pic-upload">
                <div class="pic-upload-tit">
                    门&nbsp;头&nbsp;照&nbsp;&nbsp;<span class="other-type">(选填)</span>
                </div>
                <div class="item-uploadImg_box clearfix">
                    <xeImgUpload :oldUploadImgComputed="oldUploadImgComputed6" :maxLen="3" @imgUpload="imgUpload6"></xeImgUpload>
                </div>
            </div>
        </div>
        <!--底部弹框-->
        <xe-popup
            :class="{'tred': typeTit === '主营品类'}"
            :show.sync="showFlag"
            :popupTit="typeTit === '主营品类' ? '主营品类(可多选)' : typeTit"
            position="bottom">
            <div class='useInfor-selec-box'>
                <ul>
                    <xe-radio-group v-model="formDatas.userProperties"  v-if="typeTit == '用户性质'">
                        <li class="selec-item" v-for="(item, index) in botData" :key="index">
                            <div class="selec-radio">
                                <xe-radio :label="item.cateId">
                                    {{item.cateName}}
                                </xe-radio>
                            </div>
                        </li>
                    </xe-radio-group>
                    <xe-radio-group v-model="formDatas.userTypeId" v-if="typeTit == '用户类型'">
                        <li class="selec-item" v-for="(item, index) in botData" :key="index">
                            <div class="selec-radio">
                                <xe-radio :label="item.typeId">
                                    <span class="mainTit">{{item.typeName}}</span>&nbsp;&nbsp;
                                    <span v-if="item.typeName === '批发商'" class="mainTit-con">批发商、经销商、零售商</span>
                                    <span v-if="item.typeName === '餐饮'" class="mainTit-con">烧烤店、火锅店、卤肉店、小吃店</span>
                                </xe-radio>
                            </div>
                        </li>
                    </xe-radio-group>
                    <xe-checkbox-group v-model="businessType" v-if="typeTit == '主营品类'">
                        <li class="selec-item" v-for="(item, index) in botData" :key="index">
                            <div class="selec-radio">
                                <xe-checkbox :label="item.cateId">
                                    <span class="mainTit">{{item.cateName}}</span>
                                    <span class="mainTit-con">{{item.cateId | businessTypeconToText}}</span>
                                </xe-checkbox>
                            </div>
                        </li>
                    </xe-checkbox-group>
                </ul>
            </div>
            <div v-show="typeTit == '主营品类'" class='t-btn'>
                <mt-button  type="primary" class="xe-button-primary" @click="businessTypeChange" style="width: 100%;background: #f53226" >确定</mt-button>
            </div>
        </xe-popup>

        <!--图片放大-->
        <xe-dialog :show.sync="picShowFlag">
            <div class="showBigPic-box">
                <img :src="checkPicUrl" alt="">
            </div>
        </xe-dialog>
    </div>
</template>
<script type="text/ecmascript-6">
    import {Popup} from 'components/Popup';
    import {Dialog} from 'components/Dialog/';
    import {Radio, RadioGroup} from 'components/Radio/';
    import {Checkbox, CheckboxGroup} from 'components/Checkbox/';
    import xeImgUpload from 'components/xeImgUpload/xeImgUploadMore';
    export default {
        name: '',
        data() {
            return {
                yzbtnText: '发送验证码',
                typeTit: '',
                businessType: [], // 主营品类
                botData: [],
                userProperData: [
                    {
                        cateName: '个人',
                        cateId: 1
                    },
                    {
                        cateName: '个体工商户',
                        cateId: 2
                    },
                    {
                        cateName: '企业',
                        cateId: 3
                    }
                ],
                userProp: '', // 用户性质
                mainCategory: '', // 主营品类
                userType: '', // 用户类型
                userTypeData: [],
                categoryData: [],
                showFlag: false, // 弹框开关
                picShowFlag: false, // 弹框开关
                formDatas: {
                    userProperties: '',
                    userTypeId: '',
                    businessType: '',
                    userIdNumber: '',
                    idCardFrontPic: '',
                    idCardBackPic: '',
                    businessPic: [],
                    foodLicensePic: '',
                    csPic: '',
                    doorPic: []
                },
                picSelecType: '',
                checkPicUrl: '',
                picServer: '',
                uploadURLImg1: '', // 身份证正面照
                oldUploadImgComputed1: {
                    type: 1,
                    picServer: '',
                    picArray: []
                },
                uploadURLImg2: '', // 身份证反面照
                oldUploadImgComputed2: {
                    type: 2,
                    picServer: '',
                    picArray: []
                },
                uploadURLImg3: '', // 营业执照
                oldUploadImgComputed3: {
                    type: 3,
                    picServer: '',
                    picArray: []
                },
                uploadURLImg4: '', // 食品流通许可证
                oldUploadImgComputed4: {
                    type: 4,
                    picServer: '',
                    picArray: []
                },
                uploadURLImg5: '', // CS认证
                oldUploadImgComputed5: {
                    type: 5,
                    picServer: '',
                    picArray: []
                },
                uploadURLImg6: [], // 门 头 照
                oldUploadImgComputed6: {
                    type: 6,
                    picServer: '',
                    picArray: []
                },
                userInfoData: {},
                appDoorPic: []
            };
        },
        created() {
            this.getUserType();
            this.getCategory();
            let userInfoData = this.$getLocalStorage('userInfoData');
            if (userInfoData) {
                let info = JSON.parse(userInfoData);
                this.picServer = info.picServer;
                this.userInfoData = info.userInfo;
                Object.keys(this.userInfoData).find(item => {
                    Object.keys(this.formDatas).find(items => {
                        if (item === items) {
                            this.formDatas[items] = this.userInfoData[item];
                        }
                    });
                });
                if (this.formDatas.userProperties) { // 用户性质回显
                    this.userProperData.forEach(item => {
                        if (item.cateId === Number(this.formDatas.userProperties)) {
                            this.userProp = item.cateName;
                        }
                    });
                } else {
                    this.userProp = '';
                }
                if (this.formDatas.idCardFrontPic) { // 身份证正面回显
                    this.oldUploadImgComputed1.picServer = this.picServer;
                    this.oldUploadImgComputed1.picArray = [this.formDatas.idCardFrontPic];
                }
                if (this.formDatas.idCardBackPic) { // 身份证反面回显
                    this.oldUploadImgComputed2.picServer = this.picServer;
                    this.oldUploadImgComputed2.picArray = [this.formDatas.idCardBackPic];
                }
                if (this.formDatas.businessPic.length) { // 门 头 照回显
                    this.oldUploadImgComputed3.picServer = this.picServer;
                    this.formDatas.businessPic.forEach(item => {
                        this.oldUploadImgComputed3.picArray.push(item);
                    });
                }
//                if (this.formDatas.businessPic) { // 营业执照回显
//                    this.oldUploadImgComputed3.picServer = this.picServer;
//                    this.oldUploadImgComputed3.picArray = [this.formDatas.businessPic];
//                }
                if (this.formDatas.foodLicensePic) { // 食品流通许可证回显
                    this.oldUploadImgComputed4.picServer = this.picServer;
                    this.oldUploadImgComputed4.picArray = [this.formDatas.foodLicensePic];
                }
                if (this.formDatas.csPic) { // CS认证回显
                    this.oldUploadImgComputed5.picServer = this.picServer;
                    this.oldUploadImgComputed5.picArray = [this.formDatas.csPic];
                }
                if (this.formDatas.doorPic.length) { // 门 头 照回显
                    this.oldUploadImgComputed6.picServer = this.picServer;
                    this.formDatas.doorPic.forEach(item => {
                        this.oldUploadImgComputed6.picArray.push(item);
                    });
                }
            }
        },
        mounted() {
            this.$bus.$on('imgUpload', val => {
                console.log('------------------------------------');
                console.log(val);
                console.log('------------------------------------');
                // 上传的是身份证正面图片
                this['oldUploadImgComputed' + val.imgType].picServer = val.picServer;
                let obj = {
                    1: 'idCardFrontPic',
                    2: 'idCardBackPic',
                    3: 'businessPic',
                    4: 'foodLicensePic',
                    5: 'csPic',
                    6: 'doorPic'
                };
                if (val.imgType === 3 || val.imgType === 6) {
                    this.appDoorPic.push(...val.imgUrl);
                    this.formDatas[obj[val.imgType]] = this.appDoorPic;
                    this['oldUploadImgComputed' + val.imgType].picArray = this.appDoorPic;
                    console.log('---------------doorpic---------------------');
                    console.log(this.appDoorPic);
                    console.log('-----------------doorpic-------------------');
                } else {
                    this.formDatas[obj[val.imgType]] = val.imgUrl.join('');
                    this['oldUploadImgComputed' + val.imgType].picArray = [val.imgUrl];
                }
            });
        },
        methods: {
            businessTypeChange() {
                this.showFlag = false;
            },
            imgUpload1(imgurl) {
                if (imgurl.length) {
                    this.formDatas.idCardFrontPic = imgurl.join('');
                } else {
                    this.formDatas.idCardFrontPic = '';
                }
                // 身份证正面
                console.log(this.formDatas.idCardFrontPic);
            },
            imgUpload2(imgurl) {
                // 身份证反面
                if (imgurl.length) {
                    this.formDatas.idCardBackPic = imgurl.join('');
                } else {
                    this.formDatas.idCardBackPic = '';
                }
            },
            imgUpload3(imgurl) {
                // 营业执照
//                if (imgurl.length) {
//                    this.formDatas.businessPic = imgurl.join('');
//                } else {
//                    this.formDatas.businessPic = '';
//                }
                this.formDatas.businessPic = imgurl.length ? imgurl : [];
            },
            imgUpload4(imgurl) {
                // 食品流通证
                if (imgurl.length) {
                    this.formDatas.foodLicensePic = imgurl.join('');
                } else {
                    this.formDatas.foodLicensePic = '';
                }
            },
            imgUpload5(imgurl) {
                // cs认证照
                if (imgurl.length) {
                    this.formDatas.csPic = imgurl.join('');
                } else {
                    this.formDatas.csPic = '';
                }
            },
            imgUpload6(imgurl) {
                // 门头照
                this.formDatas.doorPic = imgurl.length ? imgurl : [];
            },
            submitInfo() {
                // 错误提示str
                let flag = false;
                let errorTips = {
                    userProperties: '请选择用户性质', // 用户性质
                    userTypeId: '请选择用户类型', // 用户类型
                    businessType: '请选择主营品类', // 主营品类
                    userIdNumber: '请输入身份证号码', // 身份证号码
                    idCardFrontPic: '请添加身份证正面图片', // 身份证正面图片
                    idCardBackPic: '请添加身份证反面图片', // 身份证反面图片
                    businessPic: '请添加营业执照图片' // 营业执照图片
                };
                Object.keys(this.formDatas).find(item => {
                    if (item === 'userIdNumber') {
                        if (!this.formDatas[item] || !(/^\d{6}(18|19|20)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|[xX])$/.test(this.formDatas.userIdNumber))) {
                            this.$toast({
                                message: '请输入正确的身份证号',
                                duration: 1500
                            });
                            flag = false;
                            return true;
                        }
                    }
                    if (this.formDatas.userProperties === 1) {
                        // 个人
                        if (item !== 'businessPic' && item !== 'foodLicensePic' && item !== 'csPic' && item !== 'doorPic') {
                            if (!this.formDatas[item] && errorTips[item]) {
                                this.$toast({
                                    message: errorTips[item],
                                    duration: 2000
                                });
                                if (item === 'userIdNumber') {
                                    this.$refs[item].focus();
                                }
                                flag = false;
                                return true;
                            }
                        }
                    } else {
                        // 企业
                        if (item !== 'foodLicensePic' && item !== 'csPic' && item !== 'doorPic') {
                            if (item === 'businessPic') {
                                if (!this.formDatas[item].length) {
                                    this.$toast({
                                        message: errorTips[item],
                                        duration: 2000
                                    });
                                    flag = false;
                                    return true;
                                }
                            } else {
                                if (!this.formDatas[item]) {
                                    this.$toast({
                                        message: errorTips[item],
                                        duration: 2000
                                    });
                                    if (item === 'userIdNumber') {
                                        this.$refs[item].focus();
                                    }
                                    flag = false;
                                    return true;
                                }
                            }
                        }
                    }
                    flag = true;
                });
                return {
                    flag: flag,
                    step: 2
                };
            },
            picCheck(src) {
                this.picShowFlag = true;
                this.checkPicUrl = src;
            },
            picUpload(type) {
                this.picSelecType = type;
            },
            userTypeSelec(num) {
                this.showFlag = true;
                if (num === '1') {
                    this.typeTit = '用户性质';
                    this.botData = this.userProperData;
                } else if (num === '2') {
                    this.typeTit = '用户类型';
                    this.botData = this.userTypeData;
                } else if (num === '3') {
                    this.typeTit = '主营品类';
                    this.botData = this.categoryData;
                }
            },
            getCategory() { // 获取主营品类
                this.$http({
                    method: 'post',
                    url: '/xe-route/xe-app/mobileApp/checkIdentity/getCategory',
                    data: {}
                }).then(res => {
                    this.categoryData = res.data.categoryList;
                    if (this.formDatas.businessType) {
                        // 主营品类回显
                        this.businessType = this.formDatas.businessType.split(',');
                        for (var i = 0; i < this.businessType.length; i++) {
                            this.businessType[i] = Number(this.businessType[i]);
                        }
                        this.mainCategory = '';
                        this.categoryData.forEach(item => {
                            this.businessType.forEach(items => {
                                if (item.cateId === items) {
                                    this.mainCategory += item.cateName + '、';
                                }
                            });
                        });
                    } else {
                        this.userType = '';
                    }
                }).catch(error => {
                    console.log(error);
                });
            },
            getUserType() { // 获取用户类型
                this.$http({
                    method: 'post',
                    url: '/xe-route/xe-app/mobileApp/checkIdentity/getUserType',
                    data: {}
                }).then(res => {
                    this.userTypeData = res.data.categoryList;
                    if (this.formDatas.userTypeId) {
                        // 用户类型回显
                        this.userTypeData.find(item => {
                            console.log('------------------------------------');
                            console.log(item.typeId);
                            console.log(this.formDatas.userTypeId);
                            console.log('------------------------------------');
                            if (parseInt(item.typeId) === parseInt(this.formDatas.userTypeId)) {
                                console.log(item.typeName);
                                console.log(this);
                                this.userType = item.typeName;
                                console.log(this.userType);
                                return true;
                            }
                        });
                    } else {
                        this.userType = '';
                    }
                }).catch(error => {
                    console.log(error);
                });
            }
        },
        components: {
            [Popup.name]: Popup,
            [Radio.name]: Radio,
            [Dialog.name]: Dialog,
            [RadioGroup.name]: RadioGroup,
            [Checkbox.name]: Checkbox,
            [CheckboxGroup.name]: CheckboxGroup,
            xeImgUpload
        },
        watch: {
            showFlag(n) {
                this.$bus.$emit('dailogshow', n);
                if (this.typeTit !== '' && n === false) {
                    if (this.typeTit === '用户性质') {
                        if (this.formDatas.userProperties) {
                            this.userProperData.forEach(item => {
                                if (item.cateId === this.formDatas.userProperties) {
                                    this.userProp = item.cateName;
                                }
                            });
                        }
                    } else if (this.typeTit === '用户类型') {
                        if (this.formDatas.userTypeId) {
                            this.userTypeData.forEach(item => {
                                if (item.typeId === this.formDatas.userTypeId) {
                                    this.userType = item.typeName;
                                }
                            });
                        }
                    } else if (this.typeTit === '主营品类') {
                        if (this.businessType.length > 0) {
                            this.mainCategory = '';
                            this.categoryData.forEach(item => {
                                this.businessType.forEach(items => {
                                    if (item.cateId === items) {
                                        this.mainCategory += item.cateName + '、';
                                    }
                                });
                            });
                            this.formDatas.businessType = this.businessType.join(',');
                        } else {
                            this.mainCategory = '';
                            this.formDatas.businessType = '';
                        }
                    }
                }
            },
            'formDatas.userProperties'() {
                this.showFlag = false;
            },
            'formDatas.userTypeId'() {
                this.showFlag = false;
            }
        },
        destroyed() {
            this.$bus.$off('dailogshow');
        }
    };
</script>
<style rel="stylesheet/scss" lang="scss">
    @import "../../static/styles/rules.scss";
    .textOverflows {
        max-width: 500/$ppr;
        overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;
    }
    .tred {
        .useInfor-selec-box {
            height: auto;
            position: absolute;
            left:0;
            right: 0;
            top: 0;
            bottom: 95/$ppr;
        }
        .t-btn {
            height: 80/$ppr;
            position: absolute;
            left: 0;
            right: 0;
            bottom: 10/$ppr;
        }
    }
    .useInfor-selec-box {
        height: 100%;
        overflow: auto;
        padding-left: 30/$ppr;
        background: #fff;
        font-size: 32/$ppr;
        color: #333;
        display: flex;
        flex-direction: column;
        ul {
            height: 100%;
            padding-right: 30/$ppr;
            overflow: auto;
        }
        li {
            line-height: 88/$ppr;
            border-bottom: 1px solid #e8e8e8;
            &:last-child{
                border-bottom: none;
            }
        }
        .selec-item {
            display: flex;
            justify-content: space-between;
        }
        .selec-radio {
            width: 100%;
            height: 88/$ppr;
            display: flex;
            align-items: center;
            .van-radio__control, .van-checkbox__control {
                width: 40/$ppr;
                height: 40/$ppr;
            }
            .van-radio__input, .van-checkbox__input {
                width: 40/$ppr;
                height: 40/$ppr;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .van-radio, .van-checkbox {
                width: 100%;
                display: flex;
                flex: 1;
                flex-direction: row-reverse;
                .xe-iconfont {
                    font-size: 36/$ppr;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
            }
            .van-radio__label, .van-checkbox__label {
                font-size: 30/$ppr;
                margin-left: 10/$ppr;
                flex: 1;
            }
        }
        .mainTit {
            display: inline-block;
            min-width: 118/$ppr;
        }
        .mainTit-con {
            font-size: 26/$ppr;
            color: #999;
        }
    }
    .pic-upload-tit {
        line-height: 88/$ppr;
        margin-left: 20/$ppr;
        font-size: 32/$ppr;
        font-weight: 600;
        border-bottom: 1px solid #e8e8e8;
        .other-type {
            color: #999;
        }
        .inputcart {
            width: 400/$ppr;
            height: 60/$ppr;
            line-height: 1.1;
        }
    }
    .showBigPic-box {
        img {
            display: block;
            width: 100%;
            height: 530/$ppr;
        }
    }
</style>
