pragma solidity ^0.4.24;

import './KYC.sol';
import './SemiSafeMath.sol';
import '../node_modules/openzeppelin-solidity/contracts/token/ERC20/ERC20Basic.sol';
import '../node_modules/openzeppelin-solidity/contracts/math/SafeMath.sol';

contract Pool {
    
    struct ContributorData{
        uint lastContributionTime;
        uint grossContribution;
        mapping(address => uint) payedOut; //(tokenAddress => amountPayedOut) 0x0 address: ETH
    }

    struct Params{
        bytes32 saleParticipateFunctionSig;
        bytes32 saleWithdrawFunctionSig;
        address saleAddress; //address of token sale
        address tokenAddress; // address of erc20 token contract
        address kycAddress;   
        address provider; //connectICO address for fees
        address creator; //pool creator address
        uint256 minContribution; //minimum amount expected from pool participants
        uint256 maxContribution; //maximum amount expected from pool participants 0: no limit
        uint256 minPoolGoal;  //minimum amount needed for the sale
        uint256 maxPoolAllocation; //maximum amount raisable by pool
        uint32 saleStartDate;
        uint32 saleEndDate;
        uint32 withdrawTimelock;
        uint16 providerFeeRate; // 1/1000
        uint16 creatorFeeRate; // 1/1000
        bool whitelistPool;
    }

    struct PoolStats{
        address[] contributorList;
        uint256 allGrossContributions;
        uint256 creatorStash;
        uint256 providerStash;
        bool tokensReceivedConfirmed;
        bool sentToSale;
    }

    mapping(address => bool) public admins; //additional admins
    mapping(address => bool) public whitelist; 
    mapping(bytes3 => bool) public kycCountryBlacklist; //key: https://en.wikipedia.org/wiki/ISO_3166-1_alpha-3

    mapping(address => ContributorData) public contributors;
    mapping(address => uint) totalPayedOut; //(tokenAddress => totalAmountPayedOut) 0x0 address: ETH

    uint8 ETHEREUM_DECIMALS = 18;

    Params params;

    PoolStats public poolStats;
    
    
    
    modifier onlyCreator{
        require(msg.sender == params.creator, "modifier onlyCreator: Error, tx was not initiated by creator address");
        _;
    }
    
    modifier onlyAdmin{
        require(admins[msg.sender], "modifier onlyAdmin: Error, tx was not initiated by admin address");
        _;
    }
    
    modifier onlyProvider{
        require(msg.sender == params.provider, "modifier onlyProvider: Error, tx was not initiated by provider address");
        _;
    }
    
    /*
    modifier onlyAdminOrProvider{
        require(admins[msg.sender] || msg.sender == params.provider, "modifier onlyAdminOrProvider: Error, tx was not initiated by creator or provider address");
        _;
    }
    */
    
    /*constructor() public {
        
    }*/
    
    constructor(
        address[5] addresses, uint[9] integers, bool _whitelistPool) public {
        params.kycAddress = addresses[0];
        params.provider = addresses[1];
        params.creator = addresses[2];
        params.saleAddress = addresses[3];
        params.tokenAddress = addresses[4];
        params.providerFeeRate = uint16(integers[0]);
        params.creatorFeeRate = uint16(integers[1]);
        params.saleStartDate = uint32(integers[2]);
        params.saleEndDate = uint32(integers[3]);
        params.minContribution = integers[4];
        params.maxContribution = integers[5];
        params.minPoolGoal = integers[6];
        params.maxPoolAllocation = integers[7];
        params.withdrawTimelock = uint32(integers[8]);
        params.whitelistPool = _whitelistPool;
        admins[params.creator] = true;
    }

    /*function addAdmin(address[] addressList) public onlyCreator {
        for(uint i = 0; i < addressList.length; i++){
            require(KYC(kycAddress).checkKYC(addressList[i]), "addAdmin(address[] addressList): Error, tx was not initiated by KYC address");
            admins[addressList[i]] = true;
        }
    }*/

    function addAdmin(address adminAddress) public onlyCreator {
        require(KYC(params.kycAddress).checkKYC(adminAddress), "addAdmin(address adminAddress): Error, tx was not initiated by KYC address");
        admins[adminAddress] = true;
    }

    function removeAdmin(address adminAddress) public onlyCreator {
        admins[adminAddress] = false;
    }

    /*function addWhitelist(address[] addressList) public onlyAdmin {
        for(uint i = 0; i < addressList.length; i++){
            require(KYC(kycAddress).checkKYC(addressList[i]), "addWhitelist(address[] addressList): Error, tx was not initiated by KYC address");
            whitelist[addressList[i]] = true;
        }
    }*/

    function addWhitelist(address whitelistAddress) public onlyAdmin {
        require(KYC(params.kycAddress).checkKYC(whitelistAddress), "addWhitelist(address whitelistAddress): Error, tx was not initiated by KYC address");
        whitelist[whitelistAddress] = true;
    }

    function removeWhitelist(address whitelistAddress) public onlyAdmin {
        whitelist[whitelistAddress] = false;
    }

    /*function addCountryBlacklist(bytes3[] countryList) public onlyAdmin {
        for(uint i = 0; i < countryList.length; i++){
            kycCountryBlacklist[countryList[i]] = true;
        }
    }*/

    function addCountryBlacklist(bytes3 country) public onlyAdmin {
        kycCountryBlacklist[country] = true;
    }

    function removeCountryBlacklist(bytes3 country) public onlyAdmin {
        kycCountryBlacklist[country] = false;
    }
    
    function contribute() public payable {
        if(params.whitelistPool) require(whitelist[msg.sender], "contribute(): Error, tx was not initiated by whitelisted address");
        require(KYC(params.kycAddress).checkKYC(msg.sender), "contribute(): Error, tx was not initiated by KYC address");
        require(SafeMath.add(msg.value, contributors[msg.sender].grossContribution) >= params.minContribution, "contribute(): Error, tx value is lower than minimum allowed");
        require(params.maxContribution == 0 || SafeMath.add(msg.value, contributors[msg.sender].grossContribution) <= params.maxContribution, "contribute(): Error, tx value is higher than maximum allowed");
        require(params.maxPoolAllocation == 0 || SafeMath.add(msg.value, poolStats.allGrossContributions) <= params.maxPoolAllocation, "contribute(): Error, all contributions are higher than maximum allowed");
        require(block.timestamp < params.saleEndDate, "contribute(): Error, the sale has ended");
        require(!poolStats.sentToSale, "contribute(): Error, the pools funds were already sent to the sale");
        contributors[msg.sender].lastContributionTime = block.timestamp;
        if(contributors[msg.sender].lastContributionTime == 0) poolStats.contributorList.push(msg.sender);
        contributors[msg.sender].grossContribution = SafeMath.add(contributors[msg.sender].grossContribution, msg.value);
        poolStats.allGrossContributions = SafeMath.add(poolStats.allGrossContributions, msg.value);
    }


    function reciprocalContributionRationPow18(address contributor) private view returns (uint) {
        return SemiSafeMath.pow(poolStats.allGrossContributions, ETHEREUM_DECIMALS / contributors[contributor].grossContribution);
    }

    function calculateReward(uint toDistribute, address contributor) private view returns (uint) {
        return SemiSafeMath.pow(toDistribute, ETHEREUM_DECIMALS / reciprocalContributionRationPow18(contributor));
    }

    function calculateERC20OwedToContributor(address tokenType, address contributor) private view returns (uint) {
        uint totalBalance = SafeMath.add(totalPayedOut[tokenType], ERC20Basic(tokenType).balanceOf(address(this)));
        uint totalReward = calculateReward(totalBalance, contributor);
        return SafeMath.sub(totalReward, contributors[contributor].payedOut[tokenType]);
    }

    function calculateETHOwedToContributor(address contributor) private view returns (uint) {
        uint totalBalance = SafeMath.add(totalPayedOut[0x0], SafeMath.sub(address(this).balance, SafeMath.add(poolStats.creatorStash, poolStats.providerStash)));
        uint totalReward = calculateReward(totalBalance, contributor);
        return SafeMath.sub(totalReward, contributors[contributor].payedOut[0x0]);
    }

    function withdraw(uint amount) public {
        require(!poolStats.sentToSale, "withdraw(): Error, the pools funds were already sent to the sale");
        require(SafeMath.add(contributors[msg.sender].lastContributionTime, params.withdrawTimelock) > block.timestamp, "withdraw(): Error, the timelock is not over yet");
        require(contributors[msg.sender].grossContribution >= amount, "withdraw(): Error, tx sender has not enough funds in pool");
        require(SafeMath.sub(contributors[msg.sender].grossContribution, amount) >= params.minContribution || amount == 0, "withdraw(): Error, remaining contribution amount would have been less than 'minContribution'");
        uint transferAmount;
        if (amount == 0) {
            transferAmount = contributors[msg.sender].grossContribution;
        } else {
            transferAmount = amount;
        }
        poolStats.allGrossContributions = SafeMath.sub(poolStats.allGrossContributions, transferAmount);
        contributors[msg.sender].grossContribution = SafeMath.sub(contributors[msg.sender].grossContribution, transferAmount);
        msg.sender.transfer(amount);        
    }

    function withdrawRefund() public {
        require(poolStats.sentToSale, "withdrawRefund(): Error, the pools funds were not sent to the sale yet");
        uint amount = calculateETHOwedToContributor(msg.sender);
        contributors[msg.sender].payedOut[0x0] = SafeMath.add(contributors[msg.sender].payedOut[0x0], amount);
        totalPayedOut[0x0] = SafeMath.add(totalPayedOut[0x0], amount);
        msg.sender.transfer(amount);
    }


    function sendOutToken(address _tokenAddress, address recipient) private {
        require(poolStats.sentToSale, "sendOutToken(address _tokenAddress, address recipient): Error, the pools funds were not sent to the sale yet");
        require(params.tokenAddress != 0x0, "sendOutToken(address _tokenAddress, address recipient): Error, ERC20 token addres cannot be 0x0, that is reserved for ether");
        uint amount = calculateERC20OwedToContributor(_tokenAddress, recipient);
        contributors[recipient].payedOut[_tokenAddress] = SafeMath.add(contributors[recipient].payedOut[_tokenAddress], amount);
        totalPayedOut[_tokenAddress] = SafeMath.add(totalPayedOut[_tokenAddress], amount);
        ERC20Basic(_tokenAddress).transfer(recipient, amount);
    }

    /*
    function withdrawToken(address tokenAddress, address recipient) public {
        sendOutToken(tokenAddress, recipient);
    }
    */
    
    function withdrawToken() public {
        sendOutToken(params.tokenAddress, msg.sender);
    }

    function withdrawCustomToken(address customTokenAddress) public{
        sendOutToken(customTokenAddress, msg.sender);
    }

    function pushOutToken(address recipient) public onlyAdmin{
        sendOutToken(params.tokenAddress, recipient);
    }
    
    /*
    (duplicate)
    function changeTokenAddress(address _tokenAddress) public onlyCreator{
        require(!tokensReceivedConfirmed, "changeTokenAddress(address _tokenAddress): Error, tokens are already confirmed as received");
        tokenAddress = _tokenAddress;
    }
    */

    
    function confirmTokensReceived(uint tokensExpected) public onlyCreator{
        require(poolStats.sentToSale, "confirmTokensReceived(uint tokensExpected): Error, the pools funds were not sent to the sale yet");
        require(!poolStats.tokensReceivedConfirmed, "confirmTokensReceived(uint tokensExpected): Error, tokens are already confirmed as received");
        require (tokensExpected > 0, "confirmTokensReceived(uint tokensExpected): Error, number of tokens expected has to be greater than 0");
        if(ERC20Basic(params.tokenAddress).balanceOf(address(this)) > tokensExpected) poolStats.tokensReceivedConfirmed = true;
    }
    
    function sendToSale() public onlyAdmin{
        require(params.saleParticipateFunctionSig.length == 0, "sendToSale(): Error, participation function signature is given, 'sendToSaleFunction()' has to be used");
        require(!poolStats.sentToSale, "sendToSale(): Error, the pools funds were already sent to the sale");
        require(now >= params.saleStartDate, "sendToSale(): Error, sale hasn't started yet");
        require(block.timestamp < params.saleEndDate, "sendToSale(): Error, the sale has ended");
        require(calculateNetContribution() >= params.minPoolGoal, "sendToSale(): Not enough funds collected for sale");
        takeFees();
        poolStats.sentToSale = true;
        params.saleAddress.transfer(calculateNetContribution());        
    }

    function sendToSaleFunction() public onlyAdmin {
        require(params.saleParticipateFunctionSig.length > 0, "sendToSaleFunction(): Error, no participation function signature given");
        require(!poolStats.sentToSale, "sendToSaleFunction(): Error, the pools funds were already sent to the sale");
        require(now >= params.saleStartDate, "sendToSaleFunction(): Error, sale hasn't started yet");
        require(block.timestamp < params.saleEndDate, "sendToSaleFunction(): Error, the sale has ended");
        require(calculateNetContribution() >= params.minPoolGoal, "sendToSaleFunction():: Not enough funds collected for sale");
        takeFees();
        poolStats.sentToSale = true;
        require(params.saleAddress.call.value(calculateNetContribution())(bytes4(keccak256(params.saleParticipateFunctionSig))), "Error, transaction failed");
    }


    function takeFees() private returns(uint) {
        poolStats.creatorStash = calculateFee(poolStats.allGrossContributions, params.creatorFeeRate);
        poolStats.providerStash = calculateFee(poolStats.allGrossContributions, params.providerFeeRate);
    }


    function calculateNetContribution() private view returns (uint) {
        return SafeMath.sub(poolStats.allGrossContributions, SafeMath.sub(poolStats.creatorStash, poolStats.providerStash));
    }

    function calculateFee(uint value, uint feePerThousand) private pure returns(uint fee) {
        return SafeMath.mul(value / 1000, feePerThousand);
    }

    function withdrawFromSaleFunction() public onlyAdmin{
        require(params.saleParticipateFunctionSig.length > 0, "withdrawFromSaleFunction(): Error, no withdraw function signature given");
        require(poolStats.sentToSale, "withdrawFromSaleFunction(): Error, the pools funds were not sent to the sale yet");
        require(params.saleAddress.call(bytes4(keccak256(params.saleWithdrawFunctionSig))), "withdrawFromSaleFunction(): Error, transaction failed");
    }    

    function () public payable {
        //empty fallback to take refund tx-s
    }

    function poviderWithdraw() public onlyProvider{
        uint amount = poolStats.providerStash;
        poolStats.providerStash = 0;
        params.creator.transfer(amount);
    }

    function creatorWithdraw() public onlyCreator{
        uint amount = poolStats.creatorStash;
        poolStats.creatorStash = 0;
        params.creator.transfer(amount);
    }

    /*function bytes3ToString(bytes3 x) private pure returns (string) {
        bytes memory bytesString = new bytes(3);
        uint charCount = 0;
        for (uint j = 0; j < 3; j++) {
            byte char = byte(bytes32(uint(x) * 2 ** (8 * j)));
            if (char != 0) {
                bytesString[charCount] = char;
                charCount++;
            }
        }
        bytes memory bytesStringTrimmed = new bytes(charCount);
        for (j = 0; j < charCount; j++) {
            bytesStringTrimmed[j] = bytesString[j];
        }
        return string(bytesStringTrimmed);
    }*/

    function setParams(
        address _creator,
        uint16 _creatorFeeRate, // 1/1000
        uint32 _saleStartDate,
        uint32 _saleEndDate,
        uint32 _withdrawTimelock,
        uint256 _minContribution, //minimum amount expected from pool participants
        uint256 _maxContribution, //maximum amount expected from pool participants 0: no limit
        uint256 _minPoolGoal,  //minimum amount needed for the sale
        bool _whitelistPool,
        address _tokenAddress, // address of erc20 token contract
        bool[10] toSet
    ) public onlyCreator {
        if(toSet[0]){
            params.creator = _creator;
        }
        if(toSet[1]){
            params.creatorFeeRate = _creatorFeeRate;
        }
        if(toSet[2]){
            params.saleStartDate = _saleStartDate;
        }
        if(toSet[3]){
            params.saleEndDate = _saleEndDate;
        }
        if(toSet[4]){
            params.withdrawTimelock = _withdrawTimelock;
        }
        if(toSet[5]){
            params.minContribution = _minContribution;
        }
        if(toSet[6]){
            params.maxContribution = _maxContribution;
        }
        if(toSet[7]){
            params.minPoolGoal = _minPoolGoal;
        }
        if(toSet[8]){
            params.whitelistPool = _whitelistPool;
        }
        if(toSet[9]){
            require(!poolStats.tokensReceivedConfirmed, "setTokenAddress(address _tokenAddress): Error, tokens are already confirmed as received");
            params.tokenAddress = _tokenAddress;
        }
    }

    function setParams(
        address _provider, //connectICO address for fees
        uint16 _providerFeeRate, // 1/1000
        uint256 _maxPoolAllocation, //maximum amount raisable by pool
        bool[3] toSet
    ) public onlyProvider {
        if(toSet[0]){
            params.provider = _provider;
        }
        if(toSet[1]){
            params.providerFeeRate = _providerFeeRate;
        }
        if(toSet[2]){
            params.maxPoolAllocation = _maxPoolAllocation;
        }
    }

    function getParams1() public view returns (
        uint16 providerFeeRate, // 1/1000
        uint16 creatorFeeRate, // 1/1000
        uint32 saleStartDate,
        uint32 saleEndDate,
        uint32 withdrawTimelock,
        uint256 minContribution, //minimum amount expected from pool participants
        uint256 maxContribution, //maximum amount expected from pool participants 0: no limit
        uint256 minPoolGoal,  //minimum amount needed for the sale
        uint256 maxPoolAllocation //maximum amount raisable by pool
    )
    {
        return(
            params.providerFeeRate,
            params.creatorFeeRate,
            params.saleStartDate,
            params.saleEndDate,
            params.withdrawTimelock,
            params.minContribution,
            params.maxContribution,
            params.minPoolGoal,
            params.maxPoolAllocation
        );
    }

    function getParams2() public view returns (
        bool whitelistPool,
        bytes32 saleParticipateFunctionSig,
        bytes32 saleWithdrawFunctionSig,
        address saleAddress, //address of token sale
        address tokenAddress, // address of erc20 token contract
        address kycAddress,   
        address provider, //connectICO address for fees
        address creator //pool creator address
    )
    {
        return(            
            params.whitelistPool,
            params.saleParticipateFunctionSig,
            params.saleWithdrawFunctionSig,
            params.saleAddress,
            params.tokenAddress,
            params.kycAddress,
            params.provider,
            params.creator
        );
    }

}
