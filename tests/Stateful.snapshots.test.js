var { newInstance } = require("./../src/stateful");
const stateful = newInstance();

describe("Stateful Snapshotting Tests", () => {
  beforeEach(() => {
    stateful.clear();
  });

  it("Should create a snapshot", () => {
    stateful.modify(store => {
      store.message = "test";
      return store;
    });
    stateful.snapshot();

    stateful.modify(store => {
      store.message = "another";
      return store;
    });
    expect(stateful.getState().message).toBe("another");
    expect(stateful.getSnapshot().message).toBe("test");
  });

  it("Should modify and save a snapshot", () => {
    stateful.modifyAndSnapshot(store => {
      store.message = "test";
      return store;
    });

    expect(stateful.getState().message).toBe("test");
    expect(stateful.getSnapshot().message).toBe("test");
  });

  it("Should rollback to a snapshot", () => {
    stateful.modifyAndSnapshot(store => {
      store.message = "test";
      return store;
    });

    stateful.modify(store => {
      store.message = "another";
      return store;
    });

    expect(stateful.getState().message).toBe("another");
    expect(stateful.getSnapshot().message).toBe("test");

    stateful.rollbackToSnapshot();
    
    expect(stateful.getState().message).toBe("test");
    expect(stateful.getSnapshot().message).toBe("test");

  });
});
