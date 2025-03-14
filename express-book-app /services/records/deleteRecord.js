import recordData from "../../data/records.json" with { type: "json" };
import NotFoundError from "../../errors/NotFoundError.js";

const deleteRecord = (id) => {
    const index = recordData.records.findIndex((record) => record.id === id);

  if (index === -1) {
    throw new NotFoundError("Record", id);
  }

  recordData.records.splice(index, 1);
  return id;
};

export default deleteRecord;
