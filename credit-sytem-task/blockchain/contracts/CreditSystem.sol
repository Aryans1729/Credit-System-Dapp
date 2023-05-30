/// @title : Credit System Contract
// SPDX-License-Identifier: MIT
pragma solidity 0.8.18;

/// @dev Importinf openzeppelin stufffs
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/// @dev Defining the contract
contract CreditSystem is Ownable, ReentrancyGuard {
    /// @dev @param initialBalancePerUser : The initial amount when user will be added to the system
    uint256 public initialBalancePerUser;

    /// @dev @param name: Name of the token
    string public name;
    /// @dev @param symbol: Symbol of the token
    string public symbol;

    /// @dev mapping ( user => balance ) : To track the balance of a user in the system
    mapping(address => uint256) public balanceOf;

    /// @dev mapping ( user => yes/no ) : To track if the user is added to the credit system or not
    mapping(address => bool) public isUserAddedToTheCreditSystem;

    /// @dev Events:

    /**
     * `UserAddedToCreditSystem` will be emitted when a user will be added in the system.
     * @param _user: The address of the user
     * @param _amount: The amount user will get after adding
     */
    event UserAddedToCreditSystem(address indexed _user, uint256 _amount);

    /**
     * `ExtraTokenGiven` will be emitted when some extra token will be given to a user who already added to the system .
     * @param _user: The address of the user
     * @param _amount: The extra token given to the user
     */
    event ExtraTokenGiven(address indexed _user, uint256 _amount);

    /**
     * `transfer` will be emitted when some token tranfer from one account to another.
     *param from: The user who is transfering
     * @param to: The user to whom transfering
     * @param amount: The transfering amount
     */
    event transfer(address indexed from, address indexed to, uint256 amount);

    /// @dev Initializing the contract

    constructor(
        string memory _name,
        string memory _symbol,
        uint256 _initialBalancePerUser
    ) {
        /// @dev Checking initial amount not equal to zero
        require(
            _initialBalancePerUser > 0,
            "Credit Amount should be greater than 0"
        );

        /// @dev Initializing state variables
        name = _name;
        symbol = _symbol;
        initialBalancePerUser = _initialBalancePerUser;

        /// Minting token equal to initial Balance to the owner initially

        balanceOf[msg.sender] = _initialBalancePerUser;

        /// @dev Including the owner to the credit system
        isUserAddedToTheCreditSystem[msg.sender] = true;

        /// @dev emitting the event UserAddedToCreditSystem

        emit UserAddedToCreditSystem(msg.sender, _initialBalancePerUser);
    }

    /**
     * (PUBLIC)
     * @dev Function to Add a user to the credit system
     * Required: OnlyOwner.
     * @param _user:The address of the user being added
     */

    function addUserToCreaditSystem(address _user)
        external
        onlyOwner
        nonReentrant
    {
        /// @dev Checking for 0 address
        require(_user != address(0), "Invalid User Address");

        /// @dev Checking if the user is already in the system
        require(
            !isUserAddedToTheCreditSystem[_user],
            "User Already added to credit system"
        );

        /// @dev adding the user in the credit system
        isUserAddedToTheCreditSystem[_user] = true;

        /// @dev Assing the amount equal to max supply to the user
        balanceOf[_user] = initialBalancePerUser;

        /// @dev emitting the event UserAddedToCreditSystem
        emit UserAddedToCreditSystem(_user, initialBalancePerUser);
    }

    /**
     * (PUBLIC)
     * @dev Function to give extra token to the user
     * Required: OnlyOwner.
     * @param _user:The address of the user
     *@param _amount : Extra amount of token
     */

    function giveExtraTokenToUser(address _user, uint256 _amount)
        external
        onlyOwner
        nonReentrant
    {
        /// @dev Checking if the user is added to the system or not
        require(
            isUserAddedToTheCreditSystem[_user],
            "User is not addded to credit system"
        );

        /// @dev increasing the balance
        balanceOf[_user] += _amount;

        /// @dev emitting the event

        emit ExtraTokenGiven(_user, _amount);
    }

    /**
     * (PUBLIC)
     * @dev Function to transfer token to the user
     * @param _to:The address of the user to transfer
     *@param _amount :  amount of token
     */

    function transferToken(address _to, uint256 _amount) external nonReentrant {
        /// @dev Checking if the sender is added to the credit system or not
        require(
            isUserAddedToTheCreditSystem[msg.sender],
            "You are not added to system"
        );

        /// @dev cheking if the user who will get the token is in the system
        require(
            isUserAddedToTheCreditSystem[_to],
            "transfer to account not in credit system"
        );

        /// @dev cheking the amount
        require(_amount != 0, "Cannot send 0 amount");

        /// @dev checking if the user have sufficient balance or not

        require(
            balanceOf[msg.sender] >= _amount,
            "User does not have sufficient balance"
        );

        /// @dev adding and minus amount from both users

        balanceOf[msg.sender] -= _amount;
        balanceOf[_to] += _amount;

        /// @dev emitting the event

        emit transfer(msg.sender, _to, _amount);
    }
}
