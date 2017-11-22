import createOffice365IntegrationForm from 'in-views/configurationView/subview/Integration/office365IntegrationForm';
import createPagerdutyIntegrationForm from 'in-views/configurationView/subview/Integration/pagerdutyIntegrationForm';
import createOpsgenieIntegrationForm from 'in-views/configurationView/subview/Integration/opsgenieIntegrationForm';
import createWebhookIntegrationForm from 'in-views/configurationView/subview/Integration/webhookIntegrationForm';
import createSlackIntegrationForm from 'in-views/configurationView/subview/Integration/slackIntegrationForm';
import createEmailIntegrationForm from 'in-views/configurationView/subview/Integration/emailIntegrationForm';

export default {
  email: createEmailIntegrationForm,
  slack: createSlackIntegrationForm,
  opsgenie: createOpsgenieIntegrationForm,
  pagerduty: createPagerdutyIntegrationForm,
  office365: createOffice365IntegrationForm,
  webhook: createWebhookIntegrationForm
};
