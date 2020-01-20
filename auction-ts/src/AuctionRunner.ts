import { Bid, Bidder, Site, Auction, Configuration} from './interfaces';

const cfg: Configuration = require('./config.json');

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
  private canBidOnSite(siteName: string, bid: Bid){
    const site = this.sites[siteName];
    if(site.bidders.indexOf(bid.bidder) === -1) return false; // Bidder not valid for site
    if(site.floor >= this.getAdjustedPrice(bid)) return false; // Adjusted Bid is too low for site
    return true;
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
    
    const descendingValidBids = auction.bids
    .filter(bid => this.canBidOnSite(siteConfig.name, bid))
    .sort(this.sortBidsDesc);

    for(let unit of auction.units){
      const winnerIndex = descendingValidBids.findIndex(bid => bid.unit === unit);
      if(winnerIndex === -1) continue; // No valid bid for this unit
      winningBids.push(descendingValidBids[winnerIndex]);
      descendingValidBids.splice(winnerIndex, 1);
    }

    return winningBids;
  }
}

export default new AuctionRunner(cfg);