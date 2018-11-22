// Import the page's CSS. Webpack will know what to do with it.
import '../styles/app.css';

// Import libraries we need.
import { default as Web3 } from 'web3';
import { default as contract } from 'truffle-contract';

// Import our contract artifacts and turn them into usable abstractions.
import poolArtifact from '../../build/contracts/Pool.json';
import poolFactoryArtifact from '../../build/contracts/PoolFactory.json';
import kycArtifact from '../../build/contracts/KYC.json';
import tokenPushRegistryArtifact from '../../build/contracts/TokenPushRegistry.json';



// MetaCoin is our usable abstraction, which we'll use through the code below.
//const MetaCoin = contract(metaCoinArtifact)

var Pool = contract(poolArtifact);
var PoolFactory = contract(poolFactoryArtifact);
var KYC = contract(kycArtifact);
var TokenPushRegistry = contract(tokenPushRegistryArtifact);


// The following code is simple to show off interacting with your contracts.
// As your needs grow you will likely need to change its form and structure.
// For application bootstrapping, check out window.addEventListener below.
let accounts
let account

const App = {
    start: function () {
      const self = this
  
      // Bootstrap the abstractions for Use.
      Pool.setProvider(web3.currentProvider)
      PoolFactory.setProvider(web3.currentProvider)
      KYC.setProvider(web3.currentProvider)
      TokenPushRegistry.setProvider(web3.currentProvider)
  
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
		
		console.log("start done");
  
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

	getKYCOwner: function(){
		var instance;
		var result;
		console.log(1);

		KYC.deployed().then(function(_instance) {
			console.log(2);

			instance = _instance;
			return instance.owner.call({from: account});
		}).then(function(value) {
			console.log(3);

			result = value.toString();
			console.log(result);
			output.innerHTML = result;
			return result;
		});
    },
	
	/**
	* Return all existing pool addresses in a list
	*
	* Frontend page: PoolFactory info page
	*
	* @return {string[]} all existing pool addresses in a list
	*/
    getAllPools: function(){
		var instance;
		var result;
		PoolFactory.deployed().then(function(_instance) {
			instance = _instance;
			return instance.poolList.call({from: account});
		}).then(function(value) {
			result = value.toString();
			console.log(result);
			output.innerHTML = result;
			return result;
		});
    },
  
	/**
	* Return one pool address of the given index
	*
	* Frontend page: PoolFactory info page
	*
	* @param {number} index
	* @return {string} Pool address
	*/

    getPool: function(index){
		var instance;
		var result;
		console.log(1);
		console.log(PoolFactory);
		PoolFactory.deployed().then(function(_instance) {
			instance = _instance;
			console.log(2);
			return instance.poolList.call(index, {from: account});
		}).then(function(value) {
			console.log(3);
			result = value.toString();
			console.log(result);
			output.innerHTML = result;
			return result;
		});
    },
  
	/**
	*Returns a list of pool addresses between a first and last index (including boundaries)
	* 
	* Frontend page: PoolFactory info page
	*
	* @param {number} firstIndex 
	* @param {number} lastIndex	
	* @return {string[]} list of pool adresses in range
	*/
    /* getPoolRange: async function(firstIndex, lastIndex){
		var instance;
		var result;
		PoolFactory.deployed().then(function(_instance) {
			instance = _instance;
			return instance.poolList.call(index, {from: account});
		}).then(function(value) {
			result = value.toString();
			console.log(result);
			output.innerHTML = result;
			return result;
		});
    }, */
  
	/**
	* Retuns the number of pools created by the pool factory
	*
	* Frontend page: PoolFactory info page
	*
	* @return {number} number of pools
	*/
    getPoolNumber: async function(){
		var instance;
		var result;
		PoolFactory.deployed().then(function(_instance) {
			instance = _instance;
			return instance.poolList.length.call({from: account});
		}).then(function(value) {
			result = value.toNumber();
			console.log(result);
			output.innerHTML = result;
			return result;
		});
    },
  
	/**
	* Returns pool list for a sale address
	*
	* Frontend page: PoolFactory info page
	*
	* @param {string} saleAddress
	* @return {string[]} list of pool adresses for a given sale
	*/
    getPoolsBySales: async function(saleAddress){
		var instance;
		var result;
		PoolFactory.deployed().then(function(_instance) {
			instance = _instance;
			return instance.poolsBySales.call(saleAddress, {from: account});
		}).then(function(value) {
			result = value.toString();
			console.log(result);
			output.innerHTML = result;
			return result;
		});
    },
  
	/**
	* Cheks if a pool exists
	*
	* Frontend page: PoolFactory info page
	*
	* @param {string} poolAddress
	* @return {boolean} true if pool exists, fales if not
	*/
    checkIfPoolExists: async function(poolAddress){
		var instance;
		var result;
		PoolFactory.deployed().then(function(_instance) {
			instance = _instance;
			return instance.pools.call(poolAddress, {from: account});
		}).then(function(value) {
			result = value;
			console.log(result);
			output.innerHTML = result;
			return result;
		});
    },

	//PoolFactory param getters

	/**
	 * Get all PoolFactory parameters
	 * 
	 * Frontend page: PoolFactory info page
	 * 
	 * @typedef {Object} Params
	 * 
	 * @property {string} owner - address of pool factory
	 * @property {string} kycContractAddress - KYC contract address
	 * @property {number} flatFee - flat fee for pool creation (1/1000)
	 * @property {number} maxAllocationFeeRate - fee rate for maximum pool allocation (1/1000)
	 * @property {number} maxCreatorFeeRate - maximum allowed fee rate (1/1000)
	 * @property {number} providerFeeRate - provider fee rate for pools (1/1000)
	 * 
	 * @return {Params}
	 */
	
	getPoolFactoryParams: async function(){
		var instance;
		var result = {
			owner: null,
        	kycContractAddress: null,
        	flatFee: null,
        	maxAllocationFeeRate: null, // 1/1000
        	maxCreatorFeeRate: null, // 1/1000
        	providerFeeRate: null // 1/1000
		}
		PoolFactory.deployed().then(function(_instance) {
			instance = _instance;
			return instance.params.call(poolAddress, {from: account});
		}).then(function(value) {
			result.owner = value[0].toString();
			result.kycContractAddress = value[1].toString();
			result.flatFee = value[2].toNumber();
			result.maxAllocationFeeRate = value[3].toNumber();
			result.maxCreatorFeeRate = value[4].toNumber();
			result.providerFeeRate = value[5].toNumber();
			console.log(result);
			output.innerHTML = result;
			return result;
		});
	},
  
	/**
	* Get owner address of pool factory
	*
	* Frontend page: PoolFactory info page
	*
	* @return {string} owner address of pool factory
	*/


    getPoolFactoryOwner: async function(){
		var instance;
		var result;
		PoolFactory.deployed().then(function(_instance) {
			instance = _instance;
			return instance.params.owner.call({from: account});
		}).then(function(value) {
			result = value.toString();
			console.log(result);
			output.innerHTML = result;
			return result;
		});
    },
  
	/**
	* Get the KYC contract address tied to the PoolFactory contract
	*
	* Frontend page: PoolFactory info page
	*
	* @return {string} KYC contract address
	*/
    getPoolFactoryKycContractAddress: async function(){
		var instance;
		var result;
		PoolFactory.deployed().then(function(_instance) {
			instance = _instance;
			return instance.params.kycContractAddress.call({from: account});
		}).then(function(value) {
			result = value.toString();
			console.log(result);
			output.innerHTML = result;
			return result;
		});
    },
  
	/**
	* Get flat fee for pool creation (1/1000)
	*
	* Frontend page: PoolFactory info page
	*
	* @return {BigNumber} flat fee for pool creation (1/1000)
	*/
    getFlatFee: async function(){
		var instance;
		var result;
		PoolFactory.deployed().then(function(_instance) {
			instance = _instance;
			return instance.params.flatFee.call({from: account});
		}).then(function(value) {
			result = value.toNumber();
			console.log(result);
			output.innerHTML = result;
			return result;
		});
    },
  
	/**
	* Get fee rate for maximum pool allocation (1/1000)
	*
	* Frontend page: PoolFactory info page
	*
	* @return {BigNumber} fee rate for maximum pool allocation (1/1000)
	*/
    getMaxAllocationFeeRate: async function(){
		var instance;
		var result;
		PoolFactory.deployed().then(function(_instance) {
			instance = _instance;
			return instance.params.maxAllocationFeeRate.call({from: account});
		}).then(function(value) {
			result = value.toNumber();
			console.log(result);
			output.innerHTML = result;
			return result;
		});
    },
  
	/**
	* Get maximum allowed fee rates set by crators for pools (1/1000)
	*
	* Frontend page: PoolFactory info page
	*
	* @return {BigNumber} maximum allowed fee rate (1/1000)
	*/
    getMaxCreatorFeeRate: async function(){
		var instance;
		var result;
		PoolFactory.deployed().then(function(_instance) {
			instance = _instance;
			return instance.params.maxCreatorFeeRate.call({from: account});
		}).then(function(value) {
			result = value.toNumber();
			console.log(result);
			output.innerHTML = result;
			return result;
		});
    },
  
	/**
	* Get provider fee rate for pools (1/1000)
	*
	* Frontend page: PoolFactory info page
	*
	* @return {BigNumber} Get provider fee rate for pools (1/1000)
	*/
    getProviderFeeRate: async function(){
		var instance;
		var result;
		PoolFactory.deployed().then(function(_instance) {
			instance = _instance;
			return instance.params.providerFeeRate.call({from: account});
		}).then(function(value) {
			result = value.toNumber();
			console.log(result);
			output.innerHTML = result;
			return result;
		});
    },
  
	//PoolFactory param setters (onlyOwner)
	
	/**
	 * 
	 * Set all parameters
	 * 
	 * Should be null if you dont want to change a particular parameter
	 * 
	 * @param {string} _owner - address of pool factory
	 * @param {string} _kycContractAddress - KYC contract address
	 * @param {number} _flatFee - flat fee for pool creation (1/1000)
	 * @param {number} _maxAllocationFeeRate - fee rate for maximum pool allocation (1/1000)
	 * @param {number} _maxCreatorFeeRate - maximum allowed fee rate (1/1000)
	 * @param {number} _providerFeeRate - provider fee rate for pools (1/1000)
	 * 
	 */

	setPoolFactoryParams: async function(_ownerAddress, _kycContractAddress, _flatFee, _maxAllocationFeeRate, _maxCreatorFeeRate, _providerFeeRate){
		var instance;
		var result;
		var ownerAddress;
        var kycContractAddress;
        var flatFee;
        var maxAllocationFeeRate;
        var maxCreatorFeeRate;
		var providerFeeRate;
		var toUpdate = [];
		if(_ownerAddress === null){
			ownerAddress = 0x0;
			toUpdate.push(false);
		} else {
			ownerAddress = _ownerAddress;
			toUpdate.push(true);
		}

		if(_kycContractAddress === null){
			kycContractAddress = 0x0;
			toUpdate.push(false);
		} else {
			kycContractAddress = _kycContractAddress;
			toUpdate.push(true);
		}

		if(_flatFee === null){
			flatFee = 0;
			toUpdate.push(false);
		} else {
			flatFee = _flatFee;
			toUpdate.push(true);
		}

		if(_maxAllocationFeeRate === null){
			maxAllocationFeeRate = 0;
			toUpdate.push(false);
		} else {
			maxAllocationFeeRate = _maxAllocationFeeRate;
			toUpdate.push(true);
		}

		if(_maxCreatorFeeRate === null){
			maxCreatorFeeRate = 0;
			toUpdate.push(false);
		} else {
			maxCreatorFeeRate = _maxCreatorFeeRate;
			toUpdate.push(true);
		}

		if(_providerFeeRate === null){
			providerFeeRate = 0;
			toUpdate.push(false);
		} else {
			providerFeeRate = _providerFeeRate;
			toUpdate.push(true);
		}


		PoolFactory.deployed().then(function(_instance) {
			instance = _instance;
			return instance.setParams(ownerAddress, kycContractAddress, flatFee, maxAllocationFeeRate, maxCreatorFeeRate, providerFeeRate, toUpdate,  {from: account});
		}).then(function(reciept) {
			result = reciept;
			console.log(result);
			output.innerHTML = result;
			return result;
		});
	},

	/**
	* Set owner address in PoolFactory contract, only current owner has authority
	*
	* Frontend page: PoolFactory admin page for provider/owner
	*
	* @param {string} ownerAddress
	*/
    setOwner: async function(ownerAddress){
		var instance;
		var result;
		PoolFactory.deployed().then(function(_instance) {
			instance = _instance;
			return instance.setParams(ownerAddress, 0x0, 0, 0, 0, 0, [true, false, false, false, false, false],  {from: account});
		}).then(function(reciept) {
			result = reciept;
			console.log(result);
			output.innerHTML = result;
			return result;
		});
    },
  
	/**
	* Set KYC contract address in PoolFactory contract, only owner has authority
	*
	* Frontend page: PoolFactory admin page for provider/owner
	*
	* @param {string} kycContractAddress
	*/
    setKycContractAddress: async function(kycContractAddress){
		var instance;
		var result;
		PoolFactory.deployed().then(function(_instance) {
			instance = _instance;
			return instance.setParams(0x0, kycContractAddress, 0, 0, 0, 0, [false, true, false, false, false, false],  {from: account});
		}).then(function(reciept) {
			result = reciept;
			console.log(result);
			output.innerHTML = result;
			return result;
		});
    },
  
	/**
	* Set flat fee in PoolFactory contract for creating pools, only owner has authority
	*
	* Frontend page: PoolFactory admin page for provider/owner
	*
	* @param {BigNumber} flatFee flat fee for pool creation
	*/
    setFlatFee: async function(flatFee){
		var instance;
		var result;
		PoolFactory.deployed().then(function(_instance) {
			instance = _instance;
			return instance.setParams(0x0, 0x0, flatFee, 0, 0, 0, [false, false, true, false, false, false],  {from: account});
		}).then(function(reciept) {
			result = reciept;
			console.log(result);
			output.innerHTML = result;
			return result;
		});
    },
  
	/**
	* Set maximum allocation fee for creating pools, only owner has authority
	*
	* Frontend page: PoolFactory admin page for provider/owner
	*
	* @param {BigNumber} maxAllocationFeeRate fee "taxing" the maximum allocation parameter
	*/
    setMaxAllocationFeeRate: async function(maxAllocationFeeRate){
		var instance;
		var result;
		PoolFactory.deployed().then(function(_instance) {
			instance = _instance;
			return instance.setParams(0x0, 0x0, 0, maxAllocationFeeRate, 0, 0, [false, false, false, true, false, false],  {from: account});
		}).then(function(reciept) {
			result = reciept;
			console.log(result);
			output.innerHTML = result;
			return result;
		});
    },
  
	/**
	* Set maximum allowed fee for pool creators, only owner has authority
	*
	* Frontend page: PoolFactory admin page for provider/owner
	*
	* @param {BigNumber} maxCreatorFeeRate maximum amount of fee creators can set for a pool
	*/
    setMaxCreatorFeeRate: async function(maxCreatorFeeRate){
		var instance;
		var result;
		PoolFactory.deployed().then(function(_instance) {
			instance = _instance;
			return instance.setParams(0x0, 0x0, 0, 0, maxCreatorFeeRate, 0, [false, false, false, false, true, false],  {from: account});
		}).then(function(reciept) {
			result = reciept;
			console.log(result);
			output.innerHTML = result;
			return result;
		});
    },
  
	/**
	* Set provider fee rate for creating pools, only owner has authority
	*
	* Frontend page: PoolFactory admin page for provider/owner
	*
	* @param {BigNumber} providerFeeRate provider fees for pools
	*/
    setProviderFeeRate: async function(providerFeeRate){
		var instance;
		var result;
		PoolFactory.deployed().then(function(_instance) {
			instance = _instance;
			return instance.setParams(0x0, 0x0, 0, 0, 0, providerFeeRate, [false, false, false, false, false, true],  {from: account});
		}).then(function(reciept) {
			result = reciept;
			console.log(result);
			output.innerHTML = result;
			return result;
		});
    },
  
    //Pool factory stats getters

	/**
	* Retruns the whole ETH balace of the PoolFactory contract
	*
	* Frontend page: PoolFactory info page
	*
	* @return {BigNumber} the whole ETH balace of the PoolFactory contract
	*/
    getPoolFactoryBalance: async function(){
		var instance;
		var result;
		PoolFactory.deployed().then(function(_instance) {
			instance = _instance;
			return instance.at();
		}).then(function(address) {
			return web3.eth,getBalance(address);
		}).then(function(value) {
			result = value.toString();
			console.log(result);
			output.innerHTML = result;
			return result;
		});
    },
  
    //PoolFactory operations
	
	/**
	* Function for creating pools, needs ethereum sent to it (payable)
	*
	* Frontend page: Pool creation page
	*
	* @param {string} saleAddress address of the ICO token sale contract
	* @param {string} tokenAddress address of the erc20 token distributed in the sale
	* @param {BigNumber} creatorFeeRate 1/1000 fee rate of the pool income payed to the pool creator
	* @param {BigNumber} saleStartDate unix timestamp in seconds of the start of the sale
	* @param {BigNumber} saleEndDate unix timestamp in seconds of the end of the sale
	* @param {BigNumber} minContribution minimum amount of ETH contribution allowed in one tx
	* @param {BigNumber} maxContribution maximum amount of ETH contribution allowed in one tx
	* @param {BigNumber} minPoolGoal minimum amount of ETH needed to be raised by the pool for the sale
	* @param {BigNumber} maxPoolAllocation maximum amount of ETH allowed to be raised by the pool for the sale
	* @param {BigNumber} withdrawTimelock unix timestamp in seconds for how much time funds are locked from withdrawal after contribution
	* @param {boolean} whitelistPool pool has address whitelist or not
	* @param {BigNumber} transferValue Ethereum fee for creating pools, must equal flatFee + (maxAllocationFeeRate * _maxPoolAllocation)/1000 or more
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
		whitelistPool,
		transferValue
    ){
		var instance;
		var result;
		PoolFactory.deployed().then(function(_instance) {
			instance = _instance;
			return instance.createPool(saleAddress, 
				tokenAddress, 
				creatorFeeRate, 
				saleStartDate, 
				saleEndDate, 
				minContribution, 
				maxContribution, 
				minPoolGoal, 
				maxPoolAllocation, 
				withdrawTimelock, 
				whitelistPool,
				{from: account,
				value: transferValue}
			);
		}).then(function(reciept) {
			result = reciept;
			console.log(result);
			output.innerHTML = result;
			return result;
		});
    },
  
	/**
	* Function for owner to withdraw accumulated fees from PoolFactory
	*
	* Frontend page: PoolFactory admin page for provider/owner
	*
	*/
    withdraw: async function(){ //onlyOwner
		var instance;
		var result;
		PoolFactory.deployed().then(function(_instance) {
			instance = _instance;
			return instance.withdraw({from: account});
		}).then(function(value) {
			result = value.toString();
			console.log(result);
			output.innerHTML = result;
			return result;
		});
    },
  
    //Pool
    //Pool param getters

	/**
	* Get the KYC contract address tied to the Pool contract
	*
	* Frontend page: Pool info page (can be the same as Pool contributor page)
	*
	* @param {string} poolAddress address of the Pool this function iteracts with 
	* @return {string} address of the KYC contract
	*/
    getPoolKycContractAddress: async function(poolAddress){
		var instance;
		var result;
		Pool.deployed().then(function(_instance) {
			instance = _instance;
			return instance.params.kycAddress(index, {from: account});
		}).then(function(value) {
			result = value.toString();
			console.log(result);
			output.innerHTML = result;
			return result;
		});
    },
  
	/**
	* Address of the service provider (same as pool factory owner)
	*
	* Frontend page: Pool info page (can be the same as Pool contributor page)
	*
	* @param {string} poolAddress address of the Pool this function iteracts with 
	* @return {string} address provider
	*/
    getProviderAddress: async function(poolAddress){
		var instance;
		var result;
		Pool.deployed().then(function(_instance) {
			instance = _instance;
			return instance.poolList.call(index, {from: account});
		}).then(function(value) {
			result = value.toString();
			console.log(result);
			output.innerHTML = result;
			return result;
		});
    },
  
	/**
	* Address of the pool creator
	*
	* Frontend page: Pool info page (can be the same as Pool contributor page)
	*
	* @param {string} poolAddress address of the Pool this function iteracts with 
	* @return {string} pool creator address
	*/
    getCreatorAddress: async function(poolAddress){
		var instance;
		var result;
		Pool.deployed().then(function(_instance) {
			instance = _instance;
			return instance.poolList.call(index, {from: account});
		}).then(function(value) {
			result = value.toString();
			console.log(result);
			output.innerHTML = result;
			return result;
		});
    },
  
	/**
	* Get fee rate for the service provider after every pool income (1/1000)
	*
	* Frontend page: Pool info page (can be the same as Pool contributor page)
	*
	* @param {string} poolAddress address of the Pool this function iteracts with 
	* @return {BigNumber} provider fee rate
	*/
    getProviderFeeRate: async function(poolAddress){
		var instance;
		var result;
		Pool.deployed().then(function(_instance) {
			instance = _instance;
			return instance.poolList.call(index, {from: account});
		}).then(function(value) {
			result = value.toString();
			console.log(result);
			output.innerHTML = result;
			return result;
		});
    },
  
	/**
	* Get fee rate for the pool creator after every pool income (1/1000)
	*
	* Frontend page: Pool info page (can be the same as Pool contributor page)
	*
	* @param {string} poolAddress address of the Pool this function iteracts with 
	* @return {BigNumber} creator fee rate
	*/
    getCreatorFeeRate: async function(poolAddress){
		var instance;
		var result;
		Pool.deployed().then(function(_instance) {
			instance = _instance;
			return instance.poolList.call(index, {from: account});
		}).then(function(value) {
			result = value.toString();
			console.log(result);
			output.innerHTML = result;
			return result;
		});
    },
  
	/**
	* Get address of the ICO token sale contract the pool is raising funds for
	*
	* Frontend page: Pool info page (can be the same as Pool contributor page)
	*
	* @param {string} poolAddress address of the Pool this function iteracts with 
	* @return {string} sale contract address
	*/
    getSaleAddress: async function(poolAddress){
		var instance;
		var result;
		Pool.deployed().then(function(_instance) {
			instance = _instance;
			return instance.poolList.call(index, {from: account});
		}).then(function(value) {
			result = value.toString();
			console.log(result);
			output.innerHTML = result;
			return result;
		});
    },    
	
	/**
	* Get address of the erc20 token distributed in the sale
	*
	* Frontend page: Pool info page (can be the same as Pool contributor page)
	*
	* @param {string} poolAddress address of the Pool this function iteracts with 
	* @return {string} token address
	*/  
    getTokenAddress: async function(poolAddress){
		var instance;
		var result;
		Pool.deployed().then(function(_instance) {
			instance = _instance;
			return instance.poolList.call(index, {from: account});
		}).then(function(value) {
			result = value.toString();
			console.log(result);
			output.innerHTML = result;
			return result;
		});
    },
  
	/**
	* Get minimum amount of ETH contribution allowed in one tx
	*
	* Frontend page: Pool info page (can be the same as Pool contributor page)
	*
	* @param {string} poolAddress address of the Pool this function iteracts with 
	* @return {BigNumber} minium contribution
	*/    
    getMinContribution: async function(poolAddress){
		var instance;
		var result;
		Pool.deployed().then(function(_instance) {
			instance = _instance;
			return instance.poolList.call(index, {from: account});
		}).then(function(value) {
			result = value.toString();
			console.log(result);
			output.innerHTML = result;
			return result;
		});
    },
  
	/**
	* Get maximum amount of ETH contribution allowed in one tx
	*
	* Frontend page: Pool info page (can be the same as Pool contributor page)
	*
	* @param {string} poolAddress address of the Pool this function iteracts with 
	* @return {BigNumber} maximum contribution
	*/
    getMaxContribution: async function(poolAddress){
		var instance;
		var result;
		Pool.deployed().then(function(_instance) {
			instance = _instance;
			return instance.poolList.call(index, {from: account});
		}).then(function(value) {
			result = value.toString();
			console.log(result);
			output.innerHTML = result;
			return result;
		});
    },
  
	/**
	* Getminimum amount of ETH needed to be raised by the pool for the sale
	*
	* Frontend page: Pool info page (can be the same as Pool contributor page)
	*
	* @param {string} poolAddress address of the Pool this function iteracts with 
	* @return {BigNumber} minimum pool goal
	*/
    getMinPoolGoal: async function(poolAddress){
		var instance;
		var result;
		Pool.deployed().then(function(_instance) {
			instance = _instance;
			return instance.poolList.call(index, {from: account});
		}).then(function(value) {
			result = value.toString();
			console.log(result);
			output.innerHTML = result;
			return result;
		});
    },
  
	/**
	* Get maximum amount of ETH allowed to be raised by the pool for the sale
	*
	* Frontend page: Pool info page (can be the same as Pool contributor page)
	*
	* @param {string} poolAddress address of the Pool this function iteracts with 
	* @return {BigNumber} max pool goal
	*/
    getMaxPoolGoal: async function(poolAddress){
		var instance;
		var result;
		Pool.deployed().then(function(_instance) {
			instance = _instance;
			return instance.poolList.call(index, {from: account});
		}).then(function(value) {
			result = value.toString();
			console.log(result);
			output.innerHTML = result;
			return result;
		});
    },
  
	/**
	* Get unix timestamp in seconds for how much time funds are locked from withdrawal after contribution
	*
	* Frontend page: Pool info page (can be the same as Pool contributor page)
	*
	* @param {string} poolAddress address of the Pool this function iteracts with 
	* @return {BigNumber} withdraw timelock
	*/
    getWithdrawTimelock: async function(poolAddress){
		var instance;
		var result;
		Pool.deployed().then(function(_instance) {
			instance = _instance;
			return instance.poolList.call(index, {from: account});
		}).then(function(value) {
			result = value.toString();
			console.log(result);
			output.innerHTML = result;
			return result;
		});
    },
  
	/**
	* Get sale function signature for the case of sales, that unable to receive funds the anonymus fallback function
	*
	* Frontend page: Pool info page (can be the same as Pool contributor page)
	*
	* @param {string} poolAddress address of the Pool this function iteracts with 
	* @return {string} sale function signature
	*/
    getSaleParticipateFunctionSig: async function(poolAddress){
		var instance;
		var result;
		Pool.deployed().then(function(_instance) {
			instance = _instance;
			return instance.poolList.call(index, {from: account});
		}).then(function(value) {
			result = value.toString();
			console.log(result);
			output.innerHTML = result;
			return result;
		});
    },
  
	/** 
	* Get withdraw function signature for the case of sales, that unable push out tokens automatically
	*
	* Frontend page: Pool info page (can be the same as Pool contributor page)
	*
	* @param {string} poolAddress address of the Pool this function iteracts with 
	* @return {string} withdraw function signature
	*/
    getSaleWtidrawFunctionSig: async function(poolAddress){
		var instance;
		var result;
		Pool.deployed().then(function(_instance) {
			instance = _instance;
			return instance.poolList.call(index, {from: account});
		}).then(function(value) {
			result = value.toString();
			console.log(result);
			output.innerHTML = result;
			return result;
		});
    },
  
	/**
	*Check if the pool enforces a whitelist for participants
	*
	* Frontend page: Pool info page (can be the same as Pool contributor page)
	*
	* @param {string} poolAddress address of the Pool this function iteracts with 
	* @return {boolean} is whitelist pool
	*/
    isWhitelistPool: async function(poolAddress){
		var instance;
		var result;
		Pool.deployed().then(function(_instance) {
			instance = _instance;
			return instance.poolList.call(index, {from: account});
		}).then(function(value) {
			result = value.toString();
			console.log(result);
			output.innerHTML = result;
			return result;
		});
    },
  
	/**
	* Checik if a given address is an admin address for the pool
	*
	* Frontend page: Pool info page (can be the same as Pool contributor page)
	*
	* @param {string} poolAddress address of the Pool this function iteracts with 
	* @param {string} address address to check
	* @return {bool} is admin
	*/
    isAdmin: async function(poolAddress, address){
		var instance;
		var result;
		Pool.deployed().then(function(_instance) {
			instance = _instance;
			return instance.poolList.call(index, {from: account});
		}).then(function(value) {
			result = value.toString();
			console.log(result);
			output.innerHTML = result;
			return result;
		});
    },
  
	/**
	* Check if the given address is on the whitelist of the pool
	*
	* Frontend page: Pool info page (can be the same as Pool contributor page)
	*
	* @param {string} poolAddress address of the Pool this function iteracts with 
	* @param {string} address address to check
	* @return {bool} is on whitelist
	*/
    isOnWhitelist: async function(poolAddress, address){
		var instance;
		var result;
		Pool.deployed().then(function(_instance) {
			instance = _instance;
			return instance.poolList.call(index, {from: account});
		}).then(function(value) {
			result = value.toString();
			console.log(result);
			output.innerHTML = result;
			return result;
		});
    },
  
	/**
	* Check a country code if its on blacklist for the pool
	*
	* Frontend page: Pool info page (can be the same as Pool contributor page)
	*
	* @param {string} poolAddress address of the Pool this function iteracts with 
	* @param {string} countryCode 3 letter country code (https://en.wikipedia.org/wiki/ISO_3166-1_alpha-3) 
	* @return {boolean} is on blacklist
	*/
    isOnCountryBlacklist: async function(poolAddress, countryCode){
		var instance;
		var result;
		Pool.deployed().then(function(_instance) {
			instance = _instance;
			return instance.poolList.call(index, {from: account});
		}).then(function(value) {
			result = value.toString();
			console.log(result);
			output.innerHTML = result;
			return result;
		});
    },
  
    //Pool stats getters
	
	/**
	* Get all ETH balance of a given pool contract
	*
	* Frontend page: Pool info page (can be the same as Pool contributor page)
	*
	* @param {string} poolAddress address of the Pool this function iteracts with 
	* @return {BigNumber} ETH balance
	*/
    getPoolBalance: async function(poolAddress){
		var instance;
		var result;
		Pool.deployed().then(function(_instance) {
			instance = _instance;
			return instance.poolList.call(index, {from: account});
		}).then(function(value) {
			result = value.toString();
			console.log(result);
			output.innerHTML = result;
			return result;
		});
    },
  
	/**
	* Get all ETH contributions of the pool without applying fees
	*
	* Frontend page: Pool info page (can be the same as Pool contributor page)
	*
	* @param {string} poolAddress address of the Pool this function iteracts with 
	* @return {BigNumber} all gross contributions
	*/
    getAllGrossContributions: async function(poolAddress){
		var instance;
		var result;
		Pool.deployed().then(function(_instance) {
			instance = _instance;
			return instance.poolList.call(index, {from: account});
		}).then(function(value) {
			result = value.toString();
			console.log(result);
			output.innerHTML = result;
			return result;
		});
    },
  
	/**
	* Get ETH amount that the pool creator collected from fees
	*
	* Frontend page: Pool info page (can be the same as Pool contributor page)
	*
	* @param {string} poolAddress address of the Pool this function iteracts with 
	* @return {BigNumber} creator stash
	*/
    getCreatorStash: async function(poolAddress){
		var instance;
		var result;
		Pool.deployed().then(function(_instance) {
			instance = _instance;
			return instance.poolList.call(index, {from: account});
		}).then(function(value) {
			result = value.toString();
			console.log(result);
			output.innerHTML = result;
			return result;
		});
    },
  
	/**
	* Get ETH amount that the service provider collected from fees
	*
	* Frontend page: Pool info page (can be the same as Pool contributor page)
	*
	* @param {string} poolAddress address of the Pool this function iteracts with 
	* @return {BigNumber} provider stash
	*/
    getProviderStash: async function(poolAddress){
		var instance;
		var result;
		Pool.deployed().then(function(_instance) {
			instance = _instance;
			return instance.poolList.call(index, {from: account});
		}).then(function(value) {
			result = value.toString();
			console.log(result);
			output.innerHTML = result;
			return result;
		});
    },
  
	/**
	* Get total token amouts that has been payed out the by pool by different tokens
	*
	* Frontend page: Pool info page (can be the same as Pool contributor page)
	*
	* @param {string} poolAddress address of the Pool this function iteracts with 
	* @param {string} tokenAddress address of the token we want to query the payout amount in ETH is 0x0
	* @return {BigNumber} payout amount
	*/
    getTotalPayedOutByToken: async function(poolAddress, tokenAddress){
		var instance;
		var result;
		Pool.deployed().then(function(_instance) {
			instance = _instance;
			return instance.poolList.call(index, {from: account});
		}).then(function(value) {
			result = value.toString();
			console.log(result);
			output.innerHTML = result;
			return result;
		});
    },
  
	/**
	* Cehck if the pool funds have been sent to sale
	*
	* Frontend page: Pool info page (can be the same as Pool contributor page)
	*
	* @param {string} poolAddress address of the Pool this function iteracts with 
	* @return {boolean} true: sent, false: not sent yet
	*/
    isSentToSale: async function(poolAddress){
		var instance;
		var result;
		Pool.deployed().then(function(_instance) {
			instance = _instance;
			return instance.poolList.call(index, {from: account});
		}).then(function(value) {
			result = value.toString();
			console.log(result);
			output.innerHTML = result;
			return result;
		});
    },
  
	/**
	* Check if token receiving is confirmed
	*
	* Frontend page: Pool info page (can be the same as Pool contributor page)
	*
	* @param {string} poolAddress address of the Pool this function iteracts with 
	* @return {boolean} true: confirmed, false: not confirmed yet
	*/
    areTokensReceivedConfirmed: async function(poolAddress){
		var instance;
		var result;
		Pool.deployed().then(function(_instance) {
			instance = _instance;
			return instance.poolList.call(index, {from: account});
		}).then(function(value) {
			result = value.toString();
			console.log(result);
			output.innerHTML = result;
			return result;
		});
    },
  
    //Pool contributor queries

	/**
	* Get the address list of all pool contributors
	*
	* Frontend page: Pool info page (can be the same as Pool contributor page)
	*
	* @param {string} poolAddress address of the Pool this function iteracts with 
	* @return {string[]} address list of all pool contributors
	*/
    getAllContibutors: async function(poolAddress){
		var instance;
		var result;
		Pool.deployed().then(function(_instance) {
			instance = _instance;
			return instance.poolList.call(index, {from: account});
		}).then(function(value) {
			result = value.toString();
			console.log(result);
			output.innerHTML = result;
			return result;
		});
    },
  
	/**
	* Get pool contributor address at index
	*
	* Frontend page: Pool info page (can be the same as Pool contributor page)
	*
	* @param {string} poolAddress address of the Pool this function iteracts with 
	* @param {number} index
	* @return {string} pool contributor address
	*/    
    getContributor: async function(poolAddress, index){
		var instance;
		var result;
		Pool.deployed().then(function(_instance) {
			instance = _instance;
			return instance.poolList.call(index, {from: account});
		}).then(function(value) {
			result = value.toString();
			console.log(result);
			output.innerHTML = result;
			return result;
		});
    },
  
	/**
	* Get number of individual pool contributors
	*
	* Frontend page: Pool info page (can be the same as Pool contributor page)
	*
	* @param {string} poolAddress address of the Pool this function iteracts with 
	* @return {number} number of individual pool contributors
	*/
    getContributorNumber: async function(poolAddress){
		var instance;
		var result;
		Pool.deployed().then(function(_instance) {
			instance = _instance;
			return instance.poolList.call(index, {from: account});
		}).then(function(value) {
			result = value.toString();
			console.log(result);
			output.innerHTML = result;
			return result;
		});
    },
  
	/**
	* Get the least contribuition time of a specific contributor
	*
	* Frontend page: Pool info page (can be the same as Pool contributor page)
	*
	* @param {string} poolAddress address of the Pool this function iteracts with 
	* @param {string} contributorAddress address of contributor
	* @return {BiGNumber} contribution time
	*/
    getLastContributionTimeByContributor: async function(poolAddress, contributorAddress){
		var instance;
		var result;
		Pool.deployed().then(function(_instance) {
			instance = _instance;
			return instance.poolList.call(index, {from: account});
		}).then(function(value) {
			result = value.toString();
			console.log(result);
			output.innerHTML = result;
			return result;
		});
    },
  
	/**
	* Get ETH contribution amount before fees applied by pool contributor
	*
	* Frontend page: Pool info page (can be the same as Pool contributor page)
	*
	* @param {string} poolAddress address of the Pool this function iteracts with 
	* @param {string} contributorAddress contributor address
	* @return {BigNumber} contribution amount
	*/
    getGrossContributionByContributor: async function(poolAddress, contributorAddress){
		var instance;
		var result;
		Pool.deployed().then(function(_instance) {
			instance = _instance;
			return instance.poolList.call(index, {from: account});
		}).then(function(value) {
			result = value.toString();
			console.log(result);
			output.innerHTML = result;
			return result;
		});
    },
  
	/**
	* Get payout amounts by token by pool contributor
	*
	* Frontend page: Pool info page (can be the same as Pool contributor page)
	*
	* @param {string} poolAddress address of the Pool this function iteracts with 
	* @param {string} contributorAddress contributor address
	* @param {string} tokenAddress token address in case of ETH 0x0
	* @return {BigNumber} tonken amount
	*/
    getPayedOutByContributorByToken: async function(poolAddress, contributorAddress, tokenAddress){
		var instance;
		var result;
		Pool.deployed().then(function(_instance) {
			instance = _instance;
			return instance.poolList.call(index, {from: account});
		}).then(function(value) {
			result = value.toString();
			console.log(result);
			output.innerHTML = result;
			return result;
		});
    },
  
    //Pool operations

	/**
	* Add a new pool admin address (only creator)
	*
	* Frontend page: Pool admin page for pool creator
	*
	* @param {string} poolAddress address of the Pool this function iteracts with 
	* @param {string} adminAddress address of new admin
	*/
    addAdmin: async function(poolAddress, adminAddress){
		var instance;
		var result;
		Pool.deployed().then(function(_instance) {
			instance = _instance;
			return instance.poolList.call(index, {from: account});
		}).then(function(value) {
			result = value.toString();
			console.log(result);
			output.innerHTML = result;
			return result;
		});
    },
  
	/**
	* Add list of new admin addresses (only creator)
	*
	* Frontend page: Pool admin page for pool creator
	*
	* @param {string} poolAddress address of the Pool this function iteracts with 
	* @param {string[]} adminAddressList address list of new admins
	*/
    addAdminList: async function(poolAddress, adminAddressList){
		var instance;
		var result;
		Pool.deployed().then(function(_instance) {
			instance = _instance;
			return instance.poolList.call(index, {from: account});
		}).then(function(value) {
			result = value.toString();
			console.log(result);
			output.innerHTML = result;
			return result;
		});
    },
  
	/**
	* Remove admin by address (only creator)
	*
	* Frontend page: Pool admin page for pool creator
	*
	* @param {string} poolAddress address of the Pool this function iteracts with 
	* @param {string} adminAddress address of admin to remove
	*/
    removeAdmin: async function(poolAddress, adminAddress){
		var instance;
		var result;
		Pool.deployed().then(function(_instance) {
			instance = _instance;
			return instance.poolList.call(index, {from: account});
		}).then(function(value) {
			result = value.toString();
			console.log(result);
			output.innerHTML = result;
			return result;
		});
    },
  
	/**
	* Add address to pool whiteslist (only admin)
	*
	* Frontend page: Pool admin page for pool admins
	*
	* @param {string} poolAddress address of the Pool this function iteracts with 
	* @param {string} whitelistAddress address to add to whitelist
	*/
    addWhitelist: async function(poolAddress, whitelistAddress){
		var instance;
		var result;
		Pool.deployed().then(function(_instance) {
			instance = _instance;
			return instance.poolList.call(index, {from: account});
		}).then(function(value) {
			result = value.toString();
			console.log(result);
			output.innerHTML = result;
			return result;
		});
    },
  
	/**
	* Add list of addresses to pool whiteslist (only admin)
	*
	* Frontend page: Pool admin page for pool admins
	*
	* @param {string} poolAddress address of the Pool this function iteracts with 
	* @param {string[]} whitelistAddressList list of addresses to add to whitelist
	*/
    addWhitelistList: async function(poolAddress, whitelistAddressList){
		var instance;
		var result;
		Pool.deployed().then(function(_instance) {
			instance = _instance;
			return instance.poolList.call(index, {from: account});
		}).then(function(value) {
			result = value.toString();
			console.log(result);
			output.innerHTML = result;
			return result;
		});
    },
  
	/**
	* Remove address from pool whiteslist (only admin)
	*
	* Frontend page: Pool admin page for pool admins
	*
	* @param {string} poolAddress address of the Pool this function iteracts with 
	* @param {string} whitelistAddress address to remove from whitelist
	*/
    removeWhitelist: async function(poolAddress, whitelistAddress){
		var instance;
		var result;
		Pool.deployed().then(function(_instance) {
			instance = _instance;
			return instance.poolList.call(index, {from: account});
		}).then(function(value) {
			result = value.toString();
			console.log(result);
			output.innerHTML = result;
			return result;
		});
    },
  
	/**
	* Add country code to country blacklist (only admin)
	*
	* Frontend page: Pool admin page for pool admins
	*
	* @param {string} poolAddress address of the Pool this function iteracts with 
	* @param {string} countryCode 3 letter country code (https://en.wikipedia.org/wiki/ISO_3166-1_alpha-3) 
	*/
    addCountryBlacklist: async function(poolAddress, countryCode){
		var instance;
		var result;
		Pool.deployed().then(function(_instance) {
			instance = _instance;
			return instance.poolList.call(index, {from: account});
		}).then(function(value) {
			result = value.toString();
			console.log(result);
			output.innerHTML = result;
			return result;
		});
    },
  
/**
	* Add list of country codes to country blacklist (only admin)
	*
	* Frontend page: Pool admin page for pool admins
	*
	* @param {string} poolAddress address of the Pool this function iteracts with 
	* @param {string[]} countryCode list of 3 letter country codes (https://en.wikipedia.org/wiki/ISO_3166-1_alpha-3) 
	*/
    addCountryBlacklistList: async function(poolAddress, countryCodeList){
		var instance;
		var result;
		Pool.deployed().then(function(_instance) {
			instance = _instance;
			return instance.poolList.call(index, {from: account});
		}).then(function(value) {
			result = value.toString();
			console.log(result);
			output.innerHTML = result;
			return result;
		});
    },
  
	/**
	* Remove country code from country blacklist (only admin)
	*
	* Frontend page: Pool admin page for pool admins
	*
	* @param {string} poolAddress address of the Pool this function iteracts with 
	* @param {string} countryCode 3 letter country code (https://en.wikipedia.org/wiki/ISO_3166-1_alpha-3) 
	*/
    removeCountryBlacklist: async function(poolAddress, countryCode){
		var instance;
		var result;
		Pool.deployed().then(function(_instance) {
			instance = _instance;
			return instance.poolList.call(index, {from: account});
		}).then(function(value) {
			result = value.toString();
			console.log(result);
			output.innerHTML = result;
			return result;
		});
    },
  
	/**
	* Contribute to pool payable - tx has to have ETH value
	*
	* Frontend page: Pool contributor page (can be the same as Pool info page)
	*
	* @param {string} poolAddress address of the Pool this function iteracts with 
	*/
    contribute: async function(poolAddress){
		var instance;
		var result;
		Pool.deployed().then(function(_instance) {
			instance = _instance;
			return instance.poolList.call(index, {from: account});
		}).then(function(value) {
			result = value.toString();
			console.log(result);
			output.innerHTML = result;
			return result;
		});
    },
  
	/**
	* Withdraw funds from the token before being sent to sale
	*
	* Frontend page: Pool contributor page (can be the same as Pool info page)
	*
	* @param {string} poolAddress address of the Pool this function iteracts with 
	*/
    withdraw: async function(poolAddress){
		var instance;
		var result;
		Pool.deployed().then(function(_instance) {
			instance = _instance;
			return instance.poolList.call(index, {from: account});
		}).then(function(value) {
			result = value.toString();
			console.log(result);
			output.innerHTML = result;
			return result;
		});
    },
  
	/**
	* Withdraw funds from the token after being sent to sale and being refunded from sale to pool contract
	*
	* Frontend page: Pool contributor page (can be the same as Pool info page)
	*
	* @param {string} poolAddress address of the Pool this function iteracts with 
	*/
    withdrawRefund: async function(poolAddress){
		var instance;
		var result;
		Pool.deployed().then(function(_instance) {
			instance = _instance;
			return instance.poolList.call(index, {from: account});
		}).then(function(value) {
			result = value.toString();
			console.log(result);
			output.innerHTML = result;
			return result;
		});
    },
  
	/**
	* Withdraw main erc20 token from the pool (sepcified by tokenAddress)
	*
	* Frontend page: Pool contributor page (can be the same as Pool info page)
	*
	* @param {string} poolAddress address of the Pool this function iteracts with 
	*/
    withdrawToken: async function(poolAddress){
		var instance;
		var result;
		Pool.deployed().then(function(_instance) {
			instance = _instance;
			return instance.poolList.call(index, {from: account});
		}).then(function(value) {
			result = value.toString();
			console.log(result);
			output.innerHTML = result;
			return result;
		});
    },
  
	/**
	* Withdraw given erc20 token from the pool (sepcified by tokenAddress)
	*
	* Frontend page: Pool contributor page (can be the same as Pool info page)
	*
	* @param {string} poolAddress address of the Pool this function iteracts with 
	* @param {string} tokenAddress erc 20 token address (this cannot be ETH, so no 0x0 allowed here)
	*/
    withdrawCustomToken: async function(poolAddress, tokenAddress){
		var instance;
		var result;
		Pool.deployed().then(function(_instance) {
			instance = _instance;
			return instance.poolList.call(index, {from: account});
		}).then(function(value) {
			result = value.toString();
			console.log(result);
			output.innerHTML = result;
			return result;
		});
    },
  
	/**
	* Push out pool main tokens to participants (only admin, mostly for token push server)
	*
	* Frontend page: Pool admin page for pool admins (but mostly called by token push server, might not even on frontend)
	*
	* @param {string} poolAddress address of the Pool this function iteracts with 
	* @param {string} recipientAddress address to push out their coins
	*/
    pushOutToken: async function(poolAddress, recipientAddress){
		var instance;
		var result;
		Pool.deployed().then(function(_instance) {
			instance = _instance;
			return instance.poolList.call(index, {from: account});
		}).then(function(value) {
			result = value.toString();
			console.log(result);
			output.innerHTML = result;
			return result;
		});
    },
  
	/**
	* Change erc20 token address distributed by the sale for the pool (only creator)
	*
	* Frontend page: Pool admin page for pool creator
	*
	* @param {string} poolAddress address of the Pool this function iteracts with 
	* @param {string} tokenAddress new token address
	*/
    //DUPLICATE changeTokenAddress: async function(poolAddress, tokenAddress){ 
	//
    //},
  
	/**
	* Confirm that the tokens are received from the sale (only creator)
	*
	* Frontend page: Pool admin page for pool creator
	*
	* @param {string} poolAddress address of the Pool this function iteracts with 
	* @param {BigNumber} tokensExpected amount of tokens expected from the sale
	*/
    confirmTokensReceived: async function(poolAddress, tokensExpected){
		var instance;
		var result;
		Pool.deployed().then(function(_instance) {
			instance = _instance;
			return instance.poolList.call(index, {from: account});
		}).then(function(value) {
			result = value.toString();
			console.log(result);
			output.innerHTML = result;
			return result;
		});
    },
  
	/**
	* Send pool funds to sale (only creator)
	*
	* Frontend page: Pool admin page for pool creator
	*
	* @param {string} poolAddress address of the Pool this function iteracts with 
	*/
    sendToSale: async function(poolAddress){
		var instance;
		var result;
		Pool.deployed().then(function(_instance) {
			instance = _instance;
			return instance.poolList.call(index, {from: account});
		}).then(function(value) {
			result = value.toString();
			console.log(result);
			output.innerHTML = result;
			return result;
		});
    },
  
	/**
	* Send pool funds to sale to predefined special function (only creator)
	*
	* Frontend page: Pool admin page for pool creator
	*
	* @param {string} poolAddress address of the Pool this function iteracts with 
	*/
    sendToSaleFunction: async function(poolAddress){
		var instance;
		var result;
		Pool.deployed().then(function(_instance) {
			instance = _instance;
			return instance.poolList.call(index, {from: account});
		}).then(function(value) {
			result = value.toString();
			console.log(result);
			output.innerHTML = result;
			return result;
		});
    },
  
	/**
	* Whitdraw tokens from sale with predefined special function (only creator)
	*
	* Frontend page: Pool admin page for pool creator
	*
	* @param {string} poolAddress address of the Pool this function iteracts with
	*/
    withdrawFromSaleFunction: async function(poolAddress){
		var instance;
		var result;
		Pool.deployed().then(function(_instance) {
			instance = _instance;
			return instance.poolList.call(index, {from: account});
		}).then(function(value) {
			result = value.toString();
			console.log(result);
			output.innerHTML = result;
			return result;
		});
    },
  
	/**
	* Withdraw provider fee from the stash (onyl provider)
	*
	* Frontend page: Pool admin page for provider
	*
	* @param {string} poolAddress address of the Pool this function iteracts with
	*/
    poviderWithdraw: async function(poolAddress){
		var instance;
		var result;
		Pool.deployed().then(function(_instance) {
			instance = _instance;
			return instance.poolList.call(index, {from: account});
		}).then(function(value) {
			result = value.toString();
			console.log(result);
			output.innerHTML = result;
			return result;
		});
    },
  
	/**
	* Withdraw creator fee from the stash (only creator)
	*
	* Frontend page: Pool admin page for pool creator
	*
	* @param {string} poolAddress address of the Pool this function iteracts with
	*/
    creatorWithdraw: async function(poolAddress){
		var instance;
		var result;
		Pool.deployed().then(function(_instance) {
			instance = _instance;
			return instance.poolList.call(index, {from: account});
		}).then(function(value) {
			result = value.toString();
			console.log(result);
			output.innerHTML = result;
			return result;
		});
    },
  
    //Pool param setters

	/**
	* Set provider address (only provider)
	*
	* Frontend page: Pool admin page for provider
	*
	* @param {string} poolAddress address of the Pool this function iteracts with
	* @param {string} providerAddress new provider address
	*/
    setProvider: async function(poolAddress, providerAddress){
		var instance;
		var result;
		Pool.deployed().then(function(_instance) {
			instance = _instance;
			return instance.poolList.call(index, {from: account});
		}).then(function(value) {
			result = value.toString();
			console.log(result);
			output.innerHTML = result;
			return result;
		});
    },
  
	/**
	* Set creator address (only creator)
	*
	* Frontend page: Pool admin page for pool creator
	*
	* @param {string} poolAddress address of the Pool this function iteracts with
	* @param {string} creatorAddress new creator address
	*/
    setCreator: async function(poolAddress, creatorAddress){
		var instance;
		var result;
		Pool.deployed().then(function(_instance) {
			instance = _instance;
			return instance.poolList.call(index, {from: account});
		}).then(function(value) {
			result = value.toString();
			console.log(result);
			output.innerHTML = result;
			return result;
		});
    },
  
	/**
	* Set provider fee rate (only provider)
	*
	* Frontend page: Pool admin page for provider
	*
	* @param {string} poolAddress address of the Pool this function iteracts with
	* @param {BigNumber} providerFeeRate new provider fee rate (1/100)
	*/
    setProviderFeeRate: async function(poolAddress, providerFeeRate){
		var instance;
		var result;
		Pool.deployed().then(function(_instance) {
			instance = _instance;
			return instance.poolList.call(index, {from: account});
		}).then(function(value) {
			result = value.toString();
			console.log(result);
			output.innerHTML = result;
			return result;
		});
    },
  
	/**
	* Set creator fee rate (only creator)
	*
	* Frontend page: Pool admin page for pool creator
	*
	* @param {string} poolAddress address of the Pool this function iteracts with
	* @param {BigNumber} creatorFeeRate new creator fee rate (1/100)
	*/
    setCreatorFeeRate: async function(poolAddress, creatorFeeRate){
		var instance;
		var result;
		Pool.deployed().then(function(_instance) {
			instance = _instance;
			return instance.poolList.call(index, {from: account});
		}).then(function(value) {
			result = value.toString();
			console.log(result);
			output.innerHTML = result;
			return result;
		});
    },
  
	/**
	* Change erc20 token address distributed by the sale for the pool (only creator)
	*
	* Frontend page: Pool admin page for pool creator
	*
	* @param {string} poolAddress address of the Pool this function iteracts with 
	* @param {string} tokenAddress new token address
	*/
    setTokenAddress: async function(poolAddress, tokenAddress){
		var instance;
		var result;
		Pool.deployed().then(function(_instance) {
			instance = _instance;
			return instance.poolList.call(index, {from: account});
		}).then(function(value) {
			result = value.toString();
			console.log(result);
			output.innerHTML = result;
			return result;
		});
    },
  
	/**
	* Set if pool is whitelist pool (only creator)
	*
	* Frontend page: Pool admin page for pool creator
	*
	* @param {string} poolAddress address of the Pool this function iteracts with 
	* @param {bool} isWhitelistPool
	*/
    setWhitelistPool: async function(poolAddress, isWhitelistPool){
		var instance;
		var result;
		Pool.deployed().then(function(_instance) {
			instance = _instance;
			return instance.poolList.call(index, {from: account});
		}).then(function(value) {
			result = value.toString();
			console.log(result);
			output.innerHTML = result;
			return result;
		});
    },
  
	/**
	* Set new sale start date (only creator)
	*
	* Frontend page: Pool admin page for pool creator
	*
	* @param {string} poolAddress address of the Pool this function iteracts with 
	* @param {BigNumber} saleStartDate
	*/
    setSaleStartDate: async function(poolAddress, saleStartDate){
		var instance;
		var result;
		Pool.deployed().then(function(_instance) {
			instance = _instance;
			return instance.poolList.call(index, {from: account});
		}).then(function(value) {
			result = value.toString();
			console.log(result);
			output.innerHTML = result;
			return result;
		});
    },
  
	/**
	* Set new sale end date (only creator)
	*
	* Frontend page: Pool admin page for pool creator
	*
	* @param {string} poolAddress address of the Pool this function iteracts with 
	* @param {BigNumber} saleEndDate
	*/
    setSaleEndDate: async function(poolAddress, saleEndDate){
		var instance;
		var result;
		Pool.deployed().then(function(_instance) {
			instance = _instance;
			return instance.poolList.call(index, {from: account});
		}).then(function(value) {
			result = value.toString();
			console.log(result);
			output.innerHTML = result;
			return result;
		});
    },
  
	/**
	* Set new minimum amount of ETH contribution allowed in one tx (only creator)
	*
	* Frontend page: Pool admin page for pool creator
	*
	* @param {string} poolAddress address of the Pool this function iteracts with 
	* @param {BigNumber} minContribution new minimum contribution
	*/
    setMinContribution: async function(poolAddress, minContribution){
		var instance;
		var result;
		Pool.deployed().then(function(_instance) {
			instance = _instance;
			return instance.poolList.call(index, {from: account});
		}).then(function(value) {
			result = value.toString();
			console.log(result);
			output.innerHTML = result;
			return result;
		});
    },
  
	/**
	* Set new maximum amount of ETH contribution allowed in one tx (only creator)
	*
	* Frontend page: Pool admin page for pool creator
	*
	* @param {string} poolAddress address of the Pool this function iteracts with 
	* @param {BigNumber} maxContribution new maximum contribution
	*/
    setMaxContribution: async function(poolAddress, maxContribution){
		var instance;
		var result;
		Pool.deployed().then(function(_instance) {
			instance = _instance;
			return instance.poolList.call(index, {from: account});
		}).then(function(value) {
			result = value.toString();
			console.log(result);
			output.innerHTML = result;
			return result;
		});
    },
  
	/**
	* Set new minimum amount of ETH needed to be raised by the pool for the sale (only creator)
	*
	* Frontend page: Pool admin page for pool creator
	*
	* @param {string} poolAddress address of the Pool this function iteracts with 
	* @param {BigNumber} minPoolGoal new minimum pool goal
	*/
    setMinPoolGoal: async function(poolAddress, minPoolGoal){
		var instance;
		var result;
		Pool.deployed().then(function(_instance) {
			instance = _instance;
			return instance.poolList.call(index, {from: account});
		}).then(function(value) {
			result = value.toString();
			console.log(result);
			output.innerHTML = result;
			return result;
		});
    },
  
	/**
	* Set new maximum amount of ETH allowed to be raised by the pool for the sale (only creator)
	*
	* Frontend page: Pool admin page for pool creator
	*
	* @param {string} poolAddress address of the Pool this function iteracts with 
	* @param {BigNumber} maxPoolAllocation new maximum pool allocation
	*/
    setMaxPoolAllocation: async function(poolAddress, maxPoolAllocation){
		var instance;
		var result;
		Pool.deployed().then(function(_instance) {
			instance = _instance;
			return instance.poolList.call(index, {from: account});
		}).then(function(value) {
			result = value.toString();
			console.log(result);
			output.innerHTML = result;
			return result;
		});
    },
  
	/**
	* Set new unix timestamp in seconds for how much time funds are locked from withdrawal after contribution (only creator)
	*
	* Frontend page: Pool admin page for pool creator
	*
	* @param {string} poolAddress address of the Pool this function iteracts with 
	* @param {BigNumber} withdrawTimelock new withdraw timelock
	*/
    setWithdrawTimelock: async function(poolAddress, withdrawTimelock){
		var instance;
		var result;
		Pool.deployed().then(function(_instance) {
			instance = _instance;
			return instance.poolList.call(index, {from: account});
		}).then(function(value) {
			result = value.toString();
			console.log(result);
			output.innerHTML = result;
			return result;
		});
    }

};

/*
window.addEventListener('load', function() {
	// Checking if Web3 has been injected by the browser (Mist/MetaMask)
	if (typeof web3 !== 'undefined') {
	  console.warn("Using web3 detected from external source. If you find that your accounts don't appear or you have 0 MetaCoin, ensure you've configured that source properly. If using MetaMask, see the following link. Feel free to delete this warning. :) http://truffleframework.com/tutorials/truffle-and-metamask")
	  // Use Mist/MetaMask's provider
	  window.web3 = new Web3(web3.currentProvider);
	} else {
	  console.warn("No web3 detected. Falling back to http://localhost:8545. You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask");
	  // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
	  window.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
	}
  
	App.start();
  
	//App.watchEvents();
  });
*/  

window.App = App

window.addEventListener('load', async () => {
// Modern dapp browsers...
	if (window.ethereum) {
		window.web3 = new Web3(ethereum);
		try {
			// Request account access if needed
			await ethereum.enable();
			// Acccounts now exposed
			web3.eth.sendTransaction({/* ... */});
		} catch (error) {
			// User denied account access...
		}
	}
	// Legacy dapp browsers...
	else if (window.web3) {
		window.web3 = new Web3(web3.currentProvider);
		// Acccounts always exposed
		web3.eth.sendTransaction({/* ... */});
	}
	// Non-dapp browsers...
	else {
		console.log("Non-Ethereum browser detected. You should consider trying MetaMask! Falling back to http://localhost:8545. You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask");
		// fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
		window.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
	}

	App.start();

});