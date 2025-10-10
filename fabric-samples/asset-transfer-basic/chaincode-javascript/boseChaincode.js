//chaincode for certificates
'use strict';

const { Contract } = require('fabric-contract-api');
const stringify = require('json-stringify-deterministic');
const sortKeysRecursive = require('sort-keys-recursive');

class BOSEChaincode extends Contract {

    // Add certificate
    async AddCertificate(ctx, certId, studentId, studentName, course, institution, grade, issueDate, hash) {
        const exists = await ctx.stub.getState(certId);
        if (exists && exists.length > 0) {
            throw new Error(`Certificate ${certId} already exists`);
        }

        const certificate = {
            certId,
            studentId,
            studentName,
            course,
            institution,
            grade,
            issueDate,
            hash,
            verified: false,
            timestamp: new Date(ctx.stub.getTxTimestamp().seconds.low * 1000).toISOString()
        };

        await ctx.stub.putState(certId, Buffer.from(stringify(sortKeysRecursive(certificate))));
        return JSON.stringify({ message: `Certificate ${certId} added` });
    }

    // Query certificate by ID
    async QueryCertificate(ctx, certId) {
        const certBytes = await ctx.stub.getState(certId);
        if (!certBytes || certBytes.length === 0) {
            throw new Error(`Certificate ${certId} does not exist`);
        }
        return certBytes.toString();
    }

    // Verify certificate
    async VerifyCertificate(ctx, certId) {
        const certBytes = await ctx.stub.getState(certId);
        if (!certBytes || certBytes.length === 0) {
            throw new Error(`Certificate ${certId} does not exist`);
        }

        const certificate = JSON.parse(certBytes.toString());
        certificate.verified = true;

        await ctx.stub.putState(certId, Buffer.from(stringify(sortKeysRecursive(certificate))));
        return JSON.stringify({ message: `Certificate ${certId} verified` });
    }

    // Get all certificates for a student
    async GetAllCertificates(ctx, studentId) {
        const iterator = await ctx.stub.getStateByRange('', '');
        const results = [];

        for await (const res of iterator) {
            if (!res.value || res.value.length === 0) continue;

            const cert = JSON.parse(res.value.toString('utf8'));
            if (cert.studentId === studentId) {
                results.push(cert);
            }
        }

        return JSON.stringify(results);
    }
}

module.exports = BOSEChaincode;
