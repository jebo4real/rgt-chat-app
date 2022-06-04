import React, { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useAuth0 } from "@auth0/auth0-react";

import MessageArea from "../components/chat/MessageArea";
import Sidebar from "../components/chat/Sidebar";
import { default as socket } from "../services/ws";
import SelectUserContext from "../context/select-context";

const Chat = () => {
  const { user } = useAuth0();

  const [message, setMessage] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [userDetails, setuserDetails] = useState(null)

  const saveUser = async () => {
    try{
      const data = {
        email: user?.email,
        userName: user?.nickname,
      };
  
      const response = await fetch("/api/user/", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const res = response.json();
  
      const userReturned = await res
      if(["undefined", "null", "", undefined, null].includes(localStorage.getItem("userId"))){
        localStorage.setItem("userId", userReturned?.user?._id)
        localStorage.setItem("user", JSON.stringify(userReturned?.user))
      } 

      if(![undefined, null, ""].includes(user?.nickname)) localStorage.setItem("nickname", user?.nickname)
      
      setuserDetails(userReturned)

      //announce self online
      socket.emit("login", {userName: user?.nickname, userId: userReturned?.user?._id});
    } catch(e){
      console.log(e)
    }
    
  };

  const sendMessage = (e) => {
    e.preventDefault();

    if([null, undefined, ""].includes(selectedUser)){
      return toast("Select a user to chat!", {
        duration: 4000,
        style: {},
        className: "",
        role: "status",
        ariaLive: "polite",
      });
    }

    if(message === "" ){
      return toast("Enter a message!", {
        duration: 4000,
        style: {},
        className: "",
        role: "status",
        ariaLive: "polite",
      });
    }

    // construct message and emit
    const messageProperties = {
      senderId: localStorage.getItem("userId"),
      receiverId: selectedUser?.userId,
      message: message
    }
    socket.emit("chat-message", messageProperties)

    setMessage("")
    
  };

  useEffect(() => {
    saveUser();
  }, [user]);

  


  return (
    // Pass selected user context
    <SelectUserContext.Provider value={{ selectedUser, setSelectedUser }}>
      <div className="flex w-screen main-chat lg:h-screen bg-gray-300 divide-solid">
        <Toaster />
        <div className="flex w-full lg:w-5/6 lg:h-5/6 lg:mx-auto lg:my-auto shadow-md">
          {/* Users Online : Side Bar */}
          <Sidebar />
          <div className="flex flex-col flex-grow lg:max-w-full bg-purple-50">
            {/* Message Area */}
            <MessageArea />
            <form className="">
              <div className="w-full flex p-4 lg:p-8 bg-purple-50">
                {" "}
                <div className="flex relative w-full lg:w-5/6">
                  <span className="rounded-l-md inline-flex items-center px-1 lg:px-3 border-t bg-white border-l border-b  border-gray-300 text-gray-500 shadow-sm text-sm">
                    <p className="bg-gray-900 text-white text-xs lg:text-base font-semibold rounded p-1 w-20 lg:w-28 truncate">
                      To: {selectedUser?.userName || "Select User"}
                    </p>
                  </span>
                  <input
                    type="text"
                    className="rounded-r-lg flex-1 appearance-none border border-gray-300 w-full py-2 px-1 lg:px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none"
                    name="message"
                    onChange={(e) => setMessage(e.target.value)}
                    value={message}
                  />
                </div>
                <div className="lg:block w-1/6">
                  <button
                    className="ml-8 flex-shrink-0 bg-gray-900 text-white text-base font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-gray-900 focus:outline-none focus:ring-2"
                    onClick={(e) => sendMessage(e)}
                  >
                    Send
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </SelectUserContext.Provider>
  );
}

export default Chat;
