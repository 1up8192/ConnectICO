pragma solidity ^0.4.24;

//pow operation with a very weak but simple safety check

library SemiSafeMath {

    function pow(uint256 _a, uint256 _b) internal pure returns (uint256 c){
        c = _a ** _b;
        assert((_b <= 0 || _a < 0) || c >= _a);
        return c;
    }

}
