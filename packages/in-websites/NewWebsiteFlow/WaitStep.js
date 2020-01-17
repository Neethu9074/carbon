import React from 'react';

import TrackingSnippetPresenter from 'in-websites/trackingSnippet/TrackingSnippetPresenter';
import { getTrackingSnippet } from 'in-websites/trackingSnippet';
import Paragraph from 'in-websites/NewWebsiteFlow/Paragraph';
import CopyToClipboard from 'in-components/CopyToClipboard';
import Actions from 'in-websites/NewWebsiteFlow/Actions';
import Header from 'in-websites/NewWebsiteFlow/Header';
import Frame from 'in-websites/NewWebsiteFlow/Frame';
import Button from 'in-new-components/Button';

export default function WaitStep({ websiteId, websiteName, trackSessions, setTrackSessions }) {
  const eumSnippet = getTrackingSnippet({ key: websiteId, trackSessions });

  return (
    <Frame>
      <Header>Working…</Header>

      <Paragraph>
        We are preparing everything to monitor your website <strong>{websiteName}</strong>. While we do this, add the
        tracking script to your website.
      </Paragraph>

      <TrackingSnippetPresenter
        websiteId={websiteId}
        trackSessions={trackSessions}
        setTrackSessions={setTrackSessions}
      />

      <Actions>
        <CopyToClipboard getText={() => eumSnippet}>
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
