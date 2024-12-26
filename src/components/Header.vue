<template>
  <div>
    <el-menu
      router
      :default-active="$route.path"
      class="el-menu-demo"
      mode="horizontal"
      style="padding: 0 10px;box-shadow: 0 1px 0 rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04)">
      <!-- <el-image :src="require('../assets/images/logo.jpg')" style="float: left;width:190px;height: 40px;margin-top: 10px"></el-image> -->
      <el-menu-item  style="float: left;width:190px;height: 40px;margin-top: 10px;font-size: 15px;">Shared Cloud Disk</el-menu-item>
      <el-menu-item index="/index">Home</el-menu-item>
  <!--    <div style="float: right;margin-top: 10px">-->
      <div style="margin: 10px 5%;float: right">
        <el-button v-if="!user" type="text" style="margin-right: 10px" @click="$router.replace('/register')">Register</el-button>
        <el-dropdown v-if="user">
          <div style="margin-top: 9px"><i class="el-icon-user-solid"></i><span>{{user.uname}}</span></div>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item><div @click="visible = true;"><i class="fa fa-info" aria-hidden="true"></i>Profile</div></el-dropdown-item>
            <el-dropdown-item><div @click="logOut"><i class="fa fa-sign-out" aria-hidden="true"></i>Logout</div></el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <el-button v-else type="text" style="margin-right: 10px" @click="$router.replace('/login')">Login</el-button>
      </div>
    </el-menu>
    <el-dialog
      title="Profile"
      :visible.sync="visible"
      width="50%"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      center
      :append-to-body="true"
      :destroy-on-close="true"
      :before-close="handleBeforeClose"
    >
      <el-descriptions class="margin-top" :title="info.uname" :column="3" border>
        <template slot="extra">
          <el-button type="primary" size="mini" @click="openPasswdForm">Change Password</el-button>
        </template>
        <el-descriptions-item>
          <template slot="label">
            <i class="fa fa-user" aria-hidden="true"></i>
            Role
          </template>
          <span v-if="info.role===1">User</span>
          <span v-else>Admin</span>
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="fa fa-user-circle" aria-hidden="true"></i>
            Nickname
          </template>
          {{info.uname}}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i v-if="info.gender===1" class="fa fa-mars" aria-hidden="true"></i>
            <i v-else class="fa fa-venus" aria-hidden="true"></i>
            Gender
          </template>
          <span v-if="info.gender===1">Male</span>
          <span v-else>Female</span>
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="fa fa-map-marker" aria-hidden="true"></i>
            Location
          </template>
          {{info.city}}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="fa fa-calendar" aria-hidden="true"></i>
            Birthdate
          </template>
          {{info.birthday}}
        </el-descriptions-item>
      </el-descriptions>
      <div style="margin-top: 10px" v-show="passwdVisible">
        <el-form ref="userForm" :model="form" :rules="rules">
          <el-form-item label="Old Password" prop="oldPasswd">
            <el-input style="width: 85%;float: right" type="password" v-model="form.oldPasswd"/>
          </el-form-item>
          <el-form-item label="New Password" prop="newPasswd">
            <el-input style="float: right;width: 85%" type="password" v-model="form.newPasswd"/>
          </el-form-item>
          <el-form-item label="Verification Code" prop="code">
            <el-input style="float: right;width: 70%" v-model="form.code"/>
            <el-image style="float: right;margin-right: 2%" :src="checkCodeUrl" @click="changeCheckCode"/>
          </el-form-item>
        </el-form>
        <div style="width: fit-content;margin: 0 auto" slot="footer" class="dialog-footer">
          <el-button @click="cancel('userForm')">Cancel</el-button>
          <el-button type="primary" @click="changePasswd('userForm')">Submit</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import App from "../App";
export default {
  inject:['reload'],
  components:{App},
  name: "Header",
  data(){
    var validateOldPasswd = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('Please enter the old password'));
      } else if (value !== this.info.passwd) {
        callback(new Error('Incorrect old password!'));
      } else {
        callback();
      }
    };
    var validateNewPasswd = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('Please enter a new password'));
      } else if (value === this.info.passwd) {
        callback(new Error('The new password cannot be the same as the old password!'));
      } else {
        callback();
      }
    };
    return{
      user:'',
      visible:false,
      info:'',
      already:0,
      passwdVisible:false,
      checkCodeUrl:'',// Verification code URL
      form:{
        oldPasswd:'',
        newPasswd:'',
        code:'',
      },
      rules: {
        oldPasswd:[
          {validator:validateOldPasswd,trigger:'blur'},
          {required:true,trigger: 'blur'}
        ],
        newPasswd: [
          {validator:validateNewPasswd,trigger: 'blur'},
          {required:true,trigger:'blur'}
        ],
        code:[
          {required:true,message:'Please enter the verification code',trigger:'blur'}
        ]
      }
    }
  },
  methods:{
    async logOut(){
      await this.axios.get(this.baseUrl+"user/logOut");
       // Clear locally stored user information and tokens
       localStorage.setItem("token", '');
       sessionStorage.setItem("token", '');
      await this.$router.replace("/login");
    },
    openPasswdForm(){
      this.changeCheckCode();
      this.passwdVisible = true;
    },
    changeCheckCode(){
      this.checkCodeUrl = this.baseUrl+"checkCode?timestamp="+new Date();
    },
    getUserInfo(){
      this.axios.get(this.baseUrl+"user/getInfo")
        .then(res=>{
          this.info = res.data;
          this.already = (res.data.total-res.data.remain).toFixed(2);
        })
    },
    changePasswd(formName){
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.axios.put(this.baseUrl+"user/changePasswd",this.$qs.stringify({
            passwd:this.form.newPasswd,
            code:this.form.code
          })).then(res=>{
            if(res.data.status){
              this.cancel('userForm');
              this.$message.success("Password changed successfully, please log in again");
              this.$router.replace("/login");
            }else {
              this.$message.error(res.data.msg);
              this.changeCheckCode();
            }
          })
        }
      })
    },
    cancel(formName){
      this.$refs[formName].resetFields();
      this.passwdVisible = false;
      this.visible = false;
    },
    handleBeforeClose(done){
      this.form = '';
      this.passwdVisible = false;
      done();
    }
  },
  mounted() {
    this.getUserInfo();
  }
}
</script>

<style>
/* Center text in el-descriptions-item */
.el-descriptions__body .el-descriptions__table .el-descriptions-item__cell {
  text-align: center;
}
</style>
