<template>
    <view class="apply-cons">
       <!-- fromdata -->
       <el-form :model="formData" :rules="rules" ref="formData" label-width="100px" :inline="true" class="apply-formData">
            <h5>基本信息</h5>
            <view class="infor-baseApply">
               <view class="floor-apply">
                    <el-form-item label="企业性质" prop="userProperties" required>
                        <el-radio-group v-model="formData.userProperties">
                            <el-radio :disabled="dis" :label="1">公司企业</el-radio>
                            <el-radio  :disabled="dis" :label="3">个体工商户</el-radio>
                        </el-radio-group>
                    </el-form-item>
                </view>
                <view class="floor-apply" >
                    <el-form-item label="企业名称" prop="venName" required>
                        <el-input :disabled="dis" v-model="formData.venName" class="inp-apply" :maxlength="40"></el-input>
                    </el-form-item>
                </view>
                <view class="floor-apply yingye" >
                    <el-form-item label="营业执照号码"  prop="businessNum" required>
                        <el-input :disabled="dis" v-model="formData.businessNum" class="inp-apply" :maxlength="18"></el-input>
                    </el-form-item>
                </view>
                <view class="floor-apply" >
                    <el-form-item label="法定代表人" prop="juridicalPerson" required>
                        <el-input :disabled="dis" v-model="formData.juridicalPerson" class="inp-apply" :maxlength="15"></el-input>
                    </el-form-item>
                </view>
                <view class="floor-apply number"  >
                    <el-form-item label="法人身份证号" prop="userIdNumber" required>
                        <el-input :disabled="dis" v-model="formData.userIdNumber" class="inp-apply" :maxlength="18"></el-input>
                    </el-form-item>
                </view>
                <!-- 上传照片 -->
                <view class="floor-apply for-itemlis" >
                    <el-form-item label=" " >
                        <view class="item-uploadImg_box2 clearfix" v-loading='loadingUploadImg'>
                            <ol class="fl up-active">
                                <li class="up-imgLI">
                                    <img style="width:110px" v-if="formData.idCardFrontPic" :src=" formData.idCardFrontPic" alt="身份证（正面）">
                                </li>
                                <li class="up-slotTips">身份证（正面）</li>
                                <li class="uploadImg-btn">
                                    <view>
                                        <span class="iconfont icon-upload2"></span>
                                        <p>上传文件</p>
                                    </view>
                                    <form name='form2' id='formFile2'>
                                        <input :disabled="dis" type="file" title="点击添加或修改图片" multiple name='imgFiles' class='inputFile2' @change='inputFile2Fn("formFile2", 1)' accept="image/gif,image/jpeg,image/jpg,image/png">
                                    </form>
                                </li>
                            </ol>
                            <ol class="fl up-active">
                                <!-- {{formData.idcardBackPic}} -->
                                <li class="up-imgLI">
                                    <img style="width:110px"  v-if="formData.idcardBackPic" :src=" formData.idcardBackPic" alt="身份证（反面）">
                                </li>
                                <li class="up-slotTips">身份证（反面）</li>
                                <li class="uploadImg-btn">
                                    <view >
                                        <span class="iconfont icon-upload2"></span>
                                        <p>上传文件</p>
                                    </view>
                                    <form name='form3' id='formFile3'>
                                        <input :disabled="dis" type="file" title="点击添加或修改图片" multiple name='imgFiles' class='inputFile2' @change='inputFile2Fn("formFile3", 2)' accept="image/gif,image/jpeg,image/jpg,image/png">
                                    </form>
                                </li>
                            </ol>
                            <ol class="fl up-active">
                                <li class="up-imgLI">
                                    <img style="width:110px" v-if="formData.businessPic" :src="formData.businessPic" alt="食品许可证">
                                </li>
                                <li class="up-slotTips">食品许可证</li>
                                <li class="uploadImg-btn">
                                    <view>
                                        <span class="iconfont icon-upload2"></span>
                                        <p>上传文件</p>
                                    </view>
                                    <form name='form4' id='formFile4'>
                                        <input :disabled="dis" type="file" title="点击添加或修改图片" multiple name='imgFiles' class='inputFile2' @change='inputFile2Fn("formFile4", 3)' accept="image/gif,image/jpeg,image/jpg,image/png">
                                    </form>
                                </li>
                            </ol>
                        </view>
                    </el-form-item>
                </view>
                <view class="floor-apply comcity">
                    <el-form-item prop="formProCitys" label="企业所在地" >
                        <el-select :disabled="dis"  @change="getSheng" v-model="formData.provinceId" placeholder="请选择">
                            <el-option
                            v-for="item in provinceList"
                            :key="item.areaId"
                            :label="item.areaName"
                            :value="item.areaId">
                            </el-option>
                        </el-select>
                        <el-select :disabled="dis"   @change="getShi" v-model="formData.cityId" placeholder="请选择">
                            <el-option
                            v-for="item in provinceList2"
                            :key="item.areaId"
                            :label="item.areaName"
                            :value="item.areaId">
                            </el-option>
                        </el-select>
                        <el-select  :disabled="dis"  @change="getqu" v-model="formData.areaId" placeholder="请选择">
                            <el-option
                            v-for="item in provinceList3"
                            :key="item.areaId"
                            :label="item.areaName"
                            :value="item.areaId">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </view>
                <view class="floor-apply">
                    <el-form-item  label="详细地址" prop="venAddr" required>
                        <el-input :disabled="dis" style="width: 257px;margin-left: 28px;" v-model="formData.venAddr" class="inp-apply"></el-input>
                    </el-form-item>
                </view>
                <view v-if="isSell" class="floor-apply">
                    <el-form-item label="店铺名称" prop="shopName" required>
                        <el-input :disabled="dis" v-model="formData.shopName" class="inp-apply" :maxlength="30"></el-input>
                    </el-form-item>
                </view>
                <view v-if="isPart" class="floor-apply">
                    <el-form-item label="商城名称" prop="shopName" required>
                        <el-input :disabled="dis" v-model="formData.shopName" class="inp-apply" :maxlength="30"></el-input>
                    </el-form-item>
                </view>
                <view class="inf-Merchant">
                <h5>商户联系人信息</h5>
                <view class="floor-apply names">
                    <el-form-item label="联系人姓名" prop="userName" required>
                        <el-input :disabled="dis" v-model="formData.userName" class="inp-apply"></el-input>
                    </el-form-item>
                </view>
                <view class="floor-apply">
                    <el-form-item label="联系人手机" prop="userPhone" required>
                        <el-input :disabled="dis" v-model="formData.userPhone" class="inp-apply" :maxlength="11"></el-input>
                    </el-form-item>
                </view>
                <view class="floor-apply">
                    <el-form-item label="联系人邮箱" prop="email">
                        <el-input :disabled="dis" v-model="formData.email" class="inp-apply"></el-input>
                    </el-form-item>
                </view>
                <view class="floor-apply c-next" style="width:100%">
                    <el-form-item label=" " >  
                        <el-button class="apply_method" v-if="visible" type="primary" @click="formSubmit('formData')" :disabled="nextDisabled">
                            提交申请
                        </el-button>
                    </el-form-item>
                </view>
            </view>
           </view>
       </el-form>
    </view>
</template>
<script>
import NavBar from '@/components/NavBar/NavBar'
export default {
    name:'editinfo',
    components:{NavBar},
    data(){
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
        let validateName = (rule, value, callback) => { // 校验仓库名已存在
            if (value === '') {
                callback(new Error('请输入店铺名称'));
                return;
            };
            let params = {};
            params.shopName = value;
            params.userTypeId = this.formData.userTypeId
            this.$http({
                method: 'post',
                url: '/xe-route/xe-app/mobileApp/checkIdentity/shopNameCheck',
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
        return{
            dis:false,
            nextDisabled: false,
            isSell:false,
            isPart:false,
            loadingUploadImg:false,
            picServer:'',
            provinceList: [],
            provinceList2:[],
            provinceList3:[],
            formData:{
                userTypeId:1,
                userProperties:1,    // 企业性质 1：公司企业 3：个体工商户 
                venName:"",      //企业名称
                businessNum:"",   //营业执照号码
                juridicalPerson:"",    //法定代表人
                userIdNumber:"", //身份证号
                idCardFrontPic:"",     //身份证正面
                idCardBackPic:"",  //身份证反面
                businessPic:"",  //食品许可证
                sheng:"",   //企业所在地
                shi:"",
                qu:"",
                provinceId:'',
                cityId: '', // 企业所在地市id
                areaId:'',
                venAddr:"",        //详细地址
                shopName:"",       //店铺名称
                userName:"",        //联系人姓名
                userPhone:"",       //联系人手机号
                email:""       //联系人邮箱
            },
            visible:true,
            rules:{
                venName: [
                    {required: true, message: '请输入企业名称', trigger: 'blur'}
                ],
                businessNum: [
                    {required: true, message: '该证件不能为空', trigger: 'blur'},
                    {validator: checkCertificates, trigger: 'blur'}
                ],
                juridicalPerson: [
                    {required: true, message: '法定代表人不能为空', trigger: 'blur'},
                    {validator: checkChinese, trigger: 'blur'}
                ],
                legalPersonNum: [
                    {required: true, message: '该证件不能为空', trigger: 'blur'},
                    {validator: checkId, trigger: 'blur'}
                ],
                // formProCitys: [
                //     { required: false, message: '请选择企业所在地', trigger: 'change'}
                // ],
                venAddr: [
                    {required: true, message: '请选择详细地址', trigger: 'change'}
                ],
                shopName: [
                    {validator: validateName, trigger: 'blur'},
                    {required: false, message: '请输入店铺名称', trigger: 'blur'}
                ],
                cityName: [
                    // {validator: validateName, trigger: 'blur'},
                    {required: false, message: '请输入商城名称', trigger: 'blur'}
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
            }
        }
    },
    mounted(){
        this.loadArea('');
        if(this.$route.query.name == "sell"){
            this.isSell = true
            this.formData.userTypeId = 2
            this.rules.cityName[0].required = false
        }else if(this.$route.query.name == "part"){
            this.isPart = true
            this.rules.shopName[0].required = false
            this.formData.userTypeId = 3
        }
        this.getInfo()
    },
    methods:{
        getInfo(){
            var Name;
            var ven = JSON.parse(this.$getLocalStorage('user'))
            if(ven.mallName){
                console.log(ven)
                this.$http({
                    method:"post",
                    url:"/xe-route/xe-app/mobileApp/checkIdentity/getAuthentication",
                    data:{
                        venName:ven.mallName
                    },
                    }).then(res=> {
                    if(res.status == '0000'){
                        this.dis = true
                        this.visible = false
                        console.log(res.data.userInfo.userName)
                        this.formData.userName = res.data.userInfo.userName
                        this.formData.userProperties = res.data.userInfo.userProperties
                        this.formData.businessNum=res.data.userInfo.businessIdNo  
                        this.formData.juridicalPerson=res.data.userInfo.juridicalPerson  
                         this.formData.userIdNumber=res.data.userInfo.userIdNumber
                         this.formData.idCardFrontPic=res.data.userInfo.idCardFrontPic  
                        this.formData.idCardBackPic= res.data.userInfo.idCardBackPic 
                         this.formData.businessPic=res.data.userInfo.businessPic 
                        this.formData.provinceId=res.data.userInfo.provinceId  
                        this.formData.cityId= res.data.userInfo.cityId 
                        this.formData.areaId= res.data.userInfo.areaId  
                       this.formData.venAddr= res.data.userInfo.venAddr  
                       this.formData.shopName= res.data.userInfo.shopName 
                        this.formData.userPhone=res.data.userInfo.userPhone  
                        this.formData.email= res.data.userInfo.email 
                        this.idCardFrontPic = res.data.picServer + res.data.userInfo.idCardFrontPic
                        this.idcardBackPic = res.data.picServer + res.data.userInfo.idcardBackPic
                        this.businessPic = res.data.picServer + res.data.userInfo.businessPic
                    }
                }).catch(err=>{
                    console.log(err)
                })
            }
            
        },
        inputFile2Fn(id,imgType){
            this.loadingUploadImg = true;
            var formDatas = new FormData(document.getElementById(id));
            formDatas.append('fileType', 3);
            this.$http({
                method: 'post',
                url: '/xe-zuul/xe-route/xe-mis/manager/uploadImg/manImgUpload',
                data: formDatas
            }).then(res => {
                console.log(res)
                this.loadingUploadImg = false;
                this.picServer = res.data.picServer;
                switch(imgType){
                    case 1:{
                        this.formData.idCardFrontPic = res.data.picServer+ res.data.imgInfoList[0].imgName
                        break;
                    }
                    case 2:{
                        this.formData.idcardBackPic = res.data.picServer+res.data.imgInfoList[0].imgName
                        break;
                    }
                    case 3:{
                        this.formData.businessPic = res.data.picServer+ res.data.imgInfoList[0].imgName
                        break;
                    }
                }
                console.log(this.formData.idCardFrontPic)
            }).catch(err => {
                this.loadingUploadImg = false;
                console.log(err)
            })
        },
        loadArea(id){
            this.$http({
                method: 'post',
                url: 'xe-route/xe-app/mobile/cart/queryAreaListByParent',
                data: {
                    areaId: id
                }
            }).then(res => {
                    this.provinceList  = res.data.areaList;
                // }
                
            }).catch(error => {
                console.log(error);
            });
        },
        getSheng(val){
            console.log(val)
            this.formData.provinceId = val
            this.$http({
                 method: 'post',
                url: 'xe-route/xe-app/mobile/cart/queryAreaListByParent',
                data: {
                    areaId: val
                }
            }).then(res => {
                console.log(res)
                this.provinceList2 = res.data.areaList;
            })
        },

        getShi(val){
            this.formData.cityId = val
             this.$http({
                 method: 'post',
                url: 'xe-route/xe-app/mobile/cart/queryAreaListByParent',
                data: {
                    areaId: val
                }
            }).then(res => {
                console.log(res)
                this.provinceList3 = res.data.areaList;
            })
        },
        getqu(val){
            this.formData.areaId = val
        },
        formSubmit(formName){
             this.$refs[formName].validate((valid) => {
                if (valid) {
                    if (!this.formData.idCardFrontPic || !this.formData.idcardBackPic || !this.formData.businessPic) {
                        this.$toast({
                            message: '请上传照片信息',
                            duration: 1500
                        });
                        return false;
                    }
                    if(!this.formData.provinceId || !this.formData.cityId || !this.formData.areaId){
                        this.$toast({
                            message: '请填写企业地址',
                            duration: 1500
                        });
                        return false;
                    }
                    // this.nextDisabled = true;
                    this.$http({ // submit
                        method: 'post',
                        url: '/xe-route/xe-app/mobileApp/checkIdentity/insertIdentity',
                        data: this.formData
                    }).then((res) => { 
                        console.log('success');
                        this.visible = false;
                        this.$toast({
                            message: '提交成功',
                            duration: 1500
                        });
                        // resetUserInfoCookie({code: 1});
                        if(res.status == '0000'){
                            if(this.$route.query.name == "sell"){
                                this.$router.push({name: 'chooseshop'});
                            }else if(this.$route.query.name == "part"){
                            this.$router.push({name: 'audit',query:{name:'part'}});
                            }
                            var use = this.$getLocalStorage('LOGINSTATUS')
                            var obj={id: use,'mallName':this.formData.venName}
                            this.$setLocalStorage('user',JSON.stringify(obj))
                            this.$indicator.open('加载中...');
                            this.$router.push({name:'xe-page-my'})
                        }
                    }).catch((error) => {
                        this.visible = true;
                        // this.$toast({
                        //     message: error.msg,
                        //     duration: 1500
                        // });
                    });
                } else {
                    return false;
                }
            });

        }
    }
}
</script>
<style lang="scss">
.apply-cons{
    margin: auto;   
    .el-form-item{
        margin-bottom: 0;
        margin-top: 25px;
    }
    .el-form--inline .el-form-item{
        width: 100%;
    }
    max-width: 7.5rem;
    padding-left: 20px;
    padding-top: 4%;
    overflow: hidden;
    h5{
        width: 91%;
    font-weight: normal;
    margin: 0;
    font-size: 18px;
    height: 33px;
    line-height: 30px;
    border-bottom: 1px solid darkgrey;
    }
    .names{
        margin-top: 30px;
    }
    
}
.comcity{
    .el-input__inner{
        width: 257px;
        margin-left: 28px;
        margin-top: 20px;
    }
    .el-input__suffix {
        right: 5px;
        top: 9px;
    }
    .el-form-item__content{
        width: 200px;   
        margin-left: -100px;
        margin-top: 45px;
    }
}
.c-next{
    .el-form-item__content{
        width: 100%;
    }
}
.number{
    .el-form-item__label{
        width:107px !important;
    }
}
.yingye{
    .el-form-item__label{
        width:107px !important;
    }
}
.apply_method{
    width: 109%;
    height: 0.98rem;
    margin-left: -.23rem;
    font-size: .36rem;
}
</style>