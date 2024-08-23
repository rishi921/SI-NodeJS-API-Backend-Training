import { expect, should, use } from 'chai'
import chaiHttp from 'chai-http'
import sinon from 'sinon';
import app from '../server.js';
import pool from '../DB/db.js'

const chai = use(chaiHttp)
should();

const url = '/products'

describe('Mocking product controller', () => {
    afterEach(() => {
        sinon.restore(); // Restore original methods
    })

    // 1. Test for Empty response (No Products Found)

    it('returns 404 when no products are found', async () => {
        sinon.stub(pool, 'query').resolves({ rowCount: 0 })
        const result = await chai.request.execute(app)
            .get(url)
        expect(result).to.have.status(404)
    });

    it('should return 200 and product data when products are found', async () => {
        const mockData = [{
            product_id: 1, productname: 'WaterBottle', price: 40,
            category: 'WaterSports', star_rating: 4, description: 'of Lorem Ipsum available', productcode: 'WAT-BOT', imageurl: 'bottle.jpeg'
        }]
        sinon.stub(pool, 'query').resolves({ rowCount: mockData.length, rows: mockData });

        const res = await chai.request.execute(app).get('/products');
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('array').that.deep.equal('Internal Error')
    })

    //3. Checking it returns 500 when there is internal error (For eg. db connection rejected)

    it('should return 500 for internal error', async () => {
        sinon.stub(pool, 'query').rejects(new Error('Database error'));

        const res = await chai.request.execute(app).get('/products');
        expect(res).to.have.status(500);
        expect(res.body).to.have.property('error').to.equal('Internal Error')
    })
})

describe('Testing getById end point', () => {
    afterEach(() => {
        sinon.restore(); // Restore original methods
    });
    //OK Status 200

    it('should return 200 and product data when a valid ID is provided', async () => {
        const mockData = {
            product_id: 1, productname: 'WaterBottle', price: 40,
            category: 'WaterSports', star_rating: 4, description: 'of Lorem Ipsum available', productcode: 'WAT-BOT', imageurl: 'bottle.jpeg'
        }
        sinon.stub(pool, 'query').resolves({ rowCount: 1, rows: [mockData] });
    })
})