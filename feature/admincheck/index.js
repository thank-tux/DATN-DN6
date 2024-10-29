// /feature/withAdminCheck.js
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { auth, db } from "../firebase/firebase"; // Adjust the path based on your structure
import { doc, getDoc } from "firebase/firestore";

const withAdminCheck = (WrappedComponent) => {
  return (props) => {
    const [loading, setLoading] = useState(true);
    const [userRole, setUserRole] = useState(null);
    const router = useRouter();

    useEffect(() => {
      const unsubscribe = auth.onAuthStateChanged(async (user) => {
        if (user) {
          const userDocRef = doc(db, "users", user.uid);
          const userDocSnap = await getDoc(userDocRef);

          if (userDocSnap.exists()) {
            const userData = userDocSnap.data();
            setUserRole(userData.role);

            if (userData.role !== "admin") {
              //   router.push("/"); // Redirect if not admin
            }
          } else {
            router.push("/"); // Redirect if user document doesn't exist
          }
        }
        setLoading(false);
      });

      return () => unsubscribe();
    }, [router]);

    if (loading) {
      return (
        <h3 class="text-3xl font-bold text-black text-center py-4 mt-10">
          Loading...{" "}
        </h3>
      );
    }

    if (userRole !== "admin") {
      return (
        <h1 class="text-3xl font-bold text-black text-center py-4 mt-10">
          Bạn không có quyền truy cập hoặc trang này không tồn tại{" "}
        </h1>
      );
    }

    return <WrappedComponent {...props} />;
  };
};

export default withAdminCheck;
