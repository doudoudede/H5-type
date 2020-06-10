<template lang="html">
    <div class="apply-cons">
        <h3>基本信息</h3>
        <!-- {{formData}} -->
        <el-form :model="formData" :rules="rules" ref="formData" style="padding-top:30px;font-size:32px" :inline="true" class="apply-formData">
            <div class="infor-baseApply">
                <div class="floor-apply">
                    <el-form-item label="企业性质" prop="userProperties" required>
                        <el-radio-group v-model="formData.userProperties">
                            <el-radio :label="1">公司企业</el-radio>
                            <el-radio :label="3">个体工商户</el-radio>
                            <!-- <el-radio :label="4">个人</el-radio> -->
                            <!-- <el-radio :label="9">其他</el-radio> -->
                        </el-radio-group>
                    </el-form-item>
                </div>
                <div class="floor-apply" v-if="isPart" required>
                    <el-form-item label="企业名称" prop="shopName">
                        <el-input size="medium" v-model="formData.shopName" class="inp-apply" :maxlength="40"></el-input>
                    </el-form-item>
                </div>
                <div class="floor-apply" v-if="formData.userProperties != 4">
                    <el-form-item label="营业执照号码" prop="businessNum">
                        <el-input v-model="formData.businessNum" class="inp-apply" :maxlength="18"></el-input>
                    </el-form-item>
                </div>
                <div class="floor-apply">
                    <el-form-item label="法定代表人" prop="juridicalPerson">
                        <el-input v-model="formData.juridicalPerson" class="inp-apply" :maxlength="15"></el-input>
                    </el-form-item>
                </div>
                <div class="floor-apply">
                    <el-form-item label="法人身份证号" prop="userIdNumber">
                        <el-input v-model="formData.userIdNumber" class="inp-apply" :maxlength="18"></el-input>
                    </el-form-item>
                </div>
                <div class="floor-apply for-itemlis">
                    <el-form-item label=" ">
                        <el-upload :class="{hide:hideUpload1}"
                            action="/xe-route/xe-mis/manager/uploadImg/manImgUpload"
                            list-type="picture-card"
                            :on-preview="handlePictureCardPreview1"
                            :limit = "limitCount1"
                            :on-change="allchange1"
                            :on-success="hadsuccess1"
                            :on-remove="handleRemove1">
                            <i class="el-icon-plus"></i>
                            <img v-if="imageUrl1" :src="imageUrl1" class="avatar">
                            <div class="el-upload__tip" slot="tip"><span style="color:red">*</span>只能上传jpg/png文件，且不超过500kb</div>
                        </el-upload>
                        <p style="padding-top:15px;padding-bottom:15px">营业执照副本</p>
                        
                        <el-upload :class="{hide:hideUpload2}"
                            action="/xe-route/xe-app/mobileApp/checkIdentity/uploadImg"
                            list-type="picture-card"
                            :on-preview="handlePictureCardPreview2"
                            :limit = "limitCount2"
                            :on-change="allchange2"
                            :on-success="hadsuccess2"
                            :on-remove="handleRemove2">
                            <img v-if="imageUrl2" :src="imageUrl2" class="avatar">
                            <i class="el-icon-plus"></i>
                            <div class="el-upload__tip" slot="tip"><span style="color:red">*</span>只能上传jpg/png文件，且不超过500kb</div>
                        </el-upload>
                        <p style="padding-top:15px;padding-bottom:15px">身份证（正面）</p>
                        <el-upload :class="{hide:hideUpload3}"
                            action="/xe-route/xe-app/mobileApp/checkIdentity/uploadImg"
                            list-type="picture-card"
                            :on-preview="handlePictureCardPreview3"
                            :limit = "limitCount3"
                            :on-change="allchange3"
                            :on-success="hadsuccess3"
                            :on-remove="handleRemove3">
                            <img v-if="imageUrl1" :src="imageUrl1" class="avatar">
                            <i class="el-icon-plus"></i>
                            <div class="el-upload__tip" slot="tip"><span style="color:red">*</span>只能上传jpg/png文件，且不超过500kb</div>
                        </el-upload>
                        <p style="padding-top:15px;padding-bottom:15px">身份证（反面）</p>
                    </el-form-item>
                </div>
                <!-- {{formData.formProCitys}} -->
                <div class="floor-apply">
                    <el-form-item prop="formProCitys" label="企业所在地">
                        <el-cascader
                            class="xe-input-col1 fl"
                            :options="provinceList2"
                            v-model='formData.formProCitys'
                            @active-item-change="areaItemchange"
                            @change="valChange"
                            :style="{'width': '400px'}"
                            :props="{label: 'areaName', value: 'areaId', children: 'cities'}">
                        </el-cascader>
                    </el-form-item>
                </div>
                <div class="floor-apply">
                    <el-form-item label="详细地址" prop="userAddr">
                        <el-input v-model="formData.userAddr" class="inp-apply"></el-input>
                    </el-form-item>
                </div>
                <!-- <div class="floor-apply floor-areaSelect"> -->
                    <!-- {{formData.areaId}} -->
                    <!-- <el-form-item label="商品销售区域" prop="areaId" class="defyPoint">
                        <el-select v-model="formData.areaId" multiple placeholder="请选择销售区域" class="multip-select" :disabled="formData.areaFlag">
                            <el-option
                                v-for="item in provinceList"
                                :label="item.areaName"
                                :key="item.areaId"
                                :value="item.areaId">
                            </el-option>
                        </el-select>
                        &nbsp;
                        <el-checkbox :label="true" @change="changeFlag" name="areaId" v-model="formData.areaFlag" style="line-height: 36px;">全国</el-checkbox>
                    </el-form-item>
                </div> -->
                <!-- formData.payTypes: {{formData.payTypes}} -->
                <!-- <div class="floor-apply">
                    <el-form-item label="支持付款方式" prop="payTypes">
                        <el-checkbox-group v-model="formData.payTypes">
                            <el-checkbox style="top:-6px;" :label="1" name="payTypes">在线支付</el-checkbox>
                            <el-checkbox style="top:-6px;" :label="2" name="payTypes">货到付款</el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>
                </div> -->
                <div class="floor-apply" v-if="isSell">
                    <el-form-item label="店铺名称" prop="shopName" required>
                        <el-input v-model="formData.shopName" class="inp-apply" :maxlength="30"></el-input>
                    </el-form-item>
                </div>
            </div>
            <div class="inf-Merchant" style="margin-top:50px;">
                <h3>商户联系人信息</h3>
                <div class="floor-apply">
                    <el-form-item label="联系人姓名" prop="userName">
                        <el-input v-model="formData.userName" class="inp-apply"></el-input>
                    </el-form-item>
                </div>
                <div class="floor-apply">
                    <el-form-item label="联系人手机" prop="userPhone">
                        <el-input v-model="formData.userPhone" class="inp-apply" :maxlength="11"></el-input>
                    </el-form-item>
                </div>
                <div class="floor-apply">
                    <el-form-item label="联系人邮箱" prop="email">
                        <el-input v-model="formData.email" class="inp-apply"></el-input>
                    </el-form-item>
                </div>
                <div class="floor-apply c-next">
                    <el-form-item label=" ">
                        <el-button size="medium" type="primary" @click="formSubmit('formData')" :disabled="nextDisabled">
                            下一步
                        </el-button >
                    </el-form-item>
                </div>
            </div>
		</el-form>
    </div>
</template>

<script>
// 成为卖家   商铺
// 成为合伙人  企业
// import {getNowCookie, resetUserInfoCookie} from 'utils/commonBase';
export default {
    name: 'editinfo',
    // beforeRouteEnter(to, from, next) {
    //     let nowCookie = getNowCookie();
    //     let userInfo = nowCookie.userInfo;
    //     console.log('userInfo', userInfo);
    //     switch (userInfo.code) {
    //         case 1 :
    //             // 待审核
    //             next({
    //                 name: 'applyResult',
    //                 params: {
    //                     typeId: 1
    //                 }
    //             });
    //             break;
    //         case 2 :
    //             // 审核通过
    //             next({
    //                 name: 'applyResult',
    //                 params: {
    //                     typeId: 2
    //                 }
    //             });
    //             break;
    //         case 3 :
    //             // 驳回
    //             next();
    //             break;
    //         case 4 :
    //             // 已签订
    //             next({
    //                 name: 'index'
    //             });
    //             break;
    //         case 6 :
    //             // 已同意网络食品安全建议承诺书
    //             next();
    //             break;
    //         default :
    //             // 未入住
    //             next();
    //     }
    // },
    data() {
        let checkCertificates = (rule, value, callback) => {
            // if (value.length !== 18) {
            //     callback(new Error('请输入18位有效证件号码'));
            //     return false;
            // } else {
            var reg = /(^[0-9A-Za-z]{15,15}$)|(^[0-9A-Za-z]{18,18}$)/;
            var res = reg.test(value);
            if (!res) {
                callback(new Error('请输入15或18位有效证件号码'));
            } else {
                callback();
            }
            // }
        };
        let checkId = (rule, value, callback) => {
            var reg = /^(\d{15}$|^\d{18}$|^\d{17}(\d|X|x))$/;
            var res = reg.test(value);
            if (!res) {
                callback(new Error('请输入正确的身份证号码'));
            } else {
                callback();
            }
        };
        let checkChinese = (rule, value, callback) => {
            var reg = /^[\u4e00-\u9fa5]{0,}$/;
            var res = reg.test(value);
            if (!res) {
                callback(new Error('该选项只能填写汉字，请核对信息后填写'));
            } else {
                callback();
            }
        };
        // let checkBoxlength = (rule, value, callback) => {
        //     if (value.length > 3) {
        //         callback(new Error('主营类型最多选择3项'));
        //     } else {
        //         callback();
        //     }
        // };
        let checkPhone = (rule, value, callback) => {
            var reg = /^1[3,4,5,7,8]\d{9}$/;
            var res = reg.test(value);
            if (!res) {
                callback(new Error('请输入正确的手机号码'));
                this.phoneFlag = false;
            } else {
                this.phoneFlag = true;
                callback();
            }
        };
        // let checkareaId = (rule, value, callback) => {
        //     console.log('testareaId', this.formData.areaId);
        //     console.log('testareaFlag', this.formData.areaFlag);
        //     console.log('te22211t', !this.formData.areaId.length && !this.formData.areaFlag);
        //     if (!this.formData.areaId.length && !this.formData.areaFlag) {
        //         callback(new Error('请选择商品销售区域'));
        //     } else {
        //         callback();
        //     }
        // };
        let validateName = (rule, value, callback) => { // 校验仓库名已存在
            if (value === '') {
                callback(new Error('请输入店铺名称'));
                return;
            };
            let params = {};
            params.shopName = value;
            // params.storeId = this.$route.query.storeId;
            this.$http({
                method: 'post',
                url: '/xe-route/xe-app/mobileApp/checkIdentity/insertIdentity',
                data: params
            }).then((res) => {
                if (res.data.remote && res.data.remote.status !== '0000') {
                    callback(new Error(res.data.remote.msg));
                } else {
                    callback();
                }
            }).catch((error) => {
                console.log(error);
            });
        };
        let form = new FormData();
        return {
            disselected:false,
            imageUrl1:'',
            imageUrl2:'',
            imageUrl3:'',
            img1:false,
            img2:false,
            img3:false,
            isSell: false,
            isPart:false,
            limitCount1:1,
            limitCount2:1,
            limitCount3:1,
            hideUpload1: false,
            hideUpload2: false,
            hideUpload3: false,
            dialogImageUrl: '',
            dialogVisible: false,
            nextDisabled: false,
            disabled: false,
            phoneFlag: false,
            picServer: '',
            userInfo: '',
            commitUrl: '/xe-route/xe-app/mobileApp/checkIdentity/insertIdentity',
            formData: {
                // userTypeId: 1, // 注册类型为合伙人，必传   //用户类型
                userProperties: 1, // 企业性质 1：公司企业 3：个体工商户 4:个人 9：其他性质
                shopName: '', // 企业名称
                businessNum: '', // 营业执照号
                juridicalPerson: '', // 法人代表
                userIdNumber: '', // 法人身份证号
                businessPic: '', // 营业执照图片url
                idcardPic: '', // 身份证正面图片url
                idcardBackPic: '', // 身份证反面图片url
                // foodLicensePic: '', // 食品许可证图片url
                // comType: 3, // 企业类型 3：生产加工厂4：代理商 5：品牌商6：经销商7：进出口贸易8：协会合作社
                // businessType: '', // 主营类型（用逗号分割存储） 1肉禽蛋类 2海鲜水产 一级分类
                // businessTypes: [],
                // businessTypeName: '', // 主营类型（用逗号分割存储） 为平台一级分类name
                // businessTypeNames: [],
                provinceId: 1, // 企业所在地省id
                cityId: 2, // 企业所在地市id
                userAddr: '', // 企业所在地详细地址
                // areaId: [], // 商品销售区域id 多个id 用，分割
                // payType: 3, // 支付方式 1 在线支付 2 货到付款 3 都支持
                // payTypes: [1, 2],
                shopName: '', // 店铺名称
                userName: '', // 联系人名称
                userPhone: '', // 联系人手机号
                email: '', // 联系人邮箱
                formProCitys: [],
                areaFlag: false,
                // "version":"1"  //上一接口返回
                // "idcardApId"://上一接口返回
                // "idcardVer"://上一接口返回
                // "busApId"://上一接口返回
                // "busVer"://上一接口返回
                // "foodApId"://上一接口返回
                // "foodVer"://上一接口返回
                // verifyCode: ''
                // resource: '',
                // desc: ''
            },
            // provinceList: [],
            provinceList2: [],
            loadingUploadImg: false,
            categoryList: [],
            rules: {
                shopName: [
                    {required: true, message: '请输入企业名称', trigger: 'blur'}
                ],
                businessNum: [  //营业执照
                    {required: true, message: '该证件不能为空', trigger: 'blur'},
                    {validator: checkCertificates, trigger: 'blur'}
                ],
                // endDate: [
                //     {required: true, message: '请选择过期日期', trigger: 'change'}
                // ],
                juridicalPerson: [
                    {required: true, message: '法定代表人不能为空', trigger: 'blur'},
                    {validator: checkChinese, trigger: 'blur'}
                ], 
                userIdNumber: [   //法人身份证号码
                    {required: true, message: '该证件不能为空', trigger: 'blur'},
                    {validator: checkId, trigger: 'blur'}
                ],
                // businessTypeNames: [
                //     {type: 'array', required: true, message: '请至少选择一个主营类型', trigger: 'change'},
                //     {validator: checkBoxlength, trigger: 'change'}
                // ],
                formProCitys: [
                    {type: 'array', required: true, message: '请选择企业所在地', trigger: 'change'}
                ],
                userAddr: [
                    {required: true, message: '请选择详细地址', trigger: 'change'}
                ],
                // areaId: [
                //     {validator: checkareaId, message: '请选择商品销售区域', trigger: 'change'}
                // ],
                // areaFlag: [
                //     {validator: checkareaId, message: '请选择商品销售区域', trigger: 'change'}
                // ],
                // payTypes: [
                //     {type: 'array', required: true, message: '请选择支持付款方式', trigger: 'change'}
                // ],
                shopName: [
                    {validator: validateName, trigger: 'blur'},
                    {required: true, message: '请输入店铺名称', trigger: 'blur'}
                ],
                userName: [
                    {required: true, message: '请输入联系人姓名', trigger: 'blur'}
                ],
                userPhone: [
                    {required: true, message: '请输入手机号码', trigger: 'blur'},
                    {validator: checkPhone, trigger: 'blur'}
                ],
                email: [
                    {type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur'}
                ],
                // verifyCode: [
                //     {required: true, message: '请输入手机验证码', trigger: 'blur'}
                // ]
            }
        };
    },
    created() {
        this.loadClassfy();
        this.loadArea(0);
        // let nowCookie = getNowCookie();
        // this.userInfo = nowCookie.userInfo.code;
        // console.log('test', nowCookie.userInfo.code);
        // if (this.userInfo === 3) {
        //     this.loadInf();
        //     this.commitUrl = '/xe-route/xe-erp/xeveninfo/updateMerchants';
        // }
        console.log(this.$route.query.name)
        if(this.$route.query.name == "sell"){
            this.isSell = true
            this.formData.userTypeId = 2
        }else if(this.$route.query.name == "part"){
            this.isPart = true
            this.formData.userTypeId = 3
        }
    },
    mounted(){
        if (this.$getLocalStorage('mallName')) {
            this.disselected = true
            // this.
        }
    },
    methods: {
        allchange1(file,fileList){
            console.log(file.url)
            // this.formData.append('imgUrl', file.url); 
            // console.log(this.param1)
            this.hideUpload1 = fileList.length >= this.limitCount1;
        },
        hadsuccess1(response, file, fileList){
            // console.log(file)
            // console.log(file.url)
            let aa = new FormData();
            console.log(aa)
            console.log(this.form)
            aa.append('files', file.url);
            if(file.status == "success"){
                this.img1=true
            }
        },
        handleRemove1(file, fileList) {
            this.hideUpload1 = fileList.length >= this.limitCount1;
        },
        handlePictureCardPreview1(file) {
            this.dialogImageUrl = file.url;
            this.dialogVisible = true;
        },
        allchange2(file,fileList){
            this.hideUpload2 = fileList.length >= this.limitCount2;
        },
        hadsuccess2(response, file, fileList){
            if(file.status == "success"){
                this.img2=true
            }
        },
        handleRemove2(file, fileList) {
            this.hideUpload2 = fileList.length >= this.limitCount2;
            console.log(this.hideUpload2)
        },
        handlePictureCardPreview2(file) {
            this.dialogImageUrl = file.url;
            this.dialogVisible = true;
        },
        allchange3(file,fileList){
            this.hideUpload3 = fileList.length >= this.limitCount3;
            console.log(this.hideUpload3)
        },
        hadsuccess3(response, file, fileList){
            if(file.status == "success"){
                this.img3=true
            }
        },
        handleRemove3(file, fileList) {
            this.hideUpload3 = fileList.length >= this.limitCount3;
            console.log(this.hideUpload3)
        },
        handlePictureCardPreview3(file) {
            this.dialogImageUrl = file.url;
            this.dialogVisible = true;
        },
        formSubmit(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    if(this.img1 == false){
                        this.$message.warning('请上传营业执照');
                    }else if(this.img2 == false){
                        this.$message.warning('请上传身份证正面');
                    }else if(this.img3 == false){
                        this.$message.warning('请上传身份证反面');
                    }
                    // if (this.formData.userProperties === 4) {
                        // if (!this.formData.idcardPic || !this.formData.idcardBackPic || !this.formData.foodLicensePic) {
                        //     this.$xeMessage.warning('请上传图片');
                        //     return false;
                        // }
                        // this.$set(this.formData, 'businessNum', '');
                        // this.$set(this.formData, 'endDate', '');
                        // this.$set(this.formData, 'businessPic', '');
                    // } else {
                    //     if (!this.formData.businessPic || !this.formData.idcardPic || !this.formData.idcardBackPic || !this.formData.foodLicensePic) {
                    //         this.$xeMessage.warning('请上传图片');
                    //         return false;
                    //     }
                    // }
                    // if (this.formData.areaFlag) {
                    //     this.formData.areaId = [0];
                    // }
                    this.nextDisabled = true;
                    this.$http({ // submit
                        method: 'post',
                        url: this.commitUrl,
                        data: this.formData
                    }).then((res) => {
                        console.log('success');
                        this.nextDisabled = false;
                        this.$xeMessage.success(res.msg);
                        if(this.$route.query.name == "sell"){
                            this.$router.push({path:"chooseShop"})
                        }else if(this.$route.query.name == "part"){
                            this.$router.push({path:"audit"})
                        }
                        // resetUserInfoCookie({code: 1});
                        
                    }).catch((error) => {
                        this.nextDisabled = false;
                        this.$xeMessage.error(error.msg);
                    });
                } else {
                    return false;
                }
            });
        },
        // cancle() {
        //         this.$router.go(-1);
        // },
        // inputFile2Fn(id, imgType) {
        //     this.loadingUploadImg = true;
        //     var formDatas = new FormData(document.getElementById(id));
        //     formDatas.append('fileType', 3);
        //     this.$http({
        //         method: 'post',
        //         url: '/xe-app/xe-route/xe-mis/manager/uploadImg/manImgUpload',
        //         data: formDatas
        //     }).then(res => {
        //         console.log(res);
        //         this.loadingUploadImg = false;
        //         this.picServer = res.data.picServer;
        //         switch (imgType) {
        //             case 1: {
        //                 this.formData.businessPic = res.data.imgInfoList[0].imgName;
        //                 break;
        //             }
        //             case 2: {
        //                 this.formData.idcardPic = res.data.imgInfoList[0].imgName;
        //                 break;
        //             }
        //             case 3: {
        //                 this.formData.idcardBackPic = res.data.imgInfoList[0].imgName;
        //                 break;
        //             }
        //             case 4: {
        //                 this.formData.foodLicensePic = res.data.imgInfoList[0].imgName;
        //                 break;
        //             }
        //         }
        //     }).catch(error => {
        //         this.loadingUploadImg = false;
        //         console.log(error);
        //     });
        // },
        // getMsg() {
        //     var _this = this;
        //     this.$refs.formData.validateField('userPhone');
        //     if (this.phoneFlag) {
        //         this.disabled = true;
        //         this.$http({
        //             method: 'post',
        //             url: '/xe-route/xe-erp/xeveninfo/sendSms',
        //             data: {
        //                 userPhone: this.formData.userPhone
        //             }
        //         }).then(res => {
        //             console.log('test');
        //             this.$xeMessage.success(res.data.msg);
        //             let count = 120;
        //             $('#msgBtn span').html('120s');
        //             let msgTimer = setInterval(() => {
        //                 count--;
        //                 $('#msgBtn span').html(count + 's');
        //                 if (count === 0) {
        //                     clearInterval(msgTimer);
        //                     _this.disabled = false;
        //                     $('#msgBtn span').html('获取验证码');
        //                     console.log('test');
        //                 }
        //             }, 1000);
        //         }).catch(error => {
        //             console.log(error);
        //             this.disabled = false;
        //         });
        //     }
        // },
        handleCateNameChange(val) {
            this.formData.businessTypeNames = val;
            let businessTypeArr = [];
            if (val.length > 3) {
                val = val.slice(0, 3);
                this.formData.businessTypeNames = val.slice(0, 3);
                this.$xeMessage.warning('主营类型最多选择3项');
            }
            if (val.length) {
                for (var i = 0; i < val.length; i++) {
                    this.categoryList.some(item => {
                        if (item.cateName === val[i]) {
                            businessTypeArr.push(item.cateId);
                            return true;
                        }
                    });
                }
            };
            this.formData.businessTypes = businessTypeArr;
        },
        areaItemchange(val) {
            console.log('active item:', val);
            let flag = false;
            this.provinceList.some(item => {
                if (item.areaId === val[0] && !item.cities.length) {
                    flag = true;
                    return true;
                }
            });
            if (flag) {
                this.queryAreaListByParent(val[0], (dataList) => {
                    this.provinceList.some(item => {
                        if (item.areaId === val[0]) {
                            item.cities = dataList;
                            return true;
                        }
                    });
                });
            }
        },
        valChange(val) {
            this.formData.provinceId = val[0];
            this.formData.cityId = val[1];
        },
        queryAreaListByParent(id, fn) {
            this.$http({
                method: 'post',
                url: '/xe-route/xe-erp/xeveninfo/getArea',
                data: {
                    areaId: id
                }
            }).then(res => {
                fn && fn(res.data.areaList);
            }).catch(error => {
                console.log(error);
            });
        },
        loadArea(id) {
            this.$http({
                method: 'post',
                url: '/xe-route/xe-erp/xeveninfo/getArea',
                data: {
                    areaId: id
                }
            }).then(res => {
                console.log(res);
                this.provinceList = res.data.areaList;
                this.provinceList2 = res.data.areaList;
                console.log('provinceList2', this.provinceList2);
                this.provinceList2.forEach(item => {
                    this.$set(item, 'cities', []);
                });
            }).catch(error => {
                console.log(error);
            });
        },
        loadClassfy() {
            this.$http({
                method: 'post',
                url: '/xe-route/xe-erp/xeveninfo/getCategory'
            }).then(res => {
                // console.log(res.data.xeVenInfo);
                this.$set(this, 'categoryList', res.data.categoryList);
            }).catch(error => {
                console.log(error);
            });
        },
        // loadpayTypes(val) {
        //     let outPut = [];
        //     if (val === 3) {
        //         outPut = [1, 2];
        //     } else if (val === 0) {
        //         outPut = [];
        //     } else {
        //         outPut = [val];
        //     }
        //     // console.log('outPut', outPut);
        //     return outPut;
        // },
        // changeFlag() {
        //     console.log('testareaId', this.formData.areaId);
        //     console.log('testareaFlag', this.formData.areaFlag);
        //     console.log('te22211t', !this.formData.areaId.length && !this.formData.areaFlag);
        //     this.$refs.formData.validateField('areaId');
        // },
        loadInf() {
            this.$http({
                method: 'post',
                url: '/xe-route/xe-erp/xeveninfo/getMerchantsInfo'
            }).then(res => {
                console.log(res.data.xeVenInfo);
                this.formData = res.data.xeVenInfo;
                if (this.formData.businessTypeName) {
                    this.$set(this.formData, 'businessTypeNames', this.formData.businessTypeName.split(','));
                } else {
                    this.$set(this.formData, 'businessTypeNames', []);
                }
                // console.log('testareaid', this.formData.areaId[0] === 0);
                if (this.formData.areaId[0] === 0) {
                    this.$set(this.formData, 'areaId', []);
                    this.$set(this.formData, 'areaFlag', true);
                } else {
                    this.$set(this.formData, 'areaFlag', false);
                }
                if (this.formData.businessType) {
                    this.$set(this.formData, 'businessTypes', this.formData.businessType.split(','));
                } else {
                    this.$set(this.formData, 'businessTypes', []);
                }
                console.log('businessTypes', this.formData.businessTypes);
                let uniqueObj = {};
                this.categoryList.forEach(item => {
                    // statements
                    uniqueObj[item.cateId] = 1;
                });
                console.log('uniqueObj', uniqueObj);
                for (var i = 0; i < this.formData.businessTypes.length; i++) {
                    console.log('this.formData.businessTypes[i]', this.formData.businessTypes[i]);
                    if (!uniqueObj[this.formData.businessTypes[i]]) {
                        this.formData.businessTypes.splice(i, 1);
                        this.formData.businessTypeNames.splice(i, 1);
                        i--;
                    }
                }
                console.log('this.formData.businessTypes', this.formData.businessTypes);
                // 回显企业所在地
                this.provinceList2.some(item => {
                    if (item.areaId === this.formData.provinceId) {
                        this.queryAreaListByParent(item.areaId, (dataList) => {
                            item.cities = dataList;
                            return true;
                        });
                    }
                });
                this.picServer = res.data.picServer;
                if (this.formData.userProperties === 4) {
                    this.$set(this.formData, 'businessPic', '');
                };
                // this.$set(this.formData, 'payTypes', this.loadpayTypes(this.formData.payType));
                this.formData.formProCitys = [this.formData.provinceId, this.formData.cityId];
            }).catch(error => {
                console.log(error);
            });
        }
    },
    watch: {
        'formData.businessTypes'(val) {
            // console.log('businessTypes', val);
            if (val) {
                this.formData.businessType = val.join(',');
            } else {
                this.formData.businessType = '';
            }
        },
        'formData.businessTypeNames'(val) {
            if (val) {
                this.formData.businessTypeName = val.join(',');
            } else {
                this.formData.businessTypeName = '';
            }
        },
        // 'formData.payTypes'(val) {
        //     console.log('payTypes', val);
        //     if (!val) {
        //         this.formData.payType = 0;
        //     } else if (val.length === 2) {
        //         this.formData.payType = 3;
        //     } else if (val.length === 1) {
        //         this.formData.payType = val[0];
        //     } else {
        //         this.formData.payType = 0;
        //     };
        // }
        // 'formData.payType'(val) {
        //     // console.log('payType', val);
        //     if (val === 3) {
        //         this.formData.payTypes = [1, 2];
        //     } else if (val === 0) {
        //         this.formData.payTypes = [];
        //     } else {
        //         this.formData.payTypes = [val];
        //     }
        // }
    },
    computed: {
        uploadBtnFlag1() {
            let businessPicFlag = true;
            if (this.formData.businessPic !== '') {
                businessPicFlag = true;
            } else {
                businessPicFlag = false;
            }
            return businessPicFlag;
        },
        uploadBtnFlag2() {
            let idcardFlag = true;
            if (this.formData.idcardPic !== '') {
                idcardFlag = true;
            } else {
                idcardFlag = false;
            }
            // console.log(idcardFlag);
            return idcardFlag;
        },
        uploadBtnFlag3() {
            let dcardBackPicFlag = true;
            if (this.formData.idcardBackPic !== '') {
                dcardBackPicFlag = true;
            } else {
                dcardBackPicFlag = false;
            }
            // console.log(dcardBackPicFlag);
            return dcardBackPicFlag;
        },
        uploadBtnFlag4() {
            let foodLicensePicFlag = true;
            if (this.formData.foodLicensePic !== '') {
                foodLicensePicFlag = true;
            } else {
                foodLicensePicFlag = false;
            }
            // console.log(foodLicensePicFlag);
            return foodLicensePicFlag;
        },
        
    },
};
</script>

<style lang="scss">
h3{
        font-size: 26px;
        padding-bottom: 25px;
        border-bottom: 1px solid rgb(180,180,180);
        color: rgb(180,180,180);
    }
.apply-cons{
    width: 100%;
    padding: 40px;
    
    .el-form-item__label{
        padding: 25px 17px 0 0;
        font-size: 32px;
    }
    .el-form-item__content{
        margin-top: 13px;
    }
    .el-radio__label{
        font-size: 28px;
    }
    .el-form-item__content {
        margin-top: 24px;
        margin-left: 42px;
        font-size: 32px;
    }
    .el-input__inner {
        font-size: 18px;
    }
    .el-input__inner {
        font-size: 26px;
    }
    ul,ol,li{
        margin-top: 20px;
    }
    .el-checkbox__label{
        font-size: 32px;
        line-height:42px;
    }
    .el-radio__inner{
        width: 20px;
        height: 20px;
    }
    .el-radio__input{
        top: -2px;
    }
    .el-radio__inner::after{
        width: 10px;
        height: 10px;
    }
    .el-checkbox__inner{
        width: 20px;
        height: 20px;
    }
    .el-checkbox__inner::after{
        height: 18px;
        left: 11px;
        // top: 0px;
        // border: 4px solid #FFF;
    }
    .el-form-item__error{
        font-size: 18px;
    }
    .el-button--medium{
        font-size: 24px;
    }
    .hide .el-upload--picture-card {
        display: none;
    }
    .el-upload__tip{
        font-size: 20px;
    }
}
    .apply-cons .el-button--medium {
        font-size: 32px;
    }
</style>
