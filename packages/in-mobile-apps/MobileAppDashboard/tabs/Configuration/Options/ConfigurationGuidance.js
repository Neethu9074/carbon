import React from 'react';

import { getEumAcceptorBaseUrl } from 'in-websites/trackingSnippet';
import EntityWithType from 'in-new-components/EntityWithType';
import { Ul, Li } from 'in-new-components/lists/List';
import Card from 'in-new-components/Card';

export default function ConfigurationGuidance({ mobileAppId }) {
  return (
    <Card title="Configuration">
      <Ul>
        <Li>
          <EntityWithType label={mobileAppId} type="Key" />
        </Li>
        <Li>
          <EntityWithType label={getEumAcceptorBaseUrl()} type="Reporting URL" />
        </Li>
      </Ul>
    </Card>
  );
}
