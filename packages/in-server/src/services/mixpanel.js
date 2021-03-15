/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

const serverConfig = require('../serverConfig.js');

exports.getMixpanelToken = function getMixpanelToken(user, allAnalyticsServicesAccepted) {
  if (!user || !user.email) {
    return undefined;
  }

  // Do not send anything to Mixpanel for Instana employees
  if (user.email.endsWith('@instana.com')) {
    return undefined;
  }

  // Do not send anything to Mixpanel for users for which we have explicitly disabled
  // mixpanel data collection.
  if (
    serverConfig.mixpanelDisabledEmails &&
    serverConfig.mixpanelDisabledEmails.indexOf(user.email.toLowerCase()) !== -1
  ) {
    return undefined;
  }

  // Do not send anything to Mixpanel for users who have not
  // accepted analytics service usage.
  if (!allAnalyticsServicesAccepted) {
    return undefined;
  }

  return serverConfig.mixpanelToken;
};
