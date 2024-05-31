import { useState, useEffect } from "react";
import { getAuth } from "firebase/auth";

function useAuth() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = getAuth().onAuthStateChanged((user) => {
      setUser(user);
    });

    return unsubscribe;
  }, []);

  return user;
}

export default useAuth;
