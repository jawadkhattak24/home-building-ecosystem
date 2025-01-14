import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../../contexts/authContext";
import PropTypes from "prop-types";
import styles from "./styles/protectedRoute.module.scss";

const ProtectedRoute = React.memo(
  ({
    element: Element,
    allowedRoles = [],
    redirectPath = "/signIn",
    ...rest
  }) => {
    const { currentUser, loading } = useAuth();
    const userType = currentUser?.userType;

    if (loading) {
      return (
        <div className={styles.loadingWrapper}>
          <div className={styles.loader}></div>
          <p className={styles.loadingText}>Loading...</p>
        </div>
      );
    }

    if (!currentUser) {
      return <Navigate to="/signIn" replace />;
    }

    if (allowedRoles.length > 0 && !allowedRoles.includes(userType)) {
      const redirectTo =
        userType === "homeowner"
          ? "/homeNew"
          : userType === "professional"
          ? `/professional-profile/${currentUser._id}`
          : `/supplier-profile/${currentUser._id}`;
      return <Navigate to={redirectTo} replace />;
    }

    return <Element {...rest} />;
  }
);

ProtectedRoute.propTypes = {
  element: PropTypes.elementType.isRequired,
  allowedRoles: PropTypes.arrayOf(PropTypes.string),
  redirectPath: PropTypes.string,
};

ProtectedRoute.displayName = "ProtectedRoute";

export default ProtectedRoute;
