// bose-client/app.js
'use strict';

const { Gateway, Wallets } = require('fabric-network');
const path = require('path');
const fs = require('fs');

const CHANNEL_NAME = 'mychannel';
const CHAINCODE_NAME = 'bose';   // Deployed chaincode name
const ORG_CONNECTION_PROFILE = path.resolve(__dirname, '..', 'fabric-samples', 'test-network',
    'organizations', 'peerOrganizations', 'org1.example.com', 'connection-org1.json');

// function to get contract 
async function getContract(contractName, identityName) {
    const ccp = JSON.parse(fs.readFileSync(ORG_CONNECTION_PROFILE, 'utf8'));
    const walletPath = path.join(__dirname, '..', 'wallet');
    const wallet = await Wallets.newFileSystemWallet(walletPath);

    const gateway = new Gateway();
    await gateway.connect(ccp, {
        wallet,
        identity: identityName,
        discovery: { enabled: true, asLocalhost: true }
    });

    const network = await gateway.getNetwork(CHANNEL_NAME);
    const contract = network.getContract(CHAINCODE_NAME, contractName); // ❗ Use contract class name

    return { contract, gateway };
}

//  Certificate Contract (BOSEChaincode)
async function addCertificate(identity, certId, studentId, studentName, course, institution, grade, issueDate, fileHash) {
    const { contract, gateway } = await getContract('BOSEChaincode', identity);
    await contract.submitTransaction('AddCertificate', certId, studentId, studentName, course, institution, grade, issueDate, fileHash);
    await gateway.disconnect();
}

async function queryCertificate(identity, certId) {
    const { contract, gateway } = await getContract('BOSEChaincode', identity);
    const result = await contract.evaluateTransaction('QueryCertificate', certId);
    await gateway.disconnect();
    return result.toString();
}

// Skills Contract (SkillsChaincode)
async function addSkill(identity, skillId, studentId, studentName, skillName, category, level, issuer) {
    const { contract, gateway } = await getContract('SkillsChaincode', identity);
    await contract.submitTransaction('AddSkill', skillId, studentId, studentName, skillName, category, level, issuer);
    await gateway.disconnect();
}

async function querySkill(identity, skillId) {
    const { contract, gateway } = await getContract('SkillsChaincode', identity);
    const result = await contract.evaluateTransaction('QuerySkill', skillId);
    await gateway.disconnect();
    return result.toString();
}

module.exports = {
    addCertificate,
    queryCertificate,
    addSkill,
    querySkill
};
