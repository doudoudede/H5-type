<template>
  <div class="chooseshop">
    <el-input placeholder="请输商城名称" v-model="input" clearable></el-input>
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column fixed prop="date" label="商城名称" width="150"></el-table-column>
      <el-table-column prop="name" label="所属行业" width="120"></el-table-column>
      <el-table-column prop="province" label="所在地区" width="120"></el-table-column>
      <el-table-column prop="city" label="返佣比例" width="120"></el-table-column>
      <el-table-column fixed="right" label="操作" width="100">
        <template slot-scope="scope">
          <el-button @click="handleClick(scope.row)" type="text" size="small">详情</el-button>
          <el-button @click="applyClick(scope.row)" type="text" size="small">申请合作</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
export default {
  name: "ChooseShop",
  data() {
    return {
        input:'',
        tableData:[]
    };
  },
  methods: {
      getdata(){
          this.$http({
              // methods:"post",
              // url:'/xe-route'
          })
      },
      handleClick(i){

      },
      applyClick(){

      }
  }
};
</script>
<style  lang="scss">
.chooseshop {
  padding: 25px;
}
</style>
// <template>
//   <div class="chooseshop">
//     <el-input placeholder="请输商城名称" v-model="input" clearable style="width:260px"></el-input>
//     <el-button type="primary" style="
//         margin-top: 45px;
//         font-size: 22px;
//     ">搜索</el-button>
//     <el-table :data="tableData" border style="width: 100%;margin-top:40px;font-size: 18px;" >
//       <el-table-column fixed prop="mallName" label="商城名称" min-width="120"></el-table-column>
//       <el-table-column prop="typeName" label="所属行业" min-width="100"></el-table-column>
//       <el-table-column prop="area" label="所在地区" min-width="120"></el-table-column>
//       <el-table-column prop="com" label="返佣比例" min-width="100"></el-table-column>
//       <el-table-column fixed="right" label="操作" min-width="100">
//         <template slot-scope="scope">
//           <el-button @click="handleClick(scope.row,scope.$index)" type="text">详情</el-button>
//           <el-button  @click="applyClick(scope.row,scope.$index)" type="text" size="small">申请合作</el-button>
//         </template>
//       </el-table-column>
//     </el-table>
//     <el-button type="primary" @click="goto" style="
//         margin-top: 45px;
//         font-size: 22px;
//     ">下一步</el-button>
//     <!-- 申请弹窗 -->
//     <el-dialog
//       title="提示"
//       :visible.sync="centerDialogVisible"
//       width="30%"
//       center>
//       <span>已申请合作</span>
//       <span slot="footer" class="dialog-footer">
//         <el-button type="primary" @click="centerDialogVisible = false">确 定</el-button>
//       </span>
//     </el-dialog>
//   </div>
// </template>
// <script>
// export default {
//   name: "ChooseShop",
//   data() {
//     return {
//       centerDialogVisible:false,
//         input:'',
//         tableData:[],
//         com:"",
//         area:'',
//         isfalg:false,
//     };
//   },
//   mounted(){
//     this.getdata()
//   },
//   methods: {
//       getdata(){
//           this.$http({
//               method:"post",
//               url:'/xe-route/xe-erp/xeveninfoshop/allHhrUserlist',
//               data:{
//                 audit_flag:2,  //审核状态 0：未合作  1：待审核，2：已合作，3：审核未通过 
//                 term_search:this.input  ,  // Id号、商户名称、联系人、手机号、合伙人名称
//                 pageNum:1, //页码
//                 pageSize:10,
//               }
//           }).then(res=>{
//             if(res.status == "0000"){
//               var list = res.data.list
//               // this.tableData = list
              
//               this.tableData = list.map((item,index)=>{
//                 if(item.brokerage != ''){
//                   this.com = item.brokerage
//                 }else{
//                   this.com = item.vendorBrokerage
//                 }
//                 if(item.provinceName == null){
//                   this.area = ''
//                 }else if(item.provinceName == item.cityName){
//                   this.area = item.cityName
//                 }else{
//                   this.area = item.provinceName+item.cityName+item.areaName
//                 }
//                 return{
//                   mallName:item.mallName,
//                   typeName:item.typeName,
//                   area:this.area,
//                   com :this.com,
//                   isfalg:0,
//                   partTd:item.partnerId,
//                   id:item.id
//                 }
//               })
//               console.log(this.tableData)
//             }
//           }).catch(err=>{
//             console.log(err)
//           })
//       },
//       handleClick(obj,i){
//         this.$router.push({path:'shopDetial',query:{id: obj.id}})
//       },
//       applyClick(obj,i){
//         obj.isfalg = 1
//         this.$http({
//           method:'post',
//           url:'/xe-route/xe-erp/xeveninfo/applayPartner',
//           data:{
//             partnerId: obj.partTd
//           },
//         }).then((res)=>{
//           console.log(res)
//         }).catch(err=>{
//           console.log(err)
//         })
//         this.centerDialogVisible = true
//       },
//       goto(){
//         this.$router.push({path:"audit"})
//       }
//   }
// };
// </script>
// <style  lang="scss">
// .chooseshop {
//   padding: 50px;
// }
// .black{

// }
// .dark{
//   color: darkgray;
// }
// .el-input--suffix .el-input__inner{
//   font-size: 22px;
// }
// .el-button--text{
//   margin-left: 24px;
//   font-size: 18px;
// }
// </style>
