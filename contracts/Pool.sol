pragma solidity ^0.4.24;

import "./KYC.sol";

contract Pool {
    
    struct contributorData{
        uint lastContributionTime;
        uint grossContribution;
        bool payedOut;
    }


    address public kycAddress;   
    address public provider; //connectICO address for fees
    address public creator; //pool creator address
    uint public providerFeeRate;
    uint public creatorFeeRate;
    mapping(address => bool) public admins; //additional admins
    address public saleAddress; //address of token sale
    address[] public tokenAddresses; //todo change type to erc20 // address of erc20 token contract
    bool public whitelistPool;
    mapping(address => bool) public whitelist; 
    uint public saleStartDate;
    uint public saleEndDate;
    uint public minContribution; //minimum amount expected from pool partocopants
    uint public maxContribution; //maximum amount expected from pool partocopants 0: no limit
    uint public minPoolGoal;  //minimum amount needed for the sale
    uint public maxPoolAllocation; //maximum amount raisable by pool
    uint public withdrawTimelock;
    
    
    uint public allGrossContributions;
    mapping(address => contributorData) public contributors;
    bool public sentToSale;
    address[] contributorList;
    uint public creatorStash;
    uint public providerStash;
    
    modifier onlyCreator{
        require(msg.sender == creator);
        _;
    }
    
    modifier onlyAdmin{
        require(admins[msg.sender]);
        _;
    }
    
    modifier onlyProvider{
        require(msg.sender == provider);
        _;
    }
    
    modifier onlyAdminOrProvider{
        require(admins[msg.sender] || msg.sender == provider);
        _;
    }
    
    constructor(
        address _kycAddress, address _provider, address _creator, uint _creatorFeeRate, 
        uint _providerFeeRate, address _saleAddress, address _tokenAddress, bool _whitelistPool,
        uint _saleStartDate, uint _saleEndDate, uint _minContribution, uint _maxContribution, 
        uint _minPoolGoal, uint _maxPoolAllocation, uint _withdrawTimelock
    ) public {
        kycAddress = _kycAddress;
        provider = _provider;
        creator = _creator;
        admins[creator] = true;
        providerFeeRate = _providerFeeRate;
        creatorFeeRate = _creatorFeeRate;
        saleAddress = _saleAddress;
        if(_tokenAddress != 0x0) tokenAddresses.push(_tokenAddress);
        whitelistPool = _whitelistPool;
        saleStartDate = _saleStartDate;
        saleEndDate = _saleEndDate;
        minContribution = _minContribution;
        maxContribution = _maxContribution;
        minPoolGoal = _minPoolGoal;
        maxPoolAllocation = _maxPoolAllocation;
        withdrawTimelock = _withdrawTimelock;
    }
    
    function addAdmin(address[] addressList) public onlyCreator {
        for(uint i = 0; i < addressList.length; i++){
            require(KYC(kycAddress).checkKYC(addressList[i]));
            admins[addressList[i]] = true;
        }
    }

    function addAdmin(address adminAddress) public onlyCreator {
        require(KYC(kycAddress).checkKYC(adminAddress));
        admins[adminAddress] = true;
    }

    function removeAdmin(address adminAddress) public onlyCreator {
        admins[adminAddress] = false;
    }

    function addWhitelist(address[] addressList) public onlyAdmin {
        for(uint i = 0; i < addressList.length; i++){
            require(KYC(kycAddress).checkKYC(addressList[i]));
            whitelist[addressList[i]] = true;
        }
    }

    function addWhitelist(address whitelistAddress) public onlyAdmin {
        require(KYC(kycAddress).checkKYC(whitelistAddress));
        whitelist[whitelistAddress] = true;
    }

    function removeWhitelist(address whitelistAddress) public onlyAdmin {
        whitelist[whitelistAddress] = false;
    }
    
    function contribute() public payable {
        if(whitelistPool) require(whitelist[msg.sender]);
        require(KYC(kycAddress).checkKYC(msg.sender));
        require(msg.value >= minContribution);
        require(maxContribution == 0 || msg.value <= maxContribution);
        require(maxPoolAllocation == 0 || msg.value + allGrossContributions <= maxPoolAllocation);
        require(now < saleEndDate);
        require(!sentToSale);

        contributors[msg.sender].lastContributionTime = now; 
        if(contributors[msg.sender].lastContributionTime == 0) contributorList.push(msg.sender);
        contributors[msg.sender].grossContribution += msg.value;
        allGrossContributions += msg.value;
    }

    function detectReContributor() private {
        if(contributors[msg.sender].payedOut) contributors[msg.sender].payedOut = false;
    }
    
    function calculateFee(uint value, uint feePerThousand) private pure returns(uint fee) {
        return value / 1000 * feePerThousand;
    }
    
    function withdraw() public{
        require(!sentToSale);
        require(contributors[msg.sender].lastContributionTime + withdrawTimelock > now);
        contributors[msg.sender].payedOut = true;
        allGrossContributions -= contributors[msg.sender].grossContribution;
        uint amount = contributors[msg.sender].grossContribution;
        contributors[msg.sender].grossContribution = 0;
        contributors[msg.sender].payedOut = true;
        msg.sender.transfer(amount);        
    }
    
    function withdrawToken(){
        require(sentToSale);
    }

    function withdrawCustomToken(){

    }
    
    function pushOutToken(){
        
    }
    
    function addToken() onlyAdmin{
        
    }
    
    function sendToSale() onlyAdmin{
        //take fees
    }

    //todo setters

    //todo confirm tokens received

    //todo fallback

    //todo erc20 import (oz)

    //todo provider withdraw

    //todo creator withdraw
}
