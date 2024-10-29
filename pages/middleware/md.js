// middleware.js
import { NextResponse } from "next/server";
import { auth, db } from "./firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // Kiểm tra nếu người dùng truy cập vào đường dẫn /admin
  if (pathname.startsWith("/admin")) {
    const user = auth.currentUser;

    if (user) {
      // Lấy role của người dùng từ Firestore
      const userDoc = await getDoc(doc(db, "users", user.uid));
      const role = userDoc.exists() ? userDoc.data().role : "";

      if (role !== "admin") {
        // Redirect về trang chủ nếu không phải là admin
        return NextResponse.redirect(new URL("/", request.url));
      }
    } else {
      // Redirect đến trang đăng nhập nếu chưa đăng nhập
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
