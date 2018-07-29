// var expect = require('chai').expect;
// var MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
// const MONGODB_CONNECTION_STRING = process.env.DB;
//Example connection: MongoClient.connect(MONGODB_CONNECTION_STRING, function(err, db) {});

module.exports = function (app, db) {

  app.route('/api/books')
    .get(function (req, res, next) {
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
      db.collection(process.env.DB_COL)
        .find({})
        .project({ 'comments': 0})
        .toArray((err, doc) => {
          if (err) return next(err);
          return res.json(doc);
        });
    })

    .post(function (req, res, next) {
      var title = req.body.title;
      console.log(title);
      db.collection(process.env.DB_COL)
        .insertOne({ title: req.body.title, comments: [], commentcount: 0 }, (err, doc) => {
          if (err) return next(err);
          return res.json(doc);
        });
      // return res.send('OK');
      //response will contain new book object including atleast _id and title
    })

    .delete(function (req, res, next) {
      //if successful response will be 'complete delete successful'
      // Update multiple documents
      db.collection(process.env.DB_COL)
        .deleteMany({}, function (err, doc) {
          if (err) return next(err);
          return res.send('complete delete successful');
        });
    });



  app.route('/api/books/:id')
    .get(function (req, res, next) {
      var bookid = req.params.id;

      

      db.collection(process.env.DB_COL)
        .findOne({ _id: ObjectId(bookid) }, { 'commentcount': 0 }, (err, doc) => {
          if (err) return next(err);
          if (!doc) return next(new Error('Book not found!'));
          return res.json(doc);
        });
    })

    .post(function (req, res, next) {
      var bookid = req.params.id;
      var comment = req.body.comment;

      db.collection(process.env.DB_COL)
        .findOneAndUpdate({ _id: ObjectId(bookid) }, { $push: { comments: comment }, $inc: { commentcount: 1 } }, {
          returnOriginal: false,
          upsert: false
        }, function (err, doc) {
          if (err) return next(err);
          if (!doc.value) return next(new Error('Book not found!'));
          return res.json(doc);
        });
    })

    .delete(function (req, res, next) {
      var bookid = req.params.id;
      //if successful response will be 'delete successful'
      db.collection(process.env.DB_COL)
        .deleteOne({ _id: ObjectId(bookid) }, (err, doc) => {
          if (err) return next(err);
          return res.send('delete successful');
        });
    });

};
