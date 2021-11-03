let chai = require('chai');
let chaiHttp = require('chai-http');
let expect = chai.expect
chai.use(chaiHttp);

describe('Testing Rest Api',() => {
    it('Should return status 200 for users',(done) => {
        chai.request('http://localhost:7123')
        .get('/users')
        .then((res) => {
            expect(res).to.have.status(200)
            done()
        })
        .catch((err) => {
            throw err;
        })
    })
    it('Should return status 404 for user',(done) => {
        chai.request('http://localhost:7123')
        .get('/user')
        .then((res) => {
            expect(res).to.have.status(404)
            done()
        })
        .catch((err) => {
            throw err;
        })
    })
    it('Testing adding user',(done) => {
        chai.request('http://localhost:7123')
        .post('/addUser')
        .send({"name":"TestUser","city":"TestCity","isActive":true})
        .then((res) => {
            expect(res).to.have.status(200)
            done()
        })
        .catch((err) => {
            throw err;
        })
    })

})