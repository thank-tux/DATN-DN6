export function validatePassword(password) {
  var passw = /^[A-Za-z]\w{7,14}$/;
  if (password.value.match(passw)) {
    return true;
  } else {
    return false;
  }
}
