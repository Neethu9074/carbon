import React from 'react';

import Paragraph from 'in-mobile-apps/NewMobileAppFlow/Paragraph';
import Actions from 'in-mobile-apps/NewMobileAppFlow/Actions';
import Header from 'in-mobile-apps/NewMobileAppFlow/Header';
import CopyToClipboard from 'in-components/CopyToClipboard';
import Frame from 'in-mobile-apps/NewMobileAppFlow/Frame';
import Button from 'in-new-components/Button';

export default function ReadyStep({ mobileAppName, mobileAppLink$ }) {
  return (
    <Frame>
      <Header>
        Everything
        {`'`}s Ready!
      </Header>

      <Paragraph>
        Everything is ready to monitor your mobile app <strong>{mobileAppName}</strong>. Add the tracking script to your
        mobile app to track real users or go to the dashboard.
      </Paragraph>

      <Actions>
        <CopyToClipboard getText={() => 'TODO'}>
          {refSetter => (
            <Button kind="secondary" refSetter={refSetter}>
              Copy to clipboard
            </Button>
          )}
        </CopyToClipboard>

        <Button kind="primaryv2" href$={mobileAppLink$}>
          Go to mobile app dashboard
        </Button>
      </Actions>
    </Frame>
  );
}
