const Stateful = require("../stateful");
const SubStore = require("../substore");
const DEFAULT_PARTITION = "stateful-shared";
const Partition = require('./Partition');

let instance = null;

/**
 * @returns {Partitions}
 */
const getInstance = () => {
  if (instance === null || instance === undefined) {
    instance = new Partitions();
  }
  return instance;
};

const createPartition = (id = DEFAULT_PARTITION, partitions, store = {}, depth = 0)=>{
  const partition = new Partition();
  const toCreate = new Stateful();
  partition.setGlobal(toCreate.init(store, depth));
  partitions[id] = partition;
  return partition;
};

class Partitions {
  constructor() {
    this.partitions = {};
    this.createStore = this.createStore.bind(this);
    this.get = this.get.bind(this);
  }

  createStore(id = DEFAULT_PARTITION, store = {}, depth = 0) {
    let created = false;
    if (this.partitions[id] === undefined || this.partitions[id] === null) {
      const partition = createPartition(id, this.partitions, store, depth);
      this.partitions[id] = partition;
      created = this.partitions[id] === partition;
    }else{
      const possible = this.partitions[id];
      if(possible !== null && possible !== undefined){
        const working = possible;
        if(working.global === null || working.global === undefined){
          const toCreate = new Stateful();
          working.setGlobal(toCreate.init(store, depth));
          this.partitions[id] = working;
          created = this.partitions[id].global === toCreate;
        }
      }
    }
    return {created, id};
  }

  createSubStore(uid = "", store = {}, depth = 0, id = DEFAULT_PARTITION) {
    let created = false;
    if (this.partitions[id] === undefined || this.partitions[id] === null) {
      const toCreate = new SubStore();
      toCreate.init(uid, store, depth);
      this.partitions[id] = toCreate;
      created = this.partitions[id] === toCreate;
    }
    return created;
  }

  get(id = DEFAULT_PARTITION) {
    let store = undefined;
    if (this.partitions[id] !== undefined) {
      store = this.partitions[id];
    }
    return store;
  }

  /**
   * @static
   * @method getDefaultScope Gets default scope.
   * @returns {String}
   */
  getDefaultScope() {
    return DEFAULT_PARTITION;
  }
}

module.exports = getInstance();
