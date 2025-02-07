const RekamMedis = artifacts.require("RekamMedis");

/*
 * uncomment accounts to access the test accounts made available by the
 * Ethereum client
 * See docs: https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript
 */
contract("RekamMedis", function (/* accounts */) {
  it("should assert true", async function () {
    await RekamMedis.deployed();
    return assert.isTrue(true);
  });
});
