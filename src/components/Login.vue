<template>
  <div>
    <el-form class="myForm" :model="user" label-width="80px" name="form1" :rules="rules" ref="userForm">
      <h1 >Welcome to Shared Cloud Storage System</h1>
      <el-form-item label="Username" prop="uname">
        <el-input class=input_1 id=username name="uname" v-model="user.uname" placeholder="Username"/><br>
      </el-form-item>
      <el-form-item label="Password" prop="passwd">
        <el-input class=input_1 id=password type="password" name="passwd" v-model="user.passwd" placeholder="Password"/><br>
      </el-form-item>
      <!-- <el-form-item#03A9F4 label="Verification Code" prop="code">
        <el-image style="float: left;margin-left: 15%" :src="checkCodeUrl" @click="changeCheckCode"/>
        <el-input style="width: 50%;float: left" class="input_1" name="code" v-model="user.code" placeholder="Verification Code"/><br>
      </el-form-item> -->
      <el-form-item style="margin: 0">
        <el-button type="primary" @click="login('userForm')">Login</el-button>
        <el-button @click="resetForm('userForm')">Reset</el-button>
        <el-link :underline="false" style="color:#409EFF;font-weight: bold" @click="$router.replace('/register')">No account? Click here to register</el-link>
      </el-form-item>
    </el-form>
  </div>
  </template>
  
  <script>
  export default {
    name: "Login",
    props: ['renewHead'],
    data() {
      return {
        checkCodeUrl: '',
        user: {
          uname: '',
          passwd: '',
          code: '',
        },
        rules: {
          uname: [
            { required: true, message: 'Username cannot be empty!', trigger: 'blur' },
          ],
          passwd: [
            { required: true, message: 'Password cannot be empty!', trigger: 'blur' },
          ]
        }
      };
    },
    methods: {
      login(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.axios.post(this.baseUrl + "user/login", this.$qs.stringify(this.user))
              .then(res => {
                if (res.data.status) {
                  const token = res.data.data;
                  debugger;
                  localStorage.setItem("token", token);
                  this.setAuthorizationToken(token);
                  this.renewHead();
                  this.$message.success("Login successful");
                  this.$router.replace("/");
                } else {
                  this.$message.error(res.data.msg);
                  this.changeCheckCode();
                }
              });
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      changeCheckCode() {
        this.checkCodeUrl = this.baseUrl + "checkCode?timestamp=" + new Date();
      }
    },
    mounted() {
      this.changeCheckCode();
    }
  };
  </script>
  
  <style>
  .el-form-item__label {
    font-size: 18px;
    font-weight: bold;
  }
  .el-form-item__error {
    width: fit-content;
    margin: 0 60px;
    font-weight: bold;
  }
  html {
    height: 100%;
    box-shadow: 0 0 300px #000 inset;
    -webkit-box-shadow: 0 0 50px #000 inset;
  }
  .myForm {
    position: absolute;
    left: 77%;
    border: 1px solid #0188fb;
    top: 60%;
    margin-left: -300px;
    margin-top: -220px;
    width: 480px;
    background-size: cover;
    border-radius: 25px;
    color: #fff;
    text-align: center;
    padding: 65px;
  }
  .input_1 {
    outline: none;
    border: 0;
    width: 300px;
    height: 50px;
    border-radius: 15px;
    padding-left: 15px;
    font-size: 15px;
    color: #999;
  }
  h1 {
    color: #03A9F4;
  }
  /* Radio Button */
  .radio_box {
    display: inline-block;
    position: relative;
    margin: 20px 5px;
  }
  .radio_box label {
    width: 15px;
    height: 15px;
    position: absolute;
    top: 0;
    left: 0;
    border: 2px solid #3A5367;
    border-radius: 50%;
    background: #fff;
    cursor: pointer;
  }
  .radio_box input:checked + label:after {
    content: '';
    width: 9px;
    height: 9px;
    position: absolute;
    top: 3px;
    left: 3px;
    background: #3A5367;
    border-radius: 50%;
  }
  .check_box em {
    margin: 0 0 0 5px;
  }
  .input_3 {
    outline: none;
    width: 50px;
    height: 30px;
    border: 0;
    padding: 5px 7px;
    border-radius: 20px;
    margin: 0 10px;
  }
  </style>
  