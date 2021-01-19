/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import Paragraph from 'in-mobile-apps/NewMobileAppFlow/Paragraph';
import { getReportingUrl } from 'in-mobile-apps/configuration';
import Actions from 'in-mobile-apps/NewMobileAppFlow/Actions';
import Frame from 'in-mobile-apps/NewMobileAppFlow/Frame';
import KeyValue from 'in-new-components/lists/KeyValue';
import { Ul, Li } from 'in-new-components/lists/List';
import Button from 'in-new-components/Button';
import Link from 'in-components/Link';

export default function ReadyStep({ mobileAppName, mobileAppId, mobileAppLink$ }) {
  return (
    <Frame title="Everything's Ready!">
      <Paragraph>
        Everything is ready to monitor your mobile app <strong>{mobileAppName}</strong>.{' '}
        <Link href="https://instana.com/docs/mobile_app_monitoring/#installation" target="_blank">
          Add the agent to your mobile app
        </Link>{' '}
        to track real users or go to the dashboard.
      </Paragraph>

      <Ul>
        <Li>
          <KeyValue label="Key" value={mobileAppId} accentuated />
        </Li>
        <Li>
          <KeyValue label="Reporting URL" value={getReportingUrl()} accentuated />
        </Li>
      </Ul>

      <Actions>
        <Button kind="secondary" href="https://instana.com/docs/mobile_app_monitoring/#installation" target="_blank">
          Installation Instructions
        </Button>

        <Button kind="primaryv2" href$={mobileAppLink$}>
          Go to mobile app dashboard
        </Button>
      </Actions>
    </Frame>
  );
}
