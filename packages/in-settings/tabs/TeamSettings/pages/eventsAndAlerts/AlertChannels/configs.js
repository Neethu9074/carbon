import googleChatChannelConfig from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/AlertChannels/forms/googleChatChannelConfig';
import office365ChannelConfig from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/AlertChannels/forms/office365ChannelConfig';
import PagerdutyChannelConfig from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/AlertChannels/forms/pagerdutyChannelConfig';
import opsgenieChannelConfig from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/AlertChannels/forms/opsgenieChannelConfig';
import webhookChannelConfig from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/AlertChannels/forms/webhookChannelConfig';
import splunkChannelConfig from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/AlertChannels/forms/splunkChannelConfig';
import slackChannelConfig from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/AlertChannels/forms/slackChannelConfig';
import emailChannelConfig from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/AlertChannels/forms/emailChannelConfig';

export const configs = {
  email: emailChannelConfig,
  slack: slackChannelConfig,
  opsgenie: opsgenieChannelConfig,
  pagerduty: PagerdutyChannelConfig,
  office365: office365ChannelConfig,
  webhook: webhookChannelConfig,
  splunk: splunkChannelConfig,
  googleChat: googleChatChannelConfig
};

export const fullyQualified = {};
fullyQualified[configs.email.name] = configs.email;
fullyQualified[configs.office365.name] = configs.office365;
fullyQualified[configs.opsgenie.name] = configs.opsgenie;
fullyQualified[configs.pagerduty.name] = configs.pagerduty;
fullyQualified[configs.slack.name] = configs.slack;
fullyQualified[configs.webhook.name] = configs.webhook;
fullyQualified[configs.splunk.name] = configs.splunk;
fullyQualified[configs.googleChat.name] = configs.googleChat;

export default configs;
