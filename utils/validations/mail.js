class MailValidator {
    static validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    static isSameEmail(email1, email2) {
        return email1.trim().toLowerCase() === email2.trim().toLowerCase();
    }
}

export default MailValidator;