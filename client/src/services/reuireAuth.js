import Auth from "./auth"

export const RequireAuth = ({ children }) => {
  console.log(Auth.loggedIn())
 return Auth.loggedIn() ? children : window.location.assign('/');
}