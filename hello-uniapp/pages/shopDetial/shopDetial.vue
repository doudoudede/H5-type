<template>
    <view class="shopDetial">
        <h2>商城信息</h2>
        <p>商城名称:{{list.mallName}}</p>
        <p>所属行业：{{list.typeName}}</p>
        <p>所在区域：{{list.provinceName}}{{list.cityName}} {{list.areaName}}北京市-北京</p>
        <p>商城开通时间：2018-3-21 18:00:00</p>
        <p>商城介绍</p>
        <view class="text">
            {{text}}
        </view>
        <el-button type="primary" style="margin-top:20px;" @click="goback" >返回</el-button>
    </view>
</template>
<script>
export default {
    name:'shopdetial',
    data(){
        return{
            text:'',
            list:[]
        }
    },
    mounted(){
        this.getList()
    },
    methods:{
        getList(){
            this.$http({
                method:'post',
                url:'/xe-route/xe-app/mobileApp/user/queryMallInfo',
                data:{partnerId :this.$route.query.id}
            }).then(res=> {
                this.list = res.data.mallInfo
                console.log(this.list)
            }).catch(err=>{
                console.log(err)
            })
        },
        goback(){
            this.$router.go(-1)
        }
    }
}
</script>
<style lang="scss" scoped>
.shopDetial{
    padding: 30px;
    p{
        font-size: 18px;
        line-height: 45px;
    }
    .text{
        width: 100%;
        height: 200px;
        border: 1px solid darkgrey;
        padding: 10px;
        border-radius: 10px;
        line-height: 20px;
        font-size: 18px;
    }
}
</style> 