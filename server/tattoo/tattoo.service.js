const Tattoo = require('./tattoo.model');
const errorMessages = require('../helpers/errorMessages');
const imageService = require('../helpers/imageService');

const tattooService = {};

tattooService.getAll = (params = {}) => new Promise((resolve, reject) => {
    Tattoo.find(params)
        .then(tattoos => resolve(tattoos))
        .catch(error => reject(error || errorMessages.TATTOO_NOT_FOUND));
});

tattooService.getById = id => new Promise((resolve, reject) => {
    Tattoo.getById(id)
        .then(tattoo => resolve(tattoo))
        .catch(error => reject(error || errorMessages.TATTOO_NOT_FOUND));
});

tattooService.getByParams = (params = {}) => new Promise((resolve, reject) => {
    Tattoo.findOne(params)
        .then(tattoo => resolve(tattoo))
        .catch(error => reject(error || errorMessages.TATTOO_NOT_FOUND));
});

tattooService.create = (tattoo, imageBase64) => new Promise((resolve, reject) => {
    const imagemPromise = imageBase64 !== undefined
        ? imageService.save(imageBase64, tattoo, imageService.IMAGES_TATTOO_PATH)
        : Promise.resolve();

    return imagemPromise.then(imagePath => {
        tattoo.imagePath = imagePath;
        newTattoo = new Tattoo(tattoo);

        return newTattoo.save()
            .then(savedTatto => resolve(savedTatto))
            .catch(error => reject(error || errorMessages.TATTOO_SAVE));
    }).catch(error => reject(error || errorMessages.TATTOO_SAVE));
});

tattooService.update = tattoo => new Promise((resolve, reject) => {
    Tattoo._findByIdAndUpdate(tattoo._id, appointment, { new: true })
        .then(updatedTattoo => resolve(updatedTattoo))
        .catch(error => reject(error || errorMessages.TATTOO_UPDATE));
});

tattooService.delete = id => new Promise((resolve, reject) => {
    tattooService.getById(id)
        .then(tattoo => {
            Tattoo.remove({ _id: id })
                .then(() => resolve(id))
                .catch(error => reject(error || errorMessages.TATTOO_DELETE));
        })
        .catch(erro => reject(erro));
});

module.exports = tattooService;