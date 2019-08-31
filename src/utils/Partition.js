class Partition {
  constructor() {
    this.global = null;
    this.subStore = null;
  }

  setGlobal(global = null) {
    if (global !== undefined) {
      this.global = global;
    }
  }

  setSubStore(subStore = null) {
    if (subStore !== undefined) {
      this.subStore = subStore;
    }
  }
}

module.exports = Partition;
