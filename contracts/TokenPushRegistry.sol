pragma solidity ^0.4.24;

import '../node_modules/openzeppelin-solidity/contracts/math/SafeMath.sol';

contract TokenPushRegistry {
    
    address public owner;
    address public pushServer;
    uint public pushGasCost;
    mapping(address => mapping(address => uint)) public pushGasPrice; //(poolAddress => (recipientAddress => gasPrice))
    mapping(address => address[]) public recipients;

    modifier onlyOwner{
        require(msg.sender == owner, "modifier onlyOwner: Error, tx was not initiated by owner address");
        _;
    }

    modifier onlyPushServer{
        require(msg.sender == pushServer, "onlyPushServer onlyOwner: Error, tx was not initiated by owner push server");
        _;
    }

    constructor (address _pushServer, uint _pushGasCost) public {
        owner = msg.sender;
        pushServer = _pushServer;
        pushGasCost = _pushGasCost;
    }

    function add(address pool, uint gasPrice) public payable{
        require(msg.value >= SafeMath.mul(gasPrice, pushGasCost), "add(address pool, uint gasPrice): Error, message value is less then gas needed");
        pushGasPrice[pool][msg.sender] = gasPrice;
        recipients[pool].push(msg.sender);
    }

    function takeGas(address pool, address recipient) public onlyPushServer{
        pushServer.transfer(SafeMath.mul(pushGasPrice[pool][recipient], pushGasCost));
        pushGasPrice[pool][recipient] = 0;
    }

    function setOwner(address _owner) public onlyOwner {
        owner = _owner;
    }

    function setPushServer(address _pushServer) public onlyOwner {
        pushServer = _pushServer;
    }

    function setPushGasCost(uint _pushGasCost) public onlyOwner {
        pushGasCost = _pushGasCost;
    }

}