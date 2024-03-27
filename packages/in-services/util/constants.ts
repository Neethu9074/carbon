/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { onPremLicenseInformationEnabled } from 'in-services/featureFlags';

const deploymentType = onPremLicenseInformationEnabled ? 'SaaS' : 'Self-Hosted';
export const customRealmName = 'instanaProduct';
export const productTitle = `Observability with Instana (${deploymentType})`;
export const ut30 = '30AO8';
export const productCodeType = 'PID';
export const productCode = '5900-AG5';
export const commomMilestoneVersion = '2024-03-08 00:01:00';
