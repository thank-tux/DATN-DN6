import "@/styles/globals.css";
import { AuthContextProvider } from "@/feature/auth-context";
import 'font-awesome/css/font-awesome.css'; 
import "@fortawesome/fontawesome-free/css/all.min.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Layout from "@/components/layout"; 
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { auth, db } from '@/feature/firebase/firebase'; 
import { doc, getDoc } from 'firebase/firestore';

export default function App({ Component, pageProps }) {
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        // Kiểm tra nếu đã có userRole, tránh lặp lại hành động.
        if (!userRole) {
          const userDocRef = doc(db, 'users', user.uid); 
          const userDocSnap = await getDoc(userDocRef);

          if (userDocSnap.exists()) {
            const userData = userDocSnap.data();
            setUserRole(userData.role);

            if (userData.role !== 'admin') {
              router.push('/'); // Chuyển hướng nếu không phải admin
            }
          } else {
            router.push('/'); // Chuyển hướng nếu không tìm thấy document user
          }
        }
      } else {
        router.push('/login'); // Chuyển hướng khi không đăng nhập
      }
      setLoading(false); // Chỉ set loading sau khi hoàn thành kiểm tra
    });

    return () => unsubscribe();
  }, [router, userRole]); // Thêm userRole vào dependency để không gọi lại khi đã có userRole

  if (loading) return <div>Loading...</div>; // Hiển thị loading trong khi chờ

  const LayoutComponent = Component.layout || Layout;
  return (
    <AuthContextProvider>
      <LayoutComponent>
        <Component {...pageProps} />
      </LayoutComponent>
    </AuthContextProvider>
  );
}
