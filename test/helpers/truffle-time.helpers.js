

class TimeHelper {

    /**
     * NOTE : this is a low level api, you may not need this. use `advanceTimeAndBlock` instead.
     * 
     * this method will artifically advance time in seconds
     * 
     * @param {number} timeInSeconds time in seconds
     * @returns {void}
     */
    async advanceTime(timeInSeconds) {
        return new Promise((resolve, reject) => {
            web3.currentProvider.send({
                jsonrpc: '2.0',
                method: 'evm_increaseTime',
                params: [timeInSeconds],
                id: new Date().getTime()
            }, (err, result) => {
                if (err) { return reject(err) }
                return resolve(result)
            })
        })
    }

    /**
     * NOTE : this is a low level api, you may not need this. use `advanceTimeAndBlock` instead.
     *  
     * this method will mine blocks that hasn't been mined.
     * @returns {Promise<void>}
     */
    async advanceBlock() {
        return new Promise((resolve, reject) => {
            web3.currentProvider.send({
                jsonrpc: '2.0',
                method: 'evm_mine',
                id: new Date().getTime()
            }, (err, result) => {
                if (err) { return reject(err) }
                const newBlockHash = web3.eth.getBlock('latest').hash

                return resolve(newBlockHash)
            })
        })
    }

    /**
     * this method will advance time in seconds and then mine the blocks based on the time passed.
     * 
     * @param {number} timeInSeconds time in seconds.
     * @returns {Promise<void>}
     */
    async advanceTimeAndBlock(timeInSeconds) {
        await advanceTime(timeInSeconds)
        await advanceBlock()
        return Promise.resolve(web3.eth.getBlock('latest'))
    }
}


module.exports = {
    TimeHelper
}