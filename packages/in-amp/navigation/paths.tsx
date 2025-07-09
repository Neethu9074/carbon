/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { accountAndBillingPath } from 'in-stores/navigation/paths/mainPaths';

// Account&Billing paths
export const accountBillingBasePath = accountAndBillingPath;
export const ampAccountAndBilling = `${accountBillingBasePath}/amp`;
export const ampUsage = `${ampAccountAndBilling}/usage`;
export const ampEntitlements = `${ampAccountAndBilling}/entitlements`;
export const ampTechnologiesReporting = `${ampAccountAndBilling}/technologiesReporting`;
export const ampActivationAdoption = `${ampAccountAndBilling}/activationAndAdoption`;
export const ampAccountInformation = `${ampAccountAndBilling}/accountInformation`;

export const activeEntitlements = `${ampEntitlements}/activeEntitlements`;
export const expiredEntitlements = `${ampEntitlements}/expiredEntitlements`;
export const queuedEntitlements = `${ampEntitlements}/queuedEntitlements`;
export const customerAdoption = `${ampActivationAdoption}/customerAdoption`;
export const userUsage = `${ampActivationAdoption}/userUsage`;
