import json

class AuctionRunner:
  def __init__(self, cfg):
    self.sites = {}
    for site in cfg["sites"]:
      self.sites[site["name"]] = site
    
    self.bidders = {}
    for bidder in cfg["bidders"]:
      self.bidders[bidder["name"]] = bidder

  def canBidOnSite(self, siteName, bidderName):
    if siteName in self.sites[siteName]["bidders"]:
      return False
    else:
      return True

  def getAdjustedPrice(self, bid):
    if bid["bidder"] not in self.bidders:
      return -1
    else:
      return bid["bid"] + ( bid["bid"] * self.bidders[bid["bidder"]]["adjustment"] )

  def sortBidsDesc(self, bid):
    adjustedPrice = self.getAdjustedPrice(bid)
    return adjustedPrice

  def evaluateAuction(self, auction):
    if auction["site"] not in self.sites:
      return []
    siteConfig = self.sites[auction["site"]]

    winningBids = []

    descendingBids = list(filter(lambda bid: self.canBidOnSite(siteConfig["name"], bid["bidder"]), auction["bids"]))
    descendingBids.sort(reverse = True, key = lambda bid: self.sortBidsDesc(bid))

    try:
      floorIndex = descendingBids.index(lambda bid: self.getAdjustedPrice(bid) <= siteConfig["floor"])
    except:
      floorIndex = len(descendingBids)

    remainingUnits = auction["units"].copy()
    for bid in descendingBids[0:floorIndex]:
      if bid["unit"] in remainingUnits:
          winningBids.append(bid)
          remainingUnits.remove(bid["unit"])
          if len(remainingUnits) == 0:
            break

    return winningBids