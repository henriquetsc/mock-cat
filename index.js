const express = require('express');
const fs = require('fs');
const app = express();

const methodGenerator = require('./method-generator');

const filePath = './mock.json';

fs.readFile(filePath, 'utf8', (error, data) => {
    let serviceData = JSON.parse(data);
    let router = methodGenerator.generateRequestMethod(serviceData.method, serviceData.servicePath, serviceData.status, serviceData.data);
    app.use(router);
})


app.listen('3000', () => {
    console.log('Listening on port 3000!');
})