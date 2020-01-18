import { Bid, Bidder, Site, Auction, Configuration} from '../interfaces';

const cfg: Configuration = require('../config.json');

class AuctionRunner{
  
  sites: {[name: string]: Site} = {};
  bidders: {[name: string]: Bidder} = {};
  
  constructor(cfg: Configuration){
    for(let site of cfg.sites){
      this.sites[site.name] = site;
    }
    for(let bidder of cfg.bidders){
      this.bidders[bidder.name] = bidder;
    }
  }
  private canBidOnSite(siteName: string, bidderName: string){
    const site = this.sites[siteName];
    if(!site) return false;
    return site.bidders.indexOf(bidderName) !== -1;
  }
  private getAdjustedPrice(bid: Bid): number{
    const bidder = this.bidders[bid.bidder];
    if(!bidder) return -1;
    return bid.bid + ( bid.bid * bidder.adjustment );
  }
  private sortBidsDesc = (bidLeft: Bid, bidRight: Bid) => {
    const bidLeftAdjusted = this.getAdjustedPrice(bidLeft);
    const bidRightAdjusted = this.getAdjustedPrice(bidRight);
    return bidRightAdjusted - bidLeftAdjusted;
  }

  public evaluateAuction(auction: Auction): Bid[]{
    const siteConfig = this.sites[auction.site];
    if(!siteConfig) return [];

    const winningBids = [];
    
    const descendingBids = auction.bids
    .filter(bid => this.canBidOnSite(siteConfig.name, bid.bidder))
    .sort(this.sortBidsDesc);

    let floorIndex = descendingBids.findIndex(bid => this.getAdjustedPrice(bid) <= siteConfig.floor);
    if(floorIndex === -1) floorIndex = descendingBids.length;

    const remainingUnits = [...auction.units];
    for(let i = 0; i < floorIndex; i++){
      const unitIndex = remainingUnits.indexOf(descendingBids[i].unit);
      if(unitIndex !== -1){
        winningBids.push(descendingBids[i]);
        remainingUnits.splice(unitIndex, 1);
        if(remainingUnits.length === 0) break;
      }
    }

    return winningBids;
  }
}

export default new AuctionRunner(cfg);