const studioService = require('./studio.service');

const studioCtrl = {};

studioCtrl.load = (req, res, next, id) => {
    studioService.getById(id)
        .then(studio => {
            req['studio'] = studio;
            return next();
        })
        .catch(e => next(e));
};

studioCtrl.getAll = (req, res, next) => {
    studioService.getAll(req.query)
        .then(studios => res.json(studios))
        .catch(e => next(e));
};

studioCtrl.getById = (req, res) => res.json(req.studio);

studioCtrl.getByParams = (req, res, next) => {
    studioService.getByParams(req.query)
        .then(studio => res.json(studio))
        .catch(e => next(e));
};

studioCtrl.create = (req, res, next) => {
    studioService.create(req.body)
        .then(studio => res.json(studio))
        .catch(e => next(e));
};

studioCtrl.update = (req, res, next) => {
    studioService.update(req.params.idStudio, req.body)
        .then(studio => res.json(studio))
        .catch(e => next(e));
};

studioCtrl.delete = (req, res, next) => {
    studioService.delete(req.studio._id)
        .then(studio => res.json(studio))
        .catch(e => next(e));
};

studioCtrl.artistRequest = (req, res, next) => {
    studioService.artistRequest(req.studio._id, req.body.artistId)
        .then(studio => res.json(studio))
        .catch(e => next(e));
}

studioCtrl.acceptArtist = (req, res, next) => {
    studioService.acceptArtist(req.studio._id, req.body.artistId)
        .then(studio => res.json(studio))
        .catch(e => next(e));
}

module.exports = studioCtrl;