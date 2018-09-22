pragma solidity ^0.4.24;

import './KYC.sol';
import '../node_modules/openzeppelin-solidity/contracts/token/ERC20/ERC20.sol';

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
    address public tokenAddress; // address of erc20 token contract
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
    bool tokensReceivedConfirmed;
    
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
        tokenAddress = _tokenAddress;
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
        require(!contributors[msg.sender].payedOut);
        contributors[msg.sender].payedOut = true;
        allGrossContributions -= contributors[msg.sender].grossContribution;
        uint amount = contributors[msg.sender].grossContribution;
        contributors[msg.sender].grossContribution = 0;
        contributors[msg.sender].payedOut = true;
        msg.sender.transfer(amount);        
    }

    function withdrawRefund() public{
        require(sentToSale);
        require(!contributors[msg.sender].payedOut);
        //require(a feeknél több ether van bent);     
    }
    
    function withdrawToken() public {
        require(sentToSale);
        //todo
    }

    function withdrawCustomToken(address customTokenAddress) public{
        require(sentToSale);
        //todo
    }
    
    function pushOutToken(address recipient) public onlyAdmin{
        require(sentToSale);
        //todo
    }
    
    function changeTokenAddress(address _tokenAddress) public onlyCreator{
        require(!tokensReceivedConfirmed);
        tokenAddress = _tokenAddress;
    }

    function confirmTokensReceived(uint tokensExpected) public onlyCreator{
        require(sentToSale);
        require(!tokensReceivedConfirmed);
        require (tokensExpected > 0);
        if(ERC20(tokenAddress).balanceOf(address(this)) > tokensExpected) tokensReceivedConfirmed = true;
    }
    
    function sendToSale() public onlyAdmin{
        //todo
        //take fees
    }

    function calculateNetContribution() public view {
        //todo
    }
    

    function () public payable{
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

    //todo fee taking

    //todo setters

    //todo require error messages

}
