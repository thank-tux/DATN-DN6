import { NextResponse } from "next/server";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, getDoc } from "feature/firebase/firebase";

export async function middleware(req) {
  const url = req.nextUrl.clone();

  // Chỉ chạy middleware khi người dùng cố truy cập vào trang admin
  if (!url.pathname.startsWith("/admin")) return NextResponse.next();

  const auth = getAuth();
  const user = auth.currentUser;

  // Nếu người dùng chưa đăng nhập, chuyển hướng đến trang đăng nhập
  if (!user) {
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // Lấy role từ Firestore
  const db = getFirestore();
  const userDocRef = doc(db, "users", user.uid);
  const userDocSnap = await getDoc(userDocRef);

  if (userDocSnap.exists()) {
    const userData = userDocSnap.data();

    // Nếu role là "user", chặn truy cập vào path admin và chuyển hướng về trang chính
    if (userData.role === "user") {
      url.pathname = "/";
      return NextResponse.redirect(url);
    }
  } else {
    // Nếu không tìm thấy dữ liệu người dùng, chuyển hướng về trang chính
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"], // Áp dụng middleware cho tất cả đường dẫn admin
};
