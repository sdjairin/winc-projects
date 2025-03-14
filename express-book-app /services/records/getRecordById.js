import recordData from '../../data/records.json' with { type: 'json' };
import notFoundError from '../../errors/NotFoundError.js';

const getRecordById = (id) => {
    if (!id) {
        throw new notFoundError('Record', id);
    }

    return recordData.records.find((record) => record.id === id);
};

export default getRecordById;
