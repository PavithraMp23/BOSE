/*
// enrollUser.js
'use strict';

const FabricCAServices = require('fabric-ca-client');
const { Wallets } = require('fabric-network');
const path = require('path');
const fs = require('fs');

const ORG_CONNECTION_PROFILE = path.resolve(__dirname, '..', 'fabric-samples', 'test-network',
    'organizations', 'peerOrganizations', 'org1.example.com', 'connection-org1.json');

async function enrollUser(userId, role) {
    const ccp = JSON.parse(fs.readFileSync(ORG_CONNECTION_PROFILE, 'utf8'));

    const caInfo = ccp.certificateAuthorities['ca.org1.example.com'];
    const caTLSCACerts = caInfo.tlsCACerts.pem;
    const ca = new FabricCAServices(caInfo.url, { trustedRoots: caTLSCACerts, verify: false }, caInfo.caName);

    const walletPath = path.join(__dirname, '..', 'wallet');
    const wallet = await Wallets.newFileSystemWallet(walletPath);

    // Check if user already exists
    const userIdentity = await wallet.get(userId);
    if (userIdentity) {
        console.log(`✔️ User ${userId} already exists in wallet`);
        return;
    }

    // Get admin identity to register new users
    const adminIdentity = await wallet.get('admin');
    if (!adminIdentity) {
        console.log(' Admin identity not found. Run enrollAdmin.js first');
        return;
    }

    const provider = wallet.getProviderRegistry().getProvider(adminIdentity.type);
    const adminUser = await provider.getUserContext(adminIdentity, 'admin');

    // Register and enroll new user with specific role
    const secret = await ca.register({
        affiliation: 'org1.department1',
        enrollmentID: userId,
        role: 'client',
        attrs: [{ name: 'role', value: role, ecert: true }]
    }, adminUser);

    const enrollment = await ca.enroll({
        enrollmentID: userId,
        enrollmentSecret: secret,
        attr_reqs: [{ name: 'role', optional: false }]
    });

    const x509Identity = {
        credentials: {
            certificate: enrollment.certificate,
            privateKey: enrollment.key.toBytes(),
        },
        mspId: 'Org1MSP',
        type: 'X.509',
    };

    await wallet.put(userId, x509Identity);
    console.log(`✅ Successfully enrolled user: ${userId} with role: ${role}`);
}

module.exports = enrollUser;
*/