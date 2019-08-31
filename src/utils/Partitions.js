const Stateful = require("../stateful");
const SubStore = require("../substore");
const DEFAULT_PARTITION = "stateful-shared";
const Partition = require("./Partition");

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

class Partitions {
  constructor() {
    this.locked = true;
    this.partitions = {};
    this.partitions[DEFAULT_PARTITION] = new Partition();
    this.createPartition = this.createPartition.bind(this);
    this.createStore = this.createStore.bind(this);
    this.createSubStore = this.createSubStore.bind(this);
    this.get = this.get.bind(this);
    this.lock = this.lock.bind(this);
    this.unlock = this.unlock.bind(this);
    this.reset = this.reset.bind(this);
  }

  createPartition(id = DEFAULT_PARTITION) {
    let created = false;
    if(typeof id === "string"){
      if (this.partitions[id] === undefined || this.partitions[id] === null) {
        const partition = new Partition();
        this.partitions[id] = partition;
        created = this.partitions[id] === partition;
      } else {
        throw new Error("Partition already exists!");
      }
    }else{
      throw new Error("You must use a string for the partition id!");
    }
    return created;
  }

  createStore(id = DEFAULT_PARTITION, store = {}, depth = 0) {
    let created = false;
    let mainStore = null;
    if (this.partitions[id] !== undefined && this.partitions[id] !== null) {
      const working = this.partitions[id];
      if (working.global === null || working.global === undefined) {
        const toCreate = new Stateful();
        working.setGlobal(toCreate.init(store, depth));
        this.partitions[id] = working;
        created = this.partitions[id].global === toCreate;
        mainStore = this.partitions[id].global;
      } else {
        throw new Error(`You have already created a store on this partition! Partition: ${id}`);
      }
    }
    return {created, store: mainStore};
  }

  createSubStore(id = DEFAULT_PARTITION, uid = "", store = {}, depth = 0) {
    let created = false;
    let subStore = null;
    if (this.partitions[id] !== undefined && this.partitions[id] !== null) {
      const toCreate = new SubStore();
      const working = this.partitions[id];
      if (working.subStore === null || working.subStore === undefined) {
        working.setSubStore(toCreate.init(uid, store, depth));
        this.partitions[id] = working;
        created = working.subStore === toCreate.subStores[uid];
        subStore = toCreate.subStores[uid];
      } else {
        throw new Error(`You have already created a subStore on this partition! Partition: ${id}`);
      }
    }
    return {created, store: subStore};
  }

  get(id = DEFAULT_PARTITION) {
    let store = null;
    if (this.partitions[id] !== undefined && this.partitions[id] !== null) {
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

  lock(){
    this.locked = true;
  }

  unlock(){
    this.locked = false;
  }

  reset(){
    if(this.locked){
      throw new Error("You cannot clear this because its locked!");
    }else{
      this.partitions = {};
      this.partitions[DEFAULT_PARTITION] = new Partition();
      this.lock();
    }
  }

}

module.exports = getInstance();
