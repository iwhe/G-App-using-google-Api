import { http } from "../../services/http";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchSentEmail } from "../../redux/reducers/sentReducer.jsx";

const SentMail = () => {
  const dispatch = useDispatch();
  const {
    emails: messages,
    loading,
    error,
  } = useSelector((state) => state.sent);

  useEffect(() => {
    dispatch(fetchSentEmail());
  }, [dispatch]);

  if (error) return <p>Error: {error}</p>;

  const navigate = useNavigate();
  const openEmail = (messageId) => {
    navigate(`/mail/view/${messageId}`);
  };

  const extractName = (name) => {
    return name?.match(/^[^<@]+/)[0].trim();
   }
  

  return (
    <div className=" p-4 mr-4 rounded-2xl h-full w-full bg-white overflow-y-scroll">
      <h2 className="uppercase font-bold text-2xl">Sent</h2>
      {loading && (
        <div className="font-medium text-lg text-blue-600"> Loading... </div>
      )}

      <div className="w-full bg-zinc-100 font-normal text-sm  flex flex-col gap-2 rounded-t-xl">
        <table>
          <tbody>
            {messages &&
              messages.map((message) => (
                <div
                  key={message.id}
                  className="flex flex-row gap-4 p-2 items-center py-[10px] border-b border-gray-400 hover:bg-white  hover:drop-shadow-md cursor-pointer"
                >
                  <tr
                    onClick={() => openEmail(message.id)}
                    className="shadow-[inset 0 -1px 0 0 rgba(100, 121, 143, 0.12)] flex flex-row w-full justify-start"
                  >
                    <td className="min-w-[100px] md:min-w-[200px] text-left relative left font-medium flex flex-row justify-start items-center gap-1">
                      <p className="font-normal">To: </p>
                      {extractName(message.to)}
                    </td>
                    <td>{message.subject}</td>
                  </tr>
                </div>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SentMail;
