import { fullyQualified } from 'in-views/configurationView/tabs/TeamSettings/pages/alerting/Integrations/configs';

export default function AlertingConfigurationDetails({ integration }) {
  if (!integration) {
    return null;
  }

  return fullyQualified[integration.get('kind')].createDetails(integration);
}
