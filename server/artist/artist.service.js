const Artist = require('./artist.model');
const errorMessages = require('../helpers/errorMessages');
const scheduleService = require('../schedule/schedule.service');
const studioService = require('../studio/studio.service');

const artistService = {};

artistService.getAll = (params = {}) => new Promise((resolve, reject) => {
    Artist.find({ "name": { "$regex": params.name || "", "$options": "i" } })
        .then(artists => resolve(artists))
        .catch(error => reject(error || errorMessages.ARTIST_NOT_FOUND));
});

artistService.getById = id => new Promise((resolve, reject) => {
    Artist.getById(id)
        .then(artist => resolve(artist))
        .catch(error => reject(error || errorMessages.ARTIST_NOT_FOUND));
});

artistService.getByParams = (params = {}) => new Promise((resolve, reject) => {
    console.log('askdfnasoikfndio', params, 'asdfsadf')
    Artist.findOne(params)
        .then(artist => resolve(artist))
        .catch(error => reject(error || errorMessages.ARTIST_NOT_FOUND));
});

artistService.create = artist => new Promise((resolve, reject) => {
    newArtist = new Artist(artist)
    newArtist.save()
        .then(savedArtist => {
            scheduleService.create()
                .then(schedule => {
                    artistService.update(savedArtist._id, { schedule: schedule._id })
                        .then(updatedArtist => {
                            if (!artist.inStudio) resolve(updatedArtist)

                            studioService.artistRequest(artist.studio, savedArtist._id)
                                .then(() => resolve(updatedArtist))
                                .catch(error => reject(error));
                        })
                        .catch(e => next(e));
                })
                .catch(e => next(e));
        })
        .catch(error => reject(error || errorMessages.ARTIST_SAVE));
});

artistService.update = (artistId, artist) => new Promise((resolve, reject) => {
    Artist._findByIdAndUpdate(artistId, artist, { new: true })
        .then(updatedArtist => resolve(updatedArtist))
        .catch(error => reject(error || errorMessages.ARTIST_UPDATE));
});

artistService.delete = id => new Promise((resolve, reject) => {
    artistService.getById(id)
        .then(artist => {
            Artist.remove({ _id: id })
                .then(() => resolve(id))
                .catch(error => reject(error || errorMessages.ARTIST_DELETE));
        })
        .catch(erro => reject(erro));
});

artistService.getAppointments = id => new Promise((resolve, reject) => {
    artistService.getById(id)
        .then(artist => resolve(artist.schedule.appointments))
        .catch(error => reject(error || errorMessages.ARITST_APPOINTMENTS_NOT_FOUND));
});

artistService.getSchedule = artistId => new Promise((resolve, reject) => {
    artistService.getById(artistId)
        .then(artist => resolve(artist.schedule))
        .catch(erro => reject(erro));
});

artistService.addTattoo = (artistId, tattoId) => new Promise((resolve, reject) => {
    Artist._addTattoo(artistId, tattoId)
        .then(artist => resolve(artist))
        .catch(erro => reject(erro));
});

artistService.getFeaturedArtists = (params = {}) => new Promise((resolve, reject) => {
    Artist.find(params).sort('-rating').limit(3)
        .then(artists => resolve(artists))
        .catch(error => reject(error || errorMessages.ARTIST_NOT_FOUND));
});

module.exports = artistService;