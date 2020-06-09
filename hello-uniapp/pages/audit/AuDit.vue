<template>
    <view class="audit">
        <h2>{{status}},{{msg}}</h2>
    </view>
</template>
<script>
export default {
    name:'AuDit',
    data(){
        return{
            ststus:'',
            msg:'',
        }
    },
    mounted(){
        this.getResult()
    },
    methods:{
        getResult(){
            this.$http({
                method:'post',
                url:"/xe-route/xe-app/mobileApp/checkIdentity/getStatus",
                data:{},
            }).then(res => {
                if(this.$route.query.name == 'sell'){
                    console.log('111')
                    this.ststus = res.data.myresult.status
                    this.msg  =  res.data.myresult.reason
                    if( status == 0){
                        this.status = "待提交"
                    }else if(status == 1){
                        this.status = "待审核"
                    }else if(status == 2){
                        this.status = "已审核"
                    }else if(status == 3){
                        this.status = "已驳回"
                    }
                }else if(this.$route.query.name == 'part')
                    this.ststus = res.data.hhrresult.status
                    this.msg  =  res.data.hhrresult.reason
                    if( status == 0){
                        this.status = "待提交"
                    }else if(status == 1){
                        this.status = "待审核"
                    }else if(status == 2){
                        this.status = "已审核"
                    }else if(status == 3){
                        this.status = "已驳回"
                    }
                
            }).catch(err => {
                this.msg = res
            })
        }
    }
}
</script>
<style  lang="scss">
// @import '../../static/styles/base/common.scss';
.audit{
    padding: 30px;
    h2{
        text-align: center;
        line-height: 50px;
    }
}
</style>