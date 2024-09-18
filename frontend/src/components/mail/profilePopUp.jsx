import React from 'react';
import { PiSignOut } from "react-icons/pi";
import { IoCloseOutline } from "react-icons/io5";

const ProfilePopUp = (props) => {
    const user = props.user;
    return (
    <div className='bg-[#282a2c] py-8 px-4 text-[#c4c7c5] min-w-[436px] max-w-[240px] p-[8px 12px 16px] shadow-[0 4px 8px 3px rgba(0,0,0,.15),0 1px 3px rgba(0,0,0,.3)] rounded-[28px] flex flex-col items-center'>
        
        <div>
        <h2 className='font-serif text-blue-300 font-bold uppercase text-xl  mb-6 underline'>
             Profile
        </h2>
        <IoCloseOutline
        onClick={props.onClose}
         className='absolute right-6 top-6 rounded-full text-2xl p hover:bg-zinc-900'/>
         </div>
        <div className='text-center font-["Google Sans","Roboto"] text-[.875rem] transition-[opacity .15s cubic-bezier(.4,0,.2,1)]'>{user.email}</div>
        <div
        className=" relative w-[80px] h-[80px] mt-[22px] rounded-full"
      >
        <div
          className="absolute inset-0 rounded-full border-[0.5px] border-transparent animate-spin-slow"
          style={{
            background: "conic-gradient(yellow, cyan, limegreen, yellow)",
          }}
        ></div>
        <div className="absolute inset-0 p-[2px] rounded-full ">
          <img
            src={user.image}
            alt="profile"
            className="w-full h-full object-cover rounded-full"
          />
        </div>
        </div>
        <div className='capitalise font-[400] font-["Google Sans","Roboto"] text-[1.375rem] my-5 text-center '>{user.name}</div>
        <button className='font-[Helvitika] w-full bg-black text-[#e3e3e3] rounded-full p-[17px] flex flex-row justify-center items-center text-md gap-4' > <PiSignOut />
        Sign Out</button>
    </div>
    
    
  )
}

export default ProfilePopUp