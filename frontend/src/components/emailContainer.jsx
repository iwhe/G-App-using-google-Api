import React, { useState } from "react";
import { IoIosClose, IoMdAttach, IoIosArrowUp } from "react-icons/io";
import { MdDeleteForever } from "react-icons/md";
import { VscChromeMinimize } from "react-icons/vsc";
import Sidebar from "./mail_sidebar.jsx";

const EmailContainer = () => {
  const [showContainer, setShowContainer] = useState([true]);

  const handleCollapse = () => {
    setShowContainer(false);
  };

  const handleUpArrow = () => {
    setShowContainer(true);
  };

  return (
    <div>
      {showContainer && (
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
              // value={ToEmail}
              placeholder="example@mail.com"
            ></input>
          </div>
          <div className="w-full h-14 border-b border-black p-4 text-left flex flex-row relative">
            <p> Subject:</p>
            <input
              className="mx-4 w-full h-full border-none outline-none"
              type="text"
              placeholder="Write subject here"
            ></input>
          </div>
          <div className="w-full h-full relative p-4 text-justify">
            <textarea
              placeholder="Write your message here..."
              className="w-full h-full border-none outline-none resize-none"
            ></textarea>
          </div>
          <div className="w-full h-14 border-t border-black px-4 py-4 text-left flex flex-row items-center bottom-0 justify-between">
            <div className="flex flex-row gap-4 items-center">
              <button className="bg-blue-600 rounded-full px-6 py-2 font-bold text-white hover:bg-black">
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
        </div>
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
