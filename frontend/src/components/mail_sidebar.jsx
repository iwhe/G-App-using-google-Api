import React, {useState} from "react";
import { LuPenSquare } from "react-icons/lu";
import { BiSolidMessageDetail } from "react-icons/bi";
import { AiOutlineSend } from "react-icons/ai";
import EmailContainer from "./emailContainer";
import Inbox from "./inboxMail";
import SentMail from "./sentMail";

const Sidebar = () => {
  const [mailContainer, setMailContainer] = useState(false);
  const [viewInbox, setViewInbox] = useState(true);
  const [viewSent, setViewSent] = useState(false);


  const handleEmailContainer = () =>{
    setMailContainer(!mailContainer);
  }
  const openInbox = () =>{
    setViewSent(false);
    setViewInbox(true);
  }

  const openSent = () => {
    setViewInbox(false);
    setViewSent(true);
  }

  return (
    <div className="flex flex-row w-screen h-screen  gap-4 bg-gray-900">
      <div className="relative h-screen left-0 h-full w-[250px] md:w-[450px] px-4 bg-gray-300 w-text-black font-[Helvetica]">
        <div className="uppercase text-3xl py-4 mb-4 font-bold border-b pb-4 border-zinc-400">
          Mail
        </div>
        <div className="relative w-full flex flex-col gap-4">
          <button 
          onClick={handleEmailContainer}
          className="bg-blue-500 text-white mb-4 p-4 border border-white drop-shadow-2xl rounded-lg w-full font-bold text-lg flex items-center gap-4 justify-center">
            <LuPenSquare />
            Compose New Email
          </button>
          <div 
          onClick={openInbox}
          className={`font-sans p-4 w-full font-medium text-lg flex items-center gap-4 justify-left pl-8 rounded-full cursor-pointer
          ${ viewInbox ? 'bg-white' : 'hover:bg-white'}`}>
            <BiSolidMessageDetail />
            Inbox
          </div>
          <div 
          onClick={openSent}
          className= {`font-sans hover:bg-white p-4 w-full font-medium text-lg flex items-center gap-4 justify-left pl-8 rounded-full cursor-pointer
            ${ viewSent ? 'bg-white' : 'hover:bg-white'}`
          }>
            <AiOutlineSend />
            Sent
          </div>
        </div>
      </div>
      <div className="relative p-4 h-full w-full">
        {
          viewInbox && 
          <Inbox/> || viewSent && 
          <SentMail/>
        }
      </div>
      {mailContainer && 
      <EmailContainer/>
      }
    </div>
  );
};

export default Sidebar;
