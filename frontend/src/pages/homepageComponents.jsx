import { React, useEffect, useState } from "react";
import axios from "axios";
import { http } from "../services/http";
import { useNavigate } from "react-router-dom";
import textImage from "../assets/text-to-image.png";
import mail from "../assets/blue-mail-icon.png";
import map from "../assets/map.png";
import AI from "../assets/AI.png";

const HomeComponents = () => {
  let [userName, setUserName] = useState("");
  let [userEmail, setUserEmail] = useState("");
  let [userImg, setUserImg] = useState("");

  useEffect(() => {
    http
      .get("oauth/register/success")
      .then((res) => {
        if (res.status == 200) {
          console.log(res.data);
          setUserName(res.data.user.full_name);
          setUserEmail(res.data.user.email);
          // console.log( res.data.user.userImg);
          setUserImg(res.data.user.userImg);
        } else {
          console.log("No status");
        }
      })
      .catch((err) => console.log(err));
  }, []);

  const navigate = useNavigate();
  return (
    <div className="bg-slate-100 text-zinc w-screen h-screen ">
      <h2 className="uppercase font-bold font-serif text-zinc-700">
        working with google api{" "}
      </h2>

      <div>
        {userName ? (
          <div className="absolute top-0 right-0">
            <div className="flex flex-row gap-2 bg-yellow-700 items-center text-white p-4 rounded-xl">
              <img
                className="w-16 rounded-full border-solid border-2 border-orange-600"
                src={userImg}
                alt=""
                srcset=""
              />
            
            <div className="block text-left ">
              <h1 className="font-bold">Name: {userName}</h1>
              <p>Email: {userEmail}</p>
            </div>
            </div>
            <button
              className="p-4 bg-black text-white absolute mt-1 right-2 rounded-lg"
              onClick={""}
            >
              Logout
            </button>
          </div>
        ) : (
          <button
            onClick={() => navigate("/register")}
            className="cursor-pointer text-blue-600 absolute right-4 top-4 text-xl underline"
          >
            Register
          </button>
        )}
      </div>
      {/* <p </p> */}

      <div className="grid gap-4 p-4 grid-cols-2 lg:grid-cols-[repeat(auto-fit,minmax(200px,1fr))] justify-items-center  items-center  mt-28 md:mx-8 px-8">
        <div className="bg-white w-36 md:w-48 p-4 rounded-xl hover:bg-gray-200">
          <img className="rounded-md" src={textImage}></img>
          <p className="font-bold font-serif text-sm md:text-lg mt-2">AI text to image</p>
        </div>
        <div
          className="bg-white w-36 md:w-48 p-4 rounded-xl hover:bg-gray-200"
          onClick={() => navigate("/mail")}
        >
          <img className="rounded-md" src={mail}></img>
          <p className="font-bold font-serif text-sm md:text-lg mt-2">Mailing</p>
        </div>
        <div 
        onClick={() => navigate("/maps")}
        className="bg-white w-36 md:w-48 p-4 rounded-xl hover:bg-gray-200">
          <img className="rounded-md" src={map}></img>
          <p className="font-bold font-serif text-sm md:text-lg mt-2">Maps</p>
        </div>
        <div className="bg-white w-36 md:w-48 p-4 rounded-xl hover:bg-gray-200">
          <img className="rounded-md" src={AI}></img>
          <p className="font-bold font-serif text-sm md:text-lg mt-2">Gemini</p>
        </div>
      </div>
    </div>
  );
};

export default HomeComponents;
