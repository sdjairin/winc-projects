import recordData from '../../data/records.json' with { type: 'json' };
import notFoundError from '../../errors/NotFoundError.js';

const updateRecordById = (id, title, artist, year, available, genre) => {
    const record = recordData.records.find((record) => record.id === id);

    if (!record) {
        throw new notFoundError('Record', id);
    }

    record.title = title ?? record.title;
    record.artist = artist ?? record.artist;
    record.year = year ?? record.year;
    record.available = available ?? record.available;
    record.genre = genre ?? record.genre;

    return record;
};

export default updateRecordById;