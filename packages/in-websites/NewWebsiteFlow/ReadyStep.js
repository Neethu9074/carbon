import React from 'react';

import TrackingSnippetPresenter from 'in-websites/trackingSnippet/TrackingSnippetPresenter';
import { getTrackingSnippet } from 'in-websites/trackingSnippet';
import Paragraph from 'in-websites/NewWebsiteFlow/Paragraph';
import CopyToClipboard from 'in-components/CopyToClipboard';
import Actions from 'in-websites/NewWebsiteFlow/Actions';
import Header from 'in-websites/NewWebsiteFlow/Header';
import Frame from 'in-websites/NewWebsiteFlow/Frame';
import Button from 'in-new-components/Button';

export default function ReadyStep({ websiteId, websiteName, websiteLink$, trackSessions, setTrackSessions }) {
  const eumSnippet = getTrackingSnippet({ key: websiteId, trackSessions });

  return (
    <Frame>
      <Header>
        Everything
        {`'`}s Ready!
      </Header>

      <Paragraph>
        Everything is ready to monitor your website <strong>{websiteName}</strong>. Add the tracking script to your
        website to track real users or go to the dashboard.
      </Paragraph>

      <TrackingSnippetPresenter
        websiteId={websiteId}
        trackSessions={trackSessions}
        setTrackSessions={setTrackSessions}
      />

      <Actions>
        <CopyToClipboard getText={() => eumSnippet}>
          {refSetter => (
            <Button kind="secondary" refSetter={refSetter}>
              Copy to clipboard
            </Button>
          )}
        </CopyToClipboard>

        <Button kind="primaryv2" href$={websiteLink$}>
          Go to website dashboard
        </Button>
      </Actions>
    </Frame>
  );
}
