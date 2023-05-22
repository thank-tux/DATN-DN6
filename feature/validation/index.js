export function validate({ type, input }) {
  const passw = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
  const vnf_regex = /((09|03|07|08|05)+([0-9]{8})\b)/g;
  const emailRegex = /\S+@\S+\.\S+/;
  const format = /^[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/;
  let error = null;
  if (input === "") {
    error = "Không thể bỏ trống mục này";
  } else {
    if (type === "password" && passw.test(input) === false) {
      error =
        "Mật khẩu phải dài ít nhất 8 ký tự và chứa ít nhất một chữ thường, một chữ in hoa và một chữ số";
    }
    if (type === "phone" && vnf_regex.test(input) === false) {
      error = "Số điện thoại của bạn không đúng định dạng";
    }
    if (type === "email" && !emailRegex.test(input)) {
      error = "Email không chính xác";
    }
    if (type === "name" && string.match(format)) {
      error = "Tên không chứ kí tự đặc biệt";
    }
  }
  // console.log(type, input, error);
  return { error };
}
