<template>
  <div id="mainDiv">
    <nav class="navbar">
      <router-link to="/home" class="nav-link">Dashboard</router-link>
      <router-link to="/category" class="nav-link">Categories</router-link>
      <router-link to="/cars" class="nav-link">Cars</router-link>
      <el-link @click="logout" class="nav-link">Logout</el-link>
    </nav>

    <div class="crud-container">
      <h2 class="crud-title">Car Management</h2>
      <el-form
        class="crud-form"
        :model="currentCar"
        status-icon
        :rules="rules"
        ref="ruleForm"
      >
        <el-form-item prop="category">
          <el-select
            v-model="currentCar.category"
            placeholder="Please select category"
          >
            <!-- <el-option disabled >Please select Category</el-option> -->
            <el-option
              v-for="category in categories"
              :key="category.id"
              :value="category.name"
            >
              {{ category.name }}
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="color">
          <el-input v-model="currentCar.color" placeholder="Color" />
        </el-form-item>
        <el-form-item prop="model">
          <el-input v-model="currentCar.model" placeholder="Model" />
        </el-form-item>
        <el-form-item prop="make">
          <el-input v-model="currentCar.make" placeholder="Make" />
        </el-form-item>
        <el-form-item prop="registrationNo">
          <el-input
            v-model="currentCar.registrationNo"
            placeholder="Registration No"
          />
        </el-form-item>
        <el-button
          type="success"
          @click="submitCar('ruleForm')"
          class="btn-submit"
          >{{ editing ? "Update" : "Add Car" }}</el-button
        >
      </el-form>

      <div>
        <el-table
          :data="cars.slice((pageNum - 1) * pageSize, pageNum * pageSize)"
          style="width: 100%"
          height="280px"
          highlight-current-row
          :default-sort="{ prop: 'model', order: 'descending' }"
        >
          <el-table-column
            prop="category"
            label="Category"
            width="120px"
          ></el-table-column>
          <el-table-column
            sortable
            prop="model"
            label="Model"
          ></el-table-column>
          <el-table-column prop="make" label="Make"></el-table-column>
          <el-table-column prop="color" label="Color"></el-table-column>
          <el-table-column
            prop="registrationNo"
            label="Registration No"
            width="160px"
          ></el-table-column>
          <el-table-column label="Actions" width="160px">
            <template #default="scope">
              <el-button
                @click="editCar(scope.$index)"
                type="primary"
                size="small"
                >Edit</el-button
              >
              <el-button @click="deleteCar(scope)" type="danger" size="small"
                >Delete</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <div style="width: 100%">
          <el-pagination
            style="float: right; margin-top: 2%"
            @current-change="handleCurrentNumChange"
            :current-page="pageNum"
            :page-size="pageSize"
            layout="total, prev,pager,next,jumper"
            :total="cars.length"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ElMessage } from "element-plus";
import {
  getAllCategory,
  createCar,
  deleteCar,
  updateCar,
  getAllCars,
} from "../https/http";
export default {
  data() {
    // custom function for validation
    let validateField = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("Required"));
      }
      setTimeout(() => {
        callback();
      }, 100);
    };
    return {
      categories: [], // stores all the categories
      pageNum: 1,
      pageSize: 5,
      cars: [], // stores all the cars details
      currentCar: {
        // store the current car details, trigger when user clicks on edit
        category: "",
        color: "",
        model: "",
        make: "",
        registrationNo: "",
      },

      rules: {
        // form validation
        category: [{ validator: validateField, trigger: "blur" }],
        color: [{ validator: validateField, trigger: "blur" }],
        model: [{ validator: validateField, trigger: "blur" }],
        make: [{ validator: validateField, trigger: "blur" }],
        registrationNo: [{ validator: validateField, trigger: "blur" }],
      },
      editing: false,
    };
  },
  mounted() {
    this.getCategory(); // Function call to get all the categories
    this.getCars(); // Function call to get all the cars details and show in the table
  },
  methods: {
    // Custom function to display data in the table according to the current page selection
    handleCurrentNumChange(newNum) {
      this.pageNum = newNum;
    },
    // Logout the user
    logout() {
      localStorage.removeItem("userToken");
      this.$router.push("/login");
    },
    // Function call to get all the categories
    async getCategory() {
      await getAllCategory() // Category endpoint
        .then((res) => {
          this.categories = res.data; // shows data in the dropdown
        })
        .catch((err) => {
          console.log(err);
          // alert the user if any error occur
          ElMessage({
            message: `${err.message}`,
            duration: "1000",
            grouping: true,
            type: "error",
          });
        });
    },
    // Function call to get all the cars details and show in the table
    async getCars() {
      await getAllCars() // get car details endPoint
        .then((res) => {
          this.cars = res.data;
          ElMessage({
            message: `Success`,
            duration: "1000",
            grouping: true,
            type: "success",
          });
        })
        .catch((err) => {
          console.log(err);
          ElMessage({
            message: `${err.message}`,
            duration: "1000",
            grouping: true,
            type: "error",
          });
        });
    },
    // Function to save the car details in the database along with the validations checks
    submitCar(formName) {
      try {
        this.$refs[formName].validate(async (valid) => {
          if (valid) {
            if (this.editing) {
              // Update car endpoint
              await updateCar(this.currentCar)
                .then((res) => {
                  this.getCars();
                })
                .catch((err) => {
                  ElMessage({
                    message: `${err.message}`,
                    duration: "1000",
                    grouping: true,
                    type: "error",
                  });
                });
            } else {
              //  Add car endPoint
              await createCar(this.currentCar)
                .then((res) => {
                  this.car = res.data;
                  this.getCars();
                })
                .catch((err) => {
                  ElMessage({
                    message: `${err.message}`,
                    duration: "1000",
                    grouping: true,
                    type: "error",
                  });
                });
            }
            this.resetForm(); // after Add or Edit, empty the form
          } else {
            ElMessage({
              message: "All Field Required",
              duration: "1000",
              grouping: true,
              type: "warning",
            });
            console.log("Must Input Data");
            return false;
          }
        });
      } catch (error) {
        ElMessage({
          message: `${error.message}`,
          duration: "1000",
          grouping: true,
          type: "error",
        });
        console.log(error);
      }
    },
    // select the current row and display in the form
    editCar(index) {
      this.currentCar = { ...this.cars[index] };
      this.editing = true;
    },
    // method to delete the car details from the table
    async deleteCar(scope) {
      this.$confirm(
        "This will permanently delete the file. Continue?",
        "Warning",
        {
          confirmButtonText: "OK",
          cancelButtonText: "Cancel",
          type: "warning",
        }
      )
        .then(async () => {
          await deleteCar(scope.row._id).then((res) => this.getCars());
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "Canceled",
          });
        });
    },
    resetForm() {
      // empty the form
      this.currentCar = {
        id: null,
        category: "",
        color: "",
        model: "",
        make: "",
        registrationNo: "",
      };
      this.editing = false;
    },
  },
};
</script>

<style scoped>
.crud-container {
  margin: 2rem auto;
  padding: 20px 20px 50px 20px;
  max-width: 700px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.crud-title {
  margin-bottom: 20px;
  text-align: center;
}

.crud-form {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-bottom: 20px;
}

.btn-submit {
  grid-column: span 2;
  padding: 10px;
  background-color: #4caf50;
  color: white;
  border: none;
  cursor: pointer;
}

.item-list {
  list-style: none;
  padding: 0;
}

.item {
  background: #f9f9f9;
  margin-bottom: 10px;
  padding: 10px;
  border-radius: 4px;
}

.btn-edit,
.btn-delete {
  margin-left: 10px;
  padding: 5px 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.btn-edit {
  background-color: #ffc107;
}

.btn-delete {
  background-color: #f44336;
  color: white;
}
.navbar {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #333;
  padding: 10px 0;
  width: 100%;
}

.nav-link {
  color: #ffffff;
  margin: 0 15px;
  text-decoration: none;
  padding: 5px 10px;
  border-radius: 5px;
  transition: background-color 0.3s ease;
}

.nav-link:hover {
  background-color: #555;
}
</style>
