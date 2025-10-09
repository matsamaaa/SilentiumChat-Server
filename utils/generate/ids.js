import Token from "./tokens.js";

class Ids {
    static generateId(id) {
        return String(id).padStart(20, "0");
    }

    static generateAvatarId() {
        const caracters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        const caractersList = caracters.split('');
        let id = '';
        for(let i = 0; i < 20; i++) {
            const rdm = Token.getRandomInt(0, caractersList.length - 1);
            id+=caractersList[rdm];
        }

        return id;
    }
}

export default Ids;