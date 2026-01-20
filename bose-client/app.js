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
async function getContract(contractName, identityName, timeoutMs = 15000) {
    console.log(`Connecting to ${contractName} with timeout ${timeoutMs}ms...`);
    
    const connectPromise = (async () => {
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
        const contract = network.getContract(CHAINCODE_NAME, contractName);

        return { contract, gateway };
    })();

    const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error(`Gateway connection timeout after ${timeoutMs}ms - Fabric network may not be running`)), timeoutMs)
    );

    return Promise.race([connectPromise, timeoutPromise]);
}

//  Certificate Contract (BOSEChaincode)
async function addCertificate(identity, certId, studentId, studentName, course, institution, grade, issueDate, fileHash) {
    const { contract, gateway } = await getContract('BOSEChaincode', identity);
    try {
        await contract.submitTransaction('AddCertificate', certId, studentId, studentName, course, institution, grade, issueDate, fileHash);
    } finally {
        await gateway.disconnect();
    }
}

async function queryCertificate(identity, certId) {
    const { contract, gateway } = await getContract('BOSEChaincode', identity);
    try {
        const result = await contract.evaluateTransaction('QueryCertificate', certId);
        return result.toString();
    } finally {
        await gateway.disconnect();
    }
}

// Skills Contract (SkillsChaincode)
async function addSkill(identity, skillId, studentId, studentName, skillName, category, level, issuer) {
    const { contract, gateway } = await getContract('SkillsChaincode', identity);
    try {
        await contract.submitTransaction('AddSkill', skillId, studentId, studentName, skillName, category, level, issuer);
    } finally {
        await gateway.disconnect();
    }
}

async function querySkill(identity, skillId) {
    const { contract, gateway } = await getContract('SkillsChaincode', identity);
    try {
        const result = await contract.evaluateTransaction('QuerySkill', skillId);
        return result.toString();
    } finally {
        await gateway.disconnect();
    }
}

module.exports = {
    addCertificate,
    queryCertificate,
    addSkill,
    querySkill
};
