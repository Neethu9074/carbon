import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-components/DescriptionList';
import configs from 'in-views/configurationView/subview/Integration/configs';

export default function AlertingConfigurationDetails({ integration }) {
  if (!integration) {
    return null;
  }

  return getSpecificIntegrationDetails(integration);
}

function getSpecificIntegrationDetails(integration) {
  const kind = integration.get('kind');

  if (kind === configs.email.name) {
    const emails = integration.get('emails');
    if (!emails || emails.size === 0) {
      return null;
    }

    return (
      <div>
        <DescriptionList>
          <DescriptionItem title="EMails">
            {integration.get('webhookUrl')}
            {emails.toArray().map(email => <div key={email}>{email}</div>)}
          </DescriptionItem>
        </DescriptionList>
      </div>
    );
  }

  if (kind === configs.office365.name) {
    return (
      <DescriptionList>
        <DescriptionItem title="Webhook URL">{integration.get('webhookUrl')}</DescriptionItem>
      </DescriptionList>
    );
  }

  return null;
}
