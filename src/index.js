const CreateStoreDecorator = require("./decorators/CreateStoreDecorator");

module.exports = { createStore: new CreateStoreDecorator(), createSubStore };
