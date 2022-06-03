
class AuthService {

  loggedIn() {
    // Checks if there is a saved userId
    const userId = this.getUserId();
    return !!userId;
  }

  getUserId() {
    // Retrieves the user userId from localStorage
    return localStorage.getItem('userId');
  }

}

export default new AuthService();
