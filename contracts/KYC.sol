pragma solidity ^0.4.24;

contract KYC {
    address public owner;
    mapping(address => bool) public admins; 
    mapping(address => bool) public kycAddresses;
    mapping(address => string) public kycCountry;
    
    modifier onlyOwner{
        require(msg.sender == owner, "modifier onlyOwner: Error, tx was not initiated by owner address");
        _;
    }
    
    modifier onlyAdmin{
        require(admins[msg.sender], "modifier onlyAdmin: Error, tx was not initiated by admin address");
        _;
    }

    constructor () public {
        owner = msg.sender;
        admins[owner] = true;
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

    function addKYCAddress(address[] addressList, bytes3[] countryList) public onlyAdmin {
        require(addressList.length == countryList.length,  "addKYCAddress(address[] addressList, bytes3[] countryList): Error, addressList and countryList has different lenghts");
        for(uint i = 0; i < addressList.length; i++){
            kycAddresses[addressList[i]] = true;
            kycCountry[addressList[i]] = bytes3ToString(countryList[i]);
        }
    }

    function addKYCAddress(address KYCAddress, string country) public onlyAdmin {
        kycAddresses[KYCAddress] = true;
        kycCountry[KYCAddress] = country;
    }

    function removeKYCAddress(address KYCAddress) public onlyAdmin {
        kycAddresses[KYCAddress] = false;
        delete kycCountry[KYCAddress];
    }

    function checkKYC(address addr) public view returns (bool){
        return kycAddresses[addr];
    }

    function bytes3ToString(bytes3 x) private pure returns (string) {
        bytes memory bytesString = new bytes(3);
        uint charCount = 0;
        for (uint j = 0; j < 3; j++) {
            byte char = byte(bytes32(uint(x) * 2 ** (8 * j)));
            if (char != 0) {
                bytesString[charCount] = char;
                charCount++;
            }
        }
        bytes memory bytesStringTrimmed = new bytes(charCount);
        for (j = 0; j < charCount; j++) {
            bytesStringTrimmed[j] = bytesString[j];
        }
        return string(bytesStringTrimmed);
    }
    
}