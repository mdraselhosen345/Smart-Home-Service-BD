
import React, { useEffect, useState } from "react";
import { Navigate } from "react-router";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../Firebase/Firebase";

// এখানে আপনার নিজের Firebase Login Email দিন
const ADMIN_EMAIL = "rasel.hossenit@gmail.com";

const PrivateRoute = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-lg font-semibold">
          Checking Admin Access...
        </p>
      </div>
    );
  }

  // Login না করলে অথবা Admin Email না হলে ঢুকতে পারবে না
  if (
    !user ||
    user.email?.toLowerCase() !== ADMIN_EMAIL.toLowerCase()
  ) {
    return <Navigate to="/Account" replace />;
  }

  return children;
};

export default PrivateRoute;
