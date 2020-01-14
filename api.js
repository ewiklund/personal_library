/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

const expect = require('chai').expect;
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const MONGODB_CONNECTION_STRING = process.env.DB;
//Example connection: MongoClient.connect(MONGODB_CONNECTION_STRING, function(err, db) {});
MongoClient.connect(MONGODB_CONNECTION_STRING, function(err, db) {
  if(err) {
    console.log("Error connecting to database:" .err);
} else {
  console.log("Successfully connected to database");
  }});

module.exports = function (app) {

  app.route('/api/books')
    .get(function (req, res){
      const collection = "plibrary";
    const db = collection;
    db.collection("collection").find().toArray((err, books) => {
      if (err) {
        console.log("Error getting all book titles:", err);
        books.forEach((book) => {
          (book.comments) ? book.commentcount = book.comments.length : book.commentcount = 0;
        });
        return res.json(books);
      }
    })
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
    })


    .post(function (req, res){
      const title = req.body.title;
      if (title === undefined)
      return res.json("no title submitted");
    const collection = "plibrary";
    const db = collection;
      db.collection("collection").findOneAndUpdate({title: title},
                                {$set: {title: title},
                                $setOnInsert: {comments: []}
                                },
                                {
                                  upsert:true,
                                  returnNewDocument: true
      }),
                      (err, book) => {
        if (err) {
          console.log("Error adding book:", err);

          if (book.lastErrorObject.updatedExisting) {
            res.json({
              title: book.value.title,
              _id: book.value._id,
              comments: book.value.comments,
              inDBbefore: "yes"});
          } else {
            res.json({
              title: title,
              _id: book.lastErrorObject.upserted,
              comments: [],
              inDBbefore: "no"});
          }
          }
        }
      })

    .delete(function(req, res){
      const collection = "plibrary";
  const db = collection;
  db.collection("collection").deleteMany( {}, (err, result) => {
    if (err) {
      res.json("Error deleting entire library:", err);
    } else {
      res.json("complete delete successful");
    }
    })
    //if successful response will be 'complete delete successful'
  });

  app.route('/api/books/:id')
    .get(function (req, res){
      const bookid = req.params.id;
      let _id;
            if(ObjectId.isValid(bookid)) {
              _id = ObjectId(bookid);
            } else {
              return res.json("no book exists");
            };
        const collection = "plibrary";
        const db = collection;
        db.collection("collection").findOne({_id: _id}, (err, book) => {
          if (err) {
            console.log("Error finding one book:", err);

            if (book) {
              res.json({
                title: book.title,
                _id: book._id,
                comments: book.comments});
            } else {
              res.json("no book exists");
            }
          }
        });
          //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
        })

    .post(function(req, res){
      const bookid = req.params.id;
      const comment = req.body.comment;
      let _id;

    if (ObjectId.isValid(bookid)) {
      _id = ObjectId(bookid);
    } else {
      res.json("no book exists");
    };
    const collection = "plibrary";
    const db = collection;
    db.collection("collection").updateOne({
      _id: _id},
       {$push: {"comments": comment}}, (err, book) => {
      if (err) {
        console.log("Error adding comment:", err);
        if (book.modifiedCount != 1) {
          res.json("no book exists");
        } else {
          db.collection("collection").findOne({_id: _id}, (err, book) => {
            if (err) {
              console.log("Error retrieving book details within .updateOne():", err);
              res.json({
                title: book.title,
                _id: book._id,
                comments: book.comments});
            };
    });
        };

      //json res format same as .get
    };
    })
  })

    .delete(function(req, res){
      const bookid = req.params.id;
      let _id;
          if (ObjectId.isValid(bookid)) {
            _id = ObjectId(bookid);
          } else {
            res.json("no book exists");
          };
          const collection = "plibrary";
          const db = collection;

          db.collection("collection").deleteOne({_id: _id}, (err, book) => {
              if (err) {
                console.log("Error deleting book:", err);
                if (book.deletedCount === 1) {
                  res.json("delete successful");
                } else {
                  res.json("There is a problem deleting the book");
                }
              }
            //if successful response will be 'delete successful'

          })
      });
      }
