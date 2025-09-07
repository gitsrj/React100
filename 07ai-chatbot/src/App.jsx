import { ExternalLink } from "lucide-react";
import React, { useState } from "react";
import "animate.css";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import moment from "moment";

function App() {
  const [message, setMessage] = useState("");
  const [chats, setChats] = useState([]);
  const [isTyping, setTyping] = useState(false);

  const createChat = async (e) => {
    try {
      e.preventDefault();
      setChats((prev) => [
        ...prev,
        {
          sender: "me",
          message: message,
          createdAt: new Date(),
        },
      ]);
      setMessage("");
      setTyping(true);
      const payload = {
        contents: {
          parts: {
            text: `Answer this in short - ${message}`,
          },
        },
      };
      const options = {
        headers: {
          "X-goog-api-key": import.meta.env.VITE_API_KEY,
        },
      };
      const { data } = await axios.post(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
        payload,
        options
      );
      const aiResult = data.candidates[0].content.parts[0].text;
      setChats((prev) => [
        ...prev,
        {
          sender: "ai",
          message: aiResult,
          createdAt: new Date(),
        },
      ]);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setTyping(false);
    }
  };
  return (
    <div className="bg-gray-200 min-h-screen">
      <div className="lg:w-9/12 mx-auto bg-white min-h-screen pt-12 pb-48">
        <h1 className="text-3xl font-bold text-center ">🤖 AI CHATBOT</h1>

        <div className="p-8 space-y-6">
          {chats.map((item, index) => (
            <div key={index}>
              {item.sender === "me" && (
                <div className="flex flex-col gap-2 justify-start animate__animated animate__fadeIn">
                  <div className="bg-rose-200 text-black font-medium px-6 py-3 rounded-xl w-9/12">
                    {item.message}
                    <div className="flex justify-end text-gray-600 text-xs">
                      <label>
                        {moment(item.createdAt).format(
                          "MMM DD YYYY, hh:mm:ss A"
                        )}
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {item.sender === "ai" && (
                <div className="flex flex-col gap-2 items-end animate__animated animate__fadeIn ">
                  <div className="bg-green-200 text-black font-medium px-6 py-3 rounded-xl w-9/12">
                    {item.message}
                    <div className="flex justify-end text-gray-600 text-xs">
                      <label>
                        {moment(item.createdAt).format(
                          "MMM DD YYYY, hh:mm:ss A"
                        )}
                      </label>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {isTyping && (
          <div className="flex justify-end px-8">
            <small className="text-gray-500 text-sm font-medium text-left animate__animated animate__fadeIn">
              Typing...
            </small>
          </div>
        )}

        <div className="bg-indigo-600 fixed lg:p-8 p-4 bottom-0 lg:w-9/12 w-full ">
          <form className="flex gap-4" onSubmit={createChat}>
            <input
              required
              type="text"
              className="bg-white rounded-xl p-6 w-full"
              placeholder="Enter your message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <button className="bg-yellow-500 px-12 rounded-xl text-white flex-col items-center justify-center hover:bg-green-400 hover:scale-105 transition-transform duration-300">
              <ExternalLink />
              Send
            </button>
          </form>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default App;
