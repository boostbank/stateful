const CreateStoreDecorator = require("./decorators/CreateStoreDecorator");

const createPartition = require('./utils/createPartition');

module.exports = { createPartition, createStore: new CreateStoreDecorator() };
