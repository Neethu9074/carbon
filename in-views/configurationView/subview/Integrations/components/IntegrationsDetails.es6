import { fullyQualified } from 'in-views/configurationView/subview/Integration/configs';

export default function AlertingConfigurationDetails({ integration }) {
  if (!integration) {
    return null;
  }

  return fullyQualified[integration.get('kind')].createDetails(integration);
}
