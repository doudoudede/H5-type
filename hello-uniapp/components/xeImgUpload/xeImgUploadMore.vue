<template lang="html">
    <div class="item-main-box">
        <div class="detial-lis clearfix">
            <div class="fl" style="width: auto">
                <!--上传图片-->
                <div class="item-uploadImg_box clearfix">
                    <ul v-if='uploadImgComputed.length' class="fl" style="width: auto">
                        <li v-for='(item, index) in uploadImgComputed' :key='index' class="h-brand-img">
                            <img :src="picServers + item" alt="">
                            <span @click.prevent='removeImg(index)' class="xe-iconfont xe-icon-guanbi"></span>
                        </li>
                    </ul>
                    <div class="uploadImg-btn fl" @click="appImgupload(oldUploadImgComputed.type)" v-if="uploadImgComputed.length < maxLen">
                        <span class="xe-iconfont xe-icon-camra" style="color: #b5c0ce"></span>
                        <i class="upload-text">{{uploadText}}</i>
                        <form name='form2' id="formFile2">
                            <!--<input type="hidden" name="fileType" v-model="fileType">-->
                            <input type="file" name='imgUrl' class='inputFile2' @change='inputFile2Fn' accept="image/gif,image/jpeg,image/jpg,image/png">
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: '',
    data() {
        return {
            loadingUploadImg: false,
            uploadImg: [],
            picServerhttp: '',
            oldUploadImg: {}
        };
    },
    props: {
        fileType: {
            type: String,
            default: '3'
        },
        picServer: {
            type: String,
            default: ''
        },
        oldUploadImgComputed: { // 回显传递的图片信息
            type: Object,
            default: () => {
                return {
                    type: '',
                    picServer: '',
                    picArray: []
                };
            }
        },
        maxLen: {
            type: Number,
            default: 1
        },
        uploadText: {
            type: String,
            default: ''
        }
    },
    created() {
        if (this.oldUploadImgComputed.picArray && this.oldUploadImgComputed.picArray.length) {
            this.uploadImg = this.oldUploadImgComputed.picArray;
        } else {
            this.uploadImg = [];
        }
    },
    methods: {
        appImgupload(type) {
            // type 1-身份证正面 2-身份证反面
            // 与原生传递消息
            if (window.postMessage) {
                window.postMessage(JSON.stringify({type: 'special', payload: {goPage: 'imgUpload', imgType: type}}), '*');
            };
        },
        removeImg(index) {
            let _this = this;
//            this.uploadImgComputed.splice(index, 1);
            this.uploadImg.splice(index, 1);
            setTimeout(() => {
                _this.$emit('imgUpload', this.proImgs);
            }, 300);
        },
        inputFile2Fn(e) {
            let _this = this;
            this.loadingUploadImg = true;
            var formData = new FormData(e.target.parentNode);
            this.$indicator.open('图片上传中...');
            this.$http({
                method: 'post',
                url: '/xe-zuul/xe-route/xe-app/mobileApp/checkIdentity/uploadImg',
                data: formData
            }).then(res => {
                this.picServerhttp = res.data.picServer;
                let imgInfoList = res.data.imgUrl;
                this.uploadImg.push(imgInfoList.join(''));
                this.loadingUploadImg = false;
                setTimeout(() => {
                    _this.$emit('imgUpload', this.proImgs);
                }, 300);
                e.target.value = '';
                this.$indicator.close();
            }).catch(error => {
                console.log(error);
                this.$indicator.close();
            });
        }
    },
    computed: {
        uploadImgComputed() {
//            let picArray = this.oldUploadImgComputed.picArray ? this.oldUploadImgComputed.picArray.concat(this.uploadImg.slice(0, 10)) : this.uploadImg.slice(0, 10);
            return this.uploadImg;
        },
        proImgs() {
            let result = [];
            if (this.uploadImgComputed.length > 0) {
                this.uploadImgComputed.forEach(item => {
                    result.push(item);
                });
                return result;
            } else {
                result = '';
            }
            return result;
        },
        picServers() {
            if (this.oldUploadImgComputed.picServer) {
                return this.oldUploadImgComputed.picServer;
            } else {
                return this.picServerhttp;
            }
        }
    },
    watch: {
        uploadImg(val) {},
        'oldUploadImgComputed.picArray'(val) {
            this.uploadImg = val;
        }
    }
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped="">
    @import "../../static/styles/rules.scss";
    .item-uploadImg_box {
        padding: 10/$ppr 20/$ppr 30/$ppr 20/$ppr;
        ul {
            float: left;
            li.h-brand-img {
                position: relative;
                width: 130/$ppr;
                height: 130/$ppr;
                border: 1/$ppr solid #d9d9d9;
                border-radius: 3/$ppr;
                float: left;
                margin-right: 30/$ppr;
                margin-top: 20/$ppr;
                img {
                    width: 100%;
                    height: 100%;
                }
                span {
                    position: absolute;
                    right: -16/$ppr;
                    top: -16/$ppr;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 32/$ppr;
                    height: 32/$ppr;
                    border-radius: 50%;
                    background: #f23530;
                    font-weight: bold;
                    font-size: 16/$ppr;
                    color: #fff;
                   /* display: flex;
                    align-items: center;
                    justify-content: center;*/
                }
            }
            &:nth-child(2) {
                margin-left: 40/$ppr;
            }
        }
        .uploadImg-btn {
            float: left;
            width: 130/$ppr;
            height: 130/$ppr;
            border: 1/$ppr dashed #d9d9d9;
            border-radius: 3/$ppr;
            cursor: pointer;
            position: relative;
            overflow: hidden;
            margin-top: 20/$ppr;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction: column;
            .inputFile2 {
                position: absolute;
                left: 0;
                top: 0;
                font-size: 130/$ppr;
                z-index: 3;
                opacity: 0;
            }
            span {
                display: inline-block;
                width: 50/$ppr;
                height: 50/$ppr;
                font-size: 40/$ppr;
                text-align: center;
                color: #dadada;
                // position: absolute;
                // left: 50%;
                // top: 50%;
                // margin: -25/$ppr 0 0 -25/$ppr;
                display: flex;
                align-items: center;
                justify-content: center;
            }
        }
        .upload-text {
            // position: absolute;
            // left:0;
            // right: 0;
            // text-align: center;
            // bottom: 10/$ppr;
            display: block;
            font-size: 24/$ppr;
            color: #666;
        }
    }
</style>
