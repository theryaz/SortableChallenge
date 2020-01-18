import { readFileSync } from 'fs';

import auctionRunner from './model/AuctionRunner';

const inputAuctions = JSON.parse(readFileSync(0).toString());

// console.time("Auction");
const results = [];
for(let auction of inputAuctions){
  results.push(auctionRunner.evaluateAuction(auction));
}
// console.timeEnd("Auction");

console.log(JSON.stringify(results, null, 4));