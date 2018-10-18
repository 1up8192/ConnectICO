// Import the page's CSS. Webpack will know what to do with it.
import '../styles/app.css'

// Import libraries we need.
import { default as Web3 } from 'web3'
import { default as contract } from 'truffle-contract'

// Import our contract artifacts and turn them into usable abstractions.
import metaCoinArtifact from '../../build/contracts/MetaCoin.json'

// MetaCoin is our usable abstraction, which we'll use through the code below.
const MetaCoin = contract(metaCoinArtifact)

// The following code is simple to show off interacting with your contracts.
// As your needs grow you will likely need to change its form and structure.
// For application bootstrapping, check out window.addEventListener below.
let accounts
let account

const App = {
    start: function () {
      const self = this
  
      // Bootstrap the MetaCoin abstraction for Use.
      MetaCoin.setProvider(web3.currentProvider)
  
      // set the initial account balance so it can be displayed.
      web3.eth.getAccounts(function (err, accs) {
        if (err != null) {
          alert('There was an error fetching your accounts.')
          return
        }
  
        if (accs.length === 0) {
          alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.")
          return
        }
  
        accounts = accs
        account = accounts[0]
  
        self.refreshBalance()
      })
    },
  
	/**
	*A status message for each page for the actual tx status
	*
	* @param {string} status Status message
	*/
	setStatus: function (message) {
      const status = document.getElementById('status')
      status.innerHTML = message
    },
  
    //PoolFactory pool queries

	/**
	* Return all existing pool addresses in a list
	*
	* @return {string[]} all existing pool addresses in a list
	*/
    getAllPools: async function(){

    },
  
	/**
	* Return one pool address of the given index
	*
	* @param {number} index
	* @return {string} Pool address
	*/
    getPool: async function(index){

    },
  
	/**
	*Returns a list of pool addresses between a first and last index (including boundaries)
	*
	* @param {number} firstIndex 
	* @param {number} lastIndex	
	* @return {string[]} list of pool adresses in range
	*/
    getPoolRange: async function(firstIndex, lastIndex){

    },
  
	/**
	* Retuns the number of pools created by the pool factory
	*
	* @return {number} number of pools
	*/
    getPoolNumber: async function(){

    },
  
	/**
	* Returns pool list for a sale address
	*
	* @param {string} saleAddress
	* @return {string[]} list of pool adresses for a given sale
	*/
    getPoolsBySales: async function(saleAddress){

    },
  
	/**
	* Cheks if a pool exists
	*
	* @param {string} poolAddress
	* @return {boolean} true if pool exists, fales if not
	*/
    checkIfPoolExists: async function(poolAddress){

    },

    //PoolFactory param getters
  
	/**
	* Get owner address of pool factory
	*
	* @return {string} owner address of pool factory
	*/
    getOwner: async function(){

    },
  
	/**
	* Get the KYC contract address tied to the PoolFactory contract
	*
	* @return {string} KYC contract address
	*/
    getPoolFactoryKycContractAddress: async function(){

    },
  
	/**
	* Get flat fee for pool creation (1/1000)
	*
	* @return {BigNumber} flat fee for pool creation (1/1000)
	*/
    getFlatFee: async function(){

    },
  
	/**
	* Get fee rate for maximum pool allocation (1/1000)
	*
	* @return {BigNumber} fee rate for maximum pool allocation (1/1000)
	*/
    getMaxAllocationFeeRate: async function(){

    },
  
	/**
	* Get maximum allowed fee rates set by crators for pools (1/1000)
	*
	* @return {BigNumber} maximum allowed fee rate (1/1000)
	*/
    getMaxCreatorFeeRate: async function(){

    },
  
	/**
	* Get provider fee rate for pools (1/1000)
	*
	* @return {BigNumber} Get provider fee rate for pools (1/1000)
	*/
    getProviderFeeRate: async function(){

    },
  
    //PoolFactory param setters (onlyOwner)

	/**
	* Set owner address in PoolFactory contract, only current owner has authority
	*
	* @param {string} ownerAddress
	*/
    setOwner: async function(ownerAddress){

    },
  
	/**
	* Set KYC contract address in PoolFactory contract, only owner has authority
	*
	* @param {string} kycContractAddress
	*/
    setKycContractAddress: async function(kycContractAddress){

    },
  
	/**
	* Set flat fee in PoolFactory contract for creating pools, only owner has authority
	*
	* @param {BigNumber} flatFee flat fee for pool creation
	*/
    setFlatFee: async function(flatFee){

    },
  
	/**
	* Set maximum allocation fee for creating pools, only owner has authority
	*
	* @param {BigNumber} maxAllocationFeeRate fee "taxing" the maximum allocation parameter
	*/
    setMaxAllocationFeeRate: async function(maxAllocationFeeRate){

    },
  
	/**
	* Set maximum allowed fee for pool creators, only owner has authority
	*
	* @param {BigNumber} maxCreatorFeeRate maximum amount of fee creators can set for a pool
	*/
    setMaxCreatorFeeRate: async function(maxCreatorFeeRate){

    },
  
	/**
	* Set provider fee rate for creating pools, only owner has authority
	*
	* @param {BigNumber} providerFeeRate provider fees for pools
	*/
    setProviderFeeRate: async function(providerFeeRate){

    },
  
    //Pool factory stats getters

	/**
	* Retruns the whole ETH balace of the PoolFactory contract
	*
	* @return {BigNumber} the whole ETH balace of the PoolFactory contract
	*/
    getPoolFactoryBalance: async function(){

    },
  
    //PoolFactory operations
	
	/**
	*Function for creating pools, needs ethereum sent to it (payable)
	*
	* @param {string} saleAddress address of the ICO token sale contract
	* @param {string} tokenAddress address of the erc20 token distributed in the sale
	* @param {BigNumber} creatorFeeRate 1/1000 fee rate of the pool income payed to the pool creator
	* @param {BigNumber} saleStartDate unix timestamp in seconds of the start of the sale
	* @param {BigNumber} saleEndDate unix timestamp in seconds of the end of the sale
	* @param {BigNumber} minContribution minimum amount of ETH contribution allowed in one tx
	* @param {BigNumber} maxContribution maximum amount of ETH contribution allowed in one tx
	* @param {BigNumber} minPoolGoal minimum amount of ETH needed to be raised by the pool for the sale
	* @param {BigNumber} maxPoolAllocation minimum amount of ETH allowed to be raised by the pool for the sale
	* @param {BigNumber} withdrawTimelock unix timestamp in seconds for how much time funds are locked from withdrawal after contribution
	* @param {boolean} whitelistPool pool has address whitelist or not
	*/
    createPool: async function(
        saleAddress, 
        tokenAddress, 
        creatorFeeRate, 
        saleStartDate, 
        saleEndDate, 
        minContribution, 
        maxContribution, 
        minPoolGoal, 
        maxPoolAllocation, 
        withdrawTimelock, 
        whitelistPool
    ){

    },
  
	/**
	*Description
	*
	* @param {type} description
	* @return {type} description
	*/
    withdraw: async function(){ //onlyOwner

    },
  
    //Pool
    //Pool param getters

	/**
	*Description
	*
	* @param {type} description
	* @return {type} description
	*/
    getPoolKycContractAddress: async function(poolAddress){

    },
  
	/**
	*Description
	*
	* @param {type} description
	* @return {type} description
	*/
    getProviderAddress: async function(poolAddress){

    },
  
	/**
	*Description
	*
	* @param {type} description
	* @return {type} description
	*/
    getCreatorAddress: async function(poolAddress){

    },
  
	/**
	*Description
	*
	* @param {type} description
	* @return {type} description
	*/
    getProviderFeeRate: async function(poolAddress){

    },
  
	/**
	*Description
	*
	* @param {type} description
	* @return {type} description
	*/
    getCreatorFeeRate: async function(poolAddress){

    },
  
	/**
	*Description
	*
	* @param {type} description
	* @return {type} description
	*/
    getSaleAddress: async function(poolAddress){

    },    
    
    getTokenAddress: async function(poolAddress){

    },
  
	/**
	*Description
	*
	* @param {type} description
	* @return {type} description
	*/    
    getMinContribution: async function(poolAddress){

    },
  
	/**
	*Description
	*
	* @param {type} description
	* @return {type} description
	*/
    getMaxContribution: async function(poolAddress){

    },
  
	/**
	*Description
	*
	* @param {type} description
	* @return {type} description
	*/
    getMinPoolGoal: async function(poolAddress){

    },
  
	/**
	*Description
	*
	* @param {type} description
	* @return {type} description
	*/
    getMaxPoolGoal: async function(poolAddress){

    },
  
	/**
	*Description
	*
	* @param {type} description
	* @return {type} description
	*/
    getWithdrawTimelock: async function(poolAddress){

    },
  
	/**
	*Description
	*
	* @param {type} description
	* @return {type} description
	*/
    getSaleParticipateFunctionSig: async function(poolAddress){

    },
  
	/**
	*Description
	*
	* @param {type} description
	* @return {type} description
	*/
    getSaleWtidrawFunctionSig: async function(poolAddress){

    },
  
	/**
	*Description
	*
	* @param {type} description
	* @return {type} description
	*/
    isWhitelistPool: async function(poolAddress){

    },
  
	/**
	*Description
	*
	* @param {type} description
	* @return {type} description
	*/
    isAdmin: async function(poolAddress, address){

    },
  
	/**
	*Description
	*
	* @param {type} description
	* @return {type} description
	*/
    isOnWhitelist: async function(poolAddress, address){

    },
  
	/**
	*Description
	*
	* @param {type} description
	* @return {type} description
	*/
    isOnCountryBlacklist: async function(poolAddress, countryCode){

    },
  
    //Pool stats getters
	
	/**
	*Description
	*
	* @param {type} description
	* @return {type} description
	*/
    getPoolBalance: async function(poolAddress){

    },
  
	/**
	*Description
	*
	* @param {type} description
	* @return {type} description
	*/
    getAllGrossContributions: async function(poolAddress){

    },
  
	/**
	*Description
	*
	* @param {type} description
	* @return {type} description
	*/
    getCreatorStash: async function(poolAddress){

    },
  
	/**
	*Description
	*
	* @param {type} description
	* @return {type} description
	*/
    getProviderStash: async function(poolAddress){

    },
  
	/**
	*Description
	*
	* @param {type} description
	* @return {type} description
	*/
    getTotalPayedOutByToken: async function(poolAddress, tokenAddress){

    },
  
	/**
	*Description
	*
	* @param {type} description
	* @return {type} description
	*/
    isSentToSale: async function(poolAddress){

    },
  
	/**
	*Description
	*
	* @param {type} description
	* @return {type} description
	*/
    areTokensReceivedConfirmed: async function(poolAddress){

    },
  
    //Pool contributor queries

	/**
	*Description
	*
	* @param {type} description
	* @return {type} description
	*/
    getAllContibutors: async function(poolAddress){

    },
  
	/**
	*Description
	*
	* @param {type} description
	* @return {type} description
	*/    
    getContributor: async function(poolAddress, index){

    },
  
	/**
	*Description
	*
	* @param {type} description
	* @return {type} description
	*/
    getContributorNumber: async function(poolAddress){

    },
  
	/**
	*Description
	*
	* @param {type} description
	* @return {type} description
	*/
    getLastContributionTimeByContributor: async function(poolAddress, contributorAddress){

    },
  
	/**
	*Description
	*
	* @param {type} description
	* @return {type} description
	*/
    getGrossContributionByContributor: async function(poolAddress, contributorAddress){

    },
  
	/**
	*Description
	*
	* @param {type} description
	* @return {type} description
	*/
    getPayedOutByContributorByToken: async function(poolAddress, contributorAddress, tokenAddress){

    },
  
    //Pool operations

	/**
	*Description
	*
	* @param {type} description
	* @return {type} description
	*/
    addAdmin: async function(poolAddress, adminAddress){

    },
  
	/**
	*Description
	*
	* @param {type} description
	* @return {type} description
	*/
    addAdminList: async function(poolAddress, adminAddressList){

    },
  
	/**
	*Description
	*
	* @param {type} description
	* @return {type} description
	*/
    removeAdmin: async function(poolAddress, adminAddress){

    },
  
	/**
	*Description
	*
	* @param {type} description
	* @return {type} description
	*/
    addWhitelist: async function(poolAddress, whitelistAddress){

    },
  
	/**
	*Description
	*
	* @param {type} description
	* @return {type} description
	*/
    addWhitelistList: async function(poolAddress, whitelistAddressList){

    },
  
	/**
	*Description
	*
	* @param {type} description
	* @return {type} description
	*/
    removeWhitelist: async function(poolAddress, whitelistAddress){

    },
  
	/**
	*Description
	*
	* @param {type} description
	* @return {type} description
	*/
    addCountryBlacklist: async function(poolAddress, countryCode){

    },
  
	/**
	*Description
	*
	* @param {type} description
	* @return {type} description
	*/
    addCountryBlacklistList: async function(poolAddress, countryCodeList){

    },
  
	/**
	*Description
	*
	* @param {type} description
	* @return {type} description
	*/
    removeCountryBlacklist: async function(poolAddress, countryCode){

    },
  
	/**
	*Description
	*
	* @param {type} description
	* @return {type} description
	*/
    contribute: async function(poolAddress){

    },
  
	/**
	*Description
	*
	* @param {type} description
	* @return {type} description
	*/
    withdraw: async function(poolAddress){

    },
  
	/**
	*Description
	*
	* @param {type} description
	* @return {type} description
	*/
    withdrawRefund: async function(poolAddress){

    },
  
	/**
	*Description
	*
	* @param {type} description
	* @return {type} description
	*/
    withdrawToken: async function(poolAddress){

    },
  
	/**
	*Description
	*
	* @param {type} description
	* @return {type} description
	*/
    withdrawCustomToken: async function(poolAddress, tokenAddress){

    },
  
	/**
	*Description
	*
	* @param {type} description
	* @return {type} description
	*/
    pushOutToken: async function(poolAddress, recipientAddress){

    },
  
	/**
	*Description
	*
	* @param {type} description
	* @return {type} description
	*/
    changeTokenAddress: async function(poolAddress, tokenAddress){

    },
  
	/**
	*Description
	*
	* @param {type} description
	* @return {type} description
	*/
    confirmTokensReceived: async function(poolAddress, tokensExpected){

    },
  
	/**
	*Description
	*
	* @param {type} description
	* @return {type} description
	*/
    sendToSale: async function(poolAddress){

    },
  
	/**
	*Description
	*
	* @param {type} description
	* @return {type} description
	*/
    sendToSaleFunction: async function(poolAddress){

    },
  
	/**
	*Description
	*
	* @param {type} description
	* @return {type} description
	*/
    withdrawFromSaleFunction: async function(poolAddress){

    },
  
	/**
	*Description
	*
	* @param {type} description
	* @return {type} description
	*/
    poviderWithdraw: async function(poolAddress){

    },
  
	/**
	*Description
	*
	* @param {type} description
	* @return {type} description
	*/
    creatorWithdraw: async function(poolAddress){

    },
  
    //Pool param setters

	/**
	*Description
	*
	* @param {type} description
	* @return {type} description
	*/
    setProvider: async function(poolAddress, providerAddress){

    },
  
	/**
	*Description
	*
	* @param {type} description
	* @return {type} description
	*/
    setCreator: async function(poolAddress, creatorAddress){

    },
  
	/**
	*Description
	*
	* @param {type} description
	* @return {type} description
	*/
    setProviderFeeRate: async function(poolAddress, providerFeeRate){

    },
  
	/**
	*Description
	*
	* @param {type} description
	* @return {type} description
	*/
    setCreatorFeeRate: async function(poolAddress, creatorFeeRate){

    },
  
	/**
	*Description
	*
	* @param {type} description
	* @return {type} description
	*/
    setTokenAddress: async function(poolAddress, tokenAddress){

    },
  
	/**
	*Description
	*
	* @param {type} description
	* @return {type} description
	*/
    setWhitelistPool: async function(poolAddress, isWhitelistPool){

    },
  
	/**
	*Description
	*
	* @param {type} description
	* @return {type} description
	*/
    setSaleStartDate: async function(poolAddress, saleStartDate){

    },
  
	/**
	*Description
	*
	* @param {type} description
	* @return {type} description
	*/
    setSaleEndDate: async function(poolAddress, saleEndDate){

    },
  
	/**
	*Description
	*
	* @param {type} description
	* @return {type} description
	*/
    setMinContribution: async function(poolAddress, minContribution){

    },
  
	/**
	*Description
	*
	* @param {type} description
	* @return {type} description
	*/
    setMaxContribution: async function(poolAddress, maxContribution){

    },
  
	/**
	*Description
	*
	* @param {type} description
	* @return {type} description
	*/
    setMinPoolGoal: async function(poolAddress, minPoolGoal){

    },
  
	/**
	*Description
	*
	* @param {type} description
	* @return {type} description
	*/
    setMaxPoolAllocation: async function(poolAddress, maxPoolAllocation){

    },
  
	/**
	*Description
	*
	* @param {type} description
	* @return {type} description
	*/
    setWithdrawTimelock: async function(poolAddress, withdrawTimelock){

    }

}