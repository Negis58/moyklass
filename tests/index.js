const should = require("chai").should();
const expect = require("chai").expect;
const supertest = require("supertest");
const api = supertest("http://localhost:8080");


describe('API ROUTES', function() {
    describe('GET /', function() {
        it('returns all lessons', function(done) {
            api.get('/')
                .expect(200)
                .end(function(err, res) {
                    expect(res.body).to.have.lengthOf(5);
                    done(err);
                });
        });
    });
    describe('GET /:lessonsPerPage', function() {
        it('returns 5 lessons', function(done) {
            api.get('/?lessonsPerPage=5')
                .expect(200)
                .end(function(err, res) {
                    expect(res.body).to.have.lengthOf(5);
                    done(err);
                });
        });
    });
    describe('POST /lessons', function() {
        it('saves new lessons', function(done) {
            api.post('/lessons')
                .send({
                    teacherIds: [1,2],
                    title: 'Red Color',
                    days: [0,2,4,6],
                    firstDate: '2020-05-01',
                    lessonCount: 9,
                })
                .expect(201)
                .end(function(err, res) {
                    expect(res.body).to.have.lengthOf(9);
                    done(err);
                });
        });
    });
    describe('POST /lessons', function() {
        it('returns 400 error code', function(done) {
            api.post('/lessons')
                .send({
                    title: 'Red Color',
                    days: [0,2,4,6],
                    firstDate: '2028-19-13',
                    lessonCount: 600,
                })
                .expect(400)
                .end(function(err, res) {
                    done(err);
                });
        });
    });
});