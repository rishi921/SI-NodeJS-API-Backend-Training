import app from '../server.js';
import { use, expect, should } from 'chai'
import chaiHttp from 'chai-http';

const chai = use(chaiHttp)
should();

const url = `/products`

describe('Testing ProductsController', () => {
    it('getAll return OK status', (done) => {
        chai.request.execute(app)
            .get(url)
            .end((err, res) => {
                if (err) {
                    throw new Error(err.message)
                }
                else {
                    res.should.have.status(200)
                }
            })
        done();
    })

    it('getAll returns an array', (done) => {
        chai.request.execute(app)
            .get(url)
            .end((err, res) => {
                if (err) {
                    throw new Error(err.message)
                }
                else {
                    res.body.should.be.a('array')
                }
            })
        done();
    })
})