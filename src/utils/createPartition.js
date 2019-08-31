const Partitions = require("./Partitions");

const createPartition = (id = "") => {
  let created = false;
  if (typeof id === "string" && id.length > 0) {
    created = Partitions.createPartition(id);
  } else {
    throw new Error(
      "Id must be a string and at least one character! (uuid is preferred)"
    );
  }
  return created;
};

module.exports = createPartition;
