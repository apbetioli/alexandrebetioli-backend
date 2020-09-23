const express = require('express')
const cors = require('cors')
const morgan = require('morgan')

const app = express();

const corsOptions = {
  "preflightContinue": true
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/api", require('./app/controllers/subscribeController'));
app.use(morgan('dev'));

app.listen(process.env.PORT || 3001, () =>
  console.log('Express server is running on localhost:3001')
);
