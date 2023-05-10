import { createContext, useEffect, useState, useContext } from "react";
import { getItem } from "../firebase/firebaseAuth";
import AuthContext from "../auth-context";

const CartContext = createContext({
  quantityInfo: null,
  increment: null,
  decrement: null,
});
export function CartContextProvider({ children }) {
  const [quantity, setQuantity] = useState(0);
  const { userInfo } = useContext(AuthContext);

  console.log(userInfo);
  const increment = (value) => {
    setQuantity(value + 1);
  };

  const decrement = (value) => {
    setQuantity(value - 1);
  };
  const fecthData = async () => {
    getItem("cart");
  };
  useEffect(() => {
    fecthData;
  }, []);

  return (
    <CartContext.Provider
      value={{ quantityInfo: quantity, decrement, increment }}
    >
      {children}
    </CartContext.Provider>
  );
}

export default CartContext;
