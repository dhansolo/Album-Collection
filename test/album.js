/*

WARNING TEST WILL DELETE EVERYTHING FROM DATABASE 
RUN TEST AT YOUR OWN RISK

*/

process.env.NODE_ENV = 'test';

let mongoose = require("mongoose");
let Album = require('../App/Models/Album.model.js');

let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../app');
let should = chai.should();

chai.use(chaiHttp);

// CLEARING DB FOR TESTING PURPOSES
/*
describe('Albums', () => {
    beforeEach((done) => { //Before each test we empty the database
        Album.remove({}, (err) => { 
           done();         
        });     
    });
});
*/

// TEST GETTING ALL ALBUMS
describe('/GET Albums', () => {
    it('It should GET all albums in mongodb', (done) => {
        chai.request(server)
            .get('/albums')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('array');
                console.log(res.body.length);
                //res.body.length.should.be.eql(0);
                done();
            });
        });
    });

//TESTING GETTING AN ALBUM BY ID (ALBUM IS CREATED AND INSERTED)
describe('GET/:id Albums', () => {
    it('It should GET an album with the given id', (done) => {
        let album = new Album ({
            title: "1",
            artist: "1"
        });
        chai.request(server)
            .post('/albums')
            .send(album)
            .end((err, res) => {
                done();
            });
        album.save((err, album) => {
            chai.request(server)
                .get('/albums' + album.id)
                .send(album)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.should.be.a('object');
                    res.body.should.have.property('title');
                    res.body.should.have.property('artist');
                    res.body.should.have.property('_id');
                    res.body.title.should.eql('1');
                    res.body.artist.should.eql('1');
                    res.body.should.have.property('_id').eql(album.id);
                    albumID = album.id;
                    done();
                });
        });
    });
});

// TESTING POSTING A NEW ALBUM
describe('/POST Albums', () => {
    it('It should POST an album to mongodb', (done) => {
        let album = new Album ({
            title: "2",
            artist: "2"
        });
        chai.request(server)
            .post('/albums')
            .send(album)
            .end((err, res) => {
                done();
            });
        album.save((err, album) => {
            chai.request(server)
                .post('/album')
                .send(album)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('title');
                    res.body.should.have.property('artist');
                    res.body.should.have.property('_id');
                    res.body.title.should.eql('My Beautiful Dark Twisted Fantasy');
                    res.body.artist.should.eql('Kanye West');
                    res.body.should.have.property('_id').eql(album.id);
                    done();
                });
            });
        });
    });

// TESTING DELETING ALBUM (NEW ALBUM IS CREATED, INSTERTED, AND DELETED)
describe('GET/:id Albums', () => {
    it('It should GET an album with the given id', (done) => {
        let album = new Album ({
            title: "3",
            artist: "3"
        });
        chai.request(server)
            .post('/albums')
            .send(album)
            .end((err, res) => {
                done();
            });
        album.save((err, album) => {
            chai.request(server)
                .delete('/albums' + album.id)
                .send(album)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.length.should.be.eql(2);
                    done();
                });
        });
    });
});