//for testing purposes only
var Pool = artifacts.require('./Pool.sol')


module.exports = function (deployer) {

  deployer.deploy(Pool, [0x0, 0x0, 0x0, 0x0, 0x0], [0, 0, 0, 0, 0, 0, 0, 0, 0], false, {gas: 6720000})

}
