/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

/* global process:false */

export interface UserSettings {
  preferredLanguage?: string;
  collationLanguage?: string;
}

// userSettings does not exist in the waiting mode of the Instana UI
// @ts-ignore
export const userSettings: UserSettings = (process.env.IS_TEST ? {} : window.instana.termsAndPrivacySettings) || {};
