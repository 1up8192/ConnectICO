pragma solidity ^0.4.24;

contract KYC {
    address public owner;
    mapping(address => bool) public admins; 
    mapping(address => bool) public kycAddresses;
    
    modifier onlyOwner{
        require(msg.sender == owner);
        _;
    }
    
    modifier onlyAdmin{
        require(admins[msg.sender]);
        _;
    }

    function addAdmin(address[] addressList) public onlyOwner {
        for(uint i = 0; i < addressList.length; i++){
            admins[addressList[i]] = true;
        }
    }

    function addAdmin(address adminAddress) public onlyOwner {
        admins[adminAddress] = true;
    }

    function removeAdmin(address adminAddress) public onlyOwner {
        admins[adminAddress] = false;
    }

    function addKYCAddress(address[] addressList) public onlyAdmin {
        for(uint i = 0; i < addressList.length; i++){
            kycAddresses[addressList[i]] = true;
        }
    }

    function addKYCAddress(address KYCAddress) public onlyAdmin {
        kycAddresses[KYCAddress] = true;
    }

    function removeKYCAddress(address KYCAddress) public onlyAdmin {
        kycAddresses[KYCAddress] = false;
    }

    function checkKYC(address addr) public view returns (bool){
        return kycAddresses[addr];
    }
}