import "../../styles/navBar/navbar.css";
import axios from 'axios';
export default function Navbar({currentUser,setCurrentUser}) {
  function handleSignOut()
  {
    console.log("logout function");
    async function logout() {
    try {
      const response = await axios.get(
        "http://localhost:9000/api/v1/logout",
        {
          withCredentials: true, // if your backend uses cookies for authentication
        }
      );
      if (response.data.success) {
        setCurrentUser(false);
      } else {
        console.error("Failed to logout:", response.data.message);
      }
    } catch (error) {
      console.error("Error logging out:", error);
    }
  }
  logout();
    window.location.replace('/signin');
  }

  return (
    <nav className="navbar">
      <div className="navbar-logo">To-Do List</div>
      <div className="navbar-text">....Stay Organized, Stay Productive....</div>
      {currentUser && <button onClick={()=>handleSignOut()}>LogOut</button>}
     
    </nav>
  );
}
