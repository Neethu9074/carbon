/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import prometheusWebhookChannelConfig from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/AlertChannels/forms/prometheusWebhookChannelConfig';
import webexTeamsWebhookChannelConfig from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/AlertChannels/forms/webexTeamsWebhookChannelConfig';
import googleChatChannelConfig from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/AlertChannels/forms/googleChatChannelConfig';
import office365ChannelConfig from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/AlertChannels/forms/office365ChannelConfig';
import PagerdutyChannelConfig from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/AlertChannels/forms/pagerdutyChannelConfig';
import victorOpsChannelConfig from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/AlertChannels/forms/victorOpsChannelConfig';
import opsgenieChannelConfig from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/AlertChannels/forms/opsgenieChannelConfig';
import webhookChannelConfig from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/AlertChannels/forms/webhookChannelConfig';
import splunkChannelConfig from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/AlertChannels/forms/splunkChannelConfig';
import slackChannelConfig from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/AlertChannels/forms/slackChannelConfig';
import emailChannelConfig from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/AlertChannels/forms/emailChannelConfig';
import watsonAIOpsWebhookChannelConfig from './forms/watsonAIOpsWebhookChannelConfig';

export const configs = {
  email: emailChannelConfig,
  slack: slackChannelConfig,
  opsgenie: opsgenieChannelConfig,
  pagerduty: PagerdutyChannelConfig,
  office365: office365ChannelConfig,
  webhook: webhookChannelConfig,
  splunk: splunkChannelConfig,
  googleChat: googleChatChannelConfig,
  victorOps: victorOpsChannelConfig,
  prometheusWebhook: prometheusWebhookChannelConfig,
  webexTeamsWebhook: webexTeamsWebhookChannelConfig,
  watsonAIOpsWebhook: watsonAIOpsWebhookChannelConfig
};

export const fullyQualified = {
  [configs.email.name]: configs.email,
  [configs.office365.name]: configs.office365,
  [configs.opsgenie.name]: configs.opsgenie,
  [configs.pagerduty.name]: configs.pagerduty,
  [configs.slack.name]: configs.slack,
  [configs.webhook.name]: configs.webhook,
  [configs.splunk.name]: configs.splunk,
  [configs.googleChat.name]: configs.googleChat,
  [configs.victorOps.name]: configs.victorOps,
  [configs.prometheusWebhook.name]: configs.prometheusWebhook,
  [configs.webexTeamsWebhook.name]: configs.webexTeamsWebhook,
  [configs.watsonAIOpsWebhook.name]: configs.watsonAIOpsWebhook
};

export default configs;
