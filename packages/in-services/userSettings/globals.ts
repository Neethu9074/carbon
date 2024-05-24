/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

/* global process:false */

export interface UserSettings {
  preferredLanguage?: string;
  collationLanguage?: string;
}

export const userSettings: UserSettings = (process.env.IS_TEST ? {} : window.instana.termsAndPrivacySettings) || {};
