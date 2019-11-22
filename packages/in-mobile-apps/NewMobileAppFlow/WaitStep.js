import React from 'react';

import Paragraph from 'in-mobile-apps/NewMobileAppFlow/Paragraph';
import Actions from 'in-mobile-apps/NewMobileAppFlow/Actions';
import CopyToClipboard from 'in-components/CopyToClipboard';
import Header from 'in-mobile-apps/NewMobileAppFlow/Header';
import Frame from 'in-mobile-apps/NewMobileAppFlow/Frame';
import Button from 'in-new-components/Button';

export default function WaitStep({ mobileAppName }) {
  return (
    <Frame>
      <Header>Working…</Header>

      <Paragraph>
        We are preparing everything to monitor your mobile app <strong>{mobileAppName}</strong>. While we do this, add the
        tracking script to your mobile app.
      </Paragraph>

      <Actions>
        <CopyToClipboard getText={() => 'TODO'}>
          {refSetter => (
            <Button kind="primaryv2" refSetter={refSetter}>
              Copy to clipboard
            </Button>
          )}
        </CopyToClipboard>

        <Button kind="secondary" disabled icon="lib_actions_loading" iconSpinning>
          Enabling monitoring…
        </Button>
      </Actions>
    </Frame>
  );
}
