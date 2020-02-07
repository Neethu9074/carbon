import React from 'react';

import { getEumAcceptorBaseUrl } from 'in-websites/trackingSnippet';
import Paragraph from 'in-mobile-apps/NewMobileAppFlow/Paragraph';
import Actions from 'in-mobile-apps/NewMobileAppFlow/Actions';
import EntityWithType from 'in-new-components/EntityWithType';
import Header from 'in-mobile-apps/NewMobileAppFlow/Header';
import Frame from 'in-mobile-apps/NewMobileAppFlow/Frame';
import { Ul, Li } from 'in-new-components/lists/List';
import Button from 'in-new-components/Button';

export default function WaitStep({ mobileAppName, mobileAppId }) {
  return (
    <Frame>
      <Header>Working…</Header>

      <Paragraph>
        We are preparing everything to monitor your mobile app <strong>{mobileAppName}</strong>. While we do this, add
        the tracking script to your mobile app.
      </Paragraph>

      <Ul>
        <Li>
          <EntityWithType label={mobileAppId} type="Key" />
        </Li>
        <Li>
          <EntityWithType label={getEumAcceptorBaseUrl()} type="Reporting URL" />
        </Li>
      </Ul>

      <Actions>
        <Button kind="secondary" disabled icon="lib_actions_loading" iconSpinning>
          Enabling monitoring…
        </Button>
      </Actions>
    </Frame>
  );
}
