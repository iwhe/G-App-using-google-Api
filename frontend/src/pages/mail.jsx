import React, { useEffect, useState } from "react";
import Sidebar from "../components/mail_sidebar";
import { getUser } from "../services/user";

const Mail = () => {
  const [Error, setError] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await getUser();

          setUser(response?.data);

      } catch (err) {
        console.error(err);
        setError(err.message);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    console.log(user);
  }, [user]);

  // if (!user) return <div>Loading...</div>;
  // console.log("USer:::", User)

  return (
    <div className="mail-container">
      <Sidebar />
    </div>
  );
};

export default Mail;
