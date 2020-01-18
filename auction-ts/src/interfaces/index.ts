export interface Configuration{
  sites: Site[],
  bidders: Bidder[],
}

export interface Bidder{
  name: string,
  adjustment: number,
}

export interface Site{
  name: string,
  bidders: string[],
  floor: number,
}

export interface Auction{
  site: string,
  units: string[],
  bids: Bid[]
}

export interface Bid{
  bidder: string,
  unit: string,
  bid: number,
}
