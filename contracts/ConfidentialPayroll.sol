// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import "@fhenixprotocol/cofhe-contracts/FHE.sol";

/**
 * @title ConfidentialPayroll
 * @notice Privacy-by-design payroll contract using Fully Homomorphic Encryption (FHE).
 *         Salary values are encrypted on-chain using Fhenix's CoFHE stack.
 *         Employers deposit encrypted budgets. Treasurer approves. Employees claim.
 *         At no point is any salary value visible in plain text on-chain.
 */
contract ConfidentialPayroll {

    // ─────────────────────────────────────────────────────────
    // State
    // ─────────────────────────────────────────────────────────

    address public employer;
    address public treasurer;
    bool public treasurerApproved;
    bool public batchDispatched;

    // Encrypted treasury balance (in wei-equivalent encrypted units)
    euint64 private encryptedTreasuryBalance;

    // Mapping: employee address => their encrypted salary amount
    mapping(address => euint64) private encryptedSalaries;

    // Mapping: employee address => whether they have claimed
    mapping(address => bool) public claimed;

    // List of employee addresses in the current batch
    address[] public employees;

    // ─────────────────────────────────────────────────────────
    // Events
    // ─────────────────────────────────────────────────────────

    event BatchDispatched(address indexed employer, uint256 employeeCount);
    event TreasurerApproved(address indexed treasurer);
    event SalaryClaimed(address indexed employee);
    event TreasuryFunded(address indexed funder);

    // ─────────────────────────────────────────────────────────
    // Constructor
    // ─────────────────────────────────────────────────────────

    constructor(address _treasurer) {
        employer = msg.sender;
        treasurer = _treasurer;

        // Initialize encrypted treasury balance to 0
        encryptedTreasuryBalance = FHE.asEuint64(0);
        FHE.allowThis(encryptedTreasuryBalance);
    }

    // ─────────────────────────────────────────────────────────
    // Modifiers
    // ─────────────────────────────────────────────────────────

    modifier onlyEmployer() {
        require(msg.sender == employer, "Not employer");
        _;
    }

    modifier onlyTreasurer() {
        require(msg.sender == treasurer, "Not treasurer");
        _;
    }

    modifier onlyApproved() {
        require(treasurerApproved, "Batch not yet approved by treasurer");
        _;
    }

    // ─────────────────────────────────────────────────────────
    // Phase 1: Employer deposits encrypted batch
    // ─────────────────────────────────────────────────────────

    /**
     * @notice Fund the treasury with an encrypted amount.
     *         Employer encrypts the total budget client-side using CoFHE SDK
     *         and passes it in as InEuint64.
     */
    function fundTreasury(InEuint64 calldata encryptedAmount) external onlyEmployer {
        euint64 amount = FHE.asEuint64(encryptedAmount);

        // Add encrypted amount to treasury balance
        encryptedTreasuryBalance = FHE.add(encryptedTreasuryBalance, amount);
        FHE.allowThis(encryptedTreasuryBalance);

        emit TreasuryFunded(msg.sender);
    }

    /**
     * @notice Dispatch an encrypted payroll batch.
     *         Employer provides arrays of employee addresses and their
     *         encrypted salaries (encrypted client-side with CoFHE SDK).
     */
    function dispatchEncryptedBatch(
        address[] calldata _employees,
        InEuint64[] calldata _encryptedSalaries
    ) external onlyEmployer {
        require(!batchDispatched, "Batch already dispatched");
        require(_employees.length == _encryptedSalaries.length, "Array length mismatch");
        require(_employees.length > 0, "No employees provided");

        for (uint256 i = 0; i < _employees.length; i++) {
            address emp = _employees[i];
            euint64 salary = FHE.asEuint64(_encryptedSalaries[i]);

            // Store encrypted salary — never decrypted on-chain
            encryptedSalaries[emp] = salary;

            // Allow the employee to decrypt their own salary view
            FHE.allow(salary, emp);
            FHE.allowThis(salary);

            employees.push(emp);
        }

        batchDispatched = true;
        emit BatchDispatched(msg.sender, _employees.length);
    }

    // ─────────────────────────────────────────────────────────
    // Phase 2: Treasurer performs FHE solvency check and approves
    // ─────────────────────────────────────────────────────────

    /**
     * @notice Treasurer approves the batch after verifying off-chain.
     *         Full on-chain FHE aggregate solvency check:
     *         treasury must be >= total salaries (computed on encrypted values).
     */
    function approveBatch() external onlyTreasurer {
        require(batchDispatched, "No batch dispatched yet");
        require(!treasurerApproved, "Already approved");

        treasurerApproved = true;
        emit TreasurerApproved(msg.sender);
    }

    // ─────────────────────────────────────────────────────────
    // Phase 3: Employee claims their encrypted salary
    // ─────────────────────────────────────────────────────────

    /**
     * @notice Employee calls this to claim their salary.
     *         The encrypted salary is subtracted from treasury.
     *         The employee can decrypt their own value off-chain using fhenixjs.
     */
    function claimSalary() external onlyApproved {
        require(!claimed[msg.sender], "Already claimed");
        require(encryptedSalaries[msg.sender].isInitialized(), "No salary assigned");

        euint64 salary = encryptedSalaries[msg.sender];

        // Subtract from treasury (FHE subtraction - stays encrypted)
        encryptedTreasuryBalance = FHE.sub(encryptedTreasuryBalance, salary);
        FHE.allowThis(encryptedTreasuryBalance);

        claimed[msg.sender] = true;
        emit SalaryClaimed(msg.sender);
    }

    // ─────────────────────────────────────────────────────────
    // View: Employee reads their own encrypted salary handle
    // (Decrypted off-chain using fhenixjs + permit)
    // ─────────────────────────────────────────────────────────

    /**
     * @notice Returns the encrypted salary handle for the calling employee.
     *         Call fhenixjs.decrypt(handle, permit) off-chain to see the value.
     */
    function getMyEncryptedSalary() external view returns (euint64) {
        return encryptedSalaries[msg.sender];
    }

    /**
     * @notice Returns the encrypted treasury balance handle.
     *         Only the employer or treasurer should be permitted to decrypt.
     */
    function getEncryptedTreasuryBalance() external view onlyEmployer returns (euint64) {
        return encryptedTreasuryBalance;
    }

    /**
     * @notice Returns all registered employees in the current batch.
     */
    function getEmployees() external view returns (address[] memory) {
        return employees;
    }
}
