const Scopes = require('../utils/Scopes');
const uuid = require('uuid/v4');

class CreateStoreDecorator{
    constructor(){
    }

    withScope(store){
        Scopes.create(store, uuid);
    }

    shared(){

    }

}

module.exports = CreateStoreDecorator;