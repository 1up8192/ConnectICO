var PoolFactory = artifacts.require('./PoolFactory.sol')
var Pool = artifacts.require('./Pool.sol')
var SafeMath = artifacts.require('../node_modules/openzeppelin-solidity/contracts/math/SafeMath.sol')
var SemiSafeMath = artifacts.require('./SemiSafeMath.sol')
var KYC = artifacts.require('./KYC.sol')
var TokenPushRegistry = artifacts.require('./TokenPushRegistry.sol')

module.exports = function (deployer) {


  deployer.deploy(KYC, {gas: 8000000}).then(function(){
    return deployer.deploy(PoolFactory, KYC.address, 0, 0, 0, 0, {gas: 8000000})
  })
  //deployer.deploy(PoolFactory, KYC.address, 0, 0, 0, 0, {gas: 8000000})

}
