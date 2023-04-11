class UserService {
    constructor(db) {
        this.client = db.sequelize;
        this.User = db.User;
    }

    async getOne(email) {
        return this.User.findOne({
            where: {Email: email}
        })
    }

    async create(name, email, encryptedPassword, salt) {
        return this.User.create({
            Name: name,
            Email: email,
            EncryptedPassword: encryptedPassword,
            Salt: salt
        })
    }
}

module.exports = UserService;