// bose-client/app.js
'use strict';

const { Gateway, Wallets } = require('fabric-network');
const path = require('path');
const fs = require('fs');

const CHANNEL_NAME = 'mychannel';
const CHAINCODE_NAME = 'bose';
const ORG_CONNECTION_PROFILE = path.resolve(__dirname, '..', 'fabric-samples', 'test-network', 
    'organizations', 'peerOrganizations', 'org1.example.com', 'connection-org1.json');

async function getContract() {
    const ccp = JSON.parse(fs.readFileSync(ORG_CONNECTION_PROFILE, 'utf8'));
const walletPath = path.join(__dirname,'..', 'wallet');
const wallet = await Wallets.newFileSystemWallet(walletPath);

    const gateway = new Gateway();
    await gateway.connect(ccp, {
        wallet,
        identity: 'appUser',
        discovery: { enabled: true, asLocalhost: true }
    });

    const network = await gateway.getNetwork(CHANNEL_NAME);
    const contract = network.getContract(CHAINCODE_NAME);
    return { contract, gateway };
}

// Example: Add Certificate
async function addCertificate(certId, studentId, studentName, course, institution, grade, issueDate, hash) {
    const { contract, gateway } = await getContract();
    await contract.submitTransaction('AddCertificate', certId, studentId, studentName, course, institution, grade, issueDate, hash);
    await gateway.disconnect();
}

// Example: Query Certificate
async function queryCertificate(certId) {
    const { contract, gateway } = await getContract();
    const result = await contract.evaluateTransaction('QueryCertificate', certId);
    await gateway.disconnect();
    return result.toString();
}

module.exports = {
    addCertificate,
    queryCertificate
};
