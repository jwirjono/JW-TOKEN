pragma solidity ^0.6.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract JwToken is ERC20 {
    constructor(uint256 initialSupply) ERC20("JW-Token", "SCT") public {
        _mint(msg.sender, initialSupply);
    _setupDecimals(0);
    }
}