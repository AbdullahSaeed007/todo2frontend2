import { Route, Redirect } from "react-router-dom";

export default function ProtectedRoute({
  currentUser,
  component: Component,
  requiredRole,
  ...rest
}) {
  return (
    <Route
      {...rest}
      render={(props) =>
        currentUser === requiredRole ? (
          <Component {...props} />
        ) : (
          <Redirect to="/signin" />
        )
      }
    />
  );
}
