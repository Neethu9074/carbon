/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { onPremLicenseInformationEnabled } from 'in-services/featureFlags';

const deploymentType = onPremLicenseInformationEnabled ? 'Self-Hosted' : 'SaaS';
export const customRealmName = 'instanaProduct';
export const productTitle = `Observability with Instana (${deploymentType})`;
export const ut30 = '30AO8';
export const productCodeType = 'PID';
export const productCode = '5900-AG5';
export const commomMilestoneVersion = '2024-03-08 00:01:00';

//Event Names
export const CTA_CLICKED = 'CTA Clicked';
export const PAGE_VIEWED = 'Page Viewed';
export const STARTED_PROCESS = 'Started Process';
export const CREATED_OBJECT = 'Created Object';
export const UPDATED_OBJECT = 'Updated Object';
export const UI_INTERACTION = 'UI Interaction';
export const UI_LOADING = 'UI Loading';
