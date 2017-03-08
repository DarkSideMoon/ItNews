// ==============================================
// 		       Model class for user
// ==============================================
'use strict';

let that;
let user = {
    name: '',
    email: '',
    created: Date,
    subscriptions: []
};

function User(name, email, created, subscriptions) {
    this.user = { };
    this.user.name = name;
    this.user.email =email;
    this.user.created = created;
    this.user.subscriptions = subscriptions;

    that = this;

    that.getUserInfo = () => {
        return this.user.name +
        '\nEmail: ' + this.user.email + 
        '\nCreated: ' + this.user.created + 
        '\nSubscriptions: ' + this.user.subscriptions;
    }

    that.getUser = () => {
        return this.user;
    }
}

module.exports = User;