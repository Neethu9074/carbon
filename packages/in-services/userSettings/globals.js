/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

/* global process:false */

// userSettings does not exist in the waiting mode of the Instana UI
export const userSettings = (process.env.IS_TEST ? {} : window.instana.termsAndPrivacySettings) || {};
