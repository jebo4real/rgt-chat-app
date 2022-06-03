import React, { useState, useEffect, useContext } from "react";

import { default as socket } from "../../services/ws";
import SelectUserContext from "../../context/select-context";

function MessageArea() {

  const [chat, setChat] = useState([]);
  const [userId, setUserId] = useState(localStorage.getItem("userId"));
  const { selectedUser } = useContext(SelectUserContext);


  const getChatInteraction = async () => {

    const userId1 = localStorage.getItem("userId");
    const userId2 = selectedUser?.userId;

    if(userId1 !== undefined || userId2 !== undefined){

      try {
        const response = await fetch(`/api/chat/${userId1}/${userId2}`);
        const res = response.json();
  
        const messageReturned = await res;
        setChat(messageReturned);
      } catch (e) {
        console.log(e);
      }

    }
    
  };

  // for message sorting array by created date
  const sortAsc = (a, b) => {
    if (a.createdAt < b.createdAt) {
      return -1;
    }
    if (a.last_nom > b.last_nom) {
      return 1;
    }
    return 0;
  };

  useEffect(() => {
    socket.on(`chat-message-${userId}`, async (chat) => {
      setChat((prevChats) => [...prevChats, chat]);
    });

    return () => {
      socket.off();
    };
  }, []);

  useEffect(() => {
    if(![undefined, null, ""].includes(selectedUser)) getChatInteraction();  
  }, [getChatInteraction, selectedUser]);

  return (
    <div
      id="msg"
      className="h-5/6 overflow-y-auto pl-4 lg:pl-8 pt-4 mb-2 lg:mb-0 h-32"
    >
      {chat.length < 1 ? (
        <p className="flex items-center justify-center h-screen">Select a user to chat</p>
      ):(
        <ul className="w-full lg:w-96 space-y-2">
        {chat.sort(sortAsc).map((el, index) => (
          el.senderId === userId ? (
            <li key={index} className="flex justify-end">
            <div className="relative max-w-xl px-4 py-2 text-gray-700 bg-gray-100 rounded shadow">
              <span className="block">{el.message}</span>
            </div>
          </li>
          ):(
            <li key={index} className="flex justify-start">
            <div className="relative max-w-xl px-4 py-2 text-gray-700 bg-gray-100 rounded shadow">
              <span className="block">{el.message}</span>
            </div>
          </li>
          )
        ))}
      </ul>
      )}
     
    </div>
  );
}

export default MessageArea;
