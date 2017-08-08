/**
 * Created by developer on 7/18/17.
 */
var assert = require('assert');

//Require dev-dependencies
var chai = require('chai');
var chaiHttp = require('chai-http');
var routes = require('../node-server/node-app.js');

/* jshint ignore:start */
var should = chai.should();
//var should = require('should');
/* jshint ignore:end */

chai.use(chaiHttp);

describe('String#split', function(){
  it('should return an array', function(done){
    assert(Array.isArray('a,b,c'.split(',')));
    done();
  });
});

describe('index', function() {
      it('should respond to get http 200 ', function (done) {
        chai.request(routes).get('/api/user/status/').end(function (err, res) {
        res.should.have.status(200);
      done();
    });
  });
});
