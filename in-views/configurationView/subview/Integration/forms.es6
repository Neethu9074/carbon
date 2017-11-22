import office365IntegrationConfig from 'in-views/configurationView/subview/Integration/office365IntegrationConfig';
import PagerdutyIntegrationConfig from 'in-views/configurationView/subview/Integration/pagerdutyIntegrationConfig';
import opsgenieIntegrationConfig from 'in-views/configurationView/subview/Integration/opsgenieIntegrationConfig';
import webhookIntegrationConfig from 'in-views/configurationView/subview/Integration/webhookIntegrationConfig';
import slackIntegrationConfig from 'in-views/configurationView/subview/Integration/slackIntegrationConfig';
import emailIntegrationConfig from 'in-views/configurationView/subview/Integration/emailIntegrationConfig';

export const configs = {
  email: emailIntegrationConfig,
  slack: slackIntegrationConfig,
  opsgenie: opsgenieIntegrationConfig,
  pagerduty: PagerdutyIntegrationConfig,
  office365: office365IntegrationConfig,
  webhook: webhookIntegrationConfig
};

export const reverseLookup = {};
reverseLookup[configs.email.name] = configs.email;
reverseLookup[configs.office365.name] = configs.office365;
reverseLookup[configs.opsgenie.name] = configs.opsgenie;
reverseLookup[configs.pagerduty.name] = configs.pagerduty;
reverseLookup[configs.slack.name] = configs.slack;
reverseLookup[configs.webhook.name] = configs.webhook;

export default configs;
