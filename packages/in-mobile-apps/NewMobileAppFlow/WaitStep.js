import React from 'react';

import Paragraph from 'in-mobile-apps/NewMobileAppFlow/Paragraph';
import { getReportingUrl } from 'in-mobile-apps/configuration';
import Actions from 'in-mobile-apps/NewMobileAppFlow/Actions';
import EntityWithType from 'in-new-components/EntityWithType';
import Header from 'in-mobile-apps/NewMobileAppFlow/Header';
import Frame from 'in-mobile-apps/NewMobileAppFlow/Frame';
import { Ul, Li } from 'in-new-components/lists/List';
import Button from 'in-new-components/Button';
import Link from 'in-components/Link';

export default function WaitStep({ mobileAppName, mobileAppId }) {
  return (
    <Frame>
      <Header>Working…</Header>

      <Paragraph>
        We are preparing everything to monitor your mobile app <strong>{mobileAppName}</strong>. While we do this,{' '}
        <Link href="https://docs.instana.io/products/mobile_app_monitoring/#installation" target="_blank">
          add the agent to your mobile app
        </Link>
        .
      </Paragraph>

      <Ul>
        <Li>
          <EntityWithType label={mobileAppId} type="Key" />
        </Li>
        <Li>
          <EntityWithType label={getReportingUrl()} type="Reporting URL" />
        </Li>
      </Ul>

      <Actions>
        <Button
          kind="primaryv2"
          href="https://docs.instana.io/products/mobile_app_monitoring/#installation"
          target="_blank"
        >
          Installation Instructions
        </Button>

        <Button kind="secondary" disabled icon="lib_actions_loading" iconSpinning>
          Enabling monitoring…
        </Button>
      </Actions>
    </Frame>
  );
}
