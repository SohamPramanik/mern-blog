import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

function Register(){

  const navigate = useNavigate();

  const [formData,setFormData] = useState({
    username:"",
    email:"",
    password:""
  });

  const handleChange = (e)=>{
    setFormData({
      ...formData,
      [e.target.name]:e.target.value
    });
  };

  const handleSubmit = async (e)=>{

    e.preventDefault();

    try{

      await API.post("/auth/register",formData);

      alert("Registration successful");

      navigate("/login");

    }catch(error){

      alert("Registration failed");

    }

  };

  return(

    <div className="register-wrapper">

      <div className="register-card">

        <h2>✨ Create Account</h2>

        <form onSubmit={handleSubmit}>

          <input
            type="text"
            name="username"
            placeholder="Username"
            onChange={handleChange}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            required
          />

          <button className="register-btn" type="submit">
            🚀 Register
          </button>

        </form>

        <div className="register-extra">
          Join the SohamBlog community
        </div>

      </div>

    </div>

  );

}

export default Register;