import { fullyQualified } from 'in-settings/tabs/TeamSettings/pages/legacyAlerting/Integrations/configs';

export default function AlertingConfigurationDetails({ integration }) {
  if (!integration) {
    return null;
  }

  return fullyQualified[integration.get('kind')].createDetails(integration);
}
