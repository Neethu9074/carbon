/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { onPremLicenseInformationEnabled } from 'in-services/featureFlags';

const deploymentType = onPremLicenseInformationEnabled ? 'Self-Hosted' : 'SaaS';
//used to uniquely identify non-ibm id users
export const customRealmName = 'instanaProduct';
//Segment productTitle value
export const productTitle = `Observability with Instana (${deploymentType})`;
//Universal Taxonomy (UT) value
export const ut30 = '30AO8';
//Product Code Type
export const productCodeType = 'PID';
//Product Code , used to filter product in Amplitude
export const productCode = '5900-AG5';
//Version string*
export const commomMilestoneVersion = '2024-03-08 00:01:00';
// Added to identify the platform which used to send segment payload
export const productPlatformTitle = 'ui-client';

//Event Names
export const CTA_CLICKED = 'CTA Clicked';
export const PAGE_VIEWED = 'Page Viewed';
export const STARTED_PROCESS = 'Started Process';
export const CREATED_OBJECT = 'Created Object';
export const UPDATED_OBJECT = 'Updated Object';
export const UI_INTERACTION = 'UI Interaction';
export const UI_LOADING = 'UI Loading';
