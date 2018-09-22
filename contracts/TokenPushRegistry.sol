pragma solidity ^0.4.24;

contract TokenPushRegistry {
    
    address public owner;
    address public pushServer;
    uint public pushGasCost;
    mapping(address => mapping(address => uint)) public pushGasPrice; //(poolAddress => (recipientAddress => gasPrice))
    mapping(address => address[]) public recipients;

    modifier onlyOwner{
        require(msg.sender == owner);
        _;
    }

    modifier onlyPushServer{
        require(msg.sender == pushServer);
        _;
    }

    constructor (address _pushServer, uint _pushGasCost) public {
        owner = msg.sender;
        pushServer = _pushServer;
        pushGasCost = _pushGasCost;
    }

    function add(address pool, uint gasPrice) public payable{
        require(msg.value >= gasPrice * pushGasCost);
        pushGasPrice[pool][msg.sender] = gasPrice;
        recipients[pool].push(msg.sender);
    }

    function takeGas(address pool, address recipient) public onlyPushServer{
        pushServer.transfer(pushGasPrice[pool][recipient] * pushGasCost);
        pushGasPrice[pool][recipient] = 0;
    }

    function setPushServer(address _pushServer) public onlyOwner {
        pushServer = _pushServer;
    }

    function setpushGasCost(uint _pushGasCost) public onlyOwner {
        pushGasCost = _pushGasCost;
    }
}