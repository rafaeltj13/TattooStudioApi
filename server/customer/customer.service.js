const Customer = require('./customer.model');
const errorMessages = require('../helpers/errorMessages');

const customerService = {};

customerService.getAll = (params = {}) => new Promise((resolve, reject) => {
    Customer.find(params)
        .then(customers => resolve(customers))
        .catch(error => reject(error || errorMessages.COSTUMER_NOT_FOUND));
});

customerService.getById = id => new Promise((resolve, reject) => {
    Customer.getById(id)
        .then(customer => resolve(customer))
        .catch(error => reject(error || errorMessages.COSTUMER_NOT_FOUND));
});

customerService.getByParams = (params = {}) => new Promise((resolve, reject) => {
    Customer.findOne(params)
        .then(customer => resolve(customer))
        .catch(error => reject(error || errorMessages.COSTUMER_NOT_FOUND));
});

customerService.create = customer => new Promise((resolve, reject) => {
    newCustomer = new Customer(customer)
    newCustomer.save()
        .then(savedCustomer => resolve(savedCustomer))
        .catch(error => reject(error || errorMessages.COSTUMER_SAVE));
});

customerService.update = (customerId, customer) => new Promise((resolve, reject) => {
    Customer._findByIdAndUpdate(customerId, customer, { new: true })
        .then(updatedCustomer => resolve(updatedCustomer))
        .catch(error => reject(error || errorMessages.COSTUMER_UPDATE));
});

customerService.delete = id => new Promise((resolve, reject) => {
    customerService.getById(id)
        .then(customer => {
            Customer.remove({ _id: id })
                .then(() => resolve(id))
                .catch(error => reject(error || errorMessages.COSTUMER_DELETE));
        })
        .catch(erro => reject(erro));
});

customerService.getAppointments = id => new Promise((resolve, reject) => {
    customerService.getById(id)
        .then(customers => resolve(customers.schedule.appointments))
        .catch(error => reject(error || errorMessages.COSTUMER_APPOINTMENTS_NOT_FOUND));
});

module.exports = customerService;