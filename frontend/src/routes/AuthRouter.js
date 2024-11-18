import { useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";
import PageSignIn from "../pages/authPages/logInPage/PageLoginIn";
import Signup from "../components/authComponent/signup";
import Admin from "../pages/authPages/adminPage/Admin";
import ProtectedRoute from "./ProtectedRoute";
import Main from "../pages/todoPage/Main";
import Navbar from "../components/navBarComponent/navbar";
import Cookies from "js-cookie";
import {jwtDecode} from "jwt-decode";  // Remove the curly braces

function existCookie() {
  const token = Cookies.get("token");
  if (token) {
    try {
      const decoded = jwtDecode(token);
      return decoded.role;
    } catch (error) {
      console.error("Invalid token:", error);
      return null;
    }
  }
  return null;
}

export default function AuthRouter() {
  const [currentUser, setCurrentUser] = useState(existCookie());
  const [users, setUsers] = useState([]);

  const handleSignup = (newUser) => {
    setUsers([...users, newUser]);
  };

  return (
    <Router>
      <Navbar currentUser={currentUser} setCurrentUser={setCurrentUser} />
      <br />
      <br />
      <Switch>
        <Route exact path="/">
          <Redirect to="/signin" />
        </Route>

        <Route exact path="/signin">
          {currentUser === "Admin" ? (
            <Redirect to="/Admin" />
          ) : currentUser === "user" ? (
            <Redirect to="/Main" />
          ) : (
            <PageSignIn
              currentUser={currentUser}
              setCurrentUser={setCurrentUser}
            />
          )}
        </Route>

        <ProtectedRoute
          exact
          path="/Main"
          component={Main}
          currentUser={currentUser}
          requiredRole="user"
        />

        <ProtectedRoute
          exact
          path="/Admin"
          component={Admin}
          currentUser={currentUser}
          requiredRole="Admin"
        />

        <Route path="/signup">
          <Signup setUsersu={handleSignup} usersu={users} />
        </Route>
      </Switch>
    </Router>
  );
}
