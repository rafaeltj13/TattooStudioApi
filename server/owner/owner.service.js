const Owner = require('./owner.model');
const errorMessages = require('../helpers/errorMessages');
const studioService = require('../studio/studio.service');

const ownerService = {};

ownerService.getAll = (params = {}) => new Promise((resolve, reject) => {
    Owner.find(params)
        .then(owners => resolve(owners))
        .catch(error => reject(error || errorMessages.OWNER_NOT_FOUND));
});

ownerService.getById = id => new Promise((resolve, reject) => {
    Owner.getById(id)
        .then(owner => resolve(owner))
        .catch(error => reject(error || errorMessages.OWNER_NOT_FOUND));
});

ownerService.getByParams = (params = {}) => new Promise((resolve, reject) => {
    Owner.findOne(params)
        .then(owner => resolve(owner))
        .catch(error => reject(error || errorMessages.OWNER_NOT_FOUND));
});

ownerService.create = owner => new Promise((resolve, reject) => {
    studioService.create(owner.studio)
        .then(studio => {
            newOwner = new Owner({
                ...owner,
                studio: studio._id,
            });
            newOwner.save()
                .then(savedOwner => resolve(savedOwner))
                .catch(error => reject(error || errorMessages.OWNER_SAVE));
        })
        .catch(error => reject(error || errorMessages.OWNER_SAVE));
});

ownerService.update = (ownerId, owner) => new Promise((resolve, reject) => {
    Owner._findByIdAndUpdate(ownerId, owner, { new: true })
        .then(updatedOwner => resolve(updatedOwner))
        .catch(error => reject(error || errorMessages.OWNER_UPDATE));
});

ownerService.delete = id => new Promise((resolve, reject) => {
    ownerService.getById(id)
        .then(owner => {
            Owner.remove({ _id: id })
                .then(() => resolve(id))
                .catch(error => reject(error || errorMessages.OWNER_DELETE));
        })
        .catch(erro => reject(erro));
});

ownerService.studioAppointments = ownerId => new Promise((resolve, reject) => {
    Owner._studioAppointments(ownerId)
        .then(appointments => resolve(appointments))
        .catch(error => reject(error || errorMessages.OWNER_NOT_FOUND));
});

ownerService.getArtists = ownerId => new Promise((resolve, reject) => {
    Owner.getById(ownerId)
        .then(owner => resolve(owner.studio.artists))
        .catch(error => reject(error || errorMessages.OWNER_NOT_FOUND));
});

ownerService.pendingArtists = ownerId => new Promise((resolve, reject) => {
    Owner.getById(ownerId)
        .then(owner => resolve(owner.studio.pendingArtists))
        .catch(error => reject(error || errorMessages.OWNER_NOT_FOUND));
});

ownerService.artistRequest = (ownerId, artistId) => new Promise((resolve, reject) => {
    ownerService.getById(ownerId)
        .then(owner => {
            studioService.artistRequest(owner.studio._id, artistId)
                .then(studio => resolve(studio))
                .catch(error => reject(error));
        })
        .catch(erro => reject(erro));
});

ownerService.acceptArtist = (ownerId, response) => new Promise((resolve, reject) => {
    ownerService.getById(ownerId)
        .then(owner => {
            studioService.acceptArtist(owner.studio._id, response)
                .then(studio => resolve(studio))
                .catch(error => reject(error));
        })
        .catch(erro => reject(erro));
});

module.exports = ownerService;