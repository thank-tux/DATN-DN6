import { onAuthStateChanged, getAuth } from "firebase/auth";
import { createContext, useState, useEffect } from "react";
import { auth } from "../firebase/firebase";

const AuthContext = createContext({
  userInfo: null,
  loggedIn: false,
  signOut: () => {},
});

export function AuthContextProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  // const context = {
  //   userInfo: user,
  //   signOut: signOut(),
  // };

  const isLoggedIn = user?.uid != null;

  return (
    <AuthContext.Provider value={{ userInfo: user, loggedIn: isLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;
