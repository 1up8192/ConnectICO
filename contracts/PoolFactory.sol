pragma solidity ^0.4.24;

//import './Pool.sol';
import './KYC.sol';
import '../node_modules/openzeppelin-solidity/contracts/math/SafeMath.sol';

contract PoolFactory{
    address owner;

    address public kycContractAddress;
    uint public flatFee;
    uint public maxAllocationFeeRate; // 1/1000
    uint public maxCreatorFeeRate; // 1/1000
    uint public providerFeeRate; // 1/1000

    address[] poolList;
    mapping (address => bool) pools;
    mapping (address => address[]) poolsBySales;

    constructor (address _kycContractAddress, uint _flatFee, uint _maxAllocationFeeRate, uint _maxCreatorFeeRate, uint _providerFeeRate) public {
        owner = msg.sender;
        kycContractAddress = _kycContractAddress;
        flatFee = _flatFee;
        maxAllocationFeeRate = _maxAllocationFeeRate;
        maxCreatorFeeRate = _maxCreatorFeeRate;
        providerFeeRate = _providerFeeRate;
    }

    modifier onlyOwner{
        require(msg.sender == owner, "modifier onlyOwner: Error, tx was not initiated by owner address");
        _;
    }

    function createPool(
        address _saleAddress, 
        address _tokenAddress, 
        uint _creatorFeeRate, 
        uint _saleStartDate, 
        uint _saleEndDate, 
        uint _minContribution, 
        uint _maxContribution, 
        uint _minPoolGoal, 
        uint _maxPoolAllocation, 
        uint _withdrawTimelock, 
        bool _whitelistPool
    ) public payable {
        require(KYC(kycContractAddress).checkKYC(msg.sender), "createPool(...): Error, tx was not initiated by KYC address");
        require(msg.value >= SafeMath.add(flatFee, SafeMath.mul(maxAllocationFeeRate, _maxPoolAllocation) / 1000), "createPool(...): Error, not enough value for fees");
        require(maxCreatorFeeRate >= _creatorFeeRate, "createPool(...): Error, pool fee rate is greater than max allowed");
        /*address poolAddress = new Pool(
            [kycContractAddress, owner, msg.sender, _saleAddress, _tokenAddress],
            [providerFeeRate, _creatorFeeRate, _saleStartDate, _saleEndDate, 
            _minContribution, _maxContribution, _minPoolGoal, _maxPoolAllocation,
            _withdrawTimelock],
            _whitelistPool
            );
        poolList.push(poolAddress);
        poolsBySales[_saleAddress].push(poolAddress);
        pools[poolAddress] = true;*/
    }

    function setOwner(address _owner) public onlyOwner {
        owner = _owner;
    }

    function setKycContractAddress(address _kycContractAddress) public onlyOwner {
        kycContractAddress = _kycContractAddress;
    }

    function setFlatFee(uint _flatFee) public onlyOwner {
        flatFee = _flatFee;
    }

    function setMaxAllocationFeeRate(uint _maxAllocationFeeRate) public onlyOwner {
        maxAllocationFeeRate = _maxAllocationFeeRate;
    }

    function setMaxCreatorFeeRate(uint _maxCreatorFeeRate) public onlyOwner {
        maxCreatorFeeRate = _maxCreatorFeeRate;
    }

    function setProviderFeeRate(uint _providerFeeRate) public onlyOwner {
        providerFeeRate = _providerFeeRate;
    }

    function wtihdraw() public onlyOwner{
        owner.transfer(address(this).balance);
    }

    function () public payable{
        revert("Error: fallback function");
    }

}