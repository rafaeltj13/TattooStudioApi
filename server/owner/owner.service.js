const Owner = require('./owner.model');
const errorMessages = require('../helpers/errorMessages');

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
    newOwner = new Owner(owner);
    newOwner.save()
        .then(savedOwner => resolve(savedOwner))
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

module.exports = ownerService;