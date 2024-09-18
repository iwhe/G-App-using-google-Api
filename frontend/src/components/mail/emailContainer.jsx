import React, { useState } from "react";
import { IoIosClose, IoMdAttach, IoIosArrowUp } from "react-icons/io";
import { MdDeleteForever } from "react-icons/md";
import { VscChromeMinimize } from "react-icons/vsc";
import { http } from "../../services/http";

const EmailContainer = () => {
  const [showContainer, setShowContainer] = useState([true]);

  const [emailContent, setEmailContent] = useState({
    toEmail: "",
    subject: "",
    message: ""
  })
  const handleCollapse = () => {
    setShowContainer(false);
  };

  const handleUpArrow = () => {
    setShowContainer(true);
  };

  const handleChange = (e) => {
    console.log(emailContent);
    setEmailContent((prev) => ({
      ...prev,
      [e.target.name]: e.target.value, 
    }));
  };

  const handleEmailFormSubmit = async(e) => {
    e.preventDefault();
    const response = await http.post("/oauth/gmail/send", emailContent);
    if (response && response.status == 200){
      alert("Mail Sent Successfully")
      setEmailContent({
        toEmail: "",
        subject: "",
        message: ""
      })
      console.log(response);
    }
  }

  return (
    <div>
      {showContainer && (
         <form
         onSubmit={(e) => handleEmailFormSubmit(e)} 
         className="">
        <div className="emailContainer absolute bottom-2 right-2 w-full h-full md:w-2/5 md:h-3/5 rounded-xl bg-white text-black flex flex-col drop-shadow-2xl">
          <div className="w-full bg-gray-200 h-14 border-b border-black p-4 text-left font-medium flex flex-row justify-between items-center">
            New Message
            <div className="text-2xl text-center hover:bg-red-100 p-2 rounded-full">
              <VscChromeMinimize onClick={ handleCollapse} />
            </div>
          </div>
         
          <div className="w-full h-14 border-b border-black p-4 text-left flex flex-row relative">
            <p> To:</p>
            <input
              className="mx-12 w-full h-full border-none outline-none"
              type="text"
              name="toEmail"
              onChange={(e) => handleChange(e)}
              value={emailContent.toEmail}
              placeholder="example@mail.com"
            ></input>
          </div>
          <div className="w-full h-14 border-b border-black p-4 text-left flex flex-row relative">
            <p> Subject:</p>
            <input
               name="subject"
               value={emailContent.subject}
              onChange={(e) => handleChange(e)}
              className="mx-4 w-full h-full border-none outline-none"
              type="text"
              placeholder="Write subject here"
            ></input>
          </div>
          <div className="relative w-full h-full p-4 text-justify">
            <textarea
            name="message"
            onChange={(e) => handleChange(e)}
            value={emailContent.message}
              placeholder="Write your message here..."
              className="w-full h-full border-none outline-none resize-none"
            ></textarea>
          </div>
          <div className="w-full h-14 border-t border-black px-4 py-4 text-left flex flex-row items-center relative bottom-0 justify-between">
            <div className="flex flex-row gap-4 items-center">
              <button
              type="submit" 
              className="bg-blue-600 rounded-full px-6 py-2 font-bold text-white hover:bg-black">
                Send
              </button>
              <div className="text-xl hover:bg-gray-200 p-4 rounded-full">
                <IoMdAttach />
              </div>
            </div>
            <div className="text-xl hover:bg-gray-200 p-4 rounded-full">
              <MdDeleteForever />
            </div>
          </div>
          
        </div></form>
      )}

      {!showContainer && (
        <div className="collapsedContainer  absolute bottom-2 right-2 w-full md:w-2/5">
          <div className="w-full bg-gray-200 h-14 border border-slate-400 p-4 text-left font-medium flex flex-row justify-between items-center">
            New Message
            <div className="text-2xl text-center hover:bg-white p-2 rounded-full">
              <IoIosArrowUp onClick={handleUpArrow} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmailContainer;
