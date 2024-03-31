<template>
  <div>
    <nav class="navbar">
      <router-link to="/home" class="nav-link">Dashboard</router-link>
      <router-link to="/category" class="nav-link">Categories</router-link>
      <router-link to="/cars" class="nav-link">Cars</router-link>
      <el-link @click="logout" class="nav-link">Logout</el-link>
    </nav>

    <el-row type="flex" justify="center">
      <el-col :xs="24" :sm="20" :md="16" :lg="12">
        <div class="crud-container">
          <h2 class="crud-title">Category Management</h2>
          <el-form
            class="crud-form"
            :model="currentCategory"
            :rules="rules"
            ref="ruleForm"
          >
            <el-form-item prop="name">
              <el-input
                class="input-field"
                v-model="currentCategory.name"
                placeholder="Enter category name"
              />
            </el-form-item>
            <el-button type="success" @click="submitCategory('ruleForm')">
              {{ editing ? "Update" : "Create" }}
            </el-button>
          </el-form>
          <div>
            <el-table
              :data="
                categories.slice((pageNum - 1) * pageSize, pageNum * pageSize)
              "
              style="width: 100%"
              height="280px"
              highlight-current-row
              :default-sort="{ prop: 'name', order: 'descending' }"
            >
              <el-table-column
                prop="name"
                sortable
                label="Category Name"
              ></el-table-column>
              <el-table-column label="Actions">
                <template #default="scope">
                  <el-button
                    @click="editCategory(scope.$index)"
                    type="primary"
                    size="small"
                    >Edit</el-button
                  >
                  <el-button
                    @click="deleteCategory(scope)"
                    type="danger"
                    size="small"
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
                :total="categories.length"
              />
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { ElMessage } from "element-plus";
import {
  // endpoints
  getAllCategory,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../https/http";
export default {
  data() {
    // Custom validation function for form
    let validateField = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("Required"));
      }
      setTimeout(() => {
        callback();
      }, 100);
    };
    return {
      pageNum: 1,
      pageSize: 6,
      categories: [],
      currentCategory: { id: "", name: "" },
      editing: false,

      rules: {
        name: [{ validator: validateField, trigger: "blur" }],
      },
    };
  },
  mounted() {
    this.getCategory(); // On page load, gets the already save categories from the db
  },
  methods: {
    handleCurrentNumChange(newNum) {
      this.pageNum = newNum;
    },
    // Get category endpoint implementation
    async getCategory() {
      await getAllCategory() // get category endpoint
        .then((res) => {
          this.categories = res.data; // store data in the table
          ElMessage({
            message: "Success",
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
    logout() {
      localStorage.removeItem("userToken");
      this.$router.push("/login");
    },
    // function to Save the newly categories in the database
    async submitCategory(formName) {
      try {
        this.$refs[formName].validate(async (valid) => {
          if (valid) {
            if (this.editing) {
              // this endpoint will update the category
              await updateCategory(this.currentCategory) // update category endpoint
                .then((res) => {
                  this.getCategory();
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
            } else {
              await createCategory(this.currentCategory) // create category endpoint
                .then((res) => {
                  this.getCategory();
                })
                .catch((err) => {
                  ElMessage({
                    message: `${err.message}`,
                    duration: "1000",
                    grouping: true,
                    type: "error",
                  });
                  console.error(err);
                });
            }
            this.resetForm();
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
      } catch (err) {
        console.log(err);
        ElMessage({
          message: `${err.message}`,
          duration: "1000",
          grouping: true,
          type: "error",
        });
      }
    },
    editCategory(index) {
      // edit the selected row
      this.currentCategory = { ...this.categories[index] };
      this.editing = true;
    },
    async deleteCategory(scope) {
      // endpoint to delete the category
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
          await deleteCategory(scope.row._id) // delete category endpoint
            .then((res) => this.getCategory())
            .catch((err) => {
              console.log(err);
              ElMessage({
                message: `${err.message}`,
                duration: "1000",
                grouping: true,
                type: "error",
              });
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "Canceled",
          });
        });
    },
    resetForm() {
      this.currentCategory = { id: null, name: "" };
      this.editing = false;
    },
  },
};
</script>
<style scoped>
.crud-container {
  margin: 2rem auto;
  padding: 20px 20px 50px 20px;
  max-width: 500px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.crud-title {
  text-align: center;
  margin-bottom: 1.5rem;
  color: #333;
}

.crud-form {
  display: flex;
  justify-content: space-between;
  margin-bottom: 2rem;
}

.input-field {
  flex-grow: 1;
  margin-right: 1rem;
}

.btn-submit {
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  background-color: #4caf50;
  color: #fff;
  cursor: pointer;
}

.btn-submit:hover {
  background-color: #45a049;
}

.category-list {
  list-style: none;
  padding: 0;
}

.category-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  margin-bottom: 10px;
  background-color: #f9f9f9;
  border-radius: 4px;
}

.category-name {
  color: #333;
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
  color: #333;
}

.btn-delete {
  background-color: #f44336;
  color: #fff;
}

.btn-edit:hover {
  background-color: #ffb300;
}

.btn-delete:hover {
  background-color: #e53935;
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
