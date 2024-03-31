<template>
  <div>
    <nav class="navbar">
      <router-link to="/home" class="nav-link">Dashboard</router-link>
      <router-link to="/category" class="nav-link">Categories</router-link>
      <router-link to="/cars" class="nav-link">Cars</router-link>
      <el-link @click="logout" class="nav-link">Logout</el-link>
    </nav>

    <el-row type="flex" justify="center" align="middle" class="container">
      <el-col :xs="24" :sm="20" :md="16" :lg="12" :xl="8">
        <div class="dashboard-container">
          <div class="dashboard-card">
            <h3>Registered Cars</h3>
            <div class="dashboard-number">{{ numberOfCars }}</div>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { countCars } from "../https/http";
import ElMessage from 'element-plus'
export default {
  data() {
    return {
      numberOfCars: "",
    };
  },
  mounted() {
    this.getCount(); // method to get the total count of registered cars
  },
  methods: {
    getCount() {
      // get count endpoint
      countCars()
        .then((res) => (this.numberOfCars = res.data.count))
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
  },
};
</script>

<style scoped>
.dashboard-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.dashboard-card {
  width: 300px;
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  gap: 10px;
}

.dashboard-card h3 {
  color: #333;
  font-size: 20px;
}

.dashboard-number {
  background-color: #4caf50;
  color: #fff;
  font-size: 36px;
  padding: 15px 25px;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
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
