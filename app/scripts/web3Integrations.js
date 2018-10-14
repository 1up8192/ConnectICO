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
  
    setStatus: function (message) {
      const status = document.getElementById('status')
      status.innerHTML = message
    },

    //PoolFactory pool queries

    getAllPools: async function(){

    }, 
    
    getPool: async function(index){

    },

    getPoolRange: async function(firstIndex, lastIndex){

    },

    getPoolNumber: async function(){

    },

    getPoolsBySales: async function(saleAddress){

    },

    checkIfPoolExists: async function(poolAddress){

    },

    //PoolFactory param getters

    getOwner: async function(){

    },

    getPoolFactoryKycContractAddress: async function(){

    },

    getFlatFee: async function(){

    },

    getMaxAllocationFeeRate: async function(){

    },

    getMaxCreatorFeeRate: async function(){

    },

    getProviderFeeRate: async function(){

    },

    //PoolFactory param setters (onlyOwner)

    setOwner: async function(ownerAddress){

    },

    setKycContractAddress: async function(kycContractAddress){

    },

    setFlatFee: async function(flatFee){

    },

    setMaxAllocationFeeRate: async function(maxAllocationFeeRate){

    },

    setMaxCreatorFeeRate: async function(maxCreatorFeeRate){

    },

    setProviderFeeRate: async function(providerFeeRate){

    },

    //Pool factory stats getters

    getPoolFactoryBalance: async function(){

    },

    //PoolFactory operations
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

    withdraw: async function(){ //onlyOwner

    },

    //Pool
    //Pool param getters

    getPoolKycContractAddress: async function(poolAddress){

    },

    getProviderAddress: async function(poolAddress){

    },

    getCreatorAddress: async function(poolAddress){

    },

    getProviderFeeRate: async function(poolAddress){

    },

    getCreatorFeeRate: async function(poolAddress){

    },

    getSaleAddress: async function(poolAddress){

    },    
    
    getTokenAddress: async function(poolAddress){

    },
    
    getMinContribution: async function(poolAddress){

    },

    getMaxContribution: async function(poolAddress){

    },

    getMinPoolGoal: async function(poolAddress){

    },

    getMaxPoolGoal: async function(poolAddress){

    },

    getWithdrawTimelock: async function(poolAddress){

    },

    getSaleParticipateFunctionSig: async function(poolAddress){

    },

    getSaleWtidrawFunctionSig: async function(poolAddress){

    },

    isWhitelistPool: async function(poolAddress){

    },

    isAdmin: async function(poolAddress, address){

    },

    isOnWhitelist: async function(poolAddress, address){

    },

    isOnCountryBlacklist: async function(poolAddress, countryCode){

    },

    //Pool stats getters
    getPoolBalance: async function(poolAddress){

    },

    getAllGrossContributions: async function(poolAddress){

    },

    getCreatorStash: async function(poolAddress){

    },

    getProviderStash: async function(poolAddress){

    },

    getTotalPayedOutByToken: async function(poolAddress, tokenAddress){

    },

    isSentToSale: async function(poolAddress){

    },

    areTokensReceivedConfirmed: async function(poolAddress){

    },

    //Pool contributor queries

    getAllContibutors: async function(poolAddress){

    }, 
    
    getContributor: async function(poolAddress, index){

    },

    getContributorNumber: async function(poolAddress){

    },

    getLastContributionTimeByContributor: async function(poolAddress, contributorAddress){

    },

    getGrossContributionByContributor: async function(poolAddress, contributorAddress){

    },

    getPayedOutByContributorByToken: async function(poolAddress, contributorAddress, tokenAddress){

    },

    //Pool operations

    addAdmin: async function(poolAddress, adminAddress){

    },

    addAdminList: async function(poolAddress, adminAddressList){

    },

    removeAdmin: async function(poolAddress, adminAddress){

    },

    addWhitelist: async function(poolAddress, whitelistAddress){

    },

    addWhitelistList: async function(poolAddress, whitelistAddressList){

    },

    removeWhitelist: async function(poolAddress, whitelistAddress){

    },

    addCountryBlacklist: async function(poolAddress, countryCode){

    },

    addCountryBlacklistList: async function(poolAddress, countryCodeList){

    },

    removeCountryBlacklist: async function(poolAddress, countryCode){

    },

    contribute: async function(poolAddress){

    },

    withdraw: async function(poolAddress){

    },

    withdrawRefund: async function(poolAddress){

    },

    withdrawToken: async function(poolAddress){

    },

    withdrawCustomToken: async function(poolAddress, tokenAddress){

    },

    pushOutToken: async function(poolAddress, recipientAddress){

    },

    changeTokenAddress: async function(poolAddress, tokenAddress){

    },

    confirmTokensReceived: async function(poolAddress, tokensExpected){

    },

    sendToSale: async function(poolAddress){

    },

    sendToSaleFunction: async function(poolAddress){

    },

    withdrawFromSaleFunction: async function(poolAddress){

    },

    poviderWithdraw: async function(poolAddress){

    },

    creatorWithdraw: async function(poolAddress){

    },


    //Pool param setters

    setProvider: async function(poolAddress, providerAddress){

    },

    setCreator: async function(poolAddress, creatorAddress){

    },

    setProviderFeeRate: async function(poolAddress, providerFeeRate){

    },

    setCreatorFeeRate: async function(poolAddress, creatorFeeRate){

    },

    setTokenAddress: async function(poolAddress, tokenAddress){

    },

    setWhitelistPool: async function(poolAddress, isWhitelistPool){

    },

    setSaleStartDate: async function(poolAddress, saleStartDate){

    },

    setSaleEndDate: async function(poolAddress, saleEndDate){

    },

    setMinContribution: async function(poolAddress, minContribution){

    },

    setMaxContribution: async function(poolAddress, maxContribution){

    },

    setMinPoolGoal: async function(poolAddress, minPoolGoal){

    },

    setMaxPoolAllocation: async function(poolAddress, maxPoolAllocation){

    },

    setWithdrawTimelock: async function(poolAddress, withdrawTimelock){

    }

}