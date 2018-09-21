pragma solidity ^0.4.24;

import './Pool.sol';
import './KYC.sol';

contract PoolFactory{
    address owner;

    address public kycAddress;
    uint flatFee;
    uint maxAllocationFeeRate;
    uint maxCreatorFeeRate;
    uint providerfeeRate;

    address[] poolList;
    mapping (address => bool) pools;
    mapping (address => address[]) poolsBySales;

    constructor (address _kycAddress, uint _flatFee, uint _maxAllocationFeeRate, uint _maxCreatorFeeRate, uint _providerfeeRate) public {
        owner = msg.sender;
        kycAddress = _kycAddress;
        flatFee = flatFee;
        maxAllocationFeeRate = _maxAllocationFeeRate;
        maxCreatorFeeRate = _maxCreatorFeeRate;
        providerfeeRate = _providerfeeRate;
    }

    function createPool(
        uint _creatorFeeRate, address _saleAddress, address _tokenAddress, bool _whitelistPool, 
        uint _saleStartDate, uint _saleEndDate, uint _minContribution, uint _maxContribution, 
        uint _minPoolGoal, uint _maxPoolAllocation, uint _withdrawTimelock
    ) public payable {
        //todo checks
        require(KYC(kycAddress).checkKYC(msg.sender));
        require(flatFee + maxAllocationFeeRate * _maxPoolAllocation >= msg.value);
        require(maxCreatorFeeRate >= _creatorFeeRate);
        address poolAddress = new Pool(kycAddress, owner, msg.sender, _creatorFeeRate, providerfeeRate, _saleAddress, 
        _tokenAddress, _whitelistPool, _saleStartDate, _saleEndDate,
        _minContribution, _maxContribution, _minPoolGoal, _maxPoolAllocation,
        _withdrawTimelock);
        poolList.push(poolAddress);
        poolsBySales[_saleAddress].push(poolAddress);
        pools[poolAddress] = true;
    }

    //todo setters
    //todo withdraw

}