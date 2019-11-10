const Studio = require('./studio.model');
const errorMessages = require('../helpers/errorMessages');

const studioService = {};

studioService.getAll = (params = {}) => new Promise((resolve, reject) => {
    Studio.find(params)
        .then(studios => resolve(studios))
        .catch(error => reject(error || errorMessages.STUDIO_NOT_FOUND));
});

studioService.getById = id => new Promise((resolve, reject) => {
    Studio.getById(id)
        .then(studio => resolve(studio))
        .catch(error => reject(error || errorMessages.STUDIO_NOT_FOUND));
});

studioService.getByParams = (params = {}) => new Promise((resolve, reject) => {
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

module.exports = studioService;