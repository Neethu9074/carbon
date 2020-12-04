import React from 'react';

import { getReportingUrl } from 'in-mobile-apps/configuration';
import KeyValue from 'in-new-components/lists/KeyValue';
import { Ul, Li } from 'in-new-components/lists/List';
import Button from 'in-new-components/Button';
import Card from 'in-new-components/Card';

export default function ConfigurationGuidance({ mobileAppId }) {
  return (
    <Card
      title="Configuration"
      header={
        <Button kind="primaryv2" href="https://instana.com/docs/mobile_app_monitoring/#installation" target="_blank">
          Installation Instructions
        </Button>
      }
    >
      <Ul>
        <Li>
          <KeyValue label="Key" value={mobileAppId} accentuated />
        </Li>
        <Li>
          <KeyValue label="Reporting URL" value={getReportingUrl()} accentuated />
        </Li>
      </Ul>
    </Card>
  );
}
