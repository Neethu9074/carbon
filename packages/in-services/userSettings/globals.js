/* global process:false */
/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

export const userSettings = process.env.IS_TEST ? {} : window.instana.termsAndPrivacySettings;
