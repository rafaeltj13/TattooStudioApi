const Artist = require('./artist.model');
const errorMessages = require('../helpers/errorMessages');

const artistService = {};

artistService.getAll = (params = {}) => new Promise((resolve, reject) => {
    Artist.find(params)
        .then(artists => resolve(artists))
        .catch(error => reject(error || errorMessages.ARTIST_NOT_FOUND));
});

artistService.getById = id => new Promise((resolve, reject) => {
    Artist.getById(id)
        .then(artist => resolve(artist))
        .catch(error => reject(error || errorMessages.ARTIST_NOT_FOUND));
});

artistService.getByParams = (params = {}) => new Promise((resolve, reject) => {
    Artist.findOne(params)
        .then(artist => resolve(artist))
        .catch(error => reject(error || errorMessages.ARTIST_NOT_FOUND));
});

artistService.create = artist => new Promise((resolve, reject) => {
    newArtist = new Artist(artist)
    newArtist.save()
        .then(savedArtist => resolve(savedArtist))
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

module.exports = artistService;