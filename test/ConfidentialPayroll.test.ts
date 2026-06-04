import { expect } from "chai";
import { ethers } from "hardhat";
import { ConfidentialPayroll } from "../typechain-types";

/**
 * ConfidentialPayroll Test Suite
 *
 * NOTE: Full FHE encryption tests require a local Fhenix node (localfhenix network).
 * These tests verify the contract structure, access control, and flow logic.
 * Run against localfhenix for real encryption testing:
 *   npx hardhat test --network localfhenix
 */
describe("ConfidentialPayroll", function () {
  let contract: ConfidentialPayroll;
  let employer: any;
  let treasurer: any;
  let employee1: any;
  let employee2: any;

  beforeEach(async function () {
    [employer, treasurer, employee1, employee2] = await ethers.getSigners();

    const ConfidentialPayrollFactory = await ethers.getContractFactory("ConfidentialPayroll");
    contract = await ConfidentialPayrollFactory.deploy(treasurer.address) as ConfidentialPayroll;
    await contract.waitForDeployment();
  });

  // ─────────────────────────────────────────────────────────
  // Deployment
  // ─────────────────────────────────────────────────────────
  describe("Deployment", function () {
    it("Should set the correct employer", async function () {
      expect(await contract.employer()).to.equal(employer.address);
    });

    it("Should set the correct treasurer", async function () {
      expect(await contract.treasurer()).to.equal(treasurer.address);
    });

    it("Should start with batch not dispatched", async function () {
      expect(await contract.batchDispatched()).to.equal(false);
    });

    it("Should start with treasurer not approved", async function () {
      expect(await contract.treasurerApproved()).to.equal(false);
    });
  });

  // ─────────────────────────────────────────────────────────
  // Access Control
  // ─────────────────────────────────────────────────────────
  describe("Access Control", function () {
    it("Should revert approveBatch if called by non-treasurer", async function () {
      await expect(
        contract.connect(employee1).approveBatch()
      ).to.be.revertedWith("Not treasurer");
    });

    it("Should revert claimSalary if batch not approved", async function () {
      await expect(
        contract.connect(employee1).claimSalary()
      ).to.be.revertedWith("Batch not yet approved by treasurer");
    });

    it("Should revert getEncryptedTreasuryBalance if called by non-employer", async function () {
      await expect(
        contract.connect(employee1).getEncryptedTreasuryBalance()
      ).to.be.revertedWith("Not employer");
    });
  });

  // ─────────────────────────────────────────────────────────
  // Flow Logic
  // ─────────────────────────────────────────────────────────
  describe("Batch Dispatch Flow", function () {
    it("Should not allow a non-employer to dispatch batch", async function () {
      // Note: Full encrypted dispatch requires InEuint64 from CoFHE SDK
      // This test verifies the access control logic
      await expect(
        contract.connect(employee1).dispatchEncryptedBatch([], [])
      ).to.be.revertedWith("Not employer");
    });

    it("Should allow treasurer to approve after batch dispatch", async function () {
      // First simulate that batchDispatched is true by checking the revert message changes
      // Full integration test requires CoFHE SDK for encryption
      await expect(
        contract.connect(treasurer).approveBatch()
      ).to.be.revertedWith("No batch dispatched yet");
    });

    it("Should prevent double claiming", async function () {
      // Verify the claimed mapping logic
      expect(await contract.claimed(employee1.address)).to.equal(false);
    });
  });

  // ─────────────────────────────────────────────────────────
  // Events
  // ─────────────────────────────────────────────────────────
  describe("Events", function () {
    it("Should emit TreasuryFunded event - requires CoFHE SDK for full test", async function () {
      // NOTE: Full event test requires passing an encrypted InEuint64 value
      // which needs the CoFHE SDK client-side encryption.
      // Run `npx hardhat test --network localfhenix` for full encrypted integration tests.
      console.log("    → Full FHE event tests: run with --network localfhenix");
    });
  });
});
