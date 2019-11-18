const Studio = require('./studio.model');
const errorMessages = require('../helpers/errorMessages');
const artistService = require('../artist/artist.service');

const studioService = {};

studioService.getAll = (params = {}) => new Promise((resolve, reject) => {
    Studio.find({ "name": { "$regex": params.name || "", "$options": "i" } })
        .then(studios => resolve(studios))
        .catch(error => reject(error || errorMessages.STUDIO_NOT_FOUND));
});

studioService.getById = id => new Promise((resolve, reject) => {
    Studio.getById(id)
        .then(studio => resolve(studio))
        .catch(error => reject(error || errorMessages.STUDIO_NOT_FOUND));
});

studioService.getByParams = (params) => new Promise((resolve, reject) => {
    Studio.findOne(params)
        .then(studio => resolve(studio))
        .catch(error => reject(error || errorMessages.STUDIO_NOT_FOUND));
});

studioService.create = studio => new Promise((resolve, reject) => {
    newStudio = new Studio(studio);
    newStudio.save()
        .then(savedStudio => resolve(savedStudio))
        .catch(error => reject(error || errorMessages.STUDIO_SAVE));
});

studioService.update = (studioId, studio) => new Promise((resolve, reject) => {
    Studio._findByIdAndUpdate(studioId, studio, { new: true })
        .then(updatedStudio => resolve(updatedStudio))
        .catch(error => reject(error || errorMessages.STUDIO_UPDATE));
});

studioService.delete = id => new Promise((resolve, reject) => {
    studioService.getById(id)
        .then(studio => {
            Studio.remove({ _id: id })
                .then(() => resolve(id))
                .catch(error => reject(error || errorMessages.STUDIO_DELETE));
        })
        .catch(erro => reject(erro));
});

studioService.getStudioWorkTimeBySchedule = (scheduleId, date) => new Promise((resolve, reject) => {
    console.log(artistService)
    resolve({ morning: [8, 12], afternoon: [14, 18], night: [] })
    artistService.getByParams({ schedule: scheduleId })
        .then(artist => {
            if (!artist.inStudio) resolve({ morning: [8, 12], afternoon: [14, 18], night: [] })

            const dayOfWeek = date.getDay();
            const day = dayOfWeek < 5 ? 'week' : dayOfWeek === 5 ? 'saturday' : 'sunday';
            resolve(artist.studio.workTime[day] || { morning: [], afternoon: [], night: [] })
        })
        .catch(error => reject(error || errorMessages.STUDIO_NOT_FOUND));
});

studioService.artistRequest = (studioId, artistId) => new Promise((resolve, reject) => {
    Studio._artistRequest(studioId, artistId)
        .then(studio => resolve(studio))
        .catch(error => reject(error || errorMessages.STUDIO_NOT_FOUND));
});

studioService.acceptArtist = (studioId, response) => new Promise((resolve, reject) => {
    Studio._acceptArtist(studioId, response)
        .then(studio => {
            artistService.update(response.artistId, { inStudio: true })
                .then(() => resolve(studio))
                .catch(error => reject(error || errorMessages.STUDIO_NOT_FOUND));
        })
        .catch(error => reject(error || errorMessages.STUDIO_NOT_FOUND));
});

module.exports = studioService;