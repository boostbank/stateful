var Stateful = require("./../src/stateful");
const stateful = new Stateful();
describe("Stateful Tests", () => {
  beforeEach(() => {
    stateful.clear();
  });

  stateful.init({}, 2);

  it("Should set the state", () => {
    stateful.modify(store => {
      store.test = "test";
      return store;
    });
    expect(stateful.getState().test).toBe("test");
  });
  it("Should set the state and not be the same object", () => {
    stateful.modify(store => {
      store.test = "test";
      return store;
    });
    const state = stateful.getState();
    expect(state.test).toBe("test");
    stateful.modify(store => {
      store.test = "test";
      return store;
    });
    expect(stateful.getState()).not.toBe(state);
  });
  it("Should subscribe to state change", () => {
    let testingStore = undefined;
    stateful.init();
    stateful.subscribe(store => {
      expect(testingStore).toEqual(store);
    });
    stateful.modify(store => {
      store.test = "test";
      testingStore = store;
      return store;
    });
    expect(stateful.getState().test).toBe("test");
  });
  it("Should subscribe to state change then unsubscrive and not recieve the change", () => {
    let callCount = 0;
    const subscribeMethod = store => {
      callCount++;
      expect(testingStore).toEqual(store);
    };
    let testingStore = undefined;
    stateful.init();
    stateful.subscribe(subscribeMethod);
    stateful.modify(store => {
      store.test = "test";
      testingStore = store;
      return store;
    });
    expect(stateful.getState().test).toBe("test");
    stateful.unsubscribe(subscribeMethod);
    stateful.modify(store => {
      store.test = "test2";
      return store;
    });
    expect(callCount).toBe(1);
  });
  it("Should clear the state", () => {
    stateful.modify(store => {
      store.test = "test";
      return store;
    });
    expect(stateful.getState().test).toBe("test");
    stateful.clear();
    expect(JSON.stringify(stateful.getState())).toBe(JSON.stringify({}));
  });
  it("Should rollback the state", () => {
    stateful.modify(store => {
      store.test = "test";
      return store;
    });
    expect(stateful.getState().test).toBe("test");
    stateful.modify(store => {
      store.test = "test2";
      return store;
    });
    expect(stateful.getState().test).toBe("test2");
    stateful.rollback();
    expect(stateful.getState().test).toBe("test");
    stateful.rollback();
    expect(stateful.getState().test).toBe("test");
  });
  it("Should make a new instance", () => {
    const instance = new Stateful();
    expect(instance).not.toBe(stateful);
    expect(stateful).toBe(stateful);
  });
  it("It should keep adding with no limit", () => {
    const instance = new Stateful();
    instance.modify(store => {
      store.test = "test";
      return store;
    });
    expect(instance.getState().test).toBe("test");
    instance.modify(store => {
      store.test = "test2";
      return store;
    });
    expect(instance.getState().test).toBe("test2");
    instance.modify(store => {
      store.test = "test3";
      return store;
    });
    expect(instance.getState().test).toBe("test3");
  });
  it("It should not modify state when not passing modifier as a function", () => {
    const instance = new Stateful();
    instance.modify("test");
    expect(JSON.stringify(instance.getState())).toBe(JSON.stringify({}));
  });
  it("It should not modify when not passing an object", () => {
    const instance = new Stateful();
    instance.modify(store => {
      store.test = "test3";
      return 1;
    });
    expect(JSON.stringify(instance.getState())).toBe(JSON.stringify({}));
  });
  it("It should not subscribe when not passing a function", () => {
    const instance = new Stateful();
    instance.subscribe("test");
    instance.modify(store => {
      store.test = "test";
      return store;
    });
    expect(instance.getState().test).toBe("test");
  });
  it("It should not unsubscribe when not passing a subscriber", () => {
    let callCount = 0;
    const instance = new Stateful();
    instance.subscribe(store=>{
      callCount++;
      expect(store.test).toBe("test");
    });
    instance.modify(store => {
      store.test = "test";
      return store;
    });
    instance.unsubscribe("test");
    instance.modify(store => {
      store.test = "test";
      return store;
    });
    expect(callCount).toBe(2);
  });
});
