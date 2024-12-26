<template>
  <div>
    <el-form class="myForm" label-width="100px" :model="user" name="form1" :rules="rules" ref="userForm">
      <h1>Shared Cloud Drive System</h1>
      <!--Username-->
      <el-form-item label="Username" prop="uname">
        <el-input class=input_1 name="uname" v-model="user.uname" placeholder="Username"/><br>
      </el-form-item>
      <!--Password-->
      <el-form-item label="Password" prop="passwd">
        <el-input class=input_1 type="password" name="passwd" v-model="user.passwd" placeholder="Password"/><br>
      </el-form-item>
      <!--Confirm Password-->
      <el-form-item label="Confirm Password" prop="passwd1">
        <el-input class=input_1 type="password" name="passwd1" v-model="user.passwd1" placeholder="Confirm Password"/><br>
      </el-form-item>
      <!--Gender-->
      <el-form-item label="Gender" prop="gender" style="margin: 0;">
        <el-radio v-model="user.gender" :label=1>Male</el-radio>
        <el-radio v-model="user.gender" :label=0>Female</el-radio>
      </el-form-item>
      <!--Date of Birth-->
      <el-form-item label="Date of Birth" prop="birthday">
        <el-date-picker
          style="width: 75%"
          v-model="user.birthday"
          name="birthday"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="Date of Birth">
        </el-date-picker>
      </el-form-item>
      <!--City-->
      <el-form-item label="City" prop="city" style="margin: 0;">
        <el-select style="width: 75%" v-model="user.city" placeholder="Select">
          <el-option
            v-for="item in cities"
            :key="item.value"
            :label="item.label"
            :value="item.label">
          </el-option>
        </el-select>
      </el-form-item>
      <!--Verification Code-->
      <!-- <el-form-item label="Verification Code" prop="code" style="margin-top: 10px">
        <el-image style="float: left;margin-left: 12%" :src="checkCodeUrl" @click="changeCheckCode"/>
        <el-input style="float: left;width: 50%" class="input_1" name="code" v-model="user.code" placeholder="Verification Code"/><br>
      </el-form-item> -->
      <el-form-item style="margin: 0 auto">
        <el-button type="primary" @click="register('userForm')">Register</el-button>
        <el-button @click="resetForm('userForm')">Reset</el-button>
        <el-link :underline="false" style="color:#409EFF;font-weight: bold" @click="$router.replace('/login')">Already have an account? Click to login</el-link>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "Register",
  data(){
    var checkUserName = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('Username cannot be empty'));
      } else {
        // Call backend API
        this.axios.get(this.baseUrl+"user/checkUname",{
          params:{
            uname:value
          }
        }).then(Response => {
          if(Response.data) {
            callback();
          }
          callback(new Error('Username already exists!'));
        })
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('Please enter the password again'));
      } else if (value !== this.user.passwd) {
        callback(new Error('Passwords do not match!'));
      } else {
        callback();
      }
    };
    return{
      checkCodeUrl:'',
      cities:[
        {value:'Beijing',label:'Beijing'},
        {value:'Changchun',label:'Changchun'},
        {value:'Chengdu',label:'Chengdu'},
        {value:'Changsha',label:'Changsha'},
        {value:'Chongqing',label:'Chongqing'},
        {value:'Fujian',label:'Fujian'},
        {value:'Guiyang',label:'Guiyang'},
        {value:'Guangzhou',label:'Guangzhou'},
        {value:'Harbin',label:'Harbin'},
        {value:'HeFei',label:'Hefei'},
        {value:'Huhhot',label:'Hohhot'},
        {value:'HaiKou',label:'Haikou'},
        {value:'Hangzhou',label:'Hangzhou'},
        {value:'Jinan',label:'Jinan'},
        {value:'Kunming',label:'Kunming'},
        {value:'Lanzhou',label:'Lanzhou'},
        {value:'Nanchang',label:'Nanchang'},
        {value:'Nanjing',label:'Nanjing'},
        {value:'Shanghai',label:'Shanghai'},
        {value:'Shijiazhuang',label:'Shijiazhuang'},
        {value:'Shenyang',label:'Shenyang'},
        {value:'Tianjin',label:'Tianjin'},
        {value:'Taiyuan',label:'Taiyuan'},
        {value:'Wuhan',label:'Wuhan'},
        {value:'Xi\'An',label:'Xi\'an'},
        {value:'Xining',label:'Xining'},
        {value:'Zhengzhou',label:'Zhengzhou'},
        {value:'Urumqi',label:'Urumqi'},
        {value:'LaSa',label:'Lhasa'},
        {value:'Nanning',label:'Nanning'},
        {value:'HangKong',label:'Hong Kong'},
        {value:'Macao',label:'Macau'},
        {value:'Taipei',label:'Taipei'},
      ],
      user:{
        uname:'',
        passwd:'',
        passwd1:'',
        gender:1,
        birthday:'',
        city:'Beijing',
        code:'',
      },
      rules:{
        uname:[
          {validator:checkUserName,trigger:'blur'},
          {required: true,trigger: 'blur'},
        ],
        passwd:[
          {required: true,message:'Password cannot be empty!',trigger: 'blur'},
        ],
        passwd1:[
          {validator: validatePass2, trigger: 'blur'},
        ],
        gender:[
          {required:true,trigger:'blur'}
        ],
        birthday: [
          {required:true,message:'Date of birth cannot be empty',trigger:'blur'}
        ],
        city:[
          {required:true,trigger:'blur'}
        ]
      }
    }
  },
  methods:{
    register(formName){
      this.$refs[formName].validate((valid) => {
        if(valid){
          this.axios.post(this.baseUrl+"user/register",this.$qs.stringify(this.user))
            .then(res=>{
              if(res.data.status){
                this.$message.success("Registration successful");
                this.$router.replace("/");
              }else {
                this.$message.error(res.data.msg);
                this.changeCheckCode();
              }
            })
        }
      });
    },
    resetForm(formName){
      this.$refs[formName].resetFields();
    },
    changeCheckCode(){
      this.checkCodeUrl = this.baseUrl+"checkCode?timestamp="+new Date();
    }
  },
  mounted() {
    this.changeCheckCode();
  }
}
</script>

<style>
.el-form-item__label{
  font-size: 18px;
  font-weight: bold;
}
.el-form-item__error{
  width: fit-content;
  margin: 0 50px;
  font-weight: bold;
}
html{
  height: 100%;
  box-shadow:0 0 300px #000 inset;
  -webkit-box-shadow:0 0 50px #000 inset;
}
.myForm{
  position:absolute;
  left:77%;
  top:55%;
  border: 1px solid #0188fb;
  margin-left:-300px;
  margin-top:-347px;
  width:480px;
  background-size: cover;
  border-radius:25px;
  color:#fff;
  text-align:center;
  padding:65px;
}
.input_1{
  outline:none;
  border:0;
  width:300px;
  height:50px;
  border-radius:15px;
  padding-left:15px;
  font-size:15px;
  color:#999;
}
h1{
  color:#fff;
}
.radio_box{ display:inline-block; position:relative;margin:20px 5px;}
.radio_box label{ width:15px; height:15px; position:absolute; top:0; left:0; border:2px solid #3A5367; border-radius:50%; background:#fff; cursor:pointer;}
.radio_box input:checked + label:after{ content:''; width:9px; height:9px; position:absolute; top:3px; left:3px; background:#3A5367; border-radius:50%;}
.check_box em{ margin:0 0 0 5px;}
.input_3{
  outline: none;
  width:50px;
  height:30px;
  border:0;
  padding:5px 7px;
  border-radius:20px;
  margin:0 10px;
}
</style>
