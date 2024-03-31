<template>
  <div class="container">
    <h2 class="form-title">Signup</h2>
    <el-row>
      <el-col :span="24">
        <el-form
          :model="ruleForm"
          status-icon
          :rules="rules"
          ref="ruleForm"
          label-width="130px"
          class="demo-ruleForm"
        >
          <el-form-item label="First Name" prop="firstName">
            <el-input
              type="text"
              v-model="ruleForm.firstName"
              autocomplete="off"
            ></el-input>
          </el-form-item>

          <el-form-item label="Last Name" prop="lastName">
            <el-input
              type="text"
              v-model="ruleForm.lastName"
              autocomplete="off"
            ></el-input>
          </el-form-item>

          <el-form-item label="Email" prop="email">
            <el-input
              type="email"
              v-model="ruleForm.email"
              autocomplete="off"
            ></el-input>
          </el-form-item>

          <el-form-item label="Password" prop="password">
            <el-input
             :type="passwordFieldType"
              v-model="ruleForm.password"
              autocomplete="off"
            >
             <template #append>
              <el-button icon="el-icon-view" @click="togglePasswordVisibility"><span @click="togglePasswordVisibility"> <el-icon><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" data-v-ea893728=""><path fill="currentColor" d="M512 160c320 0 512 352 512 352S832 864 512 864 0 512 0 512s192-352 512-352m0 64c-225.28 0-384.128 208.064-436.8 288 52.608 79.872 211.456 288 436.8 288 225.28 0 384.128-208.064 436.8-288-52.608-79.872-211.456-288-436.8-288zm0 64a224 224 0 1 1 0 448 224 224 0 0 1 0-448m0 64a160.192 160.192 0 0 0-160 160c0 88.192 71.744 160 160 160s160-71.808 160-160-71.744-160-160-160"></path></svg></el-icon>
        </span></el-button>
      </template></el-input>
          </el-form-item>

          <el-form-item label="Confirm Password" prop="confirmPass">
            <el-input
              :type="passwordFieldType"
              v-model="ruleForm.confirmPass"
              autocomplete="off"
            ></el-input>
          </el-form-item>

          <el-button type="primary" @click="submitForm('ruleForm')"
            >Submit</el-button
          >
          <el-button @click="resetForm('ruleForm')">Reset</el-button>
        </el-form>
        <div class="account-exists">
          Already have an account?
          <el-link @click="goToLoginPage">Login</el-link>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { ElMessage } from "element-plus";
import { saveUserData } from "../https/http"; // Endpoint to save the User in the Database
export default {
  data() {
    // Custom function to check that the input fields has the data or not
    let validateField = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("Required"));
      }
      setTimeout(() => {
        callback();
      }, 100);
    };

    return {
      passwordFieldType:'password',
      //  Fields on which the validation apply and also used as v-model
      ruleForm: {
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPass: "",
      },
      // trigger the custom function for validation
      rules: {
        firstName: [{ validator: validateField, trigger: "blur" }],
        lastName: [{ validator: validateField, trigger: "blur" }],
        email: [{ validator: validateField, trigger: "blur" }],
        password: [{ validator: validateField, trigger: "blur" }],
        confirmPass: [{ validator: validateField, trigger: "blur" }],
      },
    };
  },
  methods: {
    togglePasswordVisibility () {
      this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
    },
    // On click navigate to login page if user  already registered
    goToLoginPage() {
      this.$router.push({ path: "/login" });
    },
    // On Submit button the data will be store in the database,
    // open the login page and also validate all the input fields
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if(this.ruleForm.password != this.ruleForm.confirmPass){
            ElMessage({
            message: "Password not matched",
            duration: "1000",
            grouping: true,
            type: "info",
          });
          }else{

            if (saveUserData(this.ruleForm)) {
              ElMessage({
                message: "User Created",
                duration: "1000",
                grouping: true,
                type: "success",
              });
              this.$router.push({ path: "/login" });
            }
          }
        } else {
          ElMessage({
            message: "Something Went Wrong!!",
            duration: "1000",
            grouping: true,
            type: "error",
          });
          return false;
        }
      });
    },
    // This function can empty all the fields
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
  },
};
</script>

<style lang="less">
.container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.form-title {
  font-size: 2rem; 
  color: #2c3e50; 
  text-align: center;
  margin-bottom: 20px; 
  font-weight: 600; 
  text-transform: uppercase;
  letter-spacing: 0.05em; 
  border-bottom: 2px solid #3498db; 
  display: inline-block; 
  padding-bottom: 5px;
  margin: 20px 0 30px; 
  background: linear-gradient(45deg, #3498db, #9b59b6); 
  background-clip: text; 
  -webkit-text-fill-color: transparent; 
}

.el-form {
  padding: 20px;
  border-radius: 8px;
  background-color: #fff;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.el-form-item__label {
  display: -webkit-inline-box;
}

.el-button {
  margin-right: 10px;
}

.account-exists {
  text-align: center;
  margin-top: 15px;
  color: #3498db;
}
</style>
