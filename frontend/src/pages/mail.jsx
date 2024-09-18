import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/mail_sidebar.jsx";
import { getUser } from "../services/user";
import ProfilePopUp from "../components/mail/profilePopUp.jsx";

const Mail = () => {
  const [Error, setError] = useState(false);
  const [user, setUser] = useState({
    name: "",
    email: "",
    image: "",
  });
  const [profilePopUp, setProfilePopUp] = useState(false);

  const [loading, setLoading] = useState(false);
  // const [response, seResponse] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const response = await getUser();
        const userData = response?.data?.data;
        setUser((prevValues) => ({
          ...prevValues,
          name: userData.full_name,
          email: userData.email,
          image: userData.userImg,
        }));
      } catch (error) {
        if (error.response) {
          switch (error.response.status) {
            case 500:
              setError(`Please register yourself`);
              break;
            default:
              setError("An unexpected error occurred.");
          }
        }
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const navigate = useNavigate();

  const handleProfileClick = () => {
    setProfilePopUp(!profilePopUp);
  };
  if (loading) return <div>Loading...</div>;
  if (Error) return <div className="mt-4 font-[Helvitica] font-bold text-4xl">{Error}
  <div >
    <button onClick={()=>navigate('/register')} className="py-4 px-8 text-xl rounded-3xl bg-blue-500 text-white font-medium m-4">Register here</button>
  </div>
  </div>;
  // console.log("USer:::", User)

  return (
    <div className="mail-container w-full">
      {user && 
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
        {profilePopUp && 
        <ProfilePopUp 
        user={user} 
        onClose={handleProfileClick} />}
      </div>
      </div>
      }
      <Sidebar />
    </div>
  );
};

export default Mail;
