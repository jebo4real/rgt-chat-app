require("dotenv").config();
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI || 'mongodb://jebo:Greenfour4@cluster0-shard-00-00.ox9zo.mongodb.net:27017,cluster0-shard-00-01.ox9zo.mongodb.net:27017,cluster0-shard-00-02.ox9zo.mongodb.net:27017/rgt-chat-db?ssl=true&replicaSet=atlas-mlf6w8-shard-0&authSource=admin&retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

module.exports = mongoose.connection;
