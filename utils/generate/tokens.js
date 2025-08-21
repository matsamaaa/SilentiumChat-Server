class Token {
    static generateToken() {
        const caracters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        const caractersList = caracters.split('');
        let token = '';
        for(let i = 0; i < 80; i++) {
            const rdm = this.getRandomInt(0, caractersList.length - 1);
            token+=caractersList[rdm];
        }

        return token;
    }

    static getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    static async isAuthenticated(req) {
        const token = req.headers.authorization?.split(' ')[1];
        
        return false;
    }
}

export default Token;