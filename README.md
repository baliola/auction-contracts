# TESTING AND DOCS

In this Unit Test, we are using Truffle, what is truffle?

> > A world class development environment, testing framework and asset pipeline for blockchains using the Ethereum Virtual Machine (EVM), aiming to make life as a developer easier.If you want to know more about Truffle, just visit _[Truffle Documentation](https://trufflesuite.com/docs/truffle/)_.

##### BEFORE WE RUN THE TESTS, WE NEED TO DO A FEW STEPS FIRST!

###### REQUIRED STEPS:

- First of all, open your terminal then install all dependencies using `npm i` / `npm install`
- Then you need to compile the contracts using `npm run compile`
- last but not least, run `npm run develop`
- After you finished all the steps above, **_you're ready to run the test!_**

###### TESTING STEPS

Open a new terminal and keep the truffle develop terminal open! You can check the test scripts in the `package.json` file and you can choose what contract do you want to test! but we'll keep give you our testing order!

1. To run the `fixed-price-1155.test.js` just simply run `npm run test-fixed-price`
2. To run the `open-bids-1155.test.js` just simply run `npm run test-open-bid-multiple`
3. To run the `fixed-price-721.test.js` just simply run `npm run test-fixed-price-single`
4. To run the `open-bids-721.test.js` just simply run `npm run test-open-bid-single`

#note:
there's special treatment for testing timed auction test, after you test one of timed aucion test `timed-auction-1155.test.js` or `timed-auction-721.test.js` you need to close all your terminal, then open a terminal and run `npm run develop` then open a new terminal, and you good to go! for example:

1. To run the `timed-auction-1155.test.js`, just simply run `npm run test-timed-multiple` | To run the `timed-auction-721.test.js`, just simply run `npm run test-timed-single`
2. After the test is completed, close all your terminal
3. Then open a new terminal, and run `npm run develop`
4. Open a new terminal once again, then you can run another test!

# notes

If you found an error such as `could not connect to the ethereum client`, just repeat the required steps from `npm run develop`
