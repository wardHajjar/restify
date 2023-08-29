export function isValidEmail(email) {
    const emailRegex = /^[a-zA-Z0-9!#$%&'*+=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+=?^_`{|}~-]+)*@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    return emailRegex.test(email);
}
  
export function isValidPassword(password) {
    const lowerRegex = /[a-z]/;
    const upperRegex = /[A-Z]/;
    const numRegex = /[0-9]/;
    const symbRegex = /[!@#$%^&*]/;
    return lowerRegex.test(password) && upperRegex.test(password) && numRegex.test(password) && symbRegex.test(password) && password.length > 8;
}
  
export function isValidPhoneNumber(phoneNumber) {
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(phoneNumber);
}

