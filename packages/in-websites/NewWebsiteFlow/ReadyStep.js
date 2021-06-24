/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Button } from '@instana/components';
import { Link } from '@instana/components';

import TrackingSnippetPresenter from 'in-websites/trackingSnippet/TrackingSnippetPresenter';
import { getTrackingSnippet } from 'in-websites/trackingSnippet';
import Paragraph from 'in-websites/NewWebsiteFlow/Paragraph';
import CopyToClipboard from 'in-components/CopyToClipboard';
import Actions from 'in-websites/NewWebsiteFlow/Actions';
import Frame from 'in-websites/NewWebsiteFlow/Frame';
import { Trans, t, SecureString } from 'in-i18n';

export default function ReadyStep({ websiteId, websiteName, websiteLink$, trackSessions, setTrackSessions }) {
  const eumSnippet = getTrackingSnippet({ key: websiteId, trackSessions });

  return (
    <Frame title={t('in-websites:newWebsiteFlow.readyStepTitleEverythingsReady')}>
      <Paragraph>
        <Trans
          i18nKey="in-websites:newWebsiteFlow.readyStepParagraphEverythingIsReadyToMonitorYourWebsite"
          values={{ websiteName: websiteName, httpHeadTag: new SecureString('<head>') }}
          components={{
            linkToDocs: <Link href="https://instana.com/docs/website_monitoring/" external />
          }}
        />
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
              {t('in-websites:newWebsiteFlow.readyStepButtonCopyToClipboard')}
            </Button>
          )}
        </CopyToClipboard>

        <Button kind="primaryv2" href$={websiteLink$}>
          {t('in-websites:newWebsiteFlow.readyStepButtonGoToWebsiteDashboard')}
        </Button>
      </Actions>
    </Frame>
  );
}
