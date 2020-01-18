import sys, json;

from AuctionRunner import AuctionRunner

cfg = json.load(open('./config.json', "r"))
auctionList = json.load(sys.stdin)

auctionRunner = AuctionRunner(cfg);

results = [];
for auction in auctionList:
    results.append(auctionRunner.evaluateAuction(auction));

print(json.dumps(results, indent=4));