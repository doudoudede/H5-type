<template>
    <xe-layout class='m-bg-dark'>
        <view class="m-feedback-item">
            <view class="m-list-block">
                <ul>
                    <li class="item-content">
                        <view class="item-inner">
                            <view class="item-title f32">联系人</view>
                            <view class="item-input">
                                <input class="input-cls" v-model="contactPeople" placeholder="输入联系人姓名" type="text">
                            </view>
                            <view class="act">
                                <span class="xe-iconfont xe-icon-cuowu" v-if="contactPeople.length" @click.prevent="contactPeople = ''"></span>
                            </view>
                        </view>
                    </li>
                    <li class="item-content">
                        <view class="item-inner">
                            <view class="item-title f32">手机号</view>
                            <view class="item-input">
                                <input class="input-cls" v-model.number="mobile" placeholder="输入手机号" type="tel" maxlength="11">
                            </view>
                            <view class="act">
                                <span class="xe-iconfont xe-icon-cuowu" v-if="mobile.length" @click.prevent="mobile = ''"></span>
                            </view>
                        </view>
                    </li>
                </ul>
            </view>
        </view>
        <view class="m-feedback-item">
            <view class="m-feedback-textarea">
                <textarea v-model="feedbackContent" placeholder="请输入反馈内容" maxlength="500"></textarea>
            </view>
            <view class="item-uploadImg_box clearfix">
                <ul>
                    <template v-if="uploadImg2.length">
                        <li class="items" v-for="(item, index) in uploadImg2">
                            <img :src="item" alt="">
                            <span class="xe-iconfont xe-icon-guanbi" @click.prevent="remove(index)"></span>
                        </li>
                    </template>
                    <li class="uploadImg-btn" v-if="uploadImg2.length < 5">
                        <span class="xe-iconfont xe-icon-camra"></span>
                        <form name='form2' id='formFile2'>
                            <input
                                type="file"
                                multiple
                                name='imgUrl'
                                ref='inputFile2'
                                class='inputFile2'
                                @change='inputFile2Fn'
                                accept="image/gif,image/jpeg,image/jpg,image/png"
                            >
                        </form>
                    </li>
                </ul>
            </view>
        </view>
        <view class="m-feedback-btn">
            <mt-button type="primary" class="xe-button-primary" style="width: 100%;" @click.prevent="btnfn">提交</mt-button>
        </view>
    </xe-layout>
</template>
<script type="text/ecmascript-6">
    export default {
        name: 'xe-page-feedback',
        data() {
            return {
                contactPeople: '',
                mobile: '',
                feedbackContent: '',
                imgUrl: '',
                cityId: '',
                uploadImg2: []
            };
        },
        created() {
            let nowRegionMap = JSON.parse(this.$getLocalStorage('REGIONMAP'));
            this.cityId = nowRegionMap.cityId;
        },
        methods: {
            inputFile2Fn(evt) {
                var resultFile = evt.target.files;
                let _this = this;
//                if (resultFile.size / 1024 / 1024 > 4) {
//                    this.$toast('请上传小于4M的照片！');
//                    return;
//                }
                if (!resultFile[0]) {
                    this.$toast('不支持File api');
                };
                if (resultFile && resultFile.length <= 5) {
                    for (let key in resultFile) {
                        if (key === 'length' || key === 'item') {} else {
                            var reader = new FileReader();
                            reader.readAsDataURL(resultFile[key]);
                            reader.onload = function (e) {
                                var urlData = this.result;
                                var img = new Image();
                                img.onload = function() {
                                    var compressedDataUrl = _this.compressImg(img, resultFile.type);
                                    _this.uploadImg2.push(compressedDataUrl);
                                };
                                img.src = urlData;
                            };
                        }
                    }
                } else {
                    this.$toast(`文件数不能超过5个,你选择了${resultFile.length}个`);
                    evt.target.value = '';
                }
                console.log(resultFile);
            },
            compressImg(img, fileType) {
                let canvas = document.createElement('canvas');
                let ctx = canvas.getContext('2d');
                let width = img.width;
                let height = img.height;
                canvas.width = width;
                canvas.height = height;
                ctx.fillStyle = '#fff';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(img, 0, 0, width, height);
                // 压缩
                var base64data = canvas.toDataURL(fileType, 0.75);
                canvas = ctx = null;
                return base64data;
            },
            remove(index) {
                this.uploadImg2.splice(index, 1);
            },
            btnfn() {
                if (!this.contactPeople) {
                    this.$toast('请填写联系人');
                    return;
                }
                if (!this.mobile || !(/^1(3|4|5|7|8)\d{9}$/.test(this.mobile))) {
                    this.$toast('请填写正确的手机号');
                    return;
                }
                if (!this.feedbackContent) {
                    this.$toast('请填写反馈内容');
                    return;
                }
                this.$indicator.open('提交中...');
                let formData = new FormData(document.querySelector('#formFile2'));
                formData.append('contactPeople', this.contactPeople);
                formData.append('mobile', this.mobile);
                formData.append('feedbackContent', this.feedbackContent);
                formData.append('cityId', this.cityId);
                formData.append('source', 4);
                console.log(formData);
                this.$http({
                    method: 'post',
                    url: '/xe-zuul/xe-route/xe-app/mobileApp/user/insertFeedBack',
                    data: formData
                }).then(res => {
                    console.log(res);
                    this.$indicator.close();
                    this.$router.go(-1);
                }).catch(error => {
                    console.log(error);
                    this.$indicator.close();
                });
            }
        }
    };
</script>
<style rel="stylesheet/scss" lang="scss">
    @import "../../static/styles/rules.scss";
    .m-feedback-item {
        background: #fff;
        margin: 20/$ppr 0;
    }
    .m-feedback-textarea {
        margin-left: 20/$ppr;
        border-bottom: 1/$ppr solid $border-color-e8e;
        textarea {
            width: 100%;
            height: 380/$ppr;
            padding: 10/$ppr 0;
            font-size: 28/$ppr;
            line-height: 1.4;
            outline: 0;
            resize: none;
            border: none;
        }
    }
    .item-uploadImg_box {
        padding: 10/$ppr 20/$ppr 30/$ppr 20/$ppr;
        ul {
            float: left;
            li.items {
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
                    width: 32/$ppr;
                    height: 32/$ppr;
                    border-radius: 50%;
                    position: absolute;
                    right: -16/$ppr;
                    top: -16/$ppr;
                    background: #f23530;
                    font-size: 16/$ppr;
                    color: #fff;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
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
                position: absolute;
                left: 50%;
                top: 50%;
                margin: -25/$ppr 0 0 -25/$ppr;
                display: flex;
                align-items: center;
                justify-content: center;
            }
        }
    }
    .m-feedback-btn {
        margin: 40/$ppr 30/$ppr;
    }
</style>
