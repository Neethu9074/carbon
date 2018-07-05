import office365IntegrationConfig from 'in-views/configurationView/subview/Integration/office365IntegrationConfig';
import PagerdutyIntegrationConfig from 'in-views/configurationView/subview/Integration/pagerdutyIntegrationConfig';
import opsgenieIntegrationConfig from 'in-views/configurationView/subview/Integration/opsgenieIntegrationConfig';
import webhookIntegrationConfig from 'in-views/configurationView/subview/Integration/webhookIntegrationConfig';
import slackIntegrationConfig from 'in-views/configurationView/subview/Integration/slackIntegrationConfig';
import emailIntegrationConfig from 'in-views/configurationView/subview/Integration/emailIntegrationConfig';
import hipChatIntegrationConfig from 'in-views/configurationView/subview/Integration/hipChatIntegrationConfig';
import splunkIntegrationConfig from 'in-views/configurationView/subview/Integration/splunkIntegrationConfig';

export const configs = {
  email: emailIntegrationConfig,
  slack: slackIntegrationConfig,
  opsgenie: opsgenieIntegrationConfig,
  pagerduty: PagerdutyIntegrationConfig,
  office365: office365IntegrationConfig,
  webhook: webhookIntegrationConfig,
  hipChat: hipChatIntegrationConfig,
  splunk: splunkIntegrationConfig
};

export const fullyQualified = {};
fullyQualified[configs.email.name] = configs.email;
fullyQualified[configs.office365.name] = configs.office365;
fullyQualified[configs.opsgenie.name] = configs.opsgenie;
fullyQualified[configs.pagerduty.name] = configs.pagerduty;
fullyQualified[configs.slack.name] = configs.slack;
fullyQualified[configs.webhook.name] = configs.webhook;
fullyQualified[configs.hipChat.name] = configs.hipChat;
fullyQualified[configs.splunk.name] = configs.splunk;

export default configs;
