const express = require('express');
const router = express.Router();

module.exports = {

    generateRequestMethod: (method, path, returnStatus, data) => {
        switch (method) {
            case 'GET':
                return generateGET(path, returnStatus, data);
            case 'POST':
                return generatePOST(path, returnStatus, data);
            default:
                console.log('Invalid http method specified!');
                break;
        }
    }

};

generateGET = (path, returnStatus, data) => {
    return router.get(path, getDefaultResponsePattern(returnStatus, data));
}

generatePOST = (path, returnStatus, data) => {
    return router.post(path, getDefaultResponsePattern(returnStatus, data));
}

getDefaultResponsePattern = (returnStatus, data) => {
    return (req, res) => {
        res.send(returnStatus, data);
    }
}