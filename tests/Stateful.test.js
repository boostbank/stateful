var { getInstance, newInstance } = require("./../src/stateful");
const stateful = getInstance();
describe("Stateful Tests", () => {
  beforeEach(() => {
    stateful.clear();
  });

  stateful.createStore({}, 2);

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
    stateful.createStore();
    stateful.subscribe(store => {
      expect(store).not.toBe(undefined);
    });
    stateful.modify(store => {
      store.test = "test";
      testingStore = store;
      return store;
    });
    expect(stateful.getState().test).toBe("test");
  });
  it("Should subscribe to state change then unsubscribe and not recieve the change", () => {
    let callCount = 0;
    const subscribeMethod = store => {
      callCount++;
      expect(store).not.toBe(undefined);
    };
    let testingStore = undefined;
    stateful.createStore();
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
    expect(callCount).toBe(2);
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
    const localStateful = newInstance().createStore({test: "test"}, 2);
    expect(localStateful.getState().test).toBe("test");
    localStateful.modify(store => {
      store.test = "test2";
      return store;
    });
    expect(localStateful.getState().test).toBe("test2");
    localStateful.rollback();
    expect(localStateful.getState().test).toBe("test");
    localStateful.rollback();
    expect(localStateful.getState().test).toBe("test");
  });

  it("Should rollback the state async", done => {
    const who = {};

    stateful.modify(store => {
      store.test = "test";
      return store;
    });
    expect(stateful.getState().test).toBe("test");
    stateful.modify(store => {
      store.test = "test2";
      return store;
    });

    stateful.subscribe((store, modified) => {
      modified(who);
    });

    expect(stateful.getState().test).toBe("test2");
    stateful.rollbackAsync(who, () => {
      expect(stateful.getState().test).toBe("test");
      done();
    });
  });

  it("Should rollback the state async no callback", () => {
    const who = {};

    stateful.modify(store => {
      store.test = "test";
      return store;
    });
    expect(stateful.getState().test).toBe("test");
    stateful.modify(store => {
      store.test = "test2";
      return store;
    });

    stateful.subscribe((store, modified) => {
      modified(null);
    });

    expect(stateful.getState().test).toBe("test2");
    stateful.rollbackAsync(who, () => {
      throw new Error("This should not be called");
    });
    expect(stateful.getState().test).toBe("test");
  });

  it("Should make a new instance", () => {
    const instance = newInstance();
    expect(instance).not.toBe(getInstance());
    expect(getInstance()).toBe(getInstance());
  });
  it("It should keep adding with no limit", () => {
    const instance = newInstance();
    instance.modify(()=> {
      return {test: "test"};
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
    const instance = newInstance().createStore({});
    instance.modify("test");
    expect(JSON.stringify(instance.getState())).toBe(JSON.stringify({}));
  });
  it("It should not modify when not passing an object", () => {
    const instance = newInstance().createStore({});
    instance.modify(store => {
      store.test = "test3";
      return 1;
    });
    expect(JSON.stringify(instance.getState())).toBe(JSON.stringify({}));
  });
  it("It should not subscribe when not passing a function", () => {
    const instance = newInstance().createStore({});
    instance.subscribe("test");
    instance.modify(store => {
      store.test = "test";
      return store;
    });
    expect(instance.getState().test).toBe("test");
  });
  it("It should not unsubscribe when not passing a subscriber", done => {
    let callCount = 0;
    const instance = newInstance().createStore({});
    instance.subscribe(store => {
      if (callCount > 0) {
        expect(store.test).toBe("test");
      }
      callCount++;
      if(callCount >= 3){
        expect(callCount).toBe(3);
        done();
      }
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
  });

  it("It should modify async", done => {
    let callCount = 0;

    const who = {};

    const instance = newInstance().createStore({});
    instance.subscribe((store, modified) => {
      if (callCount > 0) {
        expect(store.test).toBe("test");
        modified(who);
      }
      callCount++;
    });
    instance.modifyAsync(
      who,
      store => {
        store.test = "test";
        return store;
      },
      () => {
        done();
      }
    );
  });

  it("It should modify async and not callback", () => {
    let callCount = 0;
    const instance = newInstance().createStore({test: "test"});

    const who = {};

    instance.subscribe((store, modified) => {
      if (callCount > 0) {
        expect(store.test).toBe("test");
        modified(null);
      }
    });
    instance.modifyAsync(
      who,
      store => {
        store.test = "test";
        return store;
      },
      () => {
        throw new Error("This should not be called.");
      }
    );

    expect(instance.getState()).toEqual({ test: "test" });
  });
});
