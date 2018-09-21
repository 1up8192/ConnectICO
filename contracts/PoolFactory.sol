pragma solidity ^0.4.24;

import "./Pool.sol";

contract PoolFactory{
    address owner;
    address[] poolList;
    mapping (address => bool) pools;
    uint flatFee;
    uint feeRate;
    uint maxCreatorFeeRate;

    function createPool(
        uint _creatorFeeRate, address _saleAddress, address _tokenAddress, bool _whitelistPool, 
        uint _saleStartDate, uint _saleEndDate, uint _minContribution, uint _maxContribution, 
        uint _minPoolGoal, uint _maxPoolAllocation, uint _withdrawTimelock
    ) public {
        //todo checks
        address poolAddress = new Pool(owner, msg.sender, _creatorFeeRate, feeRate, _saleAddress, 
        _tokenAddress, _whitelistPool, _saleStartDate, _saleEndDate,
        _minContribution, _maxContribution, _minPoolGoal, _maxPoolAllocation,
        _withdrawTimelock);
    }

//contructor

}