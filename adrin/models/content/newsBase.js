var mongoose = require('lib/mongoose'),
    Schema = mongoose.Schema;

var User = require('models/user').User;

/*
 Content.find({})
 .populate('users.id')
 .exec(function(error, content) {
 console.log(JSON.stringify(content, null, "\t"))
 });
 */

var baseContent = {
    users: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    url:{
        type: String,
        trim: true,
        unique: true,
        required: true,
        match: [/https?:\/\/.*/, 'Please fill a valid url address']
    },
    description:{
        type:String,
        required: true,
        default: "Some default information"
    }
};


module.exports = { schemaName: 'Content', baseProperties: baseContent};


/*

 var schema = new Schema(obj);

 schema.methods.addUserById = function (id) {

 this.users.addToSet(id);
 /*
 /*
 mongoose.models.Content.update(
 {_id: this._id},
 {$addToSet: {users: id}},
 function (err, numAffected) {
 if (err) throw err;
 });
 */
/*
 };

 schema.methods.getObj = function () {
 return obj
 };


 schema.methods.deleteUserById = function (id) {
 this.users.delete(id);
 };

 exports.Content = mongoose.model('Content', schema);

 */