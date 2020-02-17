const express = require('express');
const fs = require('fs');
const app = express();
const methodGenerator = require('./method-generator');
const bodyParser = require('body-parser');
const MockDataValidator = require('./middlewares/validators/mock-data-validator');

const mockPath = './mocks'

app.use(bodyParser.json());

fs.watch(mockPath, (event, groupName) => {
  if (event === 'change')
    loadMockedService(`${__dirname}/mocks/${groupName}`);
});

fs.readdir(mockPath, (err, items) => loadMockFiles(items.map(item => `${__dirname}/mocks/${item}`)));

loadMockFiles = (filePathList) => {
  filePathList.forEach(filePath => loadMockedService(filePath))
}

loadMockedService = (filePath) => {
  console.log(`Loading mock file: ${filePath}!`)
  fs.readFile(filePath, 'utf8', (error, data) => {
    let serviceData = JSON.parse(data);
    let router = methodGenerator.generateRequestMethod(serviceData.method, serviceData.servicePath, serviceData.status, serviceData.data);
    app.use(router);
  })
}

app.post('/create', MockDataValidator, (req, res, next) => {
  let groupName = req.body.group;
  let methodName = req.body.serviceData.servicePath
  console.log(`Creating new Server File: ${groupName}`);
  fs.writeFile(`${mockPath}/${groupName}${methodName}.json`, JSON.stringify(req.body.serviceData), (err) => err ? console.log(err) : console.log(`File ${groupName} created!`));

  res.send('hello');
});

app.listen('3100', () => {
    console.log('Listening on port 3100!');
})
