/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useState } from 'react';

import { Card } from '@instana/components';
import { Link } from '@instana/legacy';

import HelpParagraph from 'in-websites/WebsiteDashboard/tabs/Configuration/Options/HelpParagraph';
import TrackingSnippetPresenter from 'in-websites/trackingSnippet/TrackingSnippetPresenter';
import { Trans, SecureString } from 'in-i18n';
import { t } from 'in-i18n';

export default function TrackingScript({ websiteId }) {
  const [trackSessions, setTrackSessions] = useState(true);

  return (
    <Card title={t('in-websites:websiteDashboard.tabs.configuration.configurationTrackingScriptTitle')}>
      <HelpParagraph>
        <Trans
          i18nKey="in-websites:trackingScript.help"
          values={{ htmlElementName: new SecureString('<head />') }}
          components={{
            linkToDocs: (
              <Link href="https://www.ibm.com/docs/en/obi/current?topic=instana-monitoring-websites" external />
            )
          }}
        />
      </HelpParagraph>

      <TrackingSnippetPresenter
        websiteId={websiteId}
        trackSessions={trackSessions}
        setTrackSessions={setTrackSessions}
      />
    </Card>
  );
}
