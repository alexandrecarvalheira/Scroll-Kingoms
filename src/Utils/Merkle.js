import { ethers } from "ethers";
import { MerkleTree } from "merkletreejs";
import { addresses } from "./WhiteListAddresses";
const keccak256 = require("keccak256");

export const claimAirdrop = async (contract) => {
  try {
    // Convert the proof elements to hexadecimal strings
    const amount = 50;
    const tx = await contract.claimAirdrop(proof, amount);
    await tx.wait();
    console.log(tx);
  } catch (error) {
    console.error("Error calling contract method:", error);
  }
};
export const generateProof = async (address, diamond, treasureId) => {
  const leafNodes = addresses.map((addr) => keccak256(addr));
  const merkleTree = new MerkleTree(leafNodes, keccak256, {
    sortPairs: true,
  });
  const leaf = ethers.utils.keccak256(address);

  const proof = merkleTree.getHexProof(leaf);
  console.log(proof);
  const verification = await diamond.verifyTreasureDropWhitelist(
    proof,
    treasureId,
    address
  );
  console.log(verification);
  if (!verification) {
    return false;
  } else {
    const status = await diamond.claimedStatus(treasureId, address);
    if (status) {
      return false;
    }
    return proof;
  }
};
export const verifyWhitelist = async (contract, address) => {
  try {
    // Convert the proof elements to hexadecimal strings

    const isWhitelisted = await contract.verifyWhitelist(proof, address);
    console.log(isWhitelisted);
    return isWhitelisted;
  } catch (error) {
    console.error("Error calling contract method:", error);
  }
};
