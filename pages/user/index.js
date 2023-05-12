import React, { useState, useContext, useEffect } from "react";
import AuthContext from "@/feature/auth-context";
import UserBody from "@/components/user-body";
import Loader from "@/components/loader";
import TextInput from "@/components/text-input";

export default function User() {
  const { userInfo } = useContext(AuthContext);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (userInfo) {
      setName(userInfo.displayName);
      setEmail(userInfo.email);
      setLoading(true);
    }
  }, [userInfo]);
  console.log(userInfo);
  return loading ? (
    <UserBody>
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
    </UserBody>
  ) : null;
}
