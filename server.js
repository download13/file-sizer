const express = require('express');
const Busboy = require('busboy');
const StreamCounter = require('stream-counter');


const app = express();

app.use(express.static('public'));

app.post('/', (req, res) => {
  const busboy = new Busboy({headers: req.headers});
  
  const counter = new StreamCounter();
  
  busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
    file.pipe(counter);
  });
  
  busboy.on('finish', () => {
    res.send({size: counter.bytes});
  });
  
  req.pipe(busboy);
});

app.listen(process.env.PORT, () => console.log('Listening'));