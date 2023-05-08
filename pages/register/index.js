import { useState } from "react";
import LayoutForm from "@/components/layout-form";
import TextInput from "@/components/text-input";
import Link from "next/link";
import axios from "axios";

export default function Register() {
  const [account, setAccount] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [img, setImg] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    const res = await axios.post("/api/auth", {
      account,
      password,
      phone,
      name,
    });
    const data = res.data;
  };

  return (
    <LayoutForm>
      <h2 className="oswald uppercase text-4xl mt-10">Tạo tài khoản mới</h2>
      <TextInput
        name="Nhập họ tên đầy đủ"
        value={name}
        callback={(text) => setName(text)}
      />
      <TextInput
        name="Nhập số điện thoại"
        value={phone}
        callback={(text) => setPhone(text)}
        type="number"
      />
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
      <div className="flex flex-row items-center my-10">
        <input type="checkbox" />
        <span>Tôi đã đọc và đồng ý với</span>
        <span className="font-bold ml-1 capitalize">
          chính sách hoạt động của KFC
        </span>
      </div>
      <button
        onClick={handleRegister}
        className="w-[100%] p-4 bg-[#e4002b] rounded-full text-white font-bold roboto btn-shadow my-4"
      >
        Tạo tài khoản
      </button>
      <div className="text-center">
        <span className="text-sm">Có tài khoản ?</span>
        <Link className="font-semibold text-sm hover:underline" href={"/login"}>
          Đăng nhập
        </Link>
      </div>
    </LayoutForm>
  );
}
