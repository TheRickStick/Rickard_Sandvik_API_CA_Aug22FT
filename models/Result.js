module.exports = (sequelize, Sequelize) => {
    const Result = sequelize.define('Result', {
        OperationName: Sequelize.DataTypes.STRING,
        Value: Sequelize.DataTypes.INTEGER
    },{
        timestamps: false
    });
    Result.associate = function(models) {
        Result.belongsTo(models.User);
    };
    return Result
}