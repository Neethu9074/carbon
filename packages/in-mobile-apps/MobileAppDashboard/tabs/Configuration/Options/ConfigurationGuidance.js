import React from 'react';

import { getReportingUrl } from 'in-mobile-apps/configuration';
import EntityWithType from 'in-new-components/EntityWithType';
import { Ul, Li } from 'in-new-components/lists/List';
import Button from 'in-new-components/Button';
import Card from 'in-new-components/Card';

export default function ConfigurationGuidance({ mobileAppId }) {
  return (
    <Card
      title="Configuration"
      header={
        <Button
          kind="primaryv2"
          href="https://docs.instana.io/products/mobile_app_monitoring/#installation"
          target="_blank"
        >
          Installation Instructions
        </Button>
      }
    >
      <Ul>
        <Li>
          <EntityWithType label={mobileAppId} type="Key" />
        </Li>
        <Li>
          <EntityWithType label={getReportingUrl()} type="Reporting URL" />
        </Li>
      </Ul>
    </Card>
  );
}
