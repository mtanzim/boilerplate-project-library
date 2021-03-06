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
const ObjectId = require('mongodb').ObjectId;

const bookName = 'Elon Musk';
var bookId = null;

chai.use(chaiHttp);

suite('Functional Tests', function() {

  /*
  * ----[EXAMPLE TEST]----
  * Each test should completely test the response of the API end-point including response status code!
  */
  /*
  * ----[END of EXAMPLE TEST]----
  */

  suite('Routing tests', function() {


    suite('POST /api/books with title => create book object/expect book object', function() {


      
      test('Test POST /api/books with title', function(done) {
        chai.request(server)
          .post('/api/books')
          .type('form')
          .send({
            'title': bookName,
          })
          .end( function (err, res)  {
            assert.equal(res.status,200);
            assert.equal(res.body.n,1);
            assert.equal(res.body.ok,1);
            done();
          });
        //done();
      });
      
      test('Test POST /api/books with no title given', function(done) {
        chai.request(server)
          .post('/api/books')
          .type('form')
          .send({'title':'      '})
          .end(function (err, res) {
            assert.equal(res.status, 500);
            done();
          });
      });
      
    });


    suite('GET /api/books => array of books', function(){
      
      test('Test GET /api/books', function (done) {
        chai.request(server)
          .get('/api/books')
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.header['x-powered-by'], process.env.POWEREDBY);
            assert.equal(res.header.pragma, 'no-cache');
            // console.log();
            assert.isArray(res.body, 'response should be an array');
            assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
            assert.property(res.body[0], 'title', 'Books in array should contain title');
            assert.property(res.body[0], '_id', 'Books in array should contain _id');

            bookId = res.body[0]._id;
            done();
          });
      });
      
    });


    suite('GET /api/books/[id] => book object with [id]', function(){
      

      
      test('Test GET /api/books/[id] with valid id in db',  function(done){
        chai.request(server)
          .get(`/api/books/${bookId}`)
          .end(function (err, res) {
            assert.equal(res.status, 200);
            // console.log(res.body);
            assert.isArray(res.body.comments, 'comments should be an array');
            // assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
            assert.property(res.body, 'title', 'Books in array should contain title');
            assert.property(res.body, '_id', 'Books in array should contain _id');
            assert.equal(res.body._id, bookId, 'Books in array should contain _id');
            done();
          });
      });

      test('Test GET /api/books/[id] with id not in db', function (done) {
        chai.request(server)
          .get(`/api/books/${new ObjectId()}`)
          .end(function (err, res) {
            assert.equal(res.status, 500);
            done();
          });
      });
      
    });


    suite('POST /api/books/[id] => add comment/expect book object with id', function(){
      
      test('Test POST /api/books/[id] with comment', function(done){
        chai.request(server)
          .post(`/api/books/${bookId}`)
          .send({ 'comment': 'Hello from Mocha!!!' })
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body.value._id, bookId, 'Books in array should contain _id');
            assert.isArray(res.body.value.comments, 'comments should be an array');
            assert.equal(res.body.value.comments[res.body.value.commentcount - 1], 'Hello from Mocha!!!', 'comments should match');
            // console.log(res.body);
            done();
          });
      });
      
    });

  });

});
