/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useState } from 'react';

import HelpParagraph from 'in-websites/WebsiteDashboard/tabs/Configuration/Options/HelpParagraph';
import TrackingSnippetPresenter from 'in-websites/trackingSnippet/TrackingSnippetPresenter';
import { getTrackingSnippet } from 'in-websites/trackingSnippet';
import CopyToClipboard from 'in-components/CopyToClipboard';
import { Trans, markAsSecureString } from 'in-i18n';
import Button from 'in-new-components/Button';
import Card from 'in-new-components/Card';
import Link from 'in-components/Link';
import { t } from 'in-i18n';

export default function TrackingScript({ websiteId }) {
  const [trackSessions, setTrackSessions] = useState(true);
  const eumSnippet = getTrackingSnippet({ key: websiteId, trackSessions });

  return (
    <Card
      title={t('in-websites:websiteDashboard.tabs.configuration.configurationTrackingScriptTitle')}
      header={
        <CopyToClipboard getText={() => eumSnippet}>
          {refSetter => (
            <Button kind="primaryv2" refSetter={refSetter}>
              {t('in-websites:websiteDashboard.tabs.configuration.configurationrackingScriptButton')}
            </Button>
          )}
        </CopyToClipboard>
      }
    >
      <HelpParagraph>
        <Trans
          i18nKey="in-websites:trackingScript.help"
          values={{ htmlElementName: markAsSecureString('<head />') }}
          components={{
            linkToDocs: <Link href="https://instana.com/docs/website_monitoring/" external />
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
