class PasswordValidator {
    static isValidPassword(password) {
        return /^(?=.*[A-Z])(?=.*[!@#$&*]).{8,}$/.test(password);
    }

    static isSamePassword(password1, password2) {
        return password1 === password2;
    }
}

export default PasswordValidator;
