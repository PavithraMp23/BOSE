@echo off
setlocal enabledelayedexpansion

REM BOSE Network Management Script
REM This script automates Hyperledger Fabric network operations for the BOSE project

echo ======================================================
echo Bank of Skills and Experience (BOSE) Network Manager
echo ======================================================

set FABRIC_SAMPLES_DIR=%~dp0fabric-samples
set TEST_NETWORK_DIR=%FABRIC_SAMPLES_DIR%\test-network
set CHAINCODE_DIR=%~dp0chaincode
set WALLET_DIR=%~dp0wallet

REM Check if WSL is installed
wsl --status >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: WSL is not installed or not properly configured.
    echo Please install WSL by running 'wsl --install' as administrator.
    exit /b 1
)

:menu
cls
echo.
echo BOSE Network Management Options:
echo -------------------------------
echo 1. Start Network
echo 2. Stop Network
echo 3. Deploy Chaincode
echo 4. Enroll Admin
echo 5. Enroll App User
echo 6. Clean Wallet (Required before restarting network)
echo 7. View Network Status
echo 8. Exit
echo.

set /p choice=Enter your choice (1-8): 

if "%choice%"=="1" goto start_network
if "%choice%"=="2" goto stop_network
if "%choice%"=="3" goto deploy_chaincode
if "%choice%"=="4" goto enroll_admin
if "%choice%"=="5" goto enroll_app_user
if "%choice%"=="6" goto clean_wallet
if "%choice%"=="7" goto network_status
if "%choice%"=="8" goto end
echo Invalid choice. Please try again.
timeout /t 2 >nul
goto menu

:start_network
echo.
echo Starting Hyperledger Fabric network...
echo This may take a few minutes...

REM Check if wallet exists and warn user
if exist "%WALLET_DIR%" (
    echo.
    echo WARNING: Wallet directory exists. It's recommended to clean the wallet
    echo before starting a new network to avoid identity conflicts.
    echo.
    set /p clean_wallet=Do you want to clean the wallet now? (y/n): 
    if /i "!clean_wallet!"=="y" (
        call :clean_wallet_function
    )
)

cd "%TEST_NETWORK_DIR%"
wsl ./network.sh down
wsl ./network.sh up createChannel -c bosechannel -ca
echo.
echo Network started successfully with channel 'bosechannel'
echo.
pause
goto menu

:stop_network
echo.
echo Stopping Hyperledger Fabric network...
cd "%TEST_NETWORK_DIR%"
wsl ./network.sh down
echo.
echo Network stopped successfully.
echo.
pause
goto menu

:deploy_chaincode
echo.
echo Deploying BOSE chaincode...

REM Check if chaincode directory exists
if not exist "%CHAINCODE_DIR%" (
    echo Creating chaincode directory...
    mkdir "%CHAINCODE_DIR%"
    echo Creating basic chaincode structure...
    mkdir "%CHAINCODE_DIR%\lib"
    
    REM Create package.json for chaincode
    echo {> "%CHAINCODE_DIR%\package.json"
    echo   "name": "bose-chaincode",>> "%CHAINCODE_DIR%\package.json"
    echo   "version": "1.0.0",>> "%CHAINCODE_DIR%\package.json"
    echo   "description": "Bank of Skills and Experience Chaincode",>> "%CHAINCODE_DIR%\package.json"
    echo   "main": "index.js",>> "%CHAINCODE_DIR%\package.json"
    echo   "engines": {>> "%CHAINCODE_DIR%\package.json"
    echo     "node": ">=12",>> "%CHAINCODE_DIR%\package.json"
    echo     "npm": ">=6">> "%CHAINCODE_DIR%\package.json"
    echo   },>> "%CHAINCODE_DIR%\package.json"
    echo   "scripts": {>> "%CHAINCODE_DIR%\package.json"
    echo     "start": "fabric-chaincode-node start">> "%CHAINCODE_DIR%\package.json"
    echo   },>> "%CHAINCODE_DIR%\package.json"
    echo   "dependencies": {>> "%CHAINCODE_DIR%\package.json"
    echo     "fabric-contract-api": "^2.0.0",>> "%CHAINCODE_DIR%\package.json"
    echo     "fabric-shim": "^2.0.0">> "%CHAINCODE_DIR%\package.json"
    echo   }>> "%CHAINCODE_DIR%\package.json"
    echo }>> "%CHAINCODE_DIR%\package.json"
    
    REM Create index.js for chaincode
    echo 'use strict';>> "%CHAINCODE_DIR%\index.js"
    echo.>> "%CHAINCODE_DIR%\index.js"
    echo const BOSEContract = require('./lib/bose-contract');>> "%CHAINCODE_DIR%\index.js"
    echo.>> "%CHAINCODE_DIR%\index.js"
    echo module.exports.BOSEContract = BOSEContract;>> "%CHAINCODE_DIR%\index.js"
    echo module.exports.contracts = [BOSEContract];>> "%CHAINCODE_DIR%\index.js"
    
    REM Create bose-contract.js for chaincode
    echo 'use strict';>> "%CHAINCODE_DIR%\lib\bose-contract.js"
    echo.>> "%CHAINCODE_DIR%\lib\bose-contract.js"
    echo const { Contract } = require('fabric-contract-api');>> "%CHAINCODE_DIR%\lib\bose-contract.js"
    echo.>> "%CHAINCODE_DIR%\lib\bose-contract.js"
    echo class BOSEContract extends Contract {>> "%CHAINCODE_DIR%\lib\bose-contract.js"
    echo.>> "%CHAINCODE_DIR%\lib\bose-contract.js"
    echo   async initLedger(ctx) {>> "%CHAINCODE_DIR%\lib\bose-contract.js"
    echo     console.log('============= START : Initialize Ledger ===========');>> "%CHAINCODE_DIR%\lib\bose-contract.js"
    echo     console.log('============= END : Initialize Ledger ===========');>> "%CHAINCODE_DIR%\lib\bose-contract.js"
    echo   }>> "%CHAINCODE_DIR%\lib\bose-contract.js"
    echo.>> "%CHAINCODE_DIR%\lib\bose-contract.js"
    echo   async createCredential(ctx, id, type, issuer, holder, data) {>> "%CHAINCODE_DIR%\lib\bose-contract.js"
    echo     console.log('============= START : Create Credential ===========');>> "%CHAINCODE_DIR%\lib\bose-contract.js"
    echo.>> "%CHAINCODE_DIR%\lib\bose-contract.js"
    echo     const credential = {>> "%CHAINCODE_DIR%\lib\bose-contract.js"
    echo       docType: 'credential',>> "%CHAINCODE_DIR%\lib\bose-contract.js"
    echo       id,>> "%CHAINCODE_DIR%\lib\bose-contract.js"
    echo       type,>> "%CHAINCODE_DIR%\lib\bose-contract.js"
    echo       issuer,>> "%CHAINCODE_DIR%\lib\bose-contract.js"
    echo       holder,>> "%CHAINCODE_DIR%\lib\bose-contract.js"
    echo       data,>> "%CHAINCODE_DIR%\lib\bose-contract.js"
    echo       verified: false,>> "%CHAINCODE_DIR%\lib\bose-contract.js"
    echo       createdAt: new Date().toISOString(),>> "%CHAINCODE_DIR%\lib\bose-contract.js"
    echo       updatedAt: new Date().toISOString()>> "%CHAINCODE_DIR%\lib\bose-contract.js"
    echo     };>> "%CHAINCODE_DIR%\lib\bose-contract.js"
    echo.>> "%CHAINCODE_DIR%\lib\bose-contract.js"
    echo     await ctx.stub.putState(id, Buffer.from(JSON.stringify(credential)));>> "%CHAINCODE_DIR%\lib\bose-contract.js"
    echo     console.log('============= END : Create Credential ===========');>> "%CHAINCODE_DIR%\lib\bose-contract.js"
    echo     return JSON.stringify(credential);>> "%CHAINCODE_DIR%\lib\bose-contract.js"
    echo   }>> "%CHAINCODE_DIR%\lib\bose-contract.js"
    echo.>> "%CHAINCODE_DIR%\lib\bose-contract.js"
    echo   async queryCredential(ctx, id) {>> "%CHAINCODE_DIR%\lib\bose-contract.js"
    echo     const credentialAsBytes = await ctx.stub.getState(id);>> "%CHAINCODE_DIR%\lib\bose-contract.js"
    echo     if (!credentialAsBytes || credentialAsBytes.length === 0) {>> "%CHAINCODE_DIR%\lib\bose-contract.js"
    echo       throw new Error(`${id} does not exist`);>> "%CHAINCODE_DIR%\lib\bose-contract.js"
    echo     }>> "%CHAINCODE_DIR%\lib\bose-contract.js"
    echo     return credentialAsBytes.toString();>> "%CHAINCODE_DIR%\lib\bose-contract.js"
    echo   }>> "%CHAINCODE_DIR%\lib\bose-contract.js"
    echo.>> "%CHAINCODE_DIR%\lib\bose-contract.js"
    echo   async verifyCredential(ctx, id, verifierId) {>> "%CHAINCODE_DIR%\lib\bose-contract.js"
    echo     const credentialAsBytes = await ctx.stub.getState(id);>> "%CHAINCODE_DIR%\lib\bose-contract.js"
    echo     if (!credentialAsBytes || credentialAsBytes.length === 0) {>> "%CHAINCODE_DIR%\lib\bose-contract.js"
    echo       throw new Error(`${id} does not exist`);>> "%CHAINCODE_DIR%\lib\bose-contract.js"
    echo     }>> "%CHAINCODE_DIR%\lib\bose-contract.js"
    echo.>> "%CHAINCODE_DIR%\lib\bose-contract.js"
    echo     const credential = JSON.parse(credentialAsBytes.toString());>> "%CHAINCODE_DIR%\lib\bose-contract.js"
    echo     credential.verified = true;>> "%CHAINCODE_DIR%\lib\bose-contract.js"
    echo     credential.verifier = verifierId;>> "%CHAINCODE_DIR%\lib\bose-contract.js"
    echo     credential.verificationDate = new Date().toISOString();>> "%CHAINCODE_DIR%\lib\bose-contract.js"
    echo     credential.updatedAt = new Date().toISOString();>> "%CHAINCODE_DIR%\lib\bose-contract.js"
    echo.>> "%CHAINCODE_DIR%\lib\bose-contract.js"
    echo     await ctx.stub.putState(id, Buffer.from(JSON.stringify(credential)));>> "%CHAINCODE_DIR%\lib\bose-contract.js"
    echo     return JSON.stringify(credential);>> "%CHAINCODE_DIR%\lib\bose-contract.js"
    echo   }>> "%CHAINCODE_DIR%\lib\bose-contract.js"
    echo.>> "%CHAINCODE_DIR%\lib\bose-contract.js"
    echo   async queryCredentialsByHolder(ctx, holder) {>> "%CHAINCODE_DIR%\lib\bose-contract.js"
    echo     const queryString = {>> "%CHAINCODE_DIR%\lib\bose-contract.js"
    echo       selector: {>> "%CHAINCODE_DIR%\lib\bose-contract.js"
    echo         docType: 'credential',>> "%CHAINCODE_DIR%\lib\bose-contract.js"
    echo         holder: holder>> "%CHAINCODE_DIR%\lib\bose-contract.js"
    echo       }>> "%CHAINCODE_DIR%\lib\bose-contract.js"
    echo     };>> "%CHAINCODE_DIR%\lib\bose-contract.js"
    echo     return await this.queryWithQueryString(ctx, JSON.stringify(queryString));>> "%CHAINCODE_DIR%\lib\bose-contract.js"
    echo   }>> "%CHAINCODE_DIR%\lib\bose-contract.js"
    echo.>> "%CHAINCODE_DIR%\lib\bose-contract.js"
    echo   async queryWithQueryString(ctx, queryString) {>> "%CHAINCODE_DIR%\lib\bose-contract.js"
    echo     const iterator = await ctx.stub.getQueryResult(queryString);>> "%CHAINCODE_DIR%\lib\bose-contract.js"
    echo     const allResults = [];>> "%CHAINCODE_DIR%\lib\bose-contract.js"
    echo     let result = await iterator.next();>> "%CHAINCODE_DIR%\lib\bose-contract.js"
    echo     while (!result.done) {>> "%CHAINCODE_DIR%\lib\bose-contract.js"
    echo       const strValue = Buffer.from(result.value.value.toString()).toString('utf8');>> "%CHAINCODE_DIR%\lib\bose-contract.js"
    echo       let record;>> "%CHAINCODE_DIR%\lib\bose-contract.js"
    echo       try {>> "%CHAINCODE_DIR%\lib\bose-contract.js"
    echo         record = JSON.parse(strValue);>> "%CHAINCODE_DIR%\lib\bose-contract.js"
    echo       } catch (err) {>> "%CHAINCODE_DIR%\lib\bose-contract.js"
    echo         console.log(err);>> "%CHAINCODE_DIR%\lib\bose-contract.js"
    echo         record = strValue;>> "%CHAINCODE_DIR%\lib\bose-contract.js"
    echo       }>> "%CHAINCODE_DIR%\lib\bose-contract.js"
    echo       allResults.push(record);>> "%CHAINCODE_DIR%\lib\bose-contract.js"
    echo       result = await iterator.next();>> "%CHAINCODE_DIR%\lib\bose-contract.js"
    echo     }>> "%CHAINCODE_DIR%\lib\bose-contract.js"
    echo     iterator.close();>> "%CHAINCODE_DIR%\lib\bose-contract.js"
    echo     return JSON.stringify(allResults);>> "%CHAINCODE_DIR%\lib\bose-contract.js"
    echo   }>> "%CHAINCODE_DIR%\lib\bose-contract.js"
    echo }>> "%CHAINCODE_DIR%\lib\bose-contract.js"
    echo.>> "%CHAINCODE_DIR%\lib\bose-contract.js"
    echo module.exports = BOSEContract;>> "%CHAINCODE_DIR%\lib\bose-contract.js"
)

cd "%TEST_NETWORK_DIR%"
wsl ./network.sh deployCC -ccn bosecc -ccp %CHAINCODE_DIR% -ccl javascript -c bosechannel

echo.
echo Chaincode deployed successfully.
echo.
pause
goto menu

:enroll_admin
echo.
echo Enrolling admin user...

REM Create bose-client directory if it doesn't exist
if not exist "%~dp0bose-client" (
    mkdir "%~dp0bose-client"
)

REM Create enrollAdmin.js if it doesn't exist
if not exist "%~dp0bose-client\enrollAdmin.js" (
    echo 'use strict';> "%~dp0bose-client\enrollAdmin.js"
    echo.>> "%~dp0bose-client\enrollAdmin.js"
    echo const FabricCAServices = require('fabric-ca-client');>> "%~dp0bose-client\enrollAdmin.js"
    echo const { Wallets } = require('fabric-network');>> "%~dp0bose-client\enrollAdmin.js"
    echo const fs = require('fs');>> "%~dp0bose-client\enrollAdmin.js"
    echo const path = require('path');>> "%~dp0bose-client\enrollAdmin.js"
    echo.>> "%~dp0bose-client\enrollAdmin.js"
    echo async function main() {>> "%~dp0bose-client\enrollAdmin.js"
    echo     try {>> "%~dp0bose-client\enrollAdmin.js"
    echo         // load the network configuration>> "%~dp0bose-client\enrollAdmin.js"
    echo         const ccpPath = path.resolve(__dirname, '..', 'fabric-samples', 'test-network', 'organizations', 'peerOrganizations', 'org1.example.com', 'connection-org1.json');>> "%~dp0bose-client\enrollAdmin.js"
    echo         const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));>> "%~dp0bose-client\enrollAdmin.js"
    echo.>> "%~dp0bose-client\enrollAdmin.js"
    echo         // Create a new CA client for interacting with the CA.>> "%~dp0bose-client\enrollAdmin.js"
    echo         const caInfo = ccp.certificateAuthorities['ca.org1.example.com'];>> "%~dp0bose-client\enrollAdmin.js"
    echo         const caTLSCACerts = caInfo.tlsCACerts.pem;>> "%~dp0bose-client\enrollAdmin.js"
    echo         const ca = new FabricCAServices(caInfo.url, { trustedRoots: caTLSCACerts, verify: false }, caInfo.caName);>> "%~dp0bose-client\enrollAdmin.js"
    echo.>> "%~dp0bose-client\enrollAdmin.js"
    echo         // Create a new file system based wallet for managing identities.>> "%~dp0bose-client\enrollAdmin.js"
    echo         const walletPath = path.join(process.cwd(), '..', 'wallet');>> "%~dp0bose-client\enrollAdmin.js"
    echo         const wallet = await Wallets.newFileSystemWallet(walletPath);>> "%~dp0bose-client\enrollAdmin.js"
    echo         console.log(`Wallet path: ${walletPath}`);>> "%~dp0bose-client\enrollAdmin.js"
    echo.>> "%~dp0bose-client\enrollAdmin.js"
    echo         // Check to see if we've already enrolled the admin user.>> "%~dp0bose-client\enrollAdmin.js"
    echo         const identity = await wallet.get('admin');>> "%~dp0bose-client\enrollAdmin.js"
    echo         if (identity) {>> "%~dp0bose-client\enrollAdmin.js"
    echo             console.log('An identity for the admin user "admin" already exists in the wallet');>> "%~dp0bose-client\enrollAdmin.js"
    echo             return;>> "%~dp0bose-client\enrollAdmin.js"
    echo         }>> "%~dp0bose-client\enrollAdmin.js"
    echo.>> "%~dp0bose-client\enrollAdmin.js"
    echo         // Enroll the admin user, and import the new identity into the wallet.>> "%~dp0bose-client\enrollAdmin.js"
    echo         const enrollment = await ca.enroll({ enrollmentID: 'admin', enrollmentSecret: 'adminpw' });>> "%~dp0bose-client\enrollAdmin.js"
    echo         const x509Identity = {>> "%~dp0bose-client\enrollAdmin.js"
    echo             credentials: {>> "%~dp0bose-client\enrollAdmin.js"
    echo                 certificate: enrollment.certificate,>> "%~dp0bose-client\enrollAdmin.js"
    echo                 privateKey: enrollment.key.toBytes(),>> "%~dp0bose-client\enrollAdmin.js"
    echo             },>> "%~dp0bose-client\enrollAdmin.js"
    echo             mspId: 'Org1MSP',>> "%~dp0bose-client\enrollAdmin.js"
    echo             type: 'X.509',>> "%~dp0bose-client\enrollAdmin.js"
    echo         };>> "%~dp0bose-client\enrollAdmin.js"
    echo         await wallet.put('admin', x509Identity);>> "%~dp0bose-client\enrollAdmin.js"
    echo         console.log('Successfully enrolled admin user "admin" and imported it into the wallet');>> "%~dp0bose-client\enrollAdmin.js"
    echo.>> "%~dp0bose-client\enrollAdmin.js"
    echo     } catch (error) {>> "%~dp0bose-client\enrollAdmin.js"
    echo         console.error(`Failed to enroll admin user "admin": ${error}`);>> "%~dp0bose-client\enrollAdmin.js"
    echo         process.exit(1);>> "%~dp0bose-client\enrollAdmin.js"
    echo     }>> "%~dp0bose-client\enrollAdmin.js"
    echo }>> "%~dp0bose-client\enrollAdmin.js"
    echo.>> "%~dp0bose-client\enrollAdmin.js"
    echo main();>> "%~dp0bose-client\enrollAdmin.js"
)

REM Create package.json if it doesn't exist
if not exist "%~dp0bose-client\package.json" (
    echo {> "%~dp0bose-client\package.json"
    echo   "name": "bose-client",>> "%~dp0bose-client\package.json"
    echo   "version": "1.0.0",>> "%~dp0bose-client\package.json"
    echo   "description": "Bank of Skills and Experience Client Application",>> "%~dp0bose-client\package.json"
    echo   "main": "app.js",>> "%~dp0bose-client\package.json"
    echo   "scripts": {>> "%~dp0bose-client\package.json"
    echo     "test": "echo \"Error: no test specified\" && exit 1">> "%~dp0bose-client\package.json"
    echo   },>> "%~dp0bose-client\package.json"
    echo   "dependencies": {>> "%~dp0bose-client\package.json"
    echo     "fabric-ca-client": "^2.2.4",>> "%~dp0bose-client\package.json"
    echo     "fabric-network": "^2.2.4">> "%~dp0bose-client\package.json"
    echo   }>> "%~dp0bose-client\package.json"
    echo }>> "%~dp0bose-client\package.json"
)

cd "%~dp0bose-client"
echo Installing dependencies...
call npm install
echo Running enrollAdmin.js...
node enrollAdmin.js

echo.
echo Admin enrolled successfully.
echo.
pause
goto menu

:enroll_app_user
echo.
echo Enrolling app user...

REM Create enrollAppUser.js if it doesn't exist
if not exist "%~dp0bose-client\enrollAppUser.js" (
    echo 'use strict';> "%~dp0bose-client\enrollAppUser.js"
    echo.>> "%~dp0bose-client\enrollAppUser.js"
    echo const { Wallets } = require('fabric-network');>> "%~dp0bose-client\enrollAppUser.js"
    echo const FabricCAServices = require('fabric-ca-client');>> "%~dp0bose-client\enrollAppUser.js"
    echo const fs = require('fs');>> "%~dp0bose-client\enrollAppUser.js"
    echo const path = require('path');>> "%~dp0bose-client\enrollAppUser.js"
    echo.>> "%~dp0bose-client\enrollAppUser.js"
    echo async function main() {>> "%~dp0bose-client\enrollAppUser.js"
    echo     try {>> "%~dp0bose-client\enrollAppUser.js"
    echo         // load the network configuration>> "%~dp0bose-client\enrollAppUser.js"
    echo         const ccpPath = path.resolve(__dirname, '..', 'fabric-samples', 'test-network', 'organizations', 'peerOrganizations', 'org1.example.com', 'connection-org1.json');>> "%~dp0bose-client\enrollAppUser.js"
    echo         const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));>> "%~dp0bose-client\enrollAppUser.js"
    echo.>> "%~dp0bose-client\enrollAppUser.js"
    echo         // Create a new CA client for interacting with the CA.>> "%~dp0bose-client\enrollAppUser.js"
    echo         const caURL = ccp.certificateAuthorities['ca.org1.example.com'].url;>> "%~dp0bose-client\enrollAppUser.js"
    echo         const ca = new FabricCAServices(caURL);>> "%~dp0bose-client\enrollAppUser.js"
    echo.>> "%~dp0bose-client\enrollAppUser.js"
    echo         // Create a new file system based wallet for managing identities.>> "%~dp0bose-client\enrollAppUser.js"
    echo         const walletPath = path.join(process.cwd(), '..', 'wallet');>> "%~dp0bose-client\enrollAppUser.js"
    echo         const wallet = await Wallets.newFileSystemWallet(walletPath);>> "%~dp0bose-client\enrollAppUser.js"
    echo         console.log(`Wallet path: ${walletPath}`);>> "%~dp0bose-client\enrollAppUser.js"
    echo.>> "%~dp0bose-client\enrollAppUser.js"
    echo         // Check to see if we've already enrolled the user.>> "%~dp0bose-client\enrollAppUser.js"
    echo         const userIdentity = await wallet.get('appUser');>> "%~dp0bose-client\enrollAppUser.js"
    echo         if (userIdentity) {>> "%~dp0bose-client\enrollAppUser.js"
    echo             console.log('An identity for the user "appUser" already exists in the wallet');>> "%~dp0bose-client\enrollAppUser.js"
    echo             return;>> "%~dp0bose-client\enrollAppUser.js"
    echo         }>> "%~dp0bose-client\enrollAppUser.js"
    echo.>> "%~dp0bose-client\enrollAppUser.js"
    echo         // Check to see if we've already enrolled the admin user.>> "%~dp0bose-client\enrollAppUser.js"
    echo         const adminIdentity = await wallet.get('admin');>> "%~dp0bose-client\enrollAppUser.js"
    echo         if (!adminIdentity) {>> "%~dp0bose-client\enrollAppUser.js"
    echo             console.log('An identity for the admin user "admin" does not exist in the wallet');>> "%~dp0bose-client\enrollAppUser.js"
    echo             console.log('Run the enrollAdmin.js application before retrying');>> "%~dp0bose-client\enrollAppUser.js"
    echo             return;>> "%~dp0bose-client\enrollAppUser.js"
    echo         }>> "%~dp0bose-client\enrollAppUser.js"
    echo.>> "%~dp0bose-client\enrollAppUser.js"
    echo         // build a user object for authenticating with the CA>> "%~dp0bose-client\enrollAppUser.js"
    echo         const provider = wallet.getProviderRegistry().getProvider(adminIdentity.type);>> "%~dp0bose-client\enrollAppUser.js"
    echo         const adminUser = await provider.getUserContext(adminIdentity, 'admin');>> "%~dp0bose-client\enrollAppUser.js"
    echo.>> "%~dp0bose-client\enrollAppUser.js"
    echo         // Register the user, enroll the user, and import the new identity into the wallet.>> "%~dp0bose-client\enrollAppUser.js"
    echo         const secret = await ca.register({>> "%~dp0bose-client\enrollAppUser.js"
    echo             affiliation: 'org1.department1',>> "%~dp0bose-client\enrollAppUser.js"
    echo             enrollmentID: 'appUser',>> "%~dp0bose-client\enrollAppUser.js"
    echo             role: 'client'>> "%~dp0bose-client\enrollAppUser.js"
    echo         }, adminUser);>> "%~dp0bose-client\enrollAppUser.js"
    echo         const enrollment = await ca.enroll({>> "%~dp0bose-client\enrollAppUser.js"
    echo             enrollmentID: 'appUser',>> "%~dp0bose-client\enrollAppUser.js"
    echo             enrollmentSecret: secret>> "%~dp0bose-client\enrollAppUser.js"
    echo         });>> "%~dp0bose-client\enrollAppUser.js"
    echo         const x509Identity = {>> "%~dp0bose-client\enrollAppUser.js"
    echo             credentials: {>> "%~dp0bose-client\enrollAppUser.js"
    echo                 certificate: enrollment.certificate,>> "%~dp0bose-client\enrollAppUser.js"
    echo                 privateKey: enrollment.key.toBytes(),>> "%~dp0bose-client\enrollAppUser.js"
    echo             },>> "%~dp0bose-client\enrollAppUser.js"
    echo             mspId: 'Org1MSP',>> "%~dp0bose-client\enrollAppUser.js"
    echo             type: 'X.509',>> "%~dp0bose-client\enrollAppUser.js"
    echo         };>> "%~dp0bose-client\enrollAppUser.js"
    echo         await wallet.put('appUser', x509Identity);>> "%~dp0bose-client\enrollAppUser.js"
    echo         console.log('Successfully registered and enrolled admin user "appUser" and imported it into the wallet');>> "%~dp0bose-client\enrollAppUser.js"
    echo.>> "%~dp0bose-client\enrollAppUser.js"
    echo     } catch (error) {>> "%~dp0bose-client\enrollAppUser.js"
    echo         console.error(`Failed to register user "appUser": ${error}`);>> "%~dp0bose-client\enrollAppUser.js"
    echo         process.exit(1);>> "%~dp0bose-client\enrollAppUser.js"
    echo     }>> "%~dp0bose-client\enrollAppUser.js"
    echo }>> "%~dp0bose-client\enrollAppUser.js"
    echo.>> "%~dp0bose-client\enrollAppUser.js"
    echo main();>> "%~dp0bose-client\enrollAppUser.js"
)

cd "%~dp0bose-client"
echo Running enrollAppUser.js...
node enrollAppUser.js

echo.
echo App user enrolled successfully.
echo.
pause
goto menu

:clean_wallet_function
echo.
echo Cleaning wallet directory...
if exist "%WALLET_DIR%" (
    rmdir /s /q "%WALLET_DIR%"
    mkdir "%WALLET_DIR%"
    echo Wallet directory cleaned successfully.
) else (
    echo Wallet directory does not exist. Creating it...
    mkdir "%WALLET_DIR%"
)
return

:clean_wallet
call :clean_wallet_function
echo.
pause
goto menu

:network_status
echo.
echo Checking network status...
cd "%TEST_NETWORK_DIR%"
wsl docker ps
echo.
pause
goto menu

:end
echo.
echo Thank you for using BOSE Network Manager.
echo.
endlocal
exit /b 0