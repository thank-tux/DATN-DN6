import { useContext, useEffect, useState } from "react";
import TextInput from "@/components/text-input";
import LayoutForm from "@/components/layout-form";
import Link from "next/link";
import {
  signInWithEmailAndPassword,
  signOut,
  getItem,
} from "@/feature/firebase/firebaseAuth";
import { useRouter } from "next/router";
import { validate } from "@/feature/validation";
import AuthContext from "@/feature/auth-context";

export default function Login() {
  const { userInfo } = useContext(AuthContext);
  const router = useRouter();
  const [account, setAccount] = useState("");
  const [password, setPassword] = useState("");
  const [errorInput, setErrorInput] = useState({});
  
  const handleLogin = async () => {
    const listInput = [
      {
        type: "password",
        input: password,
      },
      {
        type: "account",
        input: account,
      },
    ];
    setErrorInput(validate(listInput));
    if (Object.keys(errorInput).length === 0) {
      const { result, error } = await signInWithEmailAndPassword(account, password);
      
      if (!error) {
        const id = result.user.uid;
        const user = await getItem("users", id);
        if (!user || user.role !== "admin") {
          alert("Thông tin tài khoản hoặc mật khẩu không chính xác");
          await signOut();
        } else {
          await signOut(); // Tự động đăng xuất tài khoản cũ
          router.push("/admin/dashboard"); // Điều hướng đến trang /admin/dashboard
        }
      } else {
        alert("Thông tin tài khoản hoặc mật khẩu không chính xác");
      }
    }
  };

  useEffect(() => {
    if (userInfo) {
      // Kiểm tra nếu người dùng có quyền "admin"
      if (userInfo.role === "admin") {
        router.push("/admin/dashboard"); // Điều hướng đến /admin/dashboard nếu là admin
      } else {
        router.push("/user"); // Nếu không phải admin, điều hướng đến /user
      }
    }
  }, [userInfo]);
  

  return (
    
    <LayoutForm>
      
      <h2 className="oswald uppercase text-4xl mt-10">Đăng nhập</h2>
      <TextInput
        name="Nhập địa chỉ email của bạn"
        value={account}
        callback={(text) => setAccount(text)}
        error={errorInput.account}
      />
      <TextInput
        name="Nhập mật khẩu"
        value={password}
        callback={(text) => setPassword(text)}
        type="password"
        error={errorInput.password}
      />
      <div className="text-right mt-10 text-sm cursor-pointer">
        Bạn quên mật khẩu ?
      </div>
      <button
        onClick={handleLogin}
        className="w-[100%] p-4 bg-[#28a745] rounded-full text-white font-bold roboto btn-shadow my-4"
      >
        Đăng nhập
      </button>
      <div className="text-center">
        <span className="text-sm">Chưa có tài khoản? </span>
        <Link
          className="font-semibold text-sm hover:underline"
          href={"/register"}
        >
          Tạo tài khoản
        </Link>
      </div>
    </LayoutForm>
  );
}