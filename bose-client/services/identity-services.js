const FabricCAServices = require('fabric-ca-client');
const { Wallets } = require('fabric-network');
const fs = require('fs');
const config = require('../config/fabric-config');

async function enrollUser({ userId, role }) {
  console.log("1️⃣ Loading CCP");
  const ccp = JSON.parse(fs.readFileSync(config.ccpPath, 'utf8'));
  const caInfo = ccp.certificateAuthorities['ca.org1.example.com'];
const ca = new FabricCAServices(
  caInfo.url,
  { trustedRoots: caInfo.tlsCACerts.pem, verify: false },
  caInfo.caName
);

  console.log("3️⃣ Opening wallet");
  const wallet = await Wallets.newFileSystemWallet(config.walletPath);

  console.log("4️⃣ Checking existing user");
  if (await wallet.get(userId)) {
    console.log("⚠️ User already exists");
    return { exists: true };
  }
console.log("5️⃣ Fetching admin identity");
  const adminIdentity = await wallet.get('admin');
  if (!adminIdentity) {
    throw new Error('Admin not enrolled');
  }

  const provider = wallet.getProviderRegistry().getProvider(adminIdentity.type);
  const adminUser = await provider.getUserContext(adminIdentity, 'admin');
  console.log("6️⃣ Registering user with CA");
  
  const secret = await ca.register({
    affiliation: config.org.affiliation,
    enrollmentID: userId,
    role: 'client',
    attrs: [{ name: 'role', value: role, ecert: true }]
  }, adminUser);
  console.log("7️⃣ Enrolling user");

  const enrollment = await ca.enroll({
    enrollmentID: userId,
    enrollmentSecret: secret,
    attr_reqs: [{ name: 'role', optional: false }]
  });
 console.log("8️⃣ Writing to wallet");

  await wallet.put(userId, {
    credentials: {
      certificate: enrollment.certificate,
      privateKey: enrollment.key.toBytes()
    },
    mspId: config.org.mspId,
    type: 'X.509'
  });

  return { enrolled: true };
}
module.exports = {
  identityService: {
    enrollUser
  }
};
