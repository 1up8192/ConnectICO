pragma solidity ^0.4.24;

import './Pool.sol';
import './KYC.sol';

contract PoolFactory{
    address owner;

    address public kycAddress;
    uint public flatFee;
    uint public maxAllocationFeeRate;
    uint public maxCreatorFeeRate;
    uint public providerFeeRate;

    address[] poolList;
    mapping (address => bool) pools;
    mapping (address => address[]) poolsBySales;

    constructor (address _kycAddress, uint _flatFee, uint _maxAllocationFeeRate, uint _maxCreatorFeeRate, uint _providerFeeRate) public {
        owner = msg.sender;
        kycAddress = _kycAddress;
        flatFee = _flatFee;
        maxAllocationFeeRate = _maxAllocationFeeRate;
        maxCreatorFeeRate = _maxCreatorFeeRate;
        providerFeeRate = _providerFeeRate;
    }

    modifier onlyOwner{
        require(msg.sender == owner);
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
        require(KYC(kycAddress).checkKYC(msg.sender));
        require(flatFee + maxAllocationFeeRate * _maxPoolAllocation >= msg.value);
        require(maxCreatorFeeRate >= _creatorFeeRate);
        address poolAddress = new Pool(
            [kycAddress, owner, msg.sender, _saleAddress, _tokenAddress],
            [providerFeeRate, _creatorFeeRate, _saleStartDate, _saleEndDate, 
            _minContribution, _maxContribution, _minPoolGoal, _maxPoolAllocation,
            _withdrawTimelock],
            _whitelistPool
            );
        poolList.push(poolAddress);
        poolsBySales[_saleAddress].push(poolAddress);
        pools[poolAddress] = true;
    }

    function setKYCAddress(address _kycAddress) public onlyOwner {
        kycAddress = _kycAddress;
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
        revert();
    }

    //todo require error messages
}