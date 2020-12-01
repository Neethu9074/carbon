import React from 'react';

import TrackingSnippetPresenter from 'in-websites/trackingSnippet/TrackingSnippetPresenter';
import { getTrackingSnippet } from 'in-websites/trackingSnippet';
import Paragraph from 'in-websites/NewWebsiteFlow/Paragraph';
import CopyToClipboard from 'in-components/CopyToClipboard';
import Actions from 'in-websites/NewWebsiteFlow/Actions';
import Frame from 'in-websites/NewWebsiteFlow/Frame';
import Button from 'in-new-components/Button';
import Link from 'in-components/Link';

export default function WaitStep({ websiteId, websiteName, trackSessions, setTrackSessions }) {
  const eumSnippet = getTrackingSnippet({ key: websiteId, trackSessions });

  return (
    <Frame title="Working…">
      <Paragraph>
        We are preparing everything to monitor your website <strong>{websiteName}</strong>. While we do this, add the
        following script to the HTML {`document's`} <code>{'<head>'}</code>. Information about website monitoring and
        the full capabilities of the tracking script are located{' '}
        <Link href="https://instana.com/docs/website_monitoring/" external>
          within our docs
        </Link>
        .
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
