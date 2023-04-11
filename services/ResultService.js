class ResultService {
    constructor(db) {
        this.client = db.sequelize;
        this.Result = db.Result;
    }

    async getOne(userId) {
        return this.Result.findOne({
            where: {UserId: userId}
        })
    }


    async create(operationName, value, userId) {
        const model = this.Result;
        return model.findOne({
            where: {UserId: userId}
        }).then(function(result) {
            if(result) {
                return model.update({
                    OperationName: operationName,
                    Value: value,
                }, {where: {UserId: userId}})
            }
            else {
                return model.create({
                    OperationName: operationName,
                    Value: value,
                    UserId: userId
                })
            }
        });
    }
}
module.exports = ResultService;