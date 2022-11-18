const ONLY_CREATOR_CAN_REFILL = "only creator can refill";
const OUT_OF_SUPPLY = "out of supply! no nft is being selled!";
const NOT_ENOUGH_NFT = "not enough available nft!";
const CAN_ONLY_BUY_IF_AUCTION_OPEN = "can only buy nft when auction is open!";
const CAN_ONLY_BUY_IF_FEE_IS_CORRECT = "can only buy if the fee is correct!";
const CREATOR_CANNOT_BUY = "creator cannot buy nft!";
const CAN_ONLY_END_IF_AUCTION_IS_OPEN =
  "can only end auction if the auction is open";
const ONLY_CREATOR_CAN_END_AUCTION =
  "Only the auction creator can end the auction";

const SPECIAL_FIXED_PRICE_AUCTION_ERRORS = {
  ONLY_CREATOR_CAN_REFILL,
  OUT_OF_SUPPLY,
  NOT_ENOUGH_NFT,
  CAN_ONLY_BUY_IF_AUCTION_OPEN,
  CAN_ONLY_BUY_IF_FEE_IS_CORRECT,
  CREATOR_CANNOT_BUY,
  CAN_ONLY_END_IF_AUCTION_IS_OPEN,
  ONLY_CREATOR_CAN_END_AUCTION,
};

module.exports = {
  SPECIAL_FIXED_PRICE_AUCTION_ERRORS,
};
