import * as  chai from 'chai'
import { add, multiply } from './calculator.js'
// import { afterEach, beforeEach } from 'node:test';

const expect = chai.expect;
const assert = chai.assert;

describe('Testing Calculator', () => {
    let x, y;
    before(() => {
        // x = 5;
        // y = 5;
        console.log("Before any test method")
    }),
        after(() => {
            // x = 0;
            // y = 0;
            console.log("After each")
        }),

        //Arrange
        beforeEach(() => {
            x = 5;
            y = 5;
            console.log("Initializing ...")
        }),
        afterEach(() => {
            x = 0;
            y = 0;
            console.log("Initializing ...")
        }),

        it('Adds Two Numbers', () => {
            //Act
            let actual = add(x, y)
            //Assert
            expect(actual).to.equal((x + y));
        }),

        it('Multiply Two Numbers', () => {
            //Act
            let actual = multiply(x, y)
            //Assert
            // expect(actual).to.equal(10);
            assert.equal(25, actual)
        })
})