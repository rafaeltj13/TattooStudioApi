const fs = require('fs');
const crypto = require('crypto');

const BASE_64 = 'base64';
const IMGS_PATH = 'images';
const IMAGES_TATTOO_PATH  = 'tattoo';

const imageService = {
    IMAGES_TATTOO_PATH
};

imageService.save = (imageBase64, entity, entityPath) => new Promise((resolve, reject) => {
    const folderPath = `${IMGS_PATH}/${entityPath}`;
    
    const dataUrlSeparator = ',';
    const imageBase64NoUrl = imageBase64.split(dataUrlSeparator).pop();
    const imageBuffer = Buffer.from(imageBase64NoUrl, BASE_64);
    const extension = getExtensaoDoBase64(imageBase64);
    const hashFile = calculateHashFileNamee(entity);
    const fileNameWithExtension = `${hashFile}.${extension}`;
    const imagePath = `${folderPath}/${fileNameWithExtension}`;
    
    if (!fs.existsSync(folderPath)){
        fs.mkdirSync(folderPath);
    }
    
    fs.writeFile(imagePath, imageBuffer, erro => {
        if (erro) reject(erro);
        resolve(imagePath);
    });
});

const calculateHashFileNamee = entity => {
    const filename = `${entity._id}${Date.now}`;
    return crypto.createHash('md5').update(filename).digest('hex');
};

const getExtensaoDoBase64 = stringBase64 => {
    const tokenSeparator = ';';
    const mimeSeparator = '/';
    const mimeIndex = 0;
    const extensionIndex = 1
    const prefixMediatype = stringBase64.split(tokenSeparator)[mimeIndex];
    const extension = prefixMediatype.split(mimeSeparator)[extensionIndex];
    return extension;
};

module.exports = imageService;