const RekamMedis = artifacts.require('RekamMedis');

module.exports = function (_deployer) {
  _deployer.deploy(RekamMedis);
};
