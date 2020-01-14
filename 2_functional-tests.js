/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');

chai.use(chaiHttp);
let testId;

suite('Functional Tests', function() {

  /*
  * ----[EXAMPLE TEST]----
  * Each test should completely test the response of the API end-point including response status code!
  */
  test('#example Test GET /api/books', function(done){
     chai.request(server)
      .get('/api/books')
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.isArray(res.body, 'response should be an array');
        assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
        assert.property(res.body[0], 'title', 'Books in array should contain title');
        assert.property(res.body[0], '_id', 'Books in array should contain _id');
        done();
      });
  });
  /*
  * ----[END of EXAMPLE TEST]----
  */

  suite('Routing tests', function() {


    suite('POST /api/books with title => create book object/expect book object', function() {

      test('Test POST /api/books with title', function(done) {
        chai.request(server)
       .post("/api/books")
       .send( {title: "Testing POST with a title"} )
       .end( function(err, res) {
         assert.equal(res.status, 200);
         assert.property(res.body, "title", "Book should have a \"title\".");
         assert.equal(res.body.title, "Testing POST with a title", "Book \"title\" should match the sent title.");
         assert.property(res.body, "_id", "Book should have an \"_id\".");

         testId = res.body._id;

         assert.property(res.body, "comments", "Book should have a \"comments\" property.");
         assert.isArray(res.body.comments, "Book \"comments\" should be an array.");
         assert.property(res.body, "inDBbefore", "Book should have property \"inDBbefore\".");
        done();
      });
});
      test('Test POST /api/books with no title given', function(done) {
        chai.request(server)
       .post("/api/books/")
       .end( function(err, res) {
         assert.equal(res.status, 200);
         assert.equal(res.body, "no title submitted");
        done();
      });

    });
});

    suite('GET /api/books => array of books', function(){

      test('Test GET /api/books',  function(done){
        chai.request(server)
        .get("/api/books/")
        .end( function(err, res) {
          assert.equal(res.status, 200);
          assert.isArray(res.body, "The response to a GET request for all books should be an array containing all the books.");

            assert.property(res.body[0], "title", "The entries in the array of books should have a \"title\" property.");
            assert.property(res.body[0], "_id", "The entries in the array of books should have a \"_id\" property.");
            assert.property(res.body[0], "comments", "The entries in the array of books should have a \"comment\" property.");
            assert.isArray(res.body[0].comments, "The \"comments\" property in the array entries should be an array.");
            assert.property(res.body[0], "commentcount", "The entries in the array of books should have a \"commentcount\" property.");
            assert.equal(res.body[0].comments.length, res.body[0].commentcount, "The number of \"comments\" should match the number in \"commentcount\".");
            done();
      });

    });

});
    suite('GET /api/books/[id] => book object with [id]', function(){

      test('Test GET /api/books/[id] with id not in db',  function(done){
        chai.request(server)
        .get("/api/books/13245768")
        .end( function(err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body, "no book exists");
        done();
      });
    });

      test('Test GET /api/books/[id] with valid id in db',  function(done){
        chai.request(server)
      .get("/api/books/" + testId)
      .end( function(err, res) {
        assert.equal(res.status, 200);
        assert.property(res.body, "title", "The book should have a \"title\" property.");
        assert.property(res.body, "_id", "The book should have an \"_id\" property.");
        assert.equal(res.body._id, testId, "The returned \"_id\" should match the testId.");
        assert.property(res.body, "comments", "The book should have a \"comments\" property.");
        assert.isArray(res.body.comments, "The \"comments\" property should contain an array.");
        done();
      });

    });
});

    suite('POST /api/books/[id] => add comment/expect book object with id', function(){

      test('Test POST /api/books/[id] with comment', function(done){
        chai.request(server)
      .post("/api/books/" + testId)
      .send( {comment: "This is a test comment from Chai."} )
      .end( function(err, res) {
        assert.equal(res.status, 200);
        assert.property(res.body, "title", "The book should have a \"title\" property.");
        assert.property(res.body, "_id", "The book should have an \"_id\" property.");
        assert.equal(res.body._id, testId, "The returned \"_id\" should match the testId.");
        assert.property(res.body, "comments", "The book should have a \"comments\" property.");
        assert.isArray(res.body.comments, "The \"comments\" property should contain an array.");
        done();
      });

    });

  });

});
