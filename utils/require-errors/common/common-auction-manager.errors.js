const ONLY_MANAGER = "only manager can call this function"
const DIRECT_BUY_PRICE_MUST_NOT_BE_0 = "direct buy price must be greater than 0"
const START_PRICE_MUST_BE_LESS_THAN_DIRECT_BUY_PRICE = "start price must be less than the direct buy price"
const END_TIME_MUST_BE_GREATER_THAN_12_HOURS = "must be greater than 12 hours"

const COMMON_MANAGER_ERRORS = {
    ONLY_MANAGER,
    DIRECT_BUY_PRICE_MUST_NOT_BE_0,
    START_PRICE_MUST_BE_LESS_THAN_DIRECT_BUY_PRICE,
    END_TIME_MUST_BE_GREATER_THAN_12_HOURS,
}

module.exports = {
    COMMON_MANAGER_ERRORS
}