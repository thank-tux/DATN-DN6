import React, { useState, useContext, useEffect } from "react";
import AuthContext from "@/feature/auth-context";
import UserBody from "@/components/user-body";
import TextInput from "@/components/text-input";

export default function User() {
  const { userInfo } = useContext(AuthContext);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [phone, setPhone] = useState("");
  useEffect(() => {
    if (userInfo) {
      setName(userInfo.displayName);
      setEmail(userInfo.email);
      setPhone(userInfo.phoneNumber ? userInfo.phoneNumber : "");
      setLoading(true);
    }
  }, [userInfo]);
  console.log(userInfo);
  return loading ? (
    <UserBody>
      <div className="md:w-[550px]">
        <h2 className="oswald uppercase text-4xl">chi tiết tài khoản</h2>
        <TextInput
          name={"Tên của bạn"}
          callback={(text) => setName(text)}
          value={name}
        />
        <TextInput
          name={"Email của bạn"}
          callback={(text) => setEmail(text)}
          value={email}
          disabled={true}
        />
        <TextInput
          name={"Số điện thoại của bạn"}
          callback={(text) => setPhone(text)}
          value={phone}
        />
        <button className="btn-shadow w-[100%] rounded-full my-4 p-4 bg-red-600  text-white font-bold">
          Cập nhật tài khoản
        </button>
      </div>
    </UserBody>
  ) : null;
}
