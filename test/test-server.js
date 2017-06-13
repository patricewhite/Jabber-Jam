const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();

const{app} = require('../server')
chai.use(chaiHttp);

describe('Get endpoint', function(){
  it('verify you hit root url', function(){
    return chai.request(app)
    .get('/')
    .then(res => {
      res.should.have.status(200);
    });
  });
});
