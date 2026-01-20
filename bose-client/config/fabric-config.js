const path = require('path');

module.exports = {
  channelName: process.env.FABRIC_CHANNEL || 'mychannel',
  chaincodes: {
    certificate: 'BOSEChaincode',
    skill: 'SkillsChaincode'
  },
  org: {
    mspId: process.env.FABRIC_MSP || 'Org1MSP',
    affiliation: process.env.FABRIC_AFFILIATION || 'org1.department1'
  },
  walletPath: path.resolve(__dirname, '..', '..', 'wallet'),
  ccpPath: process.env.FABRIC_CCP_PATH || path.resolve(__dirname, '..', '..', 'fabric-samples', 'test-network', 'organizations', 'peerOrganizations', 'org1.example.com', 'connection-org1.json')
};
