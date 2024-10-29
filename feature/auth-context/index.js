// import { onAuthStateChanged, getAuth } from "firebase/auth";
// import { createContext, useState, useEffect } from "react";
// import { auth } from "../firebase/firebase";
// import { getItem } from "../firebase/firebaseAuth";

// const AuthContext = createContext({
//     userInfo: null,
//     loggedIn: false,
//     signOut: () => {},
//     quantityCart: null,
//     increment: null,
//     decrement: null,
// });

// export function AuthContextProvider({ children }) {
//     const [user, setUser] = useState(null);

//     const [role, setRole] = useState(null);

//     const [quantity, setQuantity] = useState(null);
//     const increment = (count = 1) => {
//         setQuantity(quantity + count);
//     };

//     const decrement = (count = 1) => {
//         setQuantity(quantity - count);
//     };

//     const emptyCart = () => {
//         setQuantity(0);
//     };
//     useEffect(() => {
//         const unsubscribe = onAuthStateChanged(auth, async(user) => {
//             if (user) {
//                 let total = 0;
//                 setUser(user);
//                 const res = await getItem("cart", user.uid);
//                 if (res !== null) {
//                     for (const key in res.arrayCart) {
//                         total += res.arrayCart[key].quantity;
//                     }
//                     setQuantity(total);
//                 } else {
//                     setQuantity(0);
//                 }
//             } else {
//                 setUser(null);
//                 setQuantity(0);
//             }
//         });

//         return () => unsubscribe();
//     }, []);

//     // const context = {
//     //   userInfo: user,
//     //   signOut: signOut(),
//     // };

//     const isLoggedIn = user ? .uid != null;

//     return ( <
//         AuthContext.Provider value = {
//             {
//                 increment,
//                 decrement,
//                 quantityCart: quantity,
//                 userInfo: user,
//                 loggedIn: isLoggedIn,
//                 emptyCart,
//             }
//         } > { children } <
//         /AuthContext.Provider>
//     );
// }

// export default AuthContext;
// auth-context.js
import { createContext, useState, useContext, useEffect } from "react";
import { onAuthStateChanged, getAuth } from "firebase/auth";
import { auth, db } from "../firebase/firebase"; // Thay 'db' nếu đã config sẵn Firestore trong firebase.js
import { getItem } from "../firebase/firebaseAuth";
import { doc, getDoc } from "firebase/firestore";

const AuthContext = createContext({
  userInfo: null,
  loggedIn: false,
  role: null,
  signOut: () => {},
  quantityCart: null,
  increment: () => {},
  decrement: () => {},
  emptyCart: () => {},
});

export function AuthContextProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [quantity, setQuantity] = useState(0);

  // Tăng số lượng giỏ hàng
  const increment = (count = 1) => {
    setQuantity(quantity + count);
  };

  // Giảm số lượng giỏ hàng
  const decrement = (count = 1) => {
    setQuantity(Math.max(0, quantity - count)); // Không để số lượng < 0
  };

  // Làm rỗng giỏ hàng
  const emptyCart = () => {
    setQuantity(0);
  };

  // Xác thực và lấy thông tin user, role và cart
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        let total = 0;
        setUser(user);

        // Lấy role từ Firestore
        const userDoc = await getDoc(doc(db, "users", user.uid));
        setRole(userDoc.exists() ? userDoc.data().role : null);

        // Lấy số lượng giỏ hàng
        const res = await getItem("cart", user.uid);
        if (res !== null) {
          for (const key in res.arrayCart) {
            total += res.arrayCart[key].quantity;
          }
          setQuantity(total);
        } else {
          setQuantity(0);
        }
      } else {
        setUser(null);
        setRole(null);
        setQuantity(0);
      }
    });

    return () => unsubscribe();
  }, []);

  const isLoggedIn = !!user;

  return (
    <AuthContext.Provider
      value={{
        userInfo: user,
        role,
        loggedIn: isLoggedIn,
        quantityCart: quantity,
        increment,
        decrement,
        emptyCart,
      }}
    >
      {children}{" "}
    </AuthContext.Provider>
  );
}

export default AuthContext;
export const useAuth = () => useContext(AuthContext);
