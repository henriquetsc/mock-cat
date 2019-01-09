const express = require('express');
const fs = require('fs');
const app = express();
const methodGenerator = require('./method-generator');
const bodyParser = require('body-parser');

const mockPath = './mocks'

app.use(bodyParser.json());

fs.watch(mockPath, (event, filename) => {
  if (event === 'change')
    loadMockedService(`${__dirname}/mocks/${filename}`);
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

app.post('/post', (req, res, next) => {
  let filename = req.body.group;
  console.log(`Creating new Server File: ${filename}`);
  fs.writeFile(`${mockPath}/${filename}.json`, JSON.stringify(req.body.serviceData), (err) => err ? console.log(err) : console.log(`File ${filename} created!`));

  res.send('hello');
});

app.listen('3100', () => {
    console.log('Listening on port 3000!');
})
