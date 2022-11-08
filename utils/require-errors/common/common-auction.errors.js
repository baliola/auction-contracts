const ONLY_MANAGER = "only manager can call"
const CREATOR_CANT_BID = "The auction creator can not place a bid"
const AUCTION_MUST_BE_OPEN = "can only place bid if the auction open"
const BID_MUST_BE_HIGHER_THAN_START_PRICE = "the bid must be higher than the start price"
const BID_MUST_BE_HIGHER_THAN_MININUM_INCREMENT = "the bid must be higher than the minimum increment"
const BID_MUST_BE_HIGHER_THAN_MININUM_INCREMENT_AND_START_PRICE = "The bid must be higher than the current bid + the minimum increment"
const AUCTION_MUST_END = "The auction must be ended by either a direct buy or timeout"
const ONLY_MAX_BIDDER_CAN_WITHDRAW_TOKEN = "The highest bidder can only withdraw the token"
const ONLY_CREATOR_CAN_WITHDRAW_FUNDS = "The auction creator can only withdraw the funds"
const ONLY_CREATOR_CAN_END_AUCTION = "only the creator can end the auction!"
const CAN_ONLY_END_AUCTION_IF_OPEN = "can only end auction when it's open!"
const ONLY_CREATOR_CAN_CANCEL_AUCTION = "Only the auction creator can cancel the auction"
const CAN_ONLY_CANCEL_AUCTION_IF_OPEN = "can only cancel auction if the auction is open"

const COMMON_AUCTION_ERRORS = {
    ONLY_MANAGER,
    CREATOR_CANT_BID,
    AUCTION_MUST_BE_OPEN,
    BID_MUST_BE_HIGHER_THAN_START_PRICE,
    BID_MUST_BE_HIGHER_THAN_MININUM_INCREMENT,
    BID_MUST_BE_HIGHER_THAN_MININUM_INCREMENT_AND_START_PRICE,
    AUCTION_MUST_END,
    ONLY_MAX_BIDDER_CAN_WITHDRAW_TOKEN,
    ONLY_CREATOR_CAN_WITHDRAW_FUNDS,
    ONLY_CREATOR_CAN_END_AUCTION,
    CAN_ONLY_END_AUCTION_IF_OPEN,
    ONLY_CREATOR_CAN_CANCEL_AUCTION,
    CAN_ONLY_CANCEL_AUCTION_IF_OPEN,
}

module.exports = {
    COMMON_AUCTION_ERRORS
}