class PasswordValidator {
    static isValidPassword(password) {
        return /^(?=.*[A-Z])(?=.*[!@#$&*]).{8,}$/.test(password);
    }

    static isSamePassword(password1, password2) {
        if (!password1 || !password2) return false;
        return String(password1).toLowerCase() === String(password2).toLowerCase();
    }
}

export default PasswordValidator;
