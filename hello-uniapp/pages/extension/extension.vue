<template>
    <div class="extension">
        <h3>推广链接</h3>
        <h3>{{link}}</h3>
        <div class="qrcode"></div>
        <div class="copy">
            <el-button type="primary" style="
                margin-top: 45px;
                font-size: 45px;"
                v-clipboard:copy="link" v-clipboard:success="onCopy" v-clipboard:error="onError"
            >复制</el-button>
        </div>
    </div>
</template>
<script>
import QRCode from 'qrcodejs2'  
export default {
    name:'extension',
    data(){
        return{
            link:'',
            imageUrl:"",
            multiple:'',
            shopUrl:window.location.origin
        }
    },
    computed:{
        // shopUrl(){
            
        // }
    },
    mounted(){
        this.getLink()
        this.gettu()
        console.log(this.shopUrl)
    },
    methods: {  
        // 复制成功时的回调函数
        onCopy (e) {
            this.$xeMessageBox.alert(`内容已复制到剪切板！`).then(() => {
            })
        },
        // 复制失败时的回调函数
        onError (e) {
            this.$message.error("抱歉，复制失败！")
        },
        getLink(){
            this.$http({
                method:"post",
                url:this.shopUrl+'/xe-route/xe-app/mobileApp/spreadmember/spreadmemberlist',
                data:{
                    partnerId :3
                }
            }).then(res => {
                if(res.status == '0000'){
                    this.link = res.data.hhrUrl
                }else{
                    this.$xeMessageBox('提示', res.msg);
                }
            }).catch(err => {
                console.log(err)
            })
        },
        handleAvatarSuccess(res, file){
            console.log(res)
        },
        beforeAvatarUpload(){

        },
        gettu(){
            this.$http({
                method:"post",
                url:this.shopUrl+'/xe-route/xe-app/mobileApp/spreadmember/reCode',
                data:{ partnerId :3 }
            }).then(res => {
                console.log(res)
            }).catch(err => {
                console.log(err)
            })
        }
    }
}
</script>
<style lang="scss" scoped>
.extension{
    padding: 25px;
    position: relative;
    
    h3{
        line-height: 108px;
        border-bottom: 2px solid darkgray;
    }
    h3:nth-child(2){
        border: none;
    }
    #qrcode{
        position: absolute;
        top: 400px;
        left: 50%;
        margin-left: -200px;
    }
    .copy{
        position: absolute;
        left: 45%;
        top: 900px;
    }
}
</style>