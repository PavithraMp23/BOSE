'use strict';

const { Contract } = require('fabric-contract-api');
const ClientIdentity = require('fabric-shim').ClientIdentity;
const stringify = require('json-stringify-deterministic');
const sortKeysRecursive = require('sort-keys-recursive');

class SkillsChaincode extends Contract {

    async InitLedger(ctx) {
        console.log('Skills Verification Ledger initialized');
    }

    // Add skill to a student profile
    async AddSkill(ctx, skillId, studentId, studentName, skillName, skillCategory, proficiencyLevel, certifiedBy) {
        // Access control - institutions, employers
        const cid = new ClientIdentity(ctx.stub);
        const role = cid.getAttributeValue('role');
        
        if (!['institution', 'employer', 'training_center', 'admin'].includes(role)) {
            throw new Error('Unauthorized: Only authorized entities can add skills');
        }

        // Input validation
        if (!skillId || !studentId || !skillName || !proficiencyLevel) {
            throw new Error('Missing required fields');
        }

        // Validate proficiency level
        const validLevels = ['beginner', 'intermediate', 'advanced', 'expert'];
        if (!validLevels.includes(proficiencyLevel.toLowerCase())) {
            throw new Error(`Invalid proficiency level. Must be one of: ${validLevels.join(', ')}`);
        }

        // Check if skill already exists
        const exists = await ctx.stub.getState(skillId);
        if (exists && exists.length > 0) {
            throw new Error(`Skill record ${skillId} already exists`);
        }

        const skill = {
            docType: 'skill',
            skillId,
            studentId,
            studentName,
            skillName,
            skillCategory: skillCategory || 'general',
            proficiencyLevel: proficiencyLevel.toLowerCase(),
            certifiedBy: certifiedBy || cid.getAttributeValue('organization'),
            endorsements: [],
            verified: true,
            revoked: false,
            issuer: cid.getID(),
            issuerRole: role,
            transactionId: ctx.stub.getTxID(),
            timestamp: new Date(ctx.stub.getTxTimestamp().seconds.low * 1000).toISOString(),
            expiryDate: null
        };

        // Create composite keys for efficient queries
        const studentSkillKey = ctx.stub.createCompositeKey('student~skill', [studentId, skillId]);
        await ctx.stub.putState(studentSkillKey, Buffer.from('\u0000'));

        const skillCategoryKey = ctx.stub.createCompositeKey('category~skill', [skillCategory || 'general', skillId]);
        await ctx.stub.putState(skillCategoryKey, Buffer.from('\u0000'));

        // Store skill record
        await ctx.stub.putState(skillId, Buffer.from(stringify(sortKeysRecursive(skill))));

        
        ctx.stub.setEvent('SkillAdded', Buffer.from(stringify({ 
            skillId, 
            studentId, 
            skillName, 
            certifiedBy: skill.certifiedBy 
        })));

        return JSON.stringify({ 
            success: true,
            message: `Skill ${skillName} added for student ${studentId}`,
            skillId,
            transactionId: skill.transactionId
        });
    }

    // Query skill by ID
    async QuerySkill(ctx, skillId) {
        const skillBytes = await ctx.stub.getState(skillId);
        if (!skillBytes || skillBytes.length === 0) {
            throw new Error(`Skill record ${skillId} does not exist`);
        }

        const skill = JSON.parse(skillBytes.toString());
        
        if (skill.revoked) {
            return JSON.stringify({ 
                ...skill, 
                status: 'REVOKED',
                warning: 'This skill verification has been revoked' 
            });
        }

        // Check expiry
        if (skill.expiryDate && new Date(skill.expiryDate) < new Date()) {
            return JSON.stringify({ 
                ...skill, 
                status: 'EXPIRED',
                warning: 'This skill verification has expired' 
            });
        }

        return skillBytes.toString();
    }

    // Get all skills for a student
    async GetStudentSkills(ctx, studentId) {
        const iterator = await ctx.stub.getStateByPartialCompositeKey('student~skill', [studentId]);
        const results = [];

        for await (const res of iterator) {
            const { attributes } = ctx.stub.splitCompositeKey(res.key);
            const skillId = attributes[1];
            
            const skillBytes = await ctx.stub.getState(skillId);
            if (skillBytes && skillBytes.length > 0) {
                const skill = JSON.parse(skillBytes.toString('utf8'));
                
                // Add status flags
                skill.isExpired = skill.expiryDate && new Date(skill.expiryDate) < new Date();
                skill.endorsementCount = skill.endorsements.length;
                
                results.push(skill);
            }
        }

        return JSON.stringify(results);
    }

    // Get skills by category
    async GetSkillsByCategory(ctx, category) {
        const iterator = await ctx.stub.getStateByPartialCompositeKey('category~skill', [category]);
        const results = [];

        for await (const res of iterator) {
            const { attributes } = ctx.stub.splitCompositeKey(res.key);
            const skillId = attributes[1];
            
            const skillBytes = await ctx.stub.getState(skillId);
            if (skillBytes && skillBytes.length > 0) {
                const skill = JSON.parse(skillBytes.toString('utf8'));
                if (!skill.revoked) {
                    results.push(skill);
                }
            }
        }

        return JSON.stringify(results);
    }

    // Endorse a skill (by employers, colleagues, or other institutions)
    async EndorseSkill(ctx, skillId, endorserName, endorserOrg, endorsementNote) {
        const cid = new ClientIdentity(ctx.stub);
        const role = cid.getAttributeValue('role');
        
        if (!['institution', 'employer', 'training_center', 'admin'].includes(role)) {
            throw new Error('Unauthorized: Only authorized entities can endorse skills');
        }

        const skillBytes = await ctx.stub.getState(skillId);
        if (!skillBytes || skillBytes.length === 0) {
            throw new Error(`Skill record ${skillId} does not exist`);
        }

        const skill = JSON.parse(skillBytes.toString());
        
        if (skill.revoked) {
            throw new Error('Cannot endorse a revoked skill');
        }

        const endorsement = {
            endorserId: cid.getID(),
            endorserName: endorserName || cid.getAttributeValue('organization'),
            endorserOrg: endorserOrg || cid.getAttributeValue('organization'),
            endorserRole: role,
            note: endorsementNote || '',
            transactionId: ctx.stub.getTxID(),
            timestamp: new Date(ctx.stub.getTxTimestamp().seconds.low * 1000).toISOString()
        };

        // Check for duplicate endorsement
        const alreadyEndorsed = skill.endorsements.some(e => e.endorserId === endorsement.endorserId);
        if (alreadyEndorsed) {
            throw new Error('You have already endorsed this skill');
        }

        skill.endorsements.push(endorsement);
        
        await ctx.stub.putState(skillId, Buffer.from(stringify(sortKeysRecursive(skill))));

        // Emit event
        ctx.stub.setEvent('SkillEndorsed', Buffer.from(stringify({ 
            skillId, 
            endorserName: endorsement.endorserName 
        })));

        return JSON.stringify({ 
            success: true,
            message: `Skill ${skillId} endorsed by ${endorsement.endorserName}`,
            totalEndorsements: skill.endorsements.length
        });
    }

    // Update skill proficiency level
    async UpdateSkillProficiency(ctx, skillId, newProficiencyLevel, reason) {
        const cid = new ClientIdentity(ctx.stub);
        const role = cid.getAttributeValue('role');
        
        if (!['institution', 'employer', 'training_center', 'admin'].includes(role)) {
            throw new Error('Unauthorized: Only authorized entities can update skills');
        }

        const validLevels = ['beginner', 'intermediate', 'advanced', 'expert'];
        if (!validLevels.includes(newProficiencyLevel.toLowerCase())) {
            throw new Error(`Invalid proficiency level. Must be one of: ${validLevels.join(', ')}`);
        }

        const skillBytes = await ctx.stub.getState(skillId);
        if (!skillBytes || skillBytes.length === 0) {
            throw new Error(`Skill record ${skillId} does not exist`);
        }

        const skill = JSON.parse(skillBytes.toString());
        
        if (skill.revoked) {
            throw new Error('Cannot update a revoked skill');
        }

        const oldLevel = skill.proficiencyLevel;
        skill.proficiencyLevel = newProficiencyLevel.toLowerCase();
        skill.lastUpdated = new Date(ctx.stub.getTxTimestamp().seconds.low * 1000).toISOString();
        skill.updateReason = reason || 'Proficiency level updated';
        skill.updatedBy = cid.getID();
        skill.updateTransactionId = ctx.stub.getTxID();

        await ctx.stub.putState(skillId, Buffer.from(stringify(sortKeysRecursive(skill))));

       
        ctx.stub.setEvent('SkillUpdated', Buffer.from(stringify({ 
            skillId, 
            oldLevel, 
            newLevel: newProficiencyLevel 
        })));

        return JSON.stringify({ 
            success: true,
            message: `Skill proficiency updated from ${oldLevel} to ${newProficiencyLevel}`
        });
    }

    // Set skill expiry date
    async SetSkillExpiry(ctx, skillId, expiryDate) {
        const cid = new ClientIdentity(ctx.stub);
        const role = cid.getAttributeValue('role');
        
        if (!['institution', 'admin'].includes(role)) {
            throw new Error('Unauthorized: Only institutions or admins can set expiry dates');
        }

        const skillBytes = await ctx.stub.getState(skillId);
        if (!skillBytes || skillBytes.length === 0) {
            throw new Error(`Skill record ${skillId} does not exist`);
        }

        const skill = JSON.parse(skillBytes.toString());
        
        // Validate date format
        if (!Date.parse(expiryDate)) {
            throw new Error('Invalid date format');
        }

        skill.expiryDate = expiryDate;
        skill.expirySetBy = cid.getID();
        skill.expirySetDate = new Date(ctx.stub.getTxTimestamp().seconds.low * 1000).toISOString();

        await ctx.stub.putState(skillId, Buffer.from(stringify(sortKeysRecursive(skill))));

        return JSON.stringify({ 
            success: true,
            message: `Expiry date set to ${expiryDate} for skill ${skillId}`
        });
    }

    // Revoke skill verification
    async RevokeSkill(ctx, skillId, reason) {
        const cid = new ClientIdentity(ctx.stub);
        const role = cid.getAttributeValue('role');
        
        if (!['institution', 'employer', 'training_center', 'admin'].includes(role)) {
            throw new Error('Unauthorized: Only authorized entities can revoke skills');
        }

        const skillBytes = await ctx.stub.getState(skillId);
        if (!skillBytes || skillBytes.length === 0) {
            throw new Error(`Skill record ${skillId} does not exist`);
        }

        const skill = JSON.parse(skillBytes.toString());
        
        if (skill.revoked) {
            throw new Error(`Skill ${skillId} is already revoked`);
        }

        skill.revoked = true;
        skill.revocationReason = reason || 'No reason provided';
        skill.revokedBy = cid.getID();
        skill.revocationDate = new Date(ctx.stub.getTxTimestamp().seconds.low * 1000).toISOString();

        await ctx.stub.putState(skillId, Buffer.from(stringify(sortKeysRecursive(skill))));

        
        ctx.stub.setEvent('SkillRevoked', Buffer.from(stringify({ skillId, reason })));

        return JSON.stringify({ 
            success: true,
            message: `Skill ${skillId} has been revoked` 
        });
    }

    // Verify skill authenticity
    async VerifySkill(ctx, skillId) {
        const skillBytes = await ctx.stub.getState(skillId);
        if (!skillBytes || skillBytes.length === 0) {
            return JSON.stringify({ 
                valid: false, 
                reason: 'Skill record does not exist' 
            });
        }

        const skill = JSON.parse(skillBytes.toString());
        
        if (skill.revoked) {
            return JSON.stringify({ 
                valid: false, 
                reason: 'Skill verification has been revoked',
                skill 
            });
        }

        if (skill.expiryDate && new Date(skill.expiryDate) < new Date()) {
            return JSON.stringify({ 
                valid: false, 
                reason: 'Skill verification has expired',
                skill 
            });
        }

        return JSON.stringify({ 
            valid: true,
            verified: true,
            skill,
            message: 'Skill is authentic and verified by blockchain'
        });
    }

    // Get skill history 
    async GetSkillHistory(ctx, skillId) {
        const cid = new ClientIdentity(ctx.stub);
        const role = cid.getAttributeValue('role');
        
        // Only admin or the issuing organization can view history
        if (role !== 'admin') {
            const skillBytes = await ctx.stub.getState(skillId);
            if (!skillBytes || skillBytes.length === 0) {
                throw new Error(`Skill record ${skillId} does not exist`);
            }
            const skill = JSON.parse(skillBytes.toString());
            if (skill.issuer !== cid.getID()) {
                throw new Error('Unauthorized: Only admins or issuers can view skill history');
            }
        }

        const iterator = await ctx.stub.getHistoryForKey(skillId);
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

    // Get student's skill summary
    async GetStudentSkillSummary(ctx, studentId) {
        const skillsJson = await this.GetStudentSkills(ctx, studentId);
        const skills = JSON.parse(skillsJson);

        const summary = {
            studentId,
            totalSkills: skills.length,
            activeSkills: skills.filter(s => !s.revoked && !s.isExpired).length,
            expiredSkills: skills.filter(s => s.isExpired).length,
            revokedSkills: skills.filter(s => s.revoked).length,
            totalEndorsements: skills.reduce((sum, s) => sum + s.endorsementCount, 0),
            proficiencyBreakdown: {
                beginner: skills.filter(s => s.proficiencyLevel === 'beginner' && !s.revoked).length,
                intermediate: skills.filter(s => s.proficiencyLevel === 'intermediate' && !s.revoked).length,
                advanced: skills.filter(s => s.proficiencyLevel === 'advanced' && !s.revoked).length,
                expert: skills.filter(s => s.proficiencyLevel === 'expert' && !s.revoked).length
            },
            categories: [...new Set(skills.map(s => s.skillCategory))],
            skills: skills
        };

        return JSON.stringify(summary);
    }

    // Get top endorsed skills
    async GetTopEndorsedSkills(ctx, limit) {
        const cid = new ClientIdentity(ctx.stub);
        const role = cid.getAttributeValue('role');
        
        if (role !== 'admin') {
            throw new Error('Only admins can query top endorsed skills');
        }

        const iterator = await ctx.stub.getStateByRange('', '');
        const skills = [];

        for await (const res of iterator) {
            if (!res.value || res.value.length === 0) continue;
            
            const record = JSON.parse(res.value.toString('utf8'));
            if (record.docType === 'skill' && !record.revoked) {
                skills.push(record);
            }
        }

        // Sort by endorsement count
        skills.sort((a, b) => b.endorsements.length - a.endorsements.length);

        // Return top N
        const topSkills = skills.slice(0, parseInt(limit) || 10);

        return JSON.stringify(topSkills);
    }

    // Query all skills  -- change the admin access
    async QueryAllSkills(ctx) {
        const cid = new ClientIdentity(ctx.stub);
        const role = cid.getAttributeValue('role');
        
        if (role !== 'admin') {
            throw new Error('Only admins can query all skills');
        }

        const iterator = await ctx.stub.getStateByRange('', '');
        const results = [];

        for await (const res of iterator) {
            if (!res.value || res.value.length === 0) continue;
            
            const record = JSON.parse(res.value.toString('utf8'));
            if (record.docType === 'skill') {
                results.push(record);
            }
        }

        return JSON.stringify(results);
    }
}
module.exports = SkillsChaincode;