const Partitions = require("../src/utils/Partitions");

Partitions.unlock();

describe("Partition Tests", () => {
  beforeEach(() => {
    Partitions.clear();
  });

  it("Creates a global partition", () => {
    expect(Partitions.partitions[Partitions.getDefaultScope()]).not.toBe(
      undefined
    );
  });

  it("Creates a partition", () => {
    const created = Partitions.createPartition("test");
    expect(created).toBe(true);
    expect(Partitions.get("test")).not.toBe(null);
  });

  it("Throws an error when trying to create a bad partition", () => {
    expect(() => {
      Partitions.createPartition(null);
    }).toThrowError();
  });

  it("Throws an error when trying to create a partition that already exists.", () => {
    expect(() => {
      Partitions.createPartition("test");
      Partitions.createPartition("test");
    }).toThrowError();
  });

  it("Creates a store.", () => {
    const created = Partitions.createPartition("test");
    expect(created).toBe(true);
    expect(Partitions.get("test")).not.toBe(null);

    const storeCreate = Partitions.createStore("test");

    expect(storeCreate.created).toBe(true);
    expect(storeCreate.store).not.toBe(null);
  });

  it("Doesn't create duplicate store.", () => {
    const created = Partitions.createPartition("test");
    expect(created).toBe(true);
    expect(Partitions.get("test")).not.toBe(null);

    const storeCreate = Partitions.createStore("test");
    expect(storeCreate.created).toBe(true);
    expect(storeCreate.store).not.toBe(null);

    expect(() => {
      Partitions.createStore("test");
    }).toThrowError();
  });

  it("Creates a subStore.", () => {
    const created = Partitions.createPartition("test");
    expect(created).toBe(true);
    expect(Partitions.get("test")).not.toBe(null);

    const storeCreate = Partitions.createSubStore("test", "test");

    expect(storeCreate.created).toBe(true);
    expect(storeCreate.store).not.toBe(null);
  });

  it("Doesn't create duplicate subStore.", () => {
    const created = Partitions.createPartition("test");
    expect(created).toBe(true);
    expect(Partitions.get("test")).not.toBe(null);

    const storeCreate = Partitions.createSubStore("test", "test");
    expect(storeCreate.created).toBe(true);
    expect(storeCreate.store).not.toBe(null);

    expect(() => {
      const storeCreate = Partitions.createSubStore("test", "test");
    }).toThrowError();
  });

  it("Doesn't create a subStore with no uid.", () => {
    const created = Partitions.createPartition("test");
    expect(created).toBe(true);
    expect(Partitions.get("test")).not.toBe(null);
    expect(() => {
      Partitions.createSubStore("test");
    }).toThrowError();
  });
});
