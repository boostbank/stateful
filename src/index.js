const CreateStoreDecorator = require("./decorators/CreateStoreDecorator");
const CreateSubStoreDecorator = require("./decorators/CreateSubStoreDecorator");
const GetStoreDecorator = require("./decorators/GetStoreDecorator");

const createPartition = require("./utils/createPartition");

module.exports = {
  createPartition,
  createStore: new CreateStoreDecorator(),
  createSubStore: new CreateSubStoreDecorator(),
  getStore: new GetStoreDecorator()
};
