import TextInput from "@/components/text-input";
import UserBody from "@/components/user-body";
import { useState } from "react";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  return (
    <UserBody>
      <div className="md:w-[550px]">
        <h2 className="oswald uppercase text-4xl">đặt lại mật khẩu</h2>
        <TextInput
          name="Mật khẩu hiện tại"
          callback={(text) => setPassword(text)}
          value={password}
          type="password"
        />
        <TextInput
          name="Mật khẩu"
          callback={(text) => setNewPassword(text)}
          value={newPassword}
          type="password"
        />
        <TextInput
          name="Xác nhận mật khẩu"
          callback={(text) => setConfirmPassword(text)}
          value={confirmPassword}
          type="password"
        />
        <button className="w-[100%] btn-shadow rounded-full my-4 p-4 bg-red-600  text-white font-bold">
          Đổi mật khẩu
        </button>
      </div>
    </UserBody>
  );
}
