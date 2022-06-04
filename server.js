const express = require('express');
const app = express();
const path = require('path')

//////////////////////////<socket.io>
const http = require('http')
const server = http.createServer(app)
module = module.exports = server
/////////////////////////</socket.io>

////////////////////////////////<handling post requests>
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
////////////////////////////////</handling post ends>

//////////////////////////////////////////<Mongoose connection>
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });
const DB = process.env.database.replace('<password>', process.env.DB_PASSWORD);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  })
  .then(() => console.log('DB Connection Successful \n+-+-+-+-+-+-+-+-+-+-+-+-'));
////////////////////////////////////////////////</Mongoose connection>

/////////////////<cors>
const cors = require('cors');
app.use(cors({ credentials: true, origin: 'http://resolve4.herokuapp.com' }));
///////////////</cors>

///////////////<doubtimages>
app.use('/doubtimages', express.static('./doubtimages'))
//////////////</doubtimages>

///////////////<dpimages>
app.use('/dpimages', express.static('./dpimages'))
//////////////</dpimages>

////////<authentucation routes>
app.use('/auth', require('./routes/auth.js'));
////////</authentucation routes>

///////<doubt routes>
app.use('/doubt', require('./routes/doubtroutes'))
///////</doubt routes>

///////<reply routes>
app.use('/reply', require('./routes/replyroutes'))
///////</reply routes>


if (process.env.NODE_ENV === 'production') {
  app.use(express.static('team-project/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '/team-project/build/index.html'))
  })
}

///////<Listen to port>
const port = process.env.PORT || 2000;
server.listen(port, () => {
  console.log(`+-+-+-+-+-+-+-+-+-+-+-+-\nApp running on : http://localhost:${port}`);
});
///////</Listen to port>
