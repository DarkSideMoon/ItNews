var mongoose = require('lib/mongoose'),
    Schema = mongoose.Schema;




var newsDou = {
    title:{
        type: String,
        unique: true,
        required: true
    },
    imageSource:{
        type: String,
        required: false
    },
    contentCategory:{
        type: String,
        default: 'news'
    },
    views:{
        type: Number,
        min: 0,
        default: 0
    },
    author:{
        type: String,
        default: "Some country"
    },
    timeCreating:{
        type: Date,
        default: Date.now()
    },
    comments:[{
        commentNumber: { type:Number, require: true},
        comment: { type: String, require: true}
    }]
};

let extend = require('extend');
var baseContent = require('models/content/contentBase');
var NewsDouSchema = new Schema(extend(baseContent.baseProperties,newsDou));



NewsDouSchema.methods.addUserById = function (id) {
    this.users.addToSet(id);
};


function isUnique(arrayToCheck) {
    if (arrayToCheck.length === 0) {
        return true;
    }

    var uniques = [];

    for (var i = 0; i < arrayToCheck.length; i++){
        var contains = false;
        for (var j = 0; j < uniques.length; j++){
            if (uniques[j].toString() === arrayToCheck[i].toString()) {
                contains = true;
                break;
            }
        }

        if (!contains) uniques.push(arrayToCheck[i]);
    }

    return uniques.length === arrayToCheck.length;
}


NewsDouSchema.pre('save', function (next) {
        next();
});


NewsDouSchema.methods.getLoginAndPassword = function () {
    return { login: 'basicUser', password: '123456'};
};

exports.NewsDou = mongoose.model('newsDou', NewsDouSchema, baseContent.schemaName);
