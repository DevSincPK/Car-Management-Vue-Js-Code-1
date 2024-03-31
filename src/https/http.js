import axios from "axios";
import { ElMessage } from "element-plus";
// SignUp User endPoint
const saveUserData = async (user) => {
  try {
    return await axios.post("http://localhost:5000/signup.action", user);
  } catch (error) {
    //show an error message to the user
    console.error("Signup error:", error.response.data.message);
  }
};
// Login User endPoint
const loginUser = async (credentials,router) => {
   
  try {
    let  response = await axios.post('http://localhost:5000/login.action', credentials);
   localStorage.setItem("userToken",  response.data.token);
   router.push({ path: "/home" });
   
          ElMessage({
            message: "Success",
            grouping: true,
            type: "success",
          });
   
  } catch (err) {
    console.log(err);
          ElMessage({
            message: `${err.message}`,
            grouping: true,
            type: "error",
          });
   
  }
 
}

// Get All Categories endPoint

const  getAllCategory = () =>{
  try{
    const token = localStorage.getItem('userToken');
    
    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };

    return axios.get('http://localhost:5000/getAllCategories.action',config)
    
  }
  catch(error){
    console.log(error);
  }
}
// Create Categories endPoint
const  createCategory = (name) =>{
  try{
    const token = localStorage.getItem('userToken');
    
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    };

    return axios.post('http://localhost:5000/createCategories.action',{name:name.name},config)
    
  }
  catch(error){
    console.log(error);
  }
}
// Update  Categories endPoint
const  updateCategory = (name) =>{
  try{
    const token = localStorage.getItem('userToken');
    
    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };

    return axios.post(`http://localhost:5000/UpdateSingleCategories/${name._id}.action`,{name:name.name},config)
    
  }
  catch(error){
    console.log(error);
  }
}
// Delete All Categories endPoint
const  deleteCategory = (id) =>{
  try{
    const token = localStorage.getItem('userToken');
    
    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };

    return axios.post(`http://localhost:5000/deleteSingleCategories/${id}.action`,'',config)
    
  }
  catch(error){
    console.log(error);
  }
}


// Get All Categories endPoint

// Get All Cars
const getAllCars = () => {
  try {
    const token = localStorage.getItem('userToken');

    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };

    return axios.get('http://localhost:5000/getAllCars.action', config);

  } catch (error) {
    console.log(error);
  }
}

// Create Car
const createCar = (carData) => {
  try {
    const token = localStorage.getItem('userToken');

    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };

    return axios.post('http://localhost:5000/createCar.action', carData, config);

  } catch (error) {
    console.log(error);
  }
}

// Update Car
const updateCar = (carData) => {
  try {
    const token = localStorage.getItem('userToken');

    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };

    return axios.post(`http://localhost:5000/UpdateSingleCar/${carData._id}.action`, carData, config);

  } catch (error) {
    console.log(error);
  }
}

// Delete Car
const deleteCar = (id) => {
  try {
    const token = localStorage.getItem('userToken');

    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };

    return axios.post(`http://localhost:5000/deleteSingleCar/${id}.action`, '', config);

  } catch (error) {
    console.log(error);
  }
}

// Get Cars Count
export const countCars = () => {
  try {
    const token = localStorage.getItem('userToken');

    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };

    return axios.get('http://localhost:5000/cars/count.action',config)

  } catch (error) {
    console.log(error);
  }
}
export { saveUserData,loginUser,getAllCategory,createCategory,
  updateCategory,
  deleteCategory,getAllCars,createCar,updateCar,deleteCar,
 };
