pragma solidity ^0.4.24;

contract KYC {
    address public owner;
    mapping(address => bool) admins; 
    mapping(address => bool) kycAddresses;
    
}