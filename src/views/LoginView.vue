<template>
  <div class="container">
    <h2 class="form-title">Login</h2>
    <el-row :gutter="20">
      <el-col :span="24">
        <el-form
          :model="ruleForm"
          status-icon
          :rules="rules"
          ref="ruleForm"
          label-width="80px"
          class="demo-ruleForm"
        >
          <el-form-item label="Email" prop="email">
            <el-input
              type="email"
              v-model="ruleForm.email"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item label="Password" prop="password">
            <el-input
              type="password"
              v-model="ruleForm.password"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-button type="primary" @click="validateUser('ruleForm')"
            >Login</el-button
          >
          <el-button @click="resetForm('ruleForm')">Reset</el-button>
        </el-form>
        <div class="account-exists">
          Don't have an account?
          <el-link @click="goToSignUpPage">Sign Up</el-link>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { ElMessage } from "element-plus";
import { loginUser } from "../https/http"; // login user endpoint
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
      //  Fields on which the validation apply and also used as v-model
      ruleForm: {
        email: "",
        password: "",
      },
      // trigger the custom function for validation

      rules: {
        email: [{ validator: validateField, trigger: "blur" }],
        password: [{ validator: validateField, trigger: "blur" }],
      },
    };
  },
  methods: {
    // On click navigate to SignUp page if user not already registered

    goToSignUpPage() {
      this.$router.push({ path: "/" });
    },
    // On Login button the user will be validate from the database,
    // open the Dashboard page and also validate all the input fields
    async validateUser(formName) {
      try {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            loginUser(this.ruleForm, this.$router) // login user endpoint
              .then((res) => {})
              .catch((err) => {
                console.log(err);
                // Alert the user about error
                ElMessage({
                  message: `${err.message}`,
                  duration: "1000",
                  grouping: true,
                  type: "error",
                });
              });
          } else {
            // Alert the user about error
            ElMessage({
              message: "Something Went Wrong!!",
              duration: "1000",
              grouping: true,
              type: "error",
            });
            return false;
          }
        });
      } catch (err) {
        console.log(err);
        // Alert the user about error
        ElMessage({
          message: `${err.message}`,
          duration: "1000",
          grouping: true,
          type: "error",
        });
      }
    },
    // This function can empty all the fields
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
  },
};
</script>

<style lang="less">
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
  color: #3498db;
  margin-top: 15px;
}
</style>
