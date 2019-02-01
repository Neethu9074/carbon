import googleChatIntegrationConfig from 'in-views/configurationView/tabs/TeamSettings/pages/alerting/Integrations/forms/googleChatIntegrationConfig';
import office365IntegrationConfig from 'in-views/configurationView/tabs/TeamSettings/pages/alerting/Integrations/forms/office365IntegrationConfig';
import PagerdutyIntegrationConfig from 'in-views/configurationView/tabs/TeamSettings/pages/alerting/Integrations/forms/pagerdutyIntegrationConfig';
import opsgenieIntegrationConfig from 'in-views/configurationView/tabs/TeamSettings/pages/alerting/Integrations/forms/opsgenieIntegrationConfig';
import webhookIntegrationConfig from 'in-views/configurationView/tabs/TeamSettings/pages/alerting/Integrations/forms/webhookIntegrationConfig';
import slackIntegrationConfig from 'in-views/configurationView/tabs/TeamSettings/pages/alerting/Integrations/forms/slackIntegrationConfig';
import emailIntegrationConfig from 'in-views/configurationView/tabs/TeamSettings/pages/alerting/Integrations/forms/emailIntegrationConfig';
import splunkIntegrationConfig from 'in-views/configurationView/tabs/TeamSettings/pages/alerting/Integrations/forms/splunkIntegrationConfig';

export const configs = {
  email: emailIntegrationConfig,
  slack: slackIntegrationConfig,
  opsgenie: opsgenieIntegrationConfig,
  pagerduty: PagerdutyIntegrationConfig,
  office365: office365IntegrationConfig,
  webhook: webhookIntegrationConfig,
  splunk: splunkIntegrationConfig,
  googleChat: googleChatIntegrationConfig
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
