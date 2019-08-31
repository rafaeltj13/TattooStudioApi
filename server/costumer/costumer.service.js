const Costumer = require('./costumer.model');
const errorMessages = require('../helpers/errorMessages');

const costumerService = {};

costumerService.getAll = (params = {}) => new Promise((resolve, reject) => {
    Costumer.find(params)
        .then(costumers => resolve(costumers))
        .catch(error => reject(error || errorMessages.COSTUMER_NOT_FOUND));
});

costumerService.getById = id => new Promise((resolve, reject) => {
    Costumer.getById(id)
        .then(costumer => resolve(costumer))
        .catch(error => reject(error || errorMessages.COSTUMER_NOT_FOUND));
});

costumerService.getByParams = (params = {}) => new Promise((resolve, reject) => {
    Costumer.findOne(params)
        .then(costumer => resolve(costumer))
        .catch(error => reject(error || errorMessages.COSTUMER_NOT_FOUND));
});

costumerService.create = costumer => new Promise((resolve, reject) => {
    newCostumer = new Costumer(costumer)
    newCostumer.save()
        .then(savedCustomer => resolve(savedCustomer))
        .catch(error => reject(error || errorMessages.COSTUMER_SAVE));
});

costumerService.update = costumer => new Promise((resolve, reject) => {
    Costumer._findByIdAndUpdate(costumer._id, costumer, { new: true })
        .then(updatedCustomer => resolve(updatedCustomer))
        .catch(error => reject(error || errorMessages.COSTUMER_UPDATE));
});

costumerService.delete = id => new Promise((resolve, reject) => {
    costumerService.getById(id)
        .then(costumer => {
            Costumer.remove({ _id: id })
                .then(() => resolve(id))
                .catch(error => reject(error || errorMessages.COSTUMER_DELETE));
        })
        .catch(erro => reject(erro));
});