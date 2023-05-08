import { useState } from "react";
import TextInput from "@/components/text-input";
import LayoutForm from "@/components/layout-form";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";
import {
  signInWithEmailAndPassword,
  signOut,
  signInGoogle,
  getItem,
} from "@/feature/firebase/firebaseAuth";
import { useRouter } from "next/router";

export default function Login() {
  const router = useRouter();
  const [account, setAccount] = useState("");
  const [password, setPassword] = useState("");
  const handleLogin = async () => {
    const { result, error } = await signInWithEmailAndPassword(
      account,
      password
    );
    if (!error) {
      const id = result.user.uid;
      const user = await getItem("users", id);
      if (!user) {
        await signOut();
      } else {
        router.back("/");
      }
    }
  };
  const loginWithGoogle = async () => {
    const { result, error } = await signInGoogle();
    if (!error) {
      router.back("/");
    }
  };
  return (
    <LayoutForm>
      <h2 className="oswald uppercase text-4xl mt-10">Đăng nhập</h2>
      <TextInput
        name="Nhập địa chỉ email của bạn"
        value={account}
        callback={(text) => setAccount(text)}
      />
      <TextInput
        name="Nhập mật khẩu"
        value={password}
        callback={(text) => setPassword(text)}
        type="password"
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
      <div className="font-bold oswald text-[18px]">Hoặc tiếp tục với</div>
      <button
        onClick={loginWithGoogle}
        className="w-[100%] p-4 border border-[#999] rounded-full text-black justify-center font-bold roboto btn-shadow my-4 flex"
      >
        <FcGoogle className="w-5 h-5 mr-2" /> Đăng nhập bằng google
      </button>
      <div className="text-center">
        <span className="text-sm">Chưa có tài khoản ?</span>
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