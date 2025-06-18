/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import watsonAIOpsWebhookChannelConfig from 'in-settings/tabs/GlobalSettings/pages/eventsAndAlerts/AlertChannels/forms/watsonAIOpsWebhookChannelConfig';
import prometheusWebhookChannelConfig from 'in-settings/tabs/GlobalSettings/pages/eventsAndAlerts/AlertChannels/forms/prometheusWebhookChannelConfig';
import webexTeamsWebhookChannelConfig from 'in-settings/tabs/GlobalSettings/pages/eventsAndAlerts/AlertChannels/forms/webexTeamsWebhookChannelConfig';
import serviceNowBDChannelConfig from 'in-settings/tabs/GlobalSettings/pages/eventsAndAlerts/AlertChannels/forms/serviceNowBDChannelConfig';
import googleChatChannelConfig from 'in-settings/tabs/GlobalSettings/pages/eventsAndAlerts/AlertChannels/forms/googleChatChannelConfig';
import serviceNowChannelConfig from 'in-settings/tabs/GlobalSettings/pages/eventsAndAlerts/AlertChannels/forms/serviceNowChannelConfig';
import salesforceChannelConfig from 'in-settings/tabs/GlobalSettings/pages/eventsAndAlerts/AlertChannels/forms/salesforceChannelConfig';
import msTeamsAppChannelConfig from 'in-settings/tabs/GlobalSettings/pages/eventsAndAlerts/AlertChannels/forms/msTeamsAppChannelConfig';
import office365ChannelConfig from 'in-settings/tabs/GlobalSettings/pages/eventsAndAlerts/AlertChannels/forms/office365ChannelConfig';
import PagerdutyChannelConfig from 'in-settings/tabs/GlobalSettings/pages/eventsAndAlerts/AlertChannels/forms/pagerdutyChannelConfig';
import victorOpsChannelConfig from 'in-settings/tabs/GlobalSettings/pages/eventsAndAlerts/AlertChannels/forms/victorOpsChannelConfig';
import opsgenieChannelConfig from 'in-settings/tabs/GlobalSettings/pages/eventsAndAlerts/AlertChannels/forms/opsgenieChannelConfig';
import zChatOpsChannelConfig from 'in-settings/tabs/GlobalSettings/pages/eventsAndAlerts/AlertChannels/forms/zChatOpsChannelConfig';
import webhookChannelConfig from 'in-settings/tabs/GlobalSettings/pages/eventsAndAlerts/AlertChannels/forms/webhookChannelConfig';
import slackBDChannelConfig from 'in-settings/tabs/GlobalSettings/pages/eventsAndAlerts/AlertChannels/forms/slackBDChannelConfig';
import splunkChannelConfig from 'in-settings/tabs/GlobalSettings/pages/eventsAndAlerts/AlertChannels/forms/splunkChannelConfig';
import slackChannelConfig from 'in-settings/tabs/GlobalSettings/pages/eventsAndAlerts/AlertChannels/forms/slackChannelConfig';
import emailChannelConfig from 'in-settings/tabs/GlobalSettings/pages/eventsAndAlerts/AlertChannels/forms/emailChannelConfig';
import { msTeamsAppEnabled, bidirectionalSlackEnabled } from 'in-services/featureFlags';

export const configs = {
  email: emailChannelConfig,
  slack: slackChannelConfig,
  ...(bidirectionalSlackEnabled && { slackBD: slackBDChannelConfig }),
  opsgenie: opsgenieChannelConfig,
  pagerduty: PagerdutyChannelConfig,
  office365: office365ChannelConfig,
  ...(msTeamsAppEnabled && { msTeams: msTeamsAppChannelConfig }),
  serviceNowWebhook: serviceNowChannelConfig,
  serviceNowBD: serviceNowBDChannelConfig,
  webhook: webhookChannelConfig,
  splunk: splunkChannelConfig,
  googleChat: googleChatChannelConfig,
  victorOps: victorOpsChannelConfig,
  prometheusWebhook: prometheusWebhookChannelConfig,
  webexTeamsWebhook: webexTeamsWebhookChannelConfig,
  watsonAIOpsWebhook: watsonAIOpsWebhookChannelConfig,
  zChatOps: zChatOpsChannelConfig,
  salesforceChannelConfig: salesforceChannelConfig
};

export const fullyQualified = {
  [configs.email.name]: configs.email,
  [configs.office365.name]: configs.office365,
  [configs.opsgenie.name]: configs.opsgenie,
  [configs.pagerduty.name]: configs.pagerduty,
  [configs.slack.name]: configs.slack,
  ...(bidirectionalSlackEnabled && { [configs.slackBD.name]: slackBDChannelConfig }),
  [configs.serviceNowWebhook.name]: configs.serviceNowWebhook,
  [configs.serviceNowBD.name]: configs.serviceNowBD,
  [configs.webhook.name]: configs.webhook,
  [configs.splunk.name]: configs.splunk,
  [configs.googleChat.name]: configs.googleChat,
  [configs.victorOps.name]: configs.victorOps,
  [configs.prometheusWebhook.name]: configs.prometheusWebhook,
  [configs.webexTeamsWebhook.name]: configs.webexTeamsWebhook,
  [configs.watsonAIOpsWebhook.name]: configs.watsonAIOpsWebhook,
  [configs.zChatOps.name]: configs.zChatOps,
  [configs.salesforceChannelConfig.name]: configs.salesforceChannelConfig,
  ...(msTeamsAppEnabled && { [configs.msTeams.name]: configs.msTeams })
};

export default configs;
