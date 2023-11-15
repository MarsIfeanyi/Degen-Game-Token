const { expect } = require("chai");
const hre = require("hardhat");

describe("DegenToken", function () {
  it("Should Mint token successfully when called by Owner", async function () {
    const Token = await hre.ethers.getContractFactory("DegenToken");
    const token = await Token.deploy();
    await token.waitForDeployment();

    const [owner, notOwner] = await ethers.getSigners();

    // Mint tokens by owner
    await token.connect(owner).mint(owner.address, 10000);

    const ownerBalance = await token.balanceOf(owner.address);
    expect(ownerBalance).to.equal(10000);
  });

  it("Should FAIL to Mint token when called by NotOwner", async function () {
    const Token = await hre.ethers.getContractFactory("DegenToken");
    const token = await Token.deploy();
    await token.waitForDeployment();

    const [owner, notOwner] = await ethers.getSigners();

    // Mint tokens by non-owner
    await expect(
      token.connect(notOwner).mint(notOwner.address, 100)
    ).to.be.revertedWithCustomError(Token, "NotOwner()");
  });

  it("Should transfer tokens successfully", async function () {
    const Token = await hre.ethers.getContractFactory("DegenToken");
    const token = await Token.deploy();
    await token.waitForDeployment();

    const [owner, receiver] = await ethers.getSigners();

    // Mint tokens
    await token.connect(owner).mint(owner.address, 1000);

    // Transfer tokens
    await token.connect(owner).transfer(receiver.address, 100);

    // Check the balances
    const ownerBalance = await token.balanceOf(owner.address);
    const testerBalance = await token.balanceOf(receiver.address);
    expect(ownerBalance).to.equal(900);
    expect(testerBalance).to.equal(100);
  });

  it("Should FAIL to transfer token if Amount is greater than Balance ", async function () {
    const Token = await hre.ethers.getContractFactory("DegenToken");
    const token = await Token.deploy();
    await token.waitForDeployment();

    const [owner, receiver] = await ethers.getSigners();

    // Mint tokens
    await token.connect(owner).mint(owner.address, 100);

    // Transfer tokens
    await expect(
      token.connect(owner).transfer(receiver.address, 10000)
    ).to.be.revertedWith("Insufficient balance");
  });

  it("Should redeem tokens successfully", async function () {
    const Token = await ethers.getContractFactory("DegenToken");
    const token = await Token.deploy();
    await token.waitForDeployment();

    const [owner, user] = await ethers.getSigners();

    // Mint tokens
    await token.connect(owner).mint(user.address, 200);

    // Create items
    await token.connect(owner).createGameItems("testItem", 100);
    await token.connect(owner).createGameItems("testItem2", 100);

    // Redeem items
    await token.connect(user).redeemToken(1);

    // Check the balances
    const ownerBalance = await token.balanceOf(owner.address);
    const userBalance = await token.balanceOf(user.address);
    expect(ownerBalance).to.equal(100);
    expect(userBalance).to.equal(100);
  });

  it("Should FAIL to redeem tokens if ItemId Does not exist", async function () {
    const Token = await ethers.getContractFactory("DegenToken");
    const token = await Token.deploy();
    await token.waitForDeployment();

    const [owner, user] = await ethers.getSigners();

    // Mint tokens
    await token.connect(owner).mint(user.address, 200);

    // Create items
    await token.connect(owner).createGameItems("testItem", 100);

    // Redeem items
    await expect(
      token.connect(user).redeemToken(5)
    ).to.be.revertedWithCustomError(Token, "ItemNotFound()");
  });

  it("Should burn tokens successfully", async function () {
    const Token = await hre.ethers.getContractFactory("DegenToken");
    const token = await Token.deploy();
    await token.waitForDeployment();

    const [owner] = await ethers.getSigners();

    // Mint tokens
    await token.connect(owner).mint(owner.address, 1000);

    // Burn tokens
    await token.connect(owner).burn(500);

    // Check the balance
    const balance = await token.balanceOf(owner.address);
    expect(balance).to.equal(500);
  });

  it("Should FAIL to burn tokens if balance is insufficient", async function () {
    const Token = await hre.ethers.getContractFactory("DegenToken");
    const token = await Token.deploy();
    await token.waitForDeployment();

    const [owner] = await ethers.getSigners();

    // Mint tokens
    await token.connect(owner).mint(owner.address, 1000);

    // Try to burn tokens
    await expect(token.connect(owner).burn(2000)).to.be.revertedWithCustomError(
      Token,
      "InsufficientBalance()"
    );
  });
});
