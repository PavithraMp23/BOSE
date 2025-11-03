import { Gateway, Wallets } from "fabric-network";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
dotenv.config();

export const getContract = async (identity) => {
  const ccpPath = path.resolve(process.env.FABRIC_CONNECTION_PROFILE);
  const ccp = JSON.parse(fs.readFileSync(ccpPath, "utf8"));
  const walletPath = path.resolve(process.env.WALLET_PATH);
  const wallet = await Wallets.newFileSystemWallet(walletPath);

  const gateway = new Gateway();
  await gateway.connect(ccp, {
    wallet,
    identity,
    discovery: { enabled: true, asLocalhost: true },
  });

  const network = await gateway.getNetwork(process.env.CHANNEL_NAME);
  const contract = network.getContract(process.env.CHAINCODE_NAME);

  return { contract, gateway };
};
