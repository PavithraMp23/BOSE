/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const BOSEChaincode = require('./lib/boseChaincode.js');
const SkillsChaincode = require('./lib/skillChaincode.js');

module.exports.contracts = [BOSEChaincode, SkillsChaincode];