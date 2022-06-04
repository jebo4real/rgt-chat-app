import React, { useState, useEffect, useContext } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import toast from "react-hot-toast";

import { default as socket } from "../../services/ws";
import SelectUserContext from "../../context/select-context";

const Sidebar = () => {
  const [usersOnline, setUsersOnline] = useState([]);
  const [userId, setUserId] = useState(localStorage.getItem("userId"));

  const { setSelectedUser } = useContext(SelectUserContext);

  const { logout } = useAuth0();

  useEffect(() => {
    socket.on("user-online", (list) => {
      setUsersOnline(list);
    });

    return () => {
      socket.off();
      setUsersOnline([]);
    };
  }, []);

  const filterBlockedUsersOnline = async (item) => {
    //filter users with blocked list out
    const blockedList = await getBlocklist();
    const extractedList = blockedList?.list ?? [];
    return !extractedList.includes(item.userId);
  };

  const saveUserToMessage = (userObj) => {
    setSelectedUser(userObj);
  };

  const blockUser = async (userIdToBlock) => {
    try {
      const data = {
        userIdToBlock,
      };

      const response = await fetch(`/api/chat/block-user/${userId}`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      });
      response.json();

      return toast("User blocked", {
        duration: 3000,
        style: {},
        className: "",
        role: "status",
        ariaLive: "polite",
      });
    } catch (e) {
      console.log(e);
      return toast("Error blocking users!", {
        duration: 3000,
        style: {},
        className: "",
        role: "status",
        ariaLive: "polite",
      });
    }
  };

  const getBlocklist = async () => {
    try {
      const response = await fetch(`/api/chat/block-list/${userId}`);
      const res = response.json();

      const blockedList = await res;
      return blockedList;
    } catch (e) {
      console.log(e);
    }
  };

  const logUserOut = () => {
    localStorage.clear();
    logout({ returnTo: window.location.origin });
  };

  return (
    <div className="lg:block pl-4 pr-4 w-64 bg-gray-900 text-white">
      <p>
        Me: {localStorage.getItem("nickname")}{" "}
        <button
          className="ml-8 flex-shrink-0 bg-gray-900 text-white text-base font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-gray-900 focus:outline-none focus:ring-2 hover:border-white border-transparent border-2"
          onClick={() => logUserOut()}
        >
          Log out
        </button>
      </p>
      <p className="font-black my-4 text-xl"> Online</p>
      <ul className="divide-y divide-gray-300 truncate">
        {usersOnline !== null
          ? usersOnline
              .filter(
                (item) =>
                  item.userId !== localStorage.getItem("userId") ||
                  null ||
                  undefined
              )
              .filter(filterBlockedUsersOnline)
              .map((el, index) => (
                <li key={index} className="flex flex-row gap-4 ">
                  <button
                    onClick={() => saveUserToMessage(el)}
                    className="block focus:outline-none truncate row-start hover:border-white border-transparent border-2"
                  >
                    {el?.userName}
                  </button>
                  <button
                    className="block focus:outline-none truncate row-start hover:border-white border-transparent border-2"
                    onClick={() => blockUser(el?.userId)}
                  >
                    Block
                  </button>
                </li>
              ))
          : ""}
      </ul>
    </div>
  );
};

export default Sidebar;
