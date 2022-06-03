import React from "react";
import { useAuth0 } from "@auth0/auth0-react";

function Login() {
  const { loginWithRedirect } = useAuth0();
  
  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <div className="grid place-items-center my-auto">
        <h1 className="font-bold text-4xl pb-10 text-gray-900 antialiased">
          RGT Chat App
        </h1>
        <div className="flex w-full max-w-sm space-x-3 justify-center">
          <button
            className="flex-shrink-0 bg-gray-900 text-white text-base font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-purple-200"
            onClick={() => {
              localStorage.setItem("userId", null)
               loginWithRedirect()
            }}
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
