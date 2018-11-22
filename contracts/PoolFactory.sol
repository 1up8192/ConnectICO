pragma solidity ^0.4.24;

import './Pool.sol';
import './KYC.sol';
import '../node_modules/openzeppelin-solidity/contracts/math/SafeMath.sol';

contract PoolFactory{

    struct Params{    
        address owner;
        address kycContractAddress;
        uint256 flatFee;
        uint16 maxAllocationFeeRate; // 1/1000
        uint16 maxCreatorFeeRate; // 1/1000
        uint16 providerFeeRate; // 1/1000
    }

    Params public params;

    address[] public poolList;
    mapping (address => bool) public pools;
    mapping (address => address[]) public poolsBySales;
    //creator whitelist

    event poolCreated(address poolAddress);

    constructor (address _kycContractAddress, uint _flatFee, uint16 _maxAllocationFeeRate, uint16 _maxCreatorFeeRate, uint16 _providerFeeRate) public {
        params.owner = msg.sender;
        params.kycContractAddress = _kycContractAddress;
        params.flatFee = _flatFee;
        params.maxAllocationFeeRate = _maxAllocationFeeRate;
        params.maxCreatorFeeRate = _maxCreatorFeeRate;
        params.providerFeeRate = _providerFeeRate;
    }

    modifier onlyOwner{
        require(msg.sender == params.owner, "modifier onlyOwner: Error, tx was not initiated by owner address");
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
        require(KYC(params.kycContractAddress).checkKYC(msg.sender), "createPool(...): Error, tx was not initiated by KYC address");
        require(msg.value >= SafeMath.add(params.flatFee, SafeMath.mul(params.maxAllocationFeeRate, _maxPoolAllocation) / 1000), "createPool(...): Error, not enough value for fees");
        require(params.maxCreatorFeeRate >= _creatorFeeRate, "createPool(...): Error, pool fee rate is greater than max allowed");
        address poolAddress = new Pool(
            [params.kycContractAddress, params.owner, msg.sender, _saleAddress, _tokenAddress],
            [params.providerFeeRate, _creatorFeeRate, _saleStartDate, _saleEndDate, 
            _minContribution, _maxContribution, _minPoolGoal, _maxPoolAllocation,
            _withdrawTimelock],
            _whitelistPool
            );
        poolList.push(poolAddress);
        poolsBySales[_saleAddress].push(poolAddress);
        pools[poolAddress] = true;
        emit poolCreated(poolAddress);
    }

    function wtihdraw() public onlyOwner{
        params.owner.transfer(address(this).balance);
    }

    function setParams(
        address _owner,
        address _kycContractAddress,
        uint256 _flatFee,
        uint16 _maxAllocationFeeRate, // 1/1000
        uint16 _maxCreatorFeeRate, // 1/1000
        uint16 _providerFeeRate, // 1/1000
        bool[6] toSet
        ) public onlyOwner {
            if(toSet[0]){
                params.owner = _owner;
            }
            if(toSet[1]){
                params.kycContractAddress = _kycContractAddress;
            }
            if(toSet[2]){
                params.flatFee = _flatFee;
            }
            if(toSet[3]){
                params.maxAllocationFeeRate = _maxAllocationFeeRate;
            }
            if(toSet[4]){
                params.maxCreatorFeeRate = _maxCreatorFeeRate;
            }
            if(toSet[5]){
                params.providerFeeRate = _providerFeeRate;
            }

    }

    function () public payable{
        revert("Error: fallback function");
    }

}