/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

// Direct import of 'in-services/userSettings/globals' instead of
// 'in-services/userSettings' to avoid circular imports.
import { userSettings } from 'in-services/userSettings/globals';

export const fallbackLanguage = 'en-US';
export const activeLanguage = userSettings.preferredLanguage || fallbackLanguage;
