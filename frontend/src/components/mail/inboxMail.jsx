import React, { useState, useEffect } from "react";
import { http } from "../../services/http";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchInboxEmail } from "../../redux/reducers/inboxReducer.jsx";

const Inbox = () => {
  const dispatch = useDispatch();
  const {
    emails: messages,
    loading,
    error,
  } = useSelector((state) => state.inbox);

  useEffect(() => {
    dispatch(fetchInboxEmail());
  }, [dispatch]);

  if (error) return <p>Error: {error}</p>;

  const extractName = (name) => {
    return name?.match(/^[^<@]+/)[0].trim();
  };

  const navigate = useNavigate();
  const openEmail = (messageId) => {
    navigate(`/mail/view/${messageId}`);
  };

  return (
    <div className=" p-4 mr-4 rounded-2xl h-full w-full bg-white font-bold text-2xl overflow-y-scroll scroller">
      Inbox
      {loading && (
        <div className="font-normal text-sm text-gray-400"> Loading... </div>
      )}
      <div className="w-full bg-zinc-100 font-normal text-sm  flex flex-col gap-2 rounded-t-xl">
        <table>
          <tbody>
            {messages &&
              messages.map((message, index) => (
                <div
                  key={index}
                  className="gap-4 p-2 items-center py-[10px] border-b border-gray-400 hover:bg-white hover:drop-shadow-md cursor-pointer"
                >
                  <tr
                    onClick={() => openEmail(message.id)}
                    className="shadow-[inset 0 -1px 0 0 rgba(100, 121, 143, 0.12)] flex flex-row w-full justify-start"
                  >
                    <td className="w-[100px] md:w-[200px] box-border text-left relative left font-medium">
                      {" "}
                      {extractName(message.from)}
                    </td>
                    <td className="text-left box-content ">
                      {message.subject}
                    </td>
                  </tr>
                </div>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Inbox;
