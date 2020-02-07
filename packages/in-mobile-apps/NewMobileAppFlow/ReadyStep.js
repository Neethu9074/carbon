import React from 'react';

import { getEumAcceptorBaseUrl } from 'in-websites/trackingSnippet';
import Paragraph from 'in-mobile-apps/NewMobileAppFlow/Paragraph';
import EntityWithType from 'in-new-components/EntityWithType';
import Actions from 'in-mobile-apps/NewMobileAppFlow/Actions';
import Header from 'in-mobile-apps/NewMobileAppFlow/Header';
import Frame from 'in-mobile-apps/NewMobileAppFlow/Frame';
import { Ul, Li } from 'in-new-components/lists/List';
import Button from 'in-new-components/Button';

export default function ReadyStep({ mobileAppName, mobileAppId, mobileAppLink$ }) {
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

      <Ul>
        <Li>
          <EntityWithType label={mobileAppId} type="Key" />
        </Li>
        <Li>
          <EntityWithType label={getEumAcceptorBaseUrl()} type="Reporting URL" />
        </Li>
      </Ul>

      <Actions>
        <Button kind="primaryv2" href$={mobileAppLink$}>
          Go to mobile app dashboard
        </Button>
      </Actions>
    </Frame>
  );
}
