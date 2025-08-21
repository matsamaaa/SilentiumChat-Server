class Ids {
    static generateId(id) {
        return String(id).padStart(20, "0");
    }
}

export default Ids;