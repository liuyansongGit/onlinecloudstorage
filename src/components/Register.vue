<template>
  <div>
    <el-form class="myForm" label-width="100px" :model="user" name="form1" :rules="rules" ref="userForm">
      <h1>共享云盘系统</h1>
      <!--用户名-->
      <el-form-item label="用户名" prop="uname">
        <el-input class=input_1 name="uname" v-model="user.uname" placeholder="用户名"/><br>
      </el-form-item>
      <!--密码-->
      <el-form-item label="密码" prop="passwd">
        <el-input class=input_1 type="password" name="passwd" v-model="user.passwd" placeholder="密码"/><br>
      </el-form-item>
      <!--确认密码-->
      <el-form-item label="确认密码" prop="passwd1">
        <el-input class=input_1 type="password" name="passwd1" v-model="user.passwd1" placeholder="确认密码"/><br>
      </el-form-item>
      <!--性别-->
      <el-form-item label="性别" prop="gender" style="margin: 0;">
        <el-radio v-model="user.gender" :label=1>男</el-radio>
        <el-radio v-model="user.gender" :label=0>女</el-radio>
      </el-form-item>
      <!--出生日期-->
      <el-form-item label="出生日期" prop="birthday">
        <el-date-picker
          style="width: 75%"
          v-model="user.birthday"
          name="birthday"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="出生日期">
        </el-date-picker>
      </el-form-item>
      <!--居住地-->
      <el-form-item label="居住地" prop="city" style="margin: 0;">
        <el-select style="width: 75%" v-model="user.city" placeholder="请选择">
          <el-option
            v-for="item in cities"
            :key="item.value"
            :label="item.label"
            :value="item.label">
          </el-option>
        </el-select>
      </el-form-item>
      <!--验证码-->
      <el-form-item label="验证码" prop="code" style="margin-top: 10px">
        <el-image style="float: left;margin-left: 12%" :src="checkCodeUrl" @click="changeCheckCode"/>
        <el-input style="float: left;width: 50%" class="input_1" name="code" v-model="user.code" placeholder="验证码"/><br>
      </el-form-item>
      <el-form-item style="margin: 0 auto">
        <el-button type="primary" @click="register('userForm')">注册</el-button>
        <el-button @click="resetForm('userForm')">重置</el-button>
        <el-link :underline="false" style="color:#409EFF;font-weight: bold" @click="$router.replace('/login')">已有账号？点我登录</el-link>
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
        return callback(new Error('用户名不能为空'));
      } else {
        // 调用后端api
        this.axios.get(this.baseUrl+"user/checkUname",{
          params:{
            uname:value
          }
        }).then(Response => {
          if(Response.data) {
            callback();
          }
          callback(new Error('用户名已存在！'));
        })
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.user.passwd) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    return{
      checkCodeUrl:'',
      cities:[
        {value:'Beijing',label:'北京市'},
        {value:'Changchun',label:'长春市'},
        {value:'Chengdu',label:'成都市'},
        {value:'Changsha',label:'长沙市'},
        {value:'Chongqing',label:'重庆市'},
        {value:'Fujian',label:'福建市'},
        {value:'Guiyang',label:'贵阳市'},
        {value:'Guangzhou',label:'广州市'},
        {value:'Harbin',label:'哈尔滨市'},
        {value:'HeFei',label:'合肥市'},
        {value:'Huhhot',label:'呼和浩特市'},
        {value:'HaiKou',label:'海口市'},
        {value:'Hangzhou',label:'杭州市'},
        {value:'Jinan',label:'济南市'},
        {value:'Kunming',label:'昆明市'},
        {value:'Lanzhou',label:'兰州市'},
        {value:'Nanchang',label:'南昌市'},
        {value:'Nanjing',label:'南京市'},
        {value:'Shanghai',label:'上海市'},
        {value:'Shijiazhuang',label:'石家庄市'},
        {value:'Shenyang',label:'沈阳市'},
        {value:'Tianjin',label:'天津市'},
        {value:'Taiyuan',label:'太原市'},
        {value:'Wuhan',label:'武汉市'},
        {value:'Xi\'An',label:'西安市'},
        {value:'Xining',label:'西宁市'},
        {value:'Zhengzhou',label:'郑州市'},
        {value:'Urumqi',label:'乌鲁木齐'},
        {value:'LaSa',label:'拉萨'},
        {value:'Nanning',label:'南宁市'},
        {value:'HangKong',label:'香港'},
        {value:'Macao',label:'澳门'},
        {value:'Taipei',label:'台湾'},
      ],
      user:{
        uname:'',
        passwd:'',
        passwd1:'',
        gender:1,
        birthday:'',
        city:'北京市',
        code:'',
      },
      rules:{
        uname:[
          {validator:checkUserName,trigger:'blur'},
          {required: true,trigger: 'blur'},
        ],
        passwd:[
          {required: true,message:'密码不能为空!',trigger: 'blur'},
        ],
        passwd1:[
          {validator: validatePass2, trigger: 'blur'},
        ],
        gender:[
          {required:true,trigger:'blur'}
        ],
        birthday: [
          {required:true,message:'出生日期不能为空',trigger:'blur'}
        ],
        city:[
          {required:true,trigger:'blur'}
        ],
        code:[
          {required: true,message:'验证码不能为空!',trigger: 'blur'},
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
                this.$message.success("注册成功");
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
  /*height:380px;*/
  /* background:url("../assets/images/b.png") no-repeat; */
  background-size: cover;
  border-radius:25px;
  color:#fff;
  text-align:center;
  padding:65px;
  /*box-shadow: 0px 0px 15px #0005;*/
}
.input_1{
  outline:none;
  /*margin-top:10px;*/
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
/*单选*/
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
  /*background:#fff;*/
  border-radius:20px;
  margin:0 10px;
}
</style>
