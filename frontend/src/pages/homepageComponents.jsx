import { React, useEffect, useState } from "react";
import axios from "axios";
import { http } from "../services/http";
import { useNavigate } from "react-router-dom";
import textImage from "../assets/text-to-image.png";
import mail from "../assets/blue-mail-icon.png";
import map from "../assets/map.png";
import AI from "../assets/AI.png";
import ProfilePopUp from "../components/mail/profilePopUp";
import { getUser } from "../services/user";

const HomeComponents = () => {
  const [Error, setError] = useState(false);
  const [user, setUser] = useState({
    name: "",
    email: "",
    image: "",
  });
  const [profilePopUp, setProfilePopUp] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        await http.get("oauth/register/success").then((res) => {
          if (res.status == 200) {
            console.log(res.data);
            const userData = res?.data?.user;
            setUser((prevValues) => ({
              ...prevValues,
              name: userData.full_name,
              email: userData.email,
              image: userData.userImg,
            }));
          } else {
            console.log("No status");
          }
        });
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();

    console.log(user);
  }, []);

  const handleProfileClick = () => {
    setProfilePopUp(!profilePopUp);
  };

  const navigate = useNavigate();

  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <div className="bg-slate-100 text-zinc w-screen h-screen ">
      <h2 className="uppercase font-bold font-serif text-zinc-700">
        working with google api{" "}
      </h2>

      {user && user.image ? (
        <div>
          <div
            className="profile cursor-pointer w-14 h-14 rounded-full absolute right-2 top-2  z-10"
            onClick={handleProfileClick}
          >
            <img
              src={user.image}
              alt="profile"
              className="w-full h-full object-cover rounded-full"
            />
          </div>
          <div className="absolute right-5 top-5 z-10">
            {profilePopUp && (
              <ProfilePopUp user={user} onClose={handleProfileClick} />
            )}
          </div>
        </div>
      ) : (
        <button
          onClick={() => navigate("/register")}
          className="cursor-pointer text-blue-600 absolute right-4 top-4 text-xl underline"
        >
          Register
        </button>
      )}

      <div className="grid gap-4 p-4 grid-cols-2 lg:grid-cols-[repeat(auto-fit,minmax(200px,1fr))] justify-items-center  items-center  mt-28 md:mx-8 px-8">
        <div className="bg-white w-36 md:w-48 p-4 rounded-xl hover:bg-gray-200">
          <img className="rounded-md" src={textImage}></img>
          <p className="font-bold font-serif text-sm md:text-lg mt-2">
            AI text to image
          </p>
        </div>
        <div
          className="bg-white w-36 md:w-48 p-4 rounded-xl hover:bg-gray-200"
          onClick={() => navigate("/mail")}
        >
          <img className="rounded-md" src={mail}></img>
          <p className="font-bold font-serif text-sm md:text-lg mt-2">
            Mailing
          </p>
        </div>
        <div
          onClick={() => navigate("/maps")}
          className="bg-white w-36 md:w-48 p-4 rounded-xl hover:bg-gray-200"
        >
          <img className="rounded-md" src={map}></img>
          <p className="font-bold font-serif text-sm md:text-lg mt-2">Maps</p>
        </div>
        <div onClick={()=> navigate("/gemini")}
         className="bg-white w-36 md:w-48 p-4 rounded-xl hover:bg-gray-200">
          <img className="rounded-md" src={AI}></img>
          <p className="font-bold font-serif text-sm md:text-lg mt-2">Gemini</p>
        </div>
      </div>
    </div>
  );
};

export default HomeComponents;
