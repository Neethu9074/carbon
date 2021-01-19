/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React, { useState } from 'react';

import HelpParagraph from 'in-websites/WebsiteDashboard/tabs/Configuration/Options/HelpParagraph';
import TrackingSnippetPresenter from 'in-websites/trackingSnippet/TrackingSnippetPresenter';
import { getTrackingSnippet } from 'in-websites/trackingSnippet';
import CopyToClipboard from 'in-components/CopyToClipboard';
import Button from 'in-new-components/Button';
import Card from 'in-new-components/Card';
import Link from 'in-components/Link';

export default function TrackingScript({ websiteId }) {
  const [trackSessions, setTrackSessions] = useState(true);
  const eumSnippet = getTrackingSnippet({ key: websiteId, trackSessions });

  return (
    <Card
      title="Tracking Script"
      header={
        <CopyToClipboard getText={() => eumSnippet}>
          {refSetter => (
            <Button kind="primaryv2" refSetter={refSetter}>
              Copy to clipboard
            </Button>
          )}
        </CopyToClipboard>
      }
    >
      <HelpParagraph>
        The following tracking script is all you need to get started with website monitoring. Copy this script to the
        HTML {`document's`} <code>{'<head>'}</code>. Information about website monitoring and the full capabilities of
        the tracking script are located{' '}
        <Link href="https://instana.com/docs/website_monitoring/" external>
          within our docs
        </Link>
        .
      </HelpParagraph>

      <TrackingSnippetPresenter
        websiteId={websiteId}
        trackSessions={trackSessions}
        setTrackSessions={setTrackSessions}
      />
    </Card>
  );
}
