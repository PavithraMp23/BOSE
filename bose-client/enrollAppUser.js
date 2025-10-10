// enrollAppUser.js
'use strict';

const { Wallets, X509WalletMixin } = require('fabric-network');
const FabricCAServices = require('fabric-ca-client');
const fs = require('fs');
const path = require('path');

async function main() {
    try {
        const ccpPath = path.resolve(__dirname, '..', 'fabric-samples', 'test-network', 'organizations', 'peerOrganizations', 'org1.example.com', 'connection-org1.json');
        const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

        const caInfo = ccp.certificateAuthorities['ca.org1.example.com'];
        const caTLSCACerts = caInfo.tlsCACerts.pem;
        const ca = new FabricCAServices(caInfo.url, { trustedRoots: caTLSCACerts, verify: false }, caInfo.caName);

       const walletPath = path.resolve(__dirname, '..', 'wallet');
       const wallet = await Wallets.newFileSystemWallet(walletPath);


        // Check if appUser already exists
        const userExists = await wallet.get('appUser');
        if (userExists) {
            console.log('An identity for the user "appUser" already exists in the wallet');
            return;
        }

        // Admin identity
        const adminIdentity = await wallet.get('admin');
        if (!adminIdentity) {
            console.log('Admin identity not found in the wallet. Enroll admin first.');
            return;
        }

        const provider = wallet.getProviderRegistry().getProvider(adminIdentity.type);
        const adminUser = await provider.getUserContext(adminIdentity, 'admin');

        // Register and enroll appUser
        let secret;
        try {
            secret = await ca.register({
                affiliation: 'org1.department1',
                enrollmentID: 'appUser',
                role: 'client'
            }, adminUser);
        } catch (err) {
            if (err.toString().includes('already registered')) {
                console.log('appUser is already registered, proceeding to enroll...');
                secret = 'appUserpw'; // Use the original secret (set at first registration)
            } else {
                throw err;
            }
        }

        // Enroll appUser
        const enrollment = await ca.enroll({
            enrollmentID: 'appUser',
            enrollmentSecret: secret
        });

        const x509Identity = {
            credentials: {
                certificate: enrollment.certificate,
                privateKey: enrollment.key.toBytes(),
            },
            mspId: 'Org1MSP',
            type: 'X.509',
        };
        await wallet.put('appUser', x509Identity);
        console.log('Successfully enrolled "appUser" and imported into the wallet');
    } catch (error) {
        console.error(`Failed to enroll appUser: ${error}`);
        process.exit(1);
    }
}

main();