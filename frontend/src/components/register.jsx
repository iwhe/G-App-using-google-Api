import React, { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import {  registerUser } from "../services/user";

const Register = () => {
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passWarning, setPassWarning] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [e.target.name]: e.target.value,
    }));
  };

  const handlePasswordChange = () => {
    if (confirmPassword !== formData.password) {
      setPassWarning("Please match the password");
    } else {
      setPassWarning("");
    }
  };


  const handleGoogleSignIn = async () => {
    try {
      window.location.href = `${import.meta.env.VITE_API_URL}/oauth/google`
      //  const callbackResponse = googleAuth();
      //  console.log(callbackResponse);
       
    } catch (error) {
      console.error(error);
      
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (passWarning !== "") {
        alert(passWarning);
      } else {
        console.log(formData);
        const response = await registerUser(formData);
        
        
       if(response){
        console.log(response);
         alert("User registered successfully!")
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="bg-slate-100 text-zinc w-screen h-screen ">
      <div className="relative w-full pt-4 flex justify-center items-center ">
        <div className="w-3/4 h-auto bg-white flex flex-row rounded-xl justify-between items-center">
          <div>
            <h1 className="text-6xl font-roboto m-4 text-blue-500">
              {" "}
              Register yourself here
            </h1>
            <p className="text-left m-4 text-xl mt-8">
              {" "}
              If you are already registered, you can{" "}
              <a href="/" className="text-blue-600 font-bold underline">
                Login
              </a>
            </p>
          </div>
          <div className="flex flex-col gap-4 w-1/2 m-4 ">
            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-4 bg-gray-100 p-8 rounded-2xl"
            >
              <div className="p-4 w-full flex flex-row justify-between">
                <label className="p-4 text-lg font-medium">Name:</label>
                <input
                  type="text"
                  name="name"
                  className=" ml-6 rounded-xl p-4 w-full outline-none"
                  placeholder="Name"
                  // value={formData.name}
                  onChange={(e) => handleChange(e)}
                ></input>
              </div>
              <div className="p-4 w-full flex flex-row justify-between items-center">
                <label className=" p-4 text-lg font-medium">Email:</label>
                <input
                  type="email"
                  name="email"
                  className="ml-8 rounded-xl p-4 w-full outline-none"
                  placeholder="Email"
                  value={formData.email}
                  onChange={(e) => handleChange(e)}
                ></input>
              </div>
              <div className="p-4 w-full flex flex-row justify-between items-center">
                <label className="p-4 text-lg font-medium">Password:</label>
                <input
                  type="password"
                  name="password"
                  className="p-4 rounded-xl w-full outline-none"
                  placeholder="Password(6 to 8 characters)"
                  value={formData.password}
                  onChange={(e) => handleChange(e)}
                ></input>
              </div>
              <div className="p-4 w-full flex flex-row justify-between items-center">
                <label className="py-4 text-lg font-medium">
                  Confirm Password:
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  className="p-4 rounded-xl w-full outline-none"
                  placeholder="Re-enter your Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  onBlur={handlePasswordChange}
                ></input>
                {passWarning && (
                  <p className="text-red-500 text-sm">{passWarning}</p>
                )}
              </div>
              <button
                type="submit"
                className="px-6 py-4 text-xl w-full bg-blue-600 rounded-full text-white font-medium"
              >
                Submit
              </button>
            </form>
            <div className="border-b border-gray-400 w-full "></div>
            <div 
            onClick={handleGoogleSignIn}
            className="flex flex-row gap-4 p-4 items-center text-lg bg-primary  justify-center rounded-full my-4 cursor-pointer">
              <FcGoogle />
              <p>Sign in with Google</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
