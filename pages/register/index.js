import { useEffect, useState, useContext } from "react";
import LayoutForm from "@/components/layout-form";
import TextInput from "@/components/text-input";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/router";
import { AiOutlineLoading } from "react-icons/ai";
import { validate } from "@/feature/validation";
import AuthContext from "@/feature/auth-context";

export default function Register() {
  const { userInfo } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [account, setAccount] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [errorInput, setErrorInput] = useState(null);
  const [checkRule, setCheckRule] = useState(null);
  const router = useRouter();
  const authorizeAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).send('Access denied');
    }
    next();
};

  const handleRegister = async () => {
    const listInput = [
      {
        type: "password",
        input: password,
      },
      {
        type: "account",
        input: account,
      },
      {
        type: "phone",
        input: phone,
      },
      {
        type: "name",
        input: name,
      },
      {
        type: "role",
        input: role,
      },
    ];
    setErrorInput(validate(listInput));
  };
  const postData = async () => {
    const role = account === 'lamadmin@gmail.com' ? 'admin' : 'user';
    setLoading(true);
    const res = await axios.post("/api/auth", {
      account,
      password,
      phone,
      name,
      role,
    });
    const data = await res.data;
    setLoading(false);
    if (data.login) {
      alert("Tạo tài khoản thành công");
      router.push("/login");
    } else {
      alert("Tài khoản đã có người sử dụng");
    }
  };
  useEffect(() => {
    if (userInfo) {
      router.push("/user");
    }
  }, [userInfo]);
  useEffect(() => {
    if (errorInput && Object.keys(errorInput).length === 0) {
      postData();
    }
  }, [errorInput]);

  app.get('/admin/', authorizeAdmin, (req, res) => {
    const database = readDatabase();
    res.status(200).send(database.users);
});
  return (
    <LayoutForm>
      <h2 className="oswald uppercase text-4xl mt-10">Tạo tài khoản mới</h2>
      <TextInput
        name="Nhập họ tên đầy đủ"
        value={name}
        callback={(text) => setName(text)}
        error={errorInput && errorInput.name}
      />
      <TextInput
        name="Nhập số điện thoại"
        value={phone}
        error={errorInput && errorInput.phone}
        callback={(text) => setPhone(text)}
        type="number"
      />
      <TextInput
        name="Nhập địa chỉ email của bạn"
        value={account}
        error={errorInput && errorInput.account}
        callback={(text) => setAccount(text)}
      />
      <TextInput
        name="Nhập mật khẩu"
        value={password}
        error={errorInput && errorInput.password}
        callback={(text) => setPassword(text)}
        type="password"
      />
      <div className="relative flex flex-row items-center my-10">
        <input
          type="checkbox"
          value={checkRule}
          onChange={() => setCheckRule(!checkRule)}
        />
        <span>Tôi đã đọc và đồng ý với</span>
        <span className="font-bold ml-1 capitalize">
          chính sách hoạt động của 
        </span>
        {checkRule === false && (
          <span className="absolute text-xs text-red-400 bottom-[-20px]">
            Bạn chưa đồng ý với điều khoản dịch vụ
          </span>
        )}
      </div>
      <button
        onClick={handleRegister}
        className="relative w-[100%] p-4 bg-[#e4002b] rounded-full text-white font-bold roboto btn-shadow my-4"
      >
        Tạo tài khoản
        <div
          className={`${
            !loading ? "hidden" : "block"
          } absolute top-0 left-0 w-[100%] h-[100%] flex items-center justify-center`}
        >
          <AiOutlineLoading
            className={`top-[24%] right-[47%] animate-spin w-10 h-10 text-red-500`}
          />
        </div>
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