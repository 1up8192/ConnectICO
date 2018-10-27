pragma solidity ^0.4.24;

import './KYC.sol';
import './SemiSafeMath.sol';
import '../node_modules/openzeppelin-solidity/contracts/token/ERC20/ERC20Basic.sol';
import '../node_modules/openzeppelin-solidity/contracts/math/SafeMath.sol';

contract Pool {
    
    struct contributorData{
        uint lastContributionTime;
        uint grossContribution;
        mapping(address => uint) payedOut; //(tokenAddress => amountPayedOut) 0x0 address: ETH
    }

    uint ETHEREUM_DECIMALS = 18;

    address public kycAddress;   
    address public provider; //connectICO address for fees
    address public creator; //pool creator address
    uint public providerFeeRate; // 1/1000
    uint public creatorFeeRate; // 1/1000
    mapping(address => bool) public admins; //additional admins
    address public saleAddress; //address of token sale
    address public tokenAddress; // address of erc20 token contract
    bool public whitelistPool;
    mapping(address => bool) public whitelist; 
    uint public saleStartDate;
    uint public saleEndDate;
    uint public minContribution; //minimum amount expected from pool participants
    uint public maxContribution; //maximum amount expected from pool participants 0: no limit
    uint public minPoolGoal;  //minimum amount needed for the sale
    uint public maxPoolAllocation; //maximum amount raisable by pool
    uint public withdrawTimelock;
    mapping(bytes3 => bool) public kycCountryBlacklist; //key: https://en.wikipedia.org/wiki/ISO_3166-1_alpha-3
    string public saleParticipateFunctionSig;
    string public saleWithdrawFunctionSig;
    
    
    uint public allGrossContributions;
    mapping(address => contributorData) public contributors;
    mapping(address => uint) totalPayedOut; //(tokenAddress => totalAmountPayedOut) 0x0 address: ETH
    bool public sentToSale;
    address[] contributorList;
    uint public creatorStash;
    uint public providerStash;
    bool tokensReceivedConfirmed;

    struct PoolData{
        address kycAddress;
        address provider;
        address creator;
        uint creatorFeeRate;
        uint providerFeeRate;
        address saleAddress;
        address tokenAddress;
        bool whitelistPool;
        uint saleStartDate;
        uint saleEndDate;
        uint minContribution;
        uint maxContribution;
        uint minPoolGoal;
        uint maxPoolAllocation;
        uint withdrawTimelock;
    }
    
    modifier onlyCreator{
        require(msg.sender == creator, "modifier onlyCreator: Error, tx was not initiated by creator address");
        _;
    }
    
    modifier onlyAdmin{
        require(admins[msg.sender], "modifier onlyAdmin: Error, tx was not initiated by admin address");
        _;
    }
    
    modifier onlyProvider{
        require(msg.sender == provider, "modifier onlyProvider: Error, tx was not initiated by provider address");
        _;
    }
    
    /*
    modifier onlyAdminOrProvider{
        require(admins[msg.sender] || msg.sender == provider, "modifier onlyAdminOrProvider: Error, tx was not initiated by creator or provider address");
        _;
    }
    */
    
    /*constructor() public {
        
    }*/
    
    constructor(
        address[5] addresses, uint[9] integers, bool _whitelistPool) public {
        kycAddress = addresses[0];
        provider = addresses[1];
        creator = addresses[2];
        saleAddress = addresses[3];
        tokenAddress = addresses[4];
        providerFeeRate = integers[0];
        creatorFeeRate = integers[1];
        saleStartDate = integers[2];
        saleEndDate = integers[3];
        minContribution = integers[4];
        maxContribution = integers[5];
        minPoolGoal = integers[6];
        maxPoolAllocation = integers[7];
        withdrawTimelock = integers[8];
        whitelistPool = _whitelistPool;
        admins[creator] = true;
    }

    /*function addAdmin(address[] addressList) public onlyCreator {
        for(uint i = 0; i < addressList.length; i++){
            require(KYC(kycAddress).checkKYC(addressList[i]), "addAdmin(address[] addressList): Error, tx was not initiated by KYC address");
            admins[addressList[i]] = true;
        }
    }*/

    function addAdmin(address adminAddress) public onlyCreator {
        require(KYC(kycAddress).checkKYC(adminAddress), "addAdmin(address adminAddress): Error, tx was not initiated by KYC address");
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
        require(KYC(kycAddress).checkKYC(whitelistAddress), "addWhitelist(address whitelistAddress): Error, tx was not initiated by KYC address");
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
        if(whitelistPool) require(whitelist[msg.sender], "contribute(): Error, tx was not initiated by whitelisted address");
        require(KYC(kycAddress).checkKYC(msg.sender), "contribute(): Error, tx was not initiated by KYC address");
        require(SafeMath.add(msg.value, contributors[msg.sender].grossContribution) >= minContribution, "contribute(): Error, tx value is lower than minimum allowed");
        require(maxContribution == 0 || SafeMath.add(msg.value, contributors[msg.sender].grossContribution) <= maxContribution, "contribute(): Error, tx value is higher than maximum allowed");
        require(maxPoolAllocation == 0 || SafeMath.add(msg.value, allGrossContributions) <= maxPoolAllocation, "contribute(): Error, all contributions are higher than maximum allowed");
        require(block.timestamp < saleEndDate, "contribute(): Error, the sale has ended");
        require(!sentToSale, "contribute(): Error, the pools funds were already sent to the sale");
        contributors[msg.sender].lastContributionTime = block.timestamp;
        if(contributors[msg.sender].lastContributionTime == 0) contributorList.push(msg.sender);
        contributors[msg.sender].grossContribution = SafeMath.add(contributors[msg.sender].grossContribution, msg.value);
        allGrossContributions = SafeMath.add(allGrossContributions, msg.value);
    }


    function reciprocalContributionRationPow18(address contributor) private view returns (uint) {
        return SemiSafeMath.pow(allGrossContributions, ETHEREUM_DECIMALS / contributors[contributor].grossContribution);
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
        uint totalBalance = SafeMath.add(totalPayedOut[0x0], SafeMath.sub(address(this).balance, SafeMath.add(creatorStash, providerStash)));
        uint totalReward = calculateReward(totalBalance, contributor);
        return SafeMath.sub(totalReward, contributors[contributor].payedOut[0x0]);
    }

    function withdraw(uint amount) public {
        require(!sentToSale, "withdraw(): Error, the pools funds were already sent to the sale");
        require(SafeMath.add(contributors[msg.sender].lastContributionTime, withdrawTimelock) > block.timestamp, "withdraw(): Error, the timelock is not over yet");
        require(contributors[msg.sender].grossContribution >= amount, "withdraw(): Error, tx sender has not enough funds in pool");
        require(SafeMath.sub(contributors[msg.sender].grossContribution, amount) >= minContribution || amount == 0, "withdraw(): Error, remaining contribution amount would have been less than 'minContribution'");
        uint transferAmount;
        if (amount == 0) {
            transferAmount = contributors[msg.sender].grossContribution;
        } else {
            transferAmount = amount;
        }
        allGrossContributions = SafeMath.sub(allGrossContributions, transferAmount);
        contributors[msg.sender].grossContribution = SafeMath.sub(contributors[msg.sender].grossContribution, transferAmount);
        msg.sender.transfer(amount);        
    }

    function withdrawRefund() public {
        require(sentToSale, "withdrawRefund(): Error, the pools funds were not sent to the sale yet");
        uint amount = calculateETHOwedToContributor(msg.sender);
        contributors[msg.sender].payedOut[0x0] = SafeMath.add(contributors[msg.sender].payedOut[0x0], amount);
        totalPayedOut[0x0] = SafeMath.add(totalPayedOut[0x0], amount);
        msg.sender.transfer(amount);
    }


    function sendOutToken(address _tokenAddress, address recipient) private {
        require(sentToSale, "sendOutToken(address _tokenAddress, address recipient): Error, the pools funds were not sent to the sale yet");
        require(tokenAddress != 0x0, "sendOutToken(address _tokenAddress, address recipient): Error, ERC20 token addres cannot be 0x0, that is reserved for ether");
        uint amount = calculateERC20OwedToContributor(_tokenAddress, recipient);
        contributors[recipient].payedOut[_tokenAddress] = SafeMath.add(contributors[recipient].payedOut[_tokenAddress], amount);
        totalPayedOut[_tokenAddress] = SafeMath.add(totalPayedOut[_tokenAddress], amount);
        ERC20Basic(_tokenAddress).transfer(recipient, amount);
    }

    function withdrawToken() public {
        sendOutToken(tokenAddress, msg.sender);
    }

    function withdrawCustomToken(address customTokenAddress) public{
        sendOutToken(customTokenAddress, msg.sender);
    }

    function pushOutToken(address recipient) public onlyAdmin{
        sendOutToken(tokenAddress, recipient);
    }
    
    /*
    (duplicate)
    function changeTokenAddress(address _tokenAddress) public onlyCreator{
        require(!tokensReceivedConfirmed, "changeTokenAddress(address _tokenAddress): Error, tokens are already confirmed as received");
        tokenAddress = _tokenAddress;
    }
    */

    function confirmTokensReceived(uint tokensExpected) public onlyCreator{
        require(sentToSale, "confirmTokensReceived(uint tokensExpected): Error, the pools funds were not sent to the sale yet");
        require(!tokensReceivedConfirmed, "confirmTokensReceived(uint tokensExpected): Error, tokens are already confirmed as received");
        require (tokensExpected > 0, "confirmTokensReceived(uint tokensExpected): Error, number of tokens expected has to be greater than 0");
        if(ERC20Basic(tokenAddress).balanceOf(address(this)) > tokensExpected) tokensReceivedConfirmed = true;
    }
    
    function sendToSale() public onlyAdmin{
        require(bytes(saleParticipateFunctionSig).length == 0, "sendToSale(): Error, participation function signature is given, 'sendToSaleFunction()' has to be used");
        require(!sentToSale, "sendToSale(): Error, the pools funds were already sent to the sale");
        require(now >= saleStartDate, "sendToSale(): Error, sale hasn't started yet");
        require(block.timestamp < saleEndDate, "sendToSale(): Error, the sale has ended");
        require(calculateNetContribution() >= minPoolGoal, "sendToSale(): Not enough funds collected for sale");
        takeFees();
        sentToSale = true;
        saleAddress.transfer(calculateNetContribution());        
    }

    function sendToSaleFunction() public onlyAdmin {
        require(bytes(saleParticipateFunctionSig).length > 0, "sendToSaleFunction(): Error, no participation function signature given");
        require(!sentToSale, "sendToSaleFunction(): Error, the pools funds were already sent to the sale");
        require(now >= saleStartDate, "sendToSaleFunction(): Error, sale hasn't started yet");
        require(block.timestamp < saleEndDate, "sendToSaleFunction(): Error, the sale has ended");
        require(calculateNetContribution() >= minPoolGoal, "sendToSaleFunction():: Not enough funds collected for sale");
        takeFees();
        sentToSale = true;
        require(saleAddress.call.value(calculateNetContribution())(bytes4(keccak256(saleParticipateFunctionSig))), "Error, transaction failed");
    }

    function takeFees() private returns(uint) {
        creatorStash = calculateFee(allGrossContributions, creatorFeeRate);
        providerStash = calculateFee(allGrossContributions, providerFeeRate);
    }


    function calculateNetContribution() private view returns (uint) {
        return SafeMath.sub(allGrossContributions, SafeMath.sub(creatorStash, providerStash));
    }

    function calculateFee(uint value, uint feePerThousand) private pure returns(uint fee) {
        return SafeMath.mul(value / 1000, feePerThousand);
    }

    function withdrawFromSaleFunction() public onlyAdmin{
        require(bytes(saleParticipateFunctionSig).length > 0, "withdrawFromSaleFunction(): Error, no withdraw function signature given");
        require(sentToSale, "withdrawFromSaleFunction(): Error, the pools funds were not sent to the sale yet");
        require(saleAddress.call(bytes4(keccak256(saleWithdrawFunctionSig))), "withdrawFromSaleFunction(): Error, transaction failed");
    }    

    function () public payable {
        //empty fallback to take refund tx-s
    }

    function poviderWithdraw() public onlyProvider{
        uint amount = providerStash;
        providerStash = 0;
        creator.transfer(amount);
    }

    function creatorWithdraw() public onlyCreator{
        uint amount = creatorStash;
        creatorStash = 0;
        creator.transfer(amount);
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

    function setProvider(address _provider) public onlyProvider {
        provider = _provider;
    }

    function setCreator(address _creator) public onlyCreator {
        creator = _creator;
    }

    function setProviderFeeRate(uint _providerFeeRate) public onlyProvider {
        providerFeeRate = _providerFeeRate;
    }

    function setCreatorFeeRate(uint _creatorFeeRate) public onlyCreator {
        creatorFeeRate = _creatorFeeRate;
    }

    function setTokenAddress(address _tokenAddress) public onlyCreator {
        require(!tokensReceivedConfirmed, "setTokenAddress(address _tokenAddress): Error, tokens are already confirmed as received");
        tokenAddress = _tokenAddress;
    }

    function setWhitelistPool(bool _whitelistPool) public onlyCreator {
        whitelistPool = _whitelistPool;
    }
    function setSaleStartDate(uint _saleStartDate) public onlyCreator {
        saleStartDate = _saleStartDate;
    }

    function setSaleEndDate(uint _saleEndDate) public onlyCreator {
        saleEndDate = _saleEndDate;
    }

    function setMinContribution(uint _minContribution) public onlyCreator {
        minContribution = _minContribution;
    }

    function setMaxContribution(uint _maxContribution) public onlyCreator {
        maxContribution = _maxContribution;
    }

    function setMinPoolGoal(uint _minPoolGoal) public onlyCreator {
        minPoolGoal = _minPoolGoal;
    }

    function setMaxPoolAllocation(uint _maxPoolAllocation) public onlyProvider {
        maxPoolAllocation = _maxPoolAllocation;
    }

    function setWithdrawTimelock(uint _withdrawTimelock) public onlyCreator {
        withdrawTimelock = _withdrawTimelock;
    }

}
