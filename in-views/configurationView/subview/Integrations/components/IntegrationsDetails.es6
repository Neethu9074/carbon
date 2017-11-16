import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-components/DescriptionList';

export default function AlertingConfigurationDetails({ integration }) {
  if (!integration) {
    return null;
  }

  return getSpecificIntegrationDetails(integration);
}

function getSpecificIntegrationDetails(integration) {
  const kind = integration.get('kind');

  if (kind === 'email') {
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

  if (kind === 'office365') {
    return (
      <DescriptionList>
        <DescriptionItem title="Webhook URL">{integration.get('webhookUrl')}</DescriptionItem>
      </DescriptionList>
    );
  }

  return null;
}
