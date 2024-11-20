export function validateOrder(data) {
    const passw = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
    const vnf_regex = /((09|03|07|08|05)+([0-9]{8})\b)/g;
    const emailRegex = /\S+@\S+\.\S+/;
    const format = /^[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/;
  
    const listObject = {};
  
    // Kiểm tra các trường trống
    if (data.name === "") listObject.name = "Không thể bỏ trống họ tên";
    if (data.phone === "") listObject.phone = "Không thể bỏ trống số điện thoại";
    if (data.email === "") listObject.email = "Không thể bỏ trống địa chỉ email";
    if (data.home === "") listObject.home = "Không thể bỏ trống số nhà";
    if (data.wards === "") listObject.wards = "Không thể bỏ trống phường/xã";
    if (data.district === "") listObject.district = "Không thể bỏ trống quận";
    if (data.city === "") listObject.city = "Không thể bỏ trống thành phố";
  
    // Kiểm tra định dạng email
    if (data.email && !emailRegex.test(data.email)) {
      listObject.email = "Địa chỉ email không hợp lệ";
    }
  
    // Kiểm tra định dạng số điện thoại
    if (data.phone && !vnf_regex.test(data.phone)) {
      listObject.phone = "Số điện thoại không đúng định dạng";
    }
  
    // Kiểm tra họ tên không chứa ký tự đặc biệt
    if (data.name && format.test(data.name)) {
      listObject.name = "Tên không được chứa ký tự đặc biệt";
    }
  
    // Kiểm tra điều khoản
    if (!data.rule) {
      listObject.rule = "Bạn cần đồng ý với Chính sách hoạt động";
    }
  
    return listObject;
  }
  