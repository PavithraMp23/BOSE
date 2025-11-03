//chaincode for certificates
/*
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
*/
'use strict';

const { Contract } = require('fabric-contract-api');
const ClientIdentity = require('fabric-shim').ClientIdentity;
const stringify = require('json-stringify-deterministic');
const sortKeysRecursive = require('sort-keys-recursive');


class BOSEChaincode extends Contract {

    
    async InitLedger(ctx) {
        console.log('Certificate Ledger initialized');
    }

    // Add certificate (Institution only)
    async AddCertificate(ctx, certId, studentId, studentName, course, institution, grade, issueDate, fileHash) {
        const cid = new ClientIdentity(ctx.stub);
        const role = cid.getAttributeValue('role');

        if (role !== 'institution') {
            throw new Error('Only institutions can add certificates');
        }

        if (!certId || !studentId || !studentName || !course || !institution || !issueDate || !fileHash) {
            throw new Error('Missing required fields');
        }

        const exists = await ctx.stub.getState(certId);
        if (exists && exists.length > 0) {
            throw new Error(`Certificate ${certId} already exists`);
        }

        const certificate = {
            docType: 'certificate',
            certId,
            studentId,
            studentName,
            course,
            institution,
            grade,
            issueDate,
            fileHash,
            verified: true,
            revoked: false,
            issuer: cid.getID(),
            issuerOrganization: cid.getAttributeValue('organization') || institution,
            transactionId: ctx.stub.getTxID(),
            timestamp: new Date(ctx.stub.getTxTimestamp().seconds.low * 1000).toISOString()
        };

        // Composite keys for student & institution queries
        const studentCertKey = ctx.stub.createCompositeKey('student~cert', [studentId, certId]);
        await ctx.stub.putState(studentCertKey, Buffer.from('\u0000'));

        const institutionCertKey = ctx.stub.createCompositeKey('institution~cert', [institution, certId]);
        await ctx.stub.putState(institutionCertKey, Buffer.from('\u0000'));

        // Store certificate by certId and fileHash
        await ctx.stub.putState(certId, Buffer.from(stringify(sortKeysRecursive(certificate))));
        await ctx.stub.putState(fileHash, Buffer.from(stringify(sortKeysRecursive(certificate))));

        ctx.stub.setEvent('CertificateAdded', Buffer.from(stringify({ certId, studentId, institution })));

        return JSON.stringify({ success: true, message: `Certificate ${certId} added successfully`, transactionId: certificate.transactionId });
    }

    // Query certificate by ID  
    async QueryCertificate(ctx, certId) {
        const certBytes = await ctx.stub.getState(certId);
        if (!certBytes || certBytes.length === 0) throw new Error(`Certificate ${certId} does not exist`);
        const certificate = JSON.parse(certBytes.toString());
        return JSON.stringify(certificate);
    }

    // Verify certificate by certId or fileHash
    async VerifyCertificate(ctx, idOrHash) {
        const certBytes = await ctx.stub.getState(idOrHash);
        if (!certBytes || certBytes.length === 0) {
            return JSON.stringify({ valid: false, reason: 'Certificate not found' });
        }

        const certificate = JSON.parse(certBytes.toString());
        if (certificate.revoked) {
            return JSON.stringify({ valid: false, reason: 'Certificate revoked', revocationDate: certificate.revocationDate, revocationReason: certificate.revocationReason });
        }

        return JSON.stringify({ valid: true, verified: true, certificate, message: 'Certificate is authentic and verified by blockchain' });
    }
    

    // Get all certificates for a student (using composite key)
    async GetStudentCertificates(ctx, studentId) {
        const iterator = await ctx.stub.getStateByPartialCompositeKey('student~cert', [studentId]);
        const results = [];

        for await (const res of iterator) {
            const { attributes } = ctx.stub.splitCompositeKey(res.key);
            const certId = attributes[1];
            
            const certBytes = await ctx.stub.getState(certId);
            if (certBytes && certBytes.length > 0) {
                const cert = JSON.parse(certBytes.toString('utf8'));
                results.push(cert);
            }
        }

        return JSON.stringify(results);
    }

    // Get all certificates issued by an institution
    async GetInstitutionCertificates(ctx, institution) {
        const cid = new ClientIdentity(ctx.stub);
        const role = cid.getAttributeValue('role');
        
        // Only institution itself or admin can query
        if (role !== 'institution' && role !== 'admin') {
            throw new Error('Unauthorized: Only institutions or admins can query institution certificates');
        }

        const iterator = await ctx.stub.getStateByPartialCompositeKey('institution~cert', [institution]);
        const results = [];

        for await (const res of iterator) {
            const { attributes } = ctx.stub.splitCompositeKey(res.key);
            const certId = attributes[1];
            
            const certBytes = await ctx.stub.getState(certId);
            if (certBytes && certBytes.length > 0) {
                const cert = JSON.parse(certBytes.toString('utf8'));
                results.push(cert);
            }
        }

        return JSON.stringify(results);
    }

    // Revoke certificate (Institution only)
    async RevokeCertificate(ctx, certId, reason) {
        const cid = new ClientIdentity(ctx.stub);
        const role = cid.getAttributeValue('role');
        
        if (role !== 'institution' && role !== 'admin') {
            throw new Error('Only institutions or admins can revoke certificates');
        }

        const certBytes = await ctx.stub.getState(certId);
        if (!certBytes || certBytes.length === 0) {
            throw new Error(`Certificate ${certId} does not exist`);
        }

        const certificate = JSON.parse(certBytes.toString());
        
        if (certificate.revoked) {
            throw new Error(`Certificate ${certId} is already revoked`);
        }

        // If institution role, verify they issued this certificate
        if (role === 'institution' && certificate.issuer !== cid.getID()) {
            throw new Error('You can only revoke certificates issued by your institution');
        }

        certificate.revoked = true;
        certificate.revocationReason = reason || 'No reason provided';
        certificate.revokedBy = cid.getID();
        certificate.revocationDate = new Date(ctx.stub.getTxTimestamp().seconds.low * 1000).toISOString();
        certificate.revocationTransactionId = ctx.stub.getTxID();

        await ctx.stub.putState(certId, Buffer.from(stringify(sortKeysRecursive(certificate))));

        // Emit event
        ctx.stub.setEvent('CertificateRevoked', Buffer.from(stringify({ certId, reason })));

        return JSON.stringify({ 
            success: true,
            message: `Certificate ${certId} revoked` 
        });
    }

    // Update certificate grade (Institution only - for corrections)
    async UpdateCertificateGrade(ctx, certId, newGrade, reason) {
        const cid = new ClientIdentity(ctx.stub);
        const role = cid.getAttributeValue('role');
        
        if (role !== 'institution') {
            throw new Error('Only institutions can update certificate grades');
        }

        const certBytes = await ctx.stub.getState(certId);
        if (!certBytes || certBytes.length === 0) {
            throw new Error(`Certificate ${certId} does not exist`);
        }

        const certificate = JSON.parse(certBytes.toString());
        
        if (certificate.revoked) {
            throw new Error('Cannot update a revoked certificate');
        }

        // Verify they issued this certificate
        if (certificate.issuer !== cid.getID()) {
            throw new Error('You can only update certificates issued by your institution');
        }

        const oldGrade = certificate.grade;
        certificate.grade = newGrade;
        certificate.gradeUpdated = true;
        certificate.gradeUpdateReason = reason || 'Grade correction';
        certificate.gradeUpdatedBy = cid.getID();
        certificate.gradeUpdateDate = new Date(ctx.stub.getTxTimestamp().seconds.low * 1000).toISOString();
        certificate.gradeUpdateTransactionId = ctx.stub.getTxID();

        await ctx.stub.putState(certId, Buffer.from(stringify(sortKeysRecursive(certificate))));

        // Emit event
        ctx.stub.setEvent('CertificateUpdated', Buffer.from(stringify({ 
            certId, 
            oldGrade, 
            newGrade 
        })));

        return JSON.stringify({ 
            success: true,
            message: `Certificate grade updated from ${oldGrade} to ${newGrade}` 
        });
    }

    // Get certificate history (audit trail)
    async GetCertificateHistory(ctx, certId) {
        const iterator = await ctx.stub.getHistoryForKey(certId);
        const history = [];

        for await (const modification of iterator) {
            const txId = modification.txId;
            const timestamp = new Date(modification.timestamp.seconds.low * 1000).toISOString();
            const isDelete = modification.isDelete;
            
            let record = { txId, timestamp, isDelete };
            
            if (!isDelete) {
                record.value = JSON.parse(modification.value.toString('utf8'));
            }
            
            history.push(record);
        }

        return JSON.stringify(history);
    }

    // Batch verify multiple certificates -- needed usecase or not?
    async BatchVerifyCertificates(ctx, certIds) {
        const certIdArray = JSON.parse(certIds);
        const results = [];

        for (const certId of certIdArray) {
            try {
                const verificationResult = await this.VerifyCertificate(ctx, certId);
                results.push(JSON.parse(verificationResult));
            } catch (error) {
                results.push({ 
                    certId, 
                    valid: false, 
                    reason: error.message 
                });
            }
        }

        return JSON.stringify(results);
    }

    // Get certificate metadata (for quick lookups without full data)
    async GetCertificateMetadata(ctx, certId) {
        const certBytes = await ctx.stub.getState(certId);
        if (!certBytes || certBytes.length === 0) {
            throw new Error(`Certificate ${certId} does not exist`);
        }

        const certificate = JSON.parse(certBytes.toString());
        
        // Return only metadata
        return JSON.stringify({
            certId: certificate.certId,
            studentId: certificate.studentId,
            studentName: certificate.studentName,
            institution: certificate.institution,
            course: certificate.course,
            grade: certificate.grade,
            issueDate: certificate.issueDate,
            verified: certificate.verified,
            revoked: certificate.revoked,
            transactionId: certificate.transactionId,
            timestamp: certificate.timestamp
        });
    }

    // Get student's certificate summary
    async GetStudentCertificateSummary(ctx, studentId) {
        const certsJson = await this.GetStudentCertificates(ctx, studentId);
        const certificates = JSON.parse(certsJson);

        const summary = {
            studentId,
            totalCertificates: certificates.length,
            activeCertificates: certificates.filter(c => !c.revoked).length,
            revokedCertificates: certificates.filter(c => c.revoked).length,
            institutions: [...new Set(certificates.map(c => c.institution))],
            courses: certificates.map(c => ({
                course: c.course,
                institution: c.institution,
                grade: c.grade,
                issueDate: c.issueDate,
                status: c.revoked ? 'REVOKED' : 'ACTIVE'
            }))
        };

        return JSON.stringify(summary);
    }
    //=================================================== REDUNDANT ===========================================================
    // Search certificates by course --not necessary
    async SearchCertificatesByCourse(ctx, courseName) {
        const cid = new ClientIdentity(ctx.stub);
        const role = cid.getAttributeValue('role');
        
        if (role !== 'admin') {
            throw new Error('Only admins can search certificates by course');
        }

        const iterator = await ctx.stub.getStateByRange('', '');
        const results = [];

        for await (const res of iterator) {
            if (!res.value || res.value.length === 0) continue;
            
            const record = JSON.parse(res.value.toString('utf8'));
            if (record.docType === 'certificate' && 
                record.course.toLowerCase().includes(courseName.toLowerCase())) {
                results.push(record);
            }
        }

        return JSON.stringify(results);
    }

    // Query all certificates (Admin only - for monitoring) -- should we need it or not?
    
    async QueryAllCertificates(ctx) {
        const cid = new ClientIdentity(ctx.stub);
        const role = cid.getAttributeValue('role');
        
        if (role !== 'admin') {
            throw new Error('Only admins can query all certificates');
        }

        const iterator = await ctx.stub.getStateByRange('', '');
        const results = [];

        for await (const res of iterator) {
            if (!res.value || res.value.length === 0) continue;
            
            const record = JSON.parse(res.value.toString('utf8'));
            if (record.docType === 'certificate') {
                results.push(record);
            }
        }

        return JSON.stringify(results);
    }
    //================================================= REDUANDANT ==================================================== 
    // Check if certificate exists (lightweight query)
    async CertificateExists(ctx, certId) {
        const certBytes = await ctx.stub.getState(certId);
        return JSON.stringify({ 
            exists: certBytes && certBytes.length > 0 
        });
    }
}

module.exports = BOSEChaincode;