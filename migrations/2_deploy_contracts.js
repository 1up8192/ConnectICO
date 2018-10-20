var PoolFactory = artifacts.require('./PoolFactory.sol')
var Pool = artifacts.require('./Pool.sol')
var SafeMath = artifacts.require('../node_modules/openzeppelin-solidity/contracts/math/SafeMath.sol')
var SemiSafeMath = artifacts.require('./SemiSafeMath.sol')
var KYC = artifacts.require('./KYC.sol')
var TokenPushRegistry = artifacts.require('./TokenPushRegistry.sol')

module.exports = function (deployer) {

  deployer.deploy(SafeMath)
  deployer.deploy(SemiSafeMath)
  deployer.link(SafeMath, PoolFactory)
  deployer.link(SemiSafeMath, PoolFactory)
  deployer.deploy(KYC).then(function(){
    deployer.deploy(PoolFactory, KYC.address, 0, 0, 0, 0)

  })
  deployer.link(SafeMath, TokenPushRegistry)
  deployer.deploy(TokenPushRegistry, 0x0, 0)

}
