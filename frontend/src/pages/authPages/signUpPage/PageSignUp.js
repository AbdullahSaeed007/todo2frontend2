import { Signup } from "../../../components/authComponent/signup";
import { useState } from "react";
import {BrowserRouter as Router, Route, Switch } from "react-router-dom";

export default function SignUp() {
  const [users, setUsers] = useState(() => {
    // Retrieve and parse the users data from localStorage if available
    const storedUsers = localStorage.getItem("users");
    return storedUsers ? JSON.parse(storedUsers) : [];
  });
  const store_local = (users) => {
    localStorage.setItem("users", JSON.stringify(users));
  };

  function handleSignup(user) {
    setUsers((prev) => {
      const newUsers = [...prev, user];
      store_local(newUsers);
      return newUsers;
    });
  }

  return (
    <Router>
    <Switch>
      <Route exact path="/signup">
        <Signup setUsersu={handleSignup} usersu={users} />
      </Route>
    </Switch>
    </Router>
  );
}
