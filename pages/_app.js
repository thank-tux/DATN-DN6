// pages/_app.js
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
import Loading from "@/components/loading"; // Import Loading component
import Modal from "@/components/alert"; // Import Modal component

export default function App({ Component, pageProps }) {
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(null);
  const [showModal, setShowModal] = useState(false); 
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        if (!userRole) {
          const userDocRef = doc(db, 'users', user.uid); 
          const userDocSnap = await getDoc(userDocRef);

          if (userDocSnap.exists()) {
            const userData = userDocSnap.data();
            setUserRole(userData.role);

          
            if (userData.role !== 'admin' && router.pathname.startsWith('/admin')) {
              setShowModal(true); 
            }
          } else {
            router.push('/'); 
          }
        }
      } else {
        router.push('/login'); 
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router, userRole]);

  const closeModal = () => {
    setShowModal(false);
    router.push('/'); 
  };

  if (loading) return <Loading />; 

  if (showModal) {
    return <Modal message="Bạn không đủ quyền truy cập vào trang này" onClose={closeModal} />; // Hiển thị modal nếu không phải admin
  }

  const LayoutComponent = Component.layout || Layout;
  return (
    <AuthContextProvider>
      <LayoutComponent>
        <Component {...pageProps} />
      </LayoutComponent>
    </AuthContextProvider>
  );
}
