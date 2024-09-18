import React, { useState } from "react";
import { http } from "../services/http";
import { marked } from 'marked';

const Gemini = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");

  const handleSendMessage = async () => {
    if (inputMessage.trim() === "") return;

    const userMessage = { text: inputMessage, sender: "user" };
    setMessages([...messages, userMessage]);

    try {        
      const userPrompt = inputMessage;
      setInputMessage("");
      const response = await http.post("/user/askgemini",  {prompt: userPrompt});
      
      const aiMessage = { text: response.data, sender: "ai" };
      setMessages([...messages, userMessage, aiMessage]);
    } catch (error) {
      console.error("Error fetching AI response:", error);
    }
    
  };


    // Function to handle Enter key press
    const handleKeyPress = (e) => {
      if (e.key === 'Enter' && inputMessage.trim() !== '') {
        e.preventDefault();
        handleSendMessage();
      }
    };

  const handleInputChange = (e) => {
    setInputMessage(e.target.value);
  };

  return (
    <div className="p-4 w-screen h-screen  flex flex-col justify-between">
   <div className="w- mx-16 "> <h1 className="text-[2.75rem] font-[Google Sans,Helvetica Neue,sans-serif] font-[500] leading-[2.875rem] p-4 text-left w-fit bg-clip-text text-transparent text-outline font-serif bg-custom-gradient text-2xl">Generative AI with Gemini</h1>
   </div>
      <div className="chatbox w-auto h-full mx-16 border bg-gray-100 border-gray-300 rounded-lg overflow-hidden flex flex-col justify-end">
        <div className="  flex flex-col w-full  mx-auto rounded-lg overflow-y-auto ">
          <div className="messages">
            <div className="flex-grow p-4 space-y-4 overflow-y-auto min-h-96 bg-gray-100">
              {messages.map((message, index) => (
                <p
                  key={index}
                  className={`p-3 rounded-xl text-justify max-w-xs ${
                    message.sender === "user"
                      ? "max-w-1/2 p-4 bg-blue-500 text-white self-end ml-auto"
                      : "max-w-1/2 p-4 bg-gray-300 text-black self-start"
                  }`}
                >
                  {message.text}
                </p>
              ))}
            </div>
          </div>
        </div>
        <div 
        onKeyDown={handleKeyPress}
        className="chat">
          <div className="flex p-4 bg-white border-t border-gray-300">
            <textarea
              type="text"
              value={inputMessage}
              onChange={handleInputChange}
              placeholder="Type your message..."
              className="flex-grow p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black overflow-y-scroll resize-none"
            >
              {" "}
            </textarea>
            <button
              onClick={handleSendMessage}
              disabled={inputMessage.trim() === ''}
              className="ml-3 p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Gemini;
